import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { findAppIdByCode } from "../shared/appLookup.js";
import { notFound } from "../shared/errors.js";
import { isKillSwitchEnabled } from "./settings.js";

type MetricSeverity = "critical" | "warning" | "info";

interface MetricsDoc {
  id: number;
  appId: string;
  cpu: number;
  memory: number;
  disk: number;
  apiLatency: number;
  networkUptime: number;
  connectionStatus: string;
  timestamp: number;
}

interface AlertDoc {
  appId: string;
  metricType: string;
  severity: MetricSeverity;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
  resolvedAt: number | null;
}

export interface AlertView extends AlertDoc {
  id: number;
}

const metrics = () => db.collection("systemMetrics");
const alerts = () => db.collection("alerts");

// What a linked app calls to push its own measured figures. Identified by
// pairing code (the id can't be trusted from the caller, and the code can be
// regenerated independently of it) and gated by the console-wide kill
// switch like the other inbound bridge calls.
export const reportMetrics = onCall<
  {
    appCode: string;
    cpu: number;
    memory: number;
    disk: number;
    apiLatency: number;
    networkUptime: number;
    connectionStatus: string;
  },
  Promise<boolean>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return false;
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  const { appCode: _appCode, ...figures } = request.data;
  for (const key of ["cpu", "memory", "disk", "apiLatency", "networkUptime"] as const) {
    if (typeof figures[key] !== "number" || !Number.isFinite(figures[key])) {
      throw new HttpsError("invalid-argument", `${key} must be a number.`);
    }
  }
  // Stored as whole numbers (the console's metric model is integer-valued),
  // so a real reading like 12.6% CPU is kept as 13, never rejected.
  const whole = (n: number) => Math.max(0, Math.round(n));
  const id = await nextId("metrics");
  const doc: MetricsDoc = {
    id,
    appId,
    cpu: whole(figures.cpu),
    memory: whole(figures.memory),
    disk: whole(figures.disk),
    apiLatency: whole(figures.apiLatency),
    networkUptime: whole(figures.networkUptime),
    connectionStatus: String(figures.connectionStatus).slice(0, 40),
    timestamp: nowMs(),
  };
  await metrics().doc(String(id)).set(doc);
  return true;
});

export const getLatestMetrics = onCall<
  { appId: string },
  Promise<MetricsDoc | null>
>(async (request) => {
  const snap = await metrics()
    .where("appId", "==", request.data.appId)
    .orderBy("id", "desc")
    .limit(1)
    .get();
  return snap.empty ? null : (snap.docs[0].data() as MetricsDoc);
});

export const getMetricsHistory = onCall<
  { appId: string },
  Promise<MetricsDoc[]>
>(async (request) => {
  const snap = await metrics()
    .where("appId", "==", request.data.appId)
    .orderBy("id", "desc")
    .limit(24)
    .get();
  return snap.docs.map((d) => d.data() as MetricsDoc).reverse();
});

export const createAlert = onCall<
  {
    appId: string;
    metricType: string;
    severity: MetricSeverity;
    value: number;
    threshold: number;
  },
  Promise<AlertView>
>(async (request) => {
  const id = await nextId("alerts");
  const doc: AlertDoc = {
    ...request.data,
    timestamp: nowMs(),
    resolved: false,
    resolvedAt: null,
  };
  await alerts().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const resolveAlert = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    const ref = alerts().doc(String(request.data.id));
    const snap = await ref.get();
    if (!snap.exists) notFound("Alert");
    await ref.update({ resolved: true, resolvedAt: nowMs() });
  },
);

export const listActiveAlerts = onCall<void, Promise<AlertView[]>>(
  async () => {
    const snap = await alerts().where("resolved", "==", false).get();
    return snap.docs.map((d) => ({
      id: Number(d.id),
      ...(d.data() as AlertDoc),
    }));
  },
);

export const listAlertHistory = onCall<
  { appId: string },
  Promise<AlertView[]>
>(async (request) => {
  const snap = await alerts().where("appId", "==", request.data.appId).get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as AlertDoc),
  }));
});
