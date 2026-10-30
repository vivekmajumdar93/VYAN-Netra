import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { findAppIdByCode } from "../shared/appLookup.js";
import { notFound } from "../shared/errors.js";
import type { Capabilities, ControlParam, ControlSpec } from "./capabilities.js";
import { isKillSwitchEnabled } from "./settings.js";

// Netra does not define commands. A command is a control the TARGET APP
// declared in its own manifest (see capabilities.ts), plus the parameter
// values the admin entered for it. issueCommand refuses anything the app
// hasn't declared, and validates the values against the app's own spec.

export type CommandParams = Record<string, string | number | boolean>;
export type CommandStatus =
  | "pending"
  | "acknowledged"
  | "failed"
  | "expired"
  | "cancelled";

// A safety command that waits longer than this is stale: running a "halt"
// or a limit change hours after it was issued, when the admin has long
// since moved on, is worse than reporting it never ran.
export const COMMAND_TTL_MS = 10 * 60 * 1000;

interface CommandDoc {
  appId: string;
  type: string;
  label: string;
  params: CommandParams;
  status: CommandStatus;
  result: string | null;
  issuedAt: number;
  expiresAt: number;
  completedAt: number | null;
}

export interface CommandView extends CommandDoc {
  id: number;
}

const commands = () => db.collection("commands");

function toView(id: number, doc: CommandDoc): CommandView {
  return { id, ...doc };
}

function bad(message: string): never {
  throw new HttpsError("invalid-argument", message);
}

function checkParam(spec: ControlParam, value: unknown): string | number | boolean | undefined {
  if (value === undefined || value === null || value === "") {
    if (spec.required) bad(`${spec.label} is required.`);
    return undefined;
  }
  switch (spec.type) {
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(n)) bad(`${spec.label} must be a number.`);
      if (spec.min !== undefined && n < spec.min) bad(`${spec.label} must be at least ${spec.min}.`);
      if (spec.max !== undefined && n > spec.max) bad(`${spec.label} must be at most ${spec.max}.`);
      return n;
    }
    case "boolean":
      if (typeof value !== "boolean") bad(`${spec.label} must be true or false.`);
      return value;
    case "select": {
      if (typeof value !== "string" || !spec.options?.some((o) => o.value === value)) {
        bad(`${spec.label} must be one of the listed options.`);
      }
      return value;
    }
    default:
      if (typeof value !== "string") bad(`${spec.label} must be text.`);
      if (value.length > 500) bad(`${spec.label} is too long.`);
      return value;
  }
}

function validateParams(control: ControlSpec, raw: unknown): CommandParams {
  const input = (raw ?? {}) as Record<string, unknown>;
  if (typeof input !== "object" || Array.isArray(input)) bad("params must be an object.");
  const declared = control.params ?? [];
  const known = new Set(declared.map((p) => p.name));
  for (const key of Object.keys(input)) {
    if (!known.has(key)) bad(`"${key}" is not a parameter of ${control.label}.`);
  }
  const clean: CommandParams = {};
  for (const spec of declared) {
    const value = checkParam(spec, input[spec.name]);
    if (value !== undefined) clean[spec.name] = value;
  }
  return clean;
}

// Pending commands past their expiry are closed out here, on read, rather
// than by a scheduled job — the console and the app both read commands
// often enough that nothing stays stale for long.
async function expireStale(appId: string): Promise<void> {
  const now = nowMs();
  const snap = await commands()
    .where("appId", "==", appId)
    .where("status", "==", "pending")
    .get();
  await Promise.all(
    snap.docs
      .filter((d) => (d.data() as CommandDoc).expiresAt <= now)
      .map((d) =>
        d.ref.update({
          status: "expired",
          result:
            "Not picked up in time. The app was offline or unreachable, so this was not run.",
          completedAt: now,
        }),
      ),
  );
}

// Called from Netra's per-app console. Only controls the app itself has
// declared can be issued.
export const issueCommand = onCall<
  { appId: string; type: string; params?: CommandParams },
  Promise<CommandView>
>(async (request) => {
  const appSnap = await db.collection("apps").doc(request.data.appId).get();
  if (!appSnap.exists) notFound("App");
  const capSnap = await db.collection("appCapabilities").doc(request.data.appId).get();
  const control = (capSnap.data() as Capabilities | undefined)?.controls.find(
    (c) => c.id === request.data.type,
  );
  if (!control) {
    throw new HttpsError(
      "failed-precondition",
      "This app has not declared that control.",
    );
  }
  const params = validateParams(control, request.data.params);
  const id = await nextId("commands");
  const now = nowMs();
  const doc: CommandDoc = {
    appId: request.data.appId,
    type: control.id,
    label: control.label,
    params,
    status: "pending",
    result: null,
    issuedAt: now,
    expiresAt: now + COMMAND_TTL_MS,
    completedAt: null,
  };
  await commands().doc(String(id)).set(doc);
  return toView(id, doc);
});

// Called by a linked app on its own interval. Gated by the console-wide
// kill switch like the other inbound bridge calls: no commands are handed
// out while it is off.
export const getPendingCommands = onCall<
  { appCode: string },
  Promise<CommandView[]>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return [];
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return [];
  await expireStale(appId);
  const snap = await commands()
    .where("appId", "==", appId)
    .where("status", "==", "pending")
    .get();
  return snap.docs
    .map((d) => toView(Number(d.id), d.data() as CommandDoc))
    .sort((a, b) => a.id - b.id);
});

// Reported by the app after it actually runs (or fails to run) a command, so
// the history shows what really happened. Only the owning app can close a
// command, and only while it is still pending.
export const acknowledgeCommand = onCall<
  { appCode: string; id: number; success: boolean; result: string },
  Promise<boolean>
>(async (request) => {
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  const ref = commands().doc(String(request.data.id));
  const snap = await ref.get();
  if (!snap.exists) return false;
  const doc = snap.data() as CommandDoc;
  if (doc.appId !== appId || doc.status !== "pending") return false;
  await ref.update({
    status: request.data.success ? "acknowledged" : "failed",
    result: String(request.data.result ?? "").slice(0, 500),
    completedAt: nowMs(),
  });
  return true;
});

export const cancelCommand = onCall<{ id: number }, Promise<boolean>>(
  async (request) => {
    const ref = commands().doc(String(request.data.id));
    const snap = await ref.get();
    if (!snap.exists) return false;
    if ((snap.data() as CommandDoc).status !== "pending") return false;
    await ref.update({
      status: "cancelled",
      result: "Cancelled from the console before the app picked it up.",
      completedAt: nowMs(),
    });
    return true;
  },
);

export const listCommandHistory = onCall<
  { appId: string },
  Promise<CommandView[]>
>(async (request) => {
  await expireStale(request.data.appId);
  const snap = await commands().where("appId", "==", request.data.appId).get();
  return snap.docs
    .map((d) => toView(Number(d.id), d.data() as CommandDoc))
    .sort((a, b) => b.id - a.id)
    .slice(0, 50);
});
