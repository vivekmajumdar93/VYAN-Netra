import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

interface ClientDoc {
  name: string;
  contactName: string | null;
  contactEmail: string | null;
  notes: string | null;
  createdAt: number;
}

export interface ClientView extends ClientDoc {
  id: string;
  appCount: number;
}

const clients = () => db.collection("clients");

function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function appCountFor(clientId: string): Promise<number> {
  const snap = await db
    .collection("apps")
    .where("clientId", "==", clientId)
    .count()
    .get();
  return snap.data().count;
}

async function toView(id: string, doc: ClientDoc): Promise<ClientView> {
  return { id, ...doc, appCount: await appCountFor(id) };
}

interface ClientInput {
  name: string;
  contactName?: string | null;
  contactEmail?: string | null;
  notes?: string | null;
}

export const createClient = onCall<ClientInput, Promise<ClientView>>(
  async (request) => {
    const name = request.data.name?.trim();
    if (!name) throw new HttpsError("invalid-argument", "Name is required.");
    const id = String(await nextId("clients"));
    const doc: ClientDoc = {
      name,
      contactName: clean(request.data.contactName),
      contactEmail: clean(request.data.contactEmail),
      notes: clean(request.data.notes),
      createdAt: nowMs(),
    };
    await clients().doc(id).set(doc);
    return toView(id, doc);
  },
);

export const updateClient = onCall<
  Partial<ClientInput> & { id: string },
  Promise<ClientView>
>(async (request) => {
  const ref = clients().doc(request.data.id);
  const snap = await ref.get();
  if (!snap.exists) notFound("Client");
  const update: Partial<ClientDoc> = {};
  if (request.data.name !== undefined) {
    const name = request.data.name.trim();
    if (!name) throw new HttpsError("invalid-argument", "Name is required.");
    update.name = name;
  }
  if (request.data.contactName !== undefined)
    update.contactName = clean(request.data.contactName);
  if (request.data.contactEmail !== undefined)
    update.contactEmail = clean(request.data.contactEmail);
  if (request.data.notes !== undefined) update.notes = clean(request.data.notes);
  await ref.update(update);
  const updated = await ref.get();
  return toView(ref.id, updated.data() as ClientDoc);
});

// Refuses while the client still owns apps: deleting it would orphan them
// (they'd keep a clientId pointing at nothing). Move or remove the apps
// first.
export const removeClient = onCall<{ id: string }, Promise<boolean>>(
  async (request) => {
    const ref = clients().doc(request.data.id);
    const snap = await ref.get();
    if (!snap.exists) return false;
    if ((await appCountFor(ref.id)) > 0) {
      throw new HttpsError(
        "failed-precondition",
        "This client still has apps or websites. Move or remove them first.",
      );
    }
    await ref.delete();
    return true;
  },
);

export const listClients = onCall<void, Promise<ClientView[]>>(async () => {
  const snap = await clients().get();
  const views = await Promise.all(
    snap.docs.map((d) => toView(d.id, d.data() as ClientDoc)),
  );
  return views.sort((a, b) => a.name.localeCompare(b.name));
});

export const getClient = onCall<{ id: string }, Promise<ClientView | null>>(
  async (request) => {
    const snap = await clients().doc(request.data.id).get();
    if (!snap.exists) return null;
    return toView(snap.id, snap.data() as ClientDoc);
  },
);
