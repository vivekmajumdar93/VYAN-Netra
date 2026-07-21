import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

type UserRole = "admin" | "manager" | "viewer";
type UserStatus = "pending" | "active" | "held" | "rejected";
type ActivityEventType = "action" | "login" | "permissionChange";

interface UserDoc {
  appId: string;
  externalId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActivity: number;
  createdAt: number;
}

export interface UserView extends UserDoc {
  id: number;
}

interface ActivityDoc {
  userId: number;
  appId: string;
  eventType: ActivityEventType;
  description: string;
  timestamp: number;
}

export interface UserActivityView extends ActivityDoc {
  id: number;
}

const users = () => db.collection("users");
const activities = () => db.collection("userActivities");
const apps = () => db.collection("apps");

function toView(id: number, doc: UserDoc): UserView {
  return { id, ...doc };
}

async function findAppIdByCode(appCode: string): Promise<string | null> {
  const found = await apps().where("appCode", "==", appCode).limit(1).get();
  return found.empty ? null : found.docs[0].id;
}

export const createUser = onCall<
  { appId: string; name: string; email: string; role: UserRole },
  Promise<UserView>
>(async (request) => {
  const { appId, name, email, role } = request.data;
  const id = await nextId("users");
  const now = nowMs();
  const doc: UserDoc = {
    appId,
    externalId: `manual-${id}`,
    name,
    email,
    role,
    status: "active",
    lastActivity: now,
    createdAt: now,
  };
  await users().doc(String(id)).set(doc);
  return toView(id, doc);
});

// Called by a linked app (identified by its current appCode) to push its
// user list into Netra for moderation. New users land as #pending;
// existing ones (matched by externalId within that app) keep their current
// moderation status and just refresh name/email/activity.
export const syncAppUsers = onCall<
  { appCode: string; incoming: [string, string, string][] },
  Promise<boolean>
>(async (request) => {
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;

  const now = nowMs();
  for (const [externalId, name, email] of request.data.incoming) {
    const existing = await users()
      .where("appId", "==", appId)
      .where("externalId", "==", externalId)
      .limit(1)
      .get();
    if (!existing.empty) {
      await existing.docs[0].ref.update({ name, email, lastActivity: now });
    } else {
      const id = await nextId("users");
      const doc: UserDoc = {
        appId,
        externalId,
        name,
        email,
        role: "viewer",
        status: "pending",
        lastActivity: now,
        createdAt: now,
      };
      await users().doc(String(id)).set(doc);
    }
  }
  return true;
});

// Lets a linked app check whether one of its own users is currently
// allowed in, per the admin's accept/reject/hold decision.
export const getUserStatusForApp = onCall<
  { appCode: string; externalId: string },
  Promise<UserStatus | null>
>(async (request) => {
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return null;
  const found = await users()
    .where("appId", "==", appId)
    .where("externalId", "==", request.data.externalId)
    .limit(1)
    .get();
  if (found.empty) return null;
  return (found.docs[0].data() as UserDoc).status;
});

async function setStatus(id: number, status: UserStatus): Promise<void> {
  const ref = users().doc(String(id));
  const snap = await ref.get();
  if (!snap.exists) notFound("User");
  await ref.update({ status });
}

export const updateUserRole = onCall<
  { id: number; role: UserRole },
  Promise<void>
>(async (request) => {
  const ref = users().doc(String(request.data.id));
  const snap = await ref.get();
  if (!snap.exists) notFound("User");
  await ref.update({ role: request.data.role });
});

export const acceptUser = onCall<{ id: number }, Promise<void>>((request) =>
  setStatus(request.data.id, "active"),
);
export const rejectUser = onCall<{ id: number }, Promise<void>>((request) =>
  setStatus(request.data.id, "rejected"),
);
export const holdUser = onCall<{ id: number }, Promise<void>>((request) =>
  setStatus(request.data.id, "held"),
);

export const removeUser = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    await users().doc(String(request.data.id)).delete();
  },
);

export const listUsers = onCall<void, Promise<UserView[]>>(async () => {
  const snap = await users().get();
  return snap.docs.map((d) => toView(Number(d.id), d.data() as UserDoc));
});

export const listUsersByApp = onCall<
  { appId: string },
  Promise<UserView[]>
>(async (request) => {
  const snap = await users().where("appId", "==", request.data.appId).get();
  return snap.docs.map((d) => toView(Number(d.id), d.data() as UserDoc));
});

export const listPendingUsers = onCall<void, Promise<UserView[]>>(
  async () => {
    const snap = await users().where("status", "==", "pending").get();
    return snap.docs.map((d) => toView(Number(d.id), d.data() as UserDoc));
  },
);

export const logUserActivity = onCall<
  {
    userId: number;
    appId: string;
    eventType: ActivityEventType;
    description: string;
  },
  Promise<void>
>(async (request) => {
  const { userId, appId, eventType, description } = request.data;
  const id = await nextId("activities");
  const doc: ActivityDoc = {
    userId,
    appId,
    eventType,
    description,
    timestamp: nowMs(),
  };
  await activities().doc(String(id)).set(doc);
});

export const listUserActivities = onCall<
  { appId: string },
  Promise<UserActivityView[]>
>(async (request) => {
  const snap = await activities()
    .where("appId", "==", request.data.appId)
    .get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as ActivityDoc),
  }));
});
