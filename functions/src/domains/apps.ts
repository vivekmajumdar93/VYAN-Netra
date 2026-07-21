import { randomInt } from "node:crypto";
import { onCall } from "firebase-functions/v2/https";
import { db, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";
import { isKillSwitchEnabled } from "./settings.js";

const CODE_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

// A heartbeat older than this reads as disconnected, even if nothing ever
// explicitly flipped the stored status — same 3-minute threshold as before.
const HEARTBEAT_STALE_MS = 3 * 60 * 1000;

type AppStatus = "pending" | "connected" | "disconnected";

interface AppDoc {
  name: string;
  baseUrl: string | null;
  appCode: string;
  status: AppStatus;
  lastHeartbeat: number | null;
  addedAt: number;
}

export interface AppView {
  id: string;
  name: string;
  baseUrl: string | null;
  appCode: string;
  status: AppStatus;
  lastHeartbeat: number | null;
  addedAt: number;
}

const apps = () => db.collection("apps");

function liveStatus(doc: AppDoc): AppStatus {
  if (doc.status === "pending") return "pending";
  if (doc.lastHeartbeat === null) return doc.status;
  return nowMs() - doc.lastHeartbeat > HEARTBEAT_STALE_MS
    ? "disconnected"
    : "connected";
}

function toView(id: string, doc: AppDoc): AppView {
  return {
    id,
    name: doc.name,
    baseUrl: doc.baseUrl,
    appCode: doc.appCode,
    status: liveStatus(doc),
    lastHeartbeat: doc.lastHeartbeat,
    addedAt: doc.addedAt,
  };
}

// Cryptographically random 6-char code (36^6 ≈ 2.18B combinations), retried
// on the (extremely unlikely) chance of a collision — same scheme as the
// old Motoko mo:core/Random-based generator.
async function generateCode(): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
    }
    const existing = await apps().where("appCode", "==", code).limit(1).get();
    if (existing.empty) return code;
  }
  throw new Error("Failed to generate a unique app code");
}

export const createApp = onCall<{ name: string }, Promise<AppView>>(
  async (request) => {
    const code = await generateCode();
    const doc: AppDoc = {
      name: request.data.name,
      baseUrl: null,
      appCode: code,
      status: "pending",
      lastHeartbeat: null,
      addedAt: nowMs(),
    };
    await apps().doc(code).set(doc);
    return toView(code, doc);
  },
);

export const setAppBaseUrl = onCall<
  { id: string; baseUrl: string },
  Promise<AppView>
>(async (request) => {
  const ref = apps().doc(request.data.id);
  const snap = await ref.get();
  if (!snap.exists) notFound("App");
  await ref.update({ baseUrl: request.data.baseUrl });
  const updated = await ref.get();
  return toView(ref.id, updated.data() as AppDoc);
});

export const renameApp = onCall<
  { id: string; name: string },
  Promise<AppView>
>(async (request) => {
  const ref = apps().doc(request.data.id);
  const snap = await ref.get();
  if (!snap.exists) notFound("App");
  await ref.update({ name: request.data.name });
  const updated = await ref.get();
  return toView(ref.id, updated.data() as AppDoc);
});

// Called by a linked app itself on a periodic interval (see the VYAN Bridge
// protocol doc). Not gated by admin auth — the appCode IS the credential.
// Returns false if the code isn't recognized, or if the console's kill
// switch is off — no cross-app activity is processed while it's disabled.
export const recordHeartbeat = onCall<{ appCode: string }, Promise<boolean>>(
  async (request) => {
    if (!(await isKillSwitchEnabled())) return false;
    const found = await apps()
      .where("appCode", "==", request.data.appCode)
      .limit(1)
      .get();
    if (found.empty) return false;
    await found.docs[0].ref.update({
      lastHeartbeat: nowMs(),
      status: "connected",
    });
    return true;
  },
);

// Reported by the console after it directly probes the app's own /health
// endpoint from the browser.
export const setAppManualStatus = onCall<
  { id: string; status: AppStatus },
  Promise<AppView>
>(async (request) => {
  const ref = apps().doc(request.data.id);
  const snap = await ref.get();
  if (!snap.exists) notFound("App");
  const update: Partial<AppDoc> = { status: request.data.status };
  if (request.data.status === "connected") update.lastHeartbeat = nowMs();
  await ref.update(update);
  const updated = await ref.get();
  return toView(ref.id, updated.data() as AppDoc);
});

// Rotates the embedded pairing credential without disturbing the app's
// stable id (and therefore without breaking Users/Email/etc. foreign keys).
export const regenerateAppCode = onCall<{ id: string }, Promise<AppView>>(
  async (request) => {
    const ref = apps().doc(request.data.id);
    const snap = await ref.get();
    if (!snap.exists) notFound("App");
    const code = await generateCode();
    await ref.update({
      appCode: code,
      status: "pending",
      lastHeartbeat: null,
    });
    const updated = await ref.get();
    return toView(ref.id, updated.data() as AppDoc);
  },
);

export const removeApp = onCall<{ id: string }, Promise<boolean>>(
  async (request) => {
    const ref = apps().doc(request.data.id);
    const snap = await ref.get();
    if (!snap.exists) return false;
    await ref.delete();
    return true;
  },
);

export const listApps = onCall<void, Promise<AppView[]>>(async () => {
  const snap = await apps().get();
  return snap.docs.map((d) => toView(d.id, d.data() as AppDoc));
});

export const getApp = onCall<{ id: string }, Promise<AppView | null>>(
  async (request) => {
    const snap = await apps().doc(request.data.id).get();
    if (!snap.exists) return null;
    return toView(snap.id, snap.data() as AppDoc);
  },
);
