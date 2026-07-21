import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

type UpdateStatus = "pending" | "scheduled" | "deployed" | "failed";

interface UpdateDoc {
  appId: string;
  version: string;
  releaseNotes: string;
  size: number;
  status: UpdateStatus;
  scheduledAt: number | null;
  deployedAt: number | null;
  createdAt: number;
}

export interface UpdateView extends UpdateDoc {
  id: number;
}

const updates = () => db.collection("updates");

export const createUpdate = onCall<
  { appId: string; version: string; releaseNotes: string; size: number },
  Promise<UpdateView>
>(async (request) => {
  const id = await nextId("updates");
  const doc: UpdateDoc = {
    ...request.data,
    status: "pending",
    scheduledAt: null,
    deployedAt: null,
    createdAt: nowMs(),
  };
  await updates().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const scheduleUpdate = onCall<
  { id: number; scheduledAt: number },
  Promise<void>
>(async (request) => {
  const ref = updates().doc(String(request.data.id));
  const snap = await ref.get();
  if (!snap.exists) notFound("Update");
  await ref.update({
    status: "scheduled",
    scheduledAt: request.data.scheduledAt,
  });
});

export const markUpdateDeployed = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    const ref = updates().doc(String(request.data.id));
    const snap = await ref.get();
    if (!snap.exists) notFound("Update");
    await ref.update({ status: "deployed", deployedAt: nowMs() });
  },
);

export const listAppUpdates = onCall<
  { appId: string },
  Promise<UpdateView[]>
>(async (request) => {
  const snap = await updates().where("appId", "==", request.data.appId).get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as UpdateDoc),
  }));
});

export const listAllUpdates = onCall<void, Promise<UpdateView[]>>(
  async () => {
    const snap = await updates().get();
    return snap.docs.map((d) => ({
      id: Number(d.id),
      ...(d.data() as UpdateDoc),
    }));
  },
);
