import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

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

export const submitMetrics = onCall<
  {
    appId: string;
    cpu: number;
    memory: number;
    disk: number;
    apiLatency: number;
    networkUptime: number;
    connectionStatus: string;
  },
  Promise<MetricsDoc>
>(async (request) => {
  const id = await nextId("metrics");
  const doc: MetricsDoc = { id, ...request.data, timestamp: nowMs() };
  await metrics().doc(String(id)).set(doc);
  return doc;
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
