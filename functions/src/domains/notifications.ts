import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { notFound } from "../shared/errors.js";

type NotificationSeverity = "critical" | "warning" | "info";
type NotificationType = "systemAlert" | "user" | "update" | "issue";

interface NotificationDoc {
  title: string;
  body: string;
  severity: NotificationSeverity;
  notifType: NotificationType;
  appId: string | null;
  isRead: boolean;
  snoozed: boolean;
  snoozedUntil: number | null;
  createdAt: number;
}

export interface NotificationView extends NotificationDoc {
  id: number;
}

const notifications = () => db.collection("notifications");

export const createNotification = onCall<
  {
    title: string;
    body: string;
    severity: NotificationSeverity;
    notifType: NotificationType;
    appId: string | null;
  },
  Promise<NotificationView>
>(async (request) => {
  const id = await nextId("notifications");
  const doc: NotificationDoc = {
    ...request.data,
    isRead: false,
    snoozed: false,
    snoozedUntil: null,
    createdAt: nowMs(),
  };
  await notifications().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const markNotificationRead = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    const ref = notifications().doc(String(request.data.id));
    const snap = await ref.get();
    if (!snap.exists) notFound("Notification");
    await ref.update({ isRead: true });
  },
);

export const markAllNotificationsRead = onCall<void, Promise<void>>(
  async () => {
    const snap = await notifications().get();
    const batch = db.batch();
    for (const d of snap.docs) batch.update(d.ref, { isRead: true });
    await batch.commit();
  },
);

export const dismissNotification = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    await notifications().doc(String(request.data.id)).delete();
  },
);

export const snoozeNotification = onCall<
  { id: number; until: number },
  Promise<void>
>(async (request) => {
  const ref = notifications().doc(String(request.data.id));
  const snap = await ref.get();
  if (!snap.exists) notFound("Notification");
  await ref.update({ snoozed: true, snoozedUntil: request.data.until });
});

export const listNotifications = onCall<
  {
    notifType: NotificationType | null;
    appId: string | null;
    isRead: boolean | null;
  },
  Promise<NotificationView[]>
>(async (request) => {
  const { notifType, appId, isRead } = request.data;
  const snap = await notifications().get();
  return snap.docs
    .map((d) => ({ id: Number(d.id), ...(d.data() as NotificationDoc) }))
    .filter((n) => {
      const typeMatch = notifType === null || n.notifType === notifType;
      const appMatch = appId === null || n.appId === appId;
      const readMatch = isRead === null || n.isRead === isRead;
      return typeMatch && appMatch && readMatch;
    });
});
