import { onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { isKillSwitchEnabled } from "./settings.js";

type EmailStatus = "sent" | "failed" | "bounced";

interface EmailConfigDoc {
  appId: string;
  senderName: string;
  senderEmail: string;
  bounceEmail: string;
  isActive: boolean;
  createdAt: number;
}
export interface EmailConfigView extends EmailConfigDoc {
  id: number;
}

interface EmailTemplateDoc {
  appId: string;
  name: string;
  subject: string;
  body: string;
  lastModified: number;
}
export interface EmailTemplateView extends EmailTemplateDoc {
  id: number;
}

export interface EmailLog {
  id: number;
  appId: string;
  recipient: string;
  subject: string;
  status: EmailStatus;
  detail: string;
  timestamp: number;
}

export interface ZohoStatusView {
  configured: boolean;
  accountId: string;
  fromAddress: string;
}

const emailConfigs = () => db.collection("emailConfigs");
const emailTemplates = () => db.collection("emailTemplates");
const emailLogs = () => db.collection("emailLogs");
const zohoRef = () => db.collection("settings").doc("zoho");

export const createEmailConfig = onCall<
  {
    appId: string;
    senderName: string;
    senderEmail: string;
    bounceEmail: string;
  },
  Promise<EmailConfigView>
>(async (request) => {
  const id = await nextId("emailConfigs");
  const doc: EmailConfigDoc = {
    ...request.data,
    isActive: true,
    createdAt: nowMs(),
  };
  await emailConfigs().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const updateEmailConfig = onCall<
  {
    id: number;
    senderName: string;
    senderEmail: string;
    bounceEmail: string;
    isActive: boolean;
  },
  Promise<void>
>(async (request) => {
  const { id, ...rest } = request.data;
  await emailConfigs().doc(String(id)).update({ ...rest });
});

export const deleteEmailConfig = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    await emailConfigs().doc(String(request.data.id)).delete();
  },
);

export const listEmailConfigs = onCall<
  { appId: string },
  Promise<EmailConfigView[]>
>(async (request) => {
  const snap = await emailConfigs()
    .where("appId", "==", request.data.appId)
    .get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as EmailConfigDoc),
  }));
});

export const createEmailTemplate = onCall<
  { appId: string; name: string; subject: string; body: string },
  Promise<EmailTemplateView>
>(async (request) => {
  const id = await nextId("emailTemplates");
  const doc: EmailTemplateDoc = { ...request.data, lastModified: nowMs() };
  await emailTemplates().doc(String(id)).set(doc);
  return { id, ...doc };
});

export const updateEmailTemplate = onCall<
  { id: number; subject: string; body: string },
  Promise<void>
>(async (request) => {
  const { id, subject, body } = request.data;
  await emailTemplates()
    .doc(String(id))
    .update({ subject, body, lastModified: nowMs() });
});

export const deleteEmailTemplate = onCall<{ id: number }, Promise<void>>(
  async (request) => {
    await emailTemplates().doc(String(request.data.id)).delete();
  },
);

export const listEmailTemplates = onCall<
  { appId: string },
  Promise<EmailTemplateView[]>
>(async (request) => {
  const snap = await emailTemplates()
    .where("appId", "==", request.data.appId)
    .get();
  return snap.docs.map((d) => ({
    id: Number(d.id),
    ...(d.data() as EmailTemplateDoc),
  }));
});

export const listEmailLogs = onCall<
  { appId: string },
  Promise<EmailLog[]>
>(async (request) => {
  const snap = await emailLogs().where("appId", "==", request.data.appId).get();
  return snap.docs.map((d) => ({ id: Number(d.id), ...(d.data() as Omit<EmailLog, "id">) }));
});

// ── Zoho credentials (write-only — never returned by a query) ────────────
export const setZohoConfig = onCall<
  { accountId: string; accessToken: string; fromAddress: string },
  Promise<void>
>(async (request) => {
  await zohoRef().set(request.data, { merge: true });
});

export const getZohoStatus = onCall<void, Promise<ZohoStatusView>>(
  async () => {
    const snap = await zohoRef().get();
    const data = snap.data() as
      | { accountId: string; accessToken: string; fromAddress: string }
      | undefined;
    return {
      configured: !!data?.accountId && !!data?.accessToken,
      accountId: data?.accountId ?? "",
      fromAddress: data?.fromAddress ?? "",
    };
  },
);

async function addEmailLog(
  appId: string,
  recipient: string,
  subject: string,
  status: EmailStatus,
  detail: string,
): Promise<EmailLog> {
  const id = await nextId("emailLogs");
  const doc = { appId, recipient, subject, status, detail, timestamp: nowMs() };
  await emailLogs().doc(String(id)).set(doc);
  return { id, ...doc };
}

// Sends one email via Zoho's Mail API (HTTPS) and logs the real result.
async function sendViaZoho(
  accountId: string,
  accessToken: string,
  fromAddress: string,
  toAddress: string,
  subject: string,
  content: string,
): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch(
      `https://mail.zoho.com/api/accounts/${accountId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fromAddress, toAddress, subject, content }),
      },
    );
    if (res.status >= 200 && res.status < 300) return { ok: true, detail: "OK" };
    return { ok: false, detail: `Zoho responded with HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, detail: `Outcall failed: ${(e as Error).message}` };
  }
}

async function sendOne(
  appId: string,
  recipient: string,
  subject: string,
  body: string,
): Promise<EmailLog> {
  if (!(await isKillSwitchEnabled())) {
    return addEmailLog(
      appId,
      recipient,
      subject,
      "failed",
      "Blocked: console kill switch is off (Settings)",
    );
  }
  const snap = await zohoRef().get();
  const zoho = snap.data() as
    | { accountId: string; accessToken: string; fromAddress: string }
    | undefined;
  if (!zoho?.accountId || !zoho?.accessToken) {
    return addEmailLog(
      appId,
      recipient,
      subject,
      "failed",
      "Zoho is not configured in Settings",
    );
  }
  const { ok, detail } = await sendViaZoho(
    zoho.accountId,
    zoho.accessToken,
    zoho.fromAddress,
    recipient,
    subject,
    body,
  );
  return addEmailLog(appId, recipient, subject, ok ? "sent" : "failed", detail);
}

export const sendEmailNow = onCall<
  { appId: string; recipient: string; subject: string; body: string },
  Promise<EmailLog>
>((request) => {
  const { appId, recipient, subject, body } = request.data;
  return sendOne(appId, recipient, subject, body);
});

// Sends to a batch of recipients, one at a time so a single failure doesn't
// drop the rest. Returns one real log entry per recipient.
export const sendEmailBatch = onCall<
  { appId: string; recipients: string[]; subject: string; body: string },
  Promise<EmailLog[]>
>(async (request) => {
  const { appId, recipients, subject, body } = request.data;
  const results: EmailLog[] = [];
  for (const recipient of recipients) {
    results.push(await sendOne(appId, recipient, subject, body));
  }
  return results;
});
