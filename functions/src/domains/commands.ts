import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";
import { isKillSwitchEnabled } from "./settings.js";

export type CommandPayload =
  | { type: "setKillSwitch"; armed: boolean }
  | { type: "setMode"; mode: "AUTONOMOUS" | "MANUAL" }
  | { type: "emergencyHalt" }
  | { type: "clearEmergencyHalt" }
  | {
      type: "updateRiskPolicy";
      dailyLossLimit?: number;
      maxTradesPerDay?: number;
      maxOpenPositions?: number;
      positionSizeLimit?: number;
      capitalAllocationPct?: number;
      totalCapital?: number;
    }
  | { type: "unlockUser"; externalId: string }
  | { type: "triggerScan" };

type CommandStatus = "pending" | "acknowledged" | "failed";

interface CommandDoc {
  appId: string;
  payload: CommandPayload;
  status: CommandStatus;
  result: string | null;
  issuedAt: number;
  completedAt: number | null;
}

export interface CommandView extends CommandDoc {
  id: number;
}

const commands = () => db.collection("commands");
const apps = () => db.collection("apps");

function toView(id: number, doc: CommandDoc): CommandView {
  return { id, ...doc };
}

async function findAppIdByCode(appCode: string): Promise<string | null> {
  const found = await apps().where("appCode", "==", appCode).limit(1).get();
  return found.empty ? null : found.docs[0].id;
}

// Queued by Netra's own UI (an admin issuing a remote command to a linked
// app) — picked up by the app itself via getPendingCommands below on its
// own polling interval. Netra never pushes into an app directly; every
// bridge interaction is the app pulling, same model as the rest of this
// protocol (recordHeartbeat, syncAppUsers).
export const issueCommand = onCall<
  { appId: string; payload: CommandPayload },
  Promise<CommandView>
>(async (request) => {
  const appSnap = await apps().doc(request.data.appId).get();
  if (!appSnap.exists) notFound("App");
  const id = await nextId("commands");
  const doc: CommandDoc = {
    appId: request.data.appId,
    payload: request.data.payload,
    status: "pending",
    result: null,
    issuedAt: nowMs(),
    completedAt: null,
  };
  await commands().doc(String(id)).set(doc);
  return toView(id, doc);
});

// Called by a linked app (identified by its current appCode) on its own
// polling interval — same appCode-as-credential pattern as
// recordHeartbeat/syncAppUsers, and gated by the same console-wide kill
// switch: no commands are handed out while it's off, consistent with
// "nothing that can incur cost or contact another app runs until an admin
// explicitly turns it on."
export const getPendingCommands = onCall<
  { appCode: string },
  Promise<CommandView[]>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return [];
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return [];
  const snap = await commands()
    .where("appId", "==", appId)
    .where("status", "==", "pending")
    .get();
  return snap.docs.map((d) => toView(Number(d.id), d.data() as CommandDoc));
});

// Reported by the app after it actually executes a command against its own
// engine — success/failure and a short free-text result, so Netra's command
// history shows what really happened, not just that the command was issued.
// Checks the acknowledging app actually owns the command (by appCode ->
// appId), so one app's code can't close out another app's command.
export const acknowledgeCommand = onCall<
  { appCode: string; id: number; success: boolean; result: string },
  Promise<boolean>
>(async (request) => {
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  const ref = commands().doc(String(request.data.id));
  const snap = await ref.get();
  if (!snap.exists || (snap.data() as CommandDoc).appId !== appId) return false;
  await ref.update({
    status: request.data.success ? "acknowledged" : "failed",
    result: request.data.result,
    completedAt: nowMs(),
  });
  return true;
});

export const listCommandHistory = onCall<
  { appId: string },
  Promise<CommandView[]>
>(async (request) => {
  const snap = await commands().where("appId", "==", request.data.appId).get();
  return snap.docs.map((d) => toView(Number(d.id), d.data() as CommandDoc));
});
