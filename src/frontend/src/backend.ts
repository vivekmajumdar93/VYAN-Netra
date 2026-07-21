/* eslint-disable */

// Firebase-backed implementation of the `_SERVICE` contract that used to
// be satisfied by an ICP canister actor. Every exported hook in
// hooks/use-backend.ts calls `actor.<method>(...)` exactly as before —
// nothing above this file changed for the ICP -> Firebase migration.
//
// Cloud Functions (functions/src/domains/*.ts) speak plain JSON: numbers,
// strings, null. The rest of this app still speaks the original candid
// wire shapes (`bigint` timestamps/ids, `[] | [T]` optionals, `{tag:null}`
// variants) because hooks/use-backend.ts's mapping functions
// (fromVariant/fromOpt) were written against them. The `unwire*`/`wire*`
// helpers below are the one place that translates between the two, so a
// future backend swap only has to satisfy `_SERVICE` again — nothing else
// in the frontend needs to know or care what's behind it.

import { httpsCallable, type Functions } from "firebase/functions";
import { getFirebaseFunctions } from "./firebase";
import type { _SERVICE } from "./declarations/backend.did";

export type {
  AppId,
  AppView,
  AlertView,
  EmailConfigId,
  EmailConfigView,
  EmailLog,
  EmailTemplateView,
  Id,
  IssueComment,
  IssueId,
  IssueView,
  KillSwitchView,
  NotificationView,
  SystemMetrics,
  Time,
  Timestamp,
  UpdateId,
  UpdateView,
  UserActivity,
  UserId,
  UserView,
  ZohoStatusView,
  _SERVICE,
} from "./declarations/backend.did";

export enum ActivityEventType {
  action = "action",
  login = "login",
  permissionChange = "permissionChange",
}
export enum AppStatus {
  pending = "pending",
  connected = "connected",
  disconnected = "disconnected",
}
export enum EmailStatus {
  sent = "sent",
  failed = "failed",
  bounced = "bounced",
}
export enum IssueSeverity {
  low = "low",
  high = "high",
  critical = "critical",
  medium = "medium",
}
export enum IssueStatus {
  resolved = "resolved",
  in_progress = "in_progress",
  open = "open",
}
export enum NotificationSeverity {
  warning = "warning",
  info = "info",
  critical = "critical",
}
export enum NotificationType {
  systemAlert = "systemAlert",
  user = "user",
  update = "update",
  issue = "issue",
}
export enum UpdateStatus {
  deployed = "deployed",
  scheduled = "scheduled",
  pending = "pending",
  failed = "failed",
}
export enum UserRole {
  manager = "manager",
  admin = "admin",
  viewer = "viewer",
}
export enum UserStatus {
  pending = "pending",
  active = "active",
  held = "held",
  rejected = "rejected",
}

/** Candid variant (`{ critical: null }`) -> plain string tag (`"critical"`). */
export function fromVariant<T extends string>(v: Record<string, null>): T {
  return Object.keys(v)[0] as T;
}
/** Plain string tag -> candid variant. */
export function toVariant(key: string): Record<string, null> {
  return { [key]: null };
}
/** Candid `?T` (`[] | [T]`) -> `T | null`. */
export function fromOpt<T>(opt: [] | [T]): T | null {
  return opt.length === 0 ? null : opt[0];
}
/** `T | null | undefined` -> candid `?T`. */
export function toOpt<T>(val: T | null | undefined): [] | [T] {
  return val === null || val === undefined ? [] : [val];
}

// ── Wire marshaling (candid shapes <-> plain JSON Cloud Functions speak) ──

type Variant<T extends string> = T extends string ? { [K in T]: null } : never;

function unwireVariant<T extends string>(tag: T): Variant<T> {
  return { [tag]: null } as Variant<T>;
}
function wireVariant(v: Record<string, null>): string {
  return Object.keys(v)[0];
}
function unwireTs(ms: number): bigint {
  return BigInt(ms) * 1_000_000n;
}
function wireTs(ts: bigint): number {
  return Number(ts / 1_000_000n);
}
function unwireOptTs(ms: number | null): [] | [bigint] {
  return ms === null ? [] : [unwireTs(ms)];
}
function wireOptTs(opt: [] | [bigint]): number | null {
  return opt.length === 0 ? null : wireTs(opt[0]);
}
function unwireOpt<T>(v: T | null): [] | [T] {
  return v === null ? [] : [v];
}
function wireOpt<T>(opt: [] | [T]): T | null {
  return opt.length === 0 ? null : opt[0];
}
function unwireId(n: number): bigint {
  return BigInt(n);
}
function wireId(id: bigint): number {
  return Number(id);
}
/** Candid `?Variant` -> wire `string | null` in one step (not `wireOpt` — that unwraps to the raw value, not a wire tag). */
function wireOptVariant(opt: readonly [] | readonly [unknown]): string | null {
  return opt.length === 0 ? null : wireVariant(opt[0] as Record<string, null>);
}
/** Candid `?Nat` -> wire `number | null` in one step. */
function wireOptId(opt: readonly [] | readonly [bigint]): number | null {
  return opt.length === 0 ? null : wireId(opt[0] as bigint);
}

// ── Wire (plain JSON) shapes returned by/sent to the Cloud Functions ─────

interface WireApp {
  id: string;
  name: string;
  baseUrl: string | null;
  appCode: string;
  status: string;
  lastHeartbeat: number | null;
  addedAt: number;
}
interface WireAlert {
  id: number;
  appId: string;
  metricType: string;
  severity: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved: boolean;
  resolvedAt: number | null;
}
interface WireMetrics {
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
interface WireUser {
  id: number;
  appId: string;
  externalId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActivity: number;
  createdAt: number;
}
interface WireUserActivity {
  id: number;
  userId: number;
  appId: string;
  eventType: string;
  description: string;
  timestamp: number;
}
interface WireNotification {
  id: number;
  title: string;
  body: string;
  severity: string;
  notifType: string;
  appId: string | null;
  isRead: boolean;
  snoozed: boolean;
  snoozedUntil: number | null;
  createdAt: number;
}
interface WireIssue {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  appId: string;
  assignedTo: number | null;
  createdAt: number;
  updatedAt: number;
}
interface WireIssueComment {
  id: number;
  issueId: number;
  content: string;
  authorId: number;
  timestamp: number;
}
interface WireUpdate {
  id: number;
  appId: string;
  version: string;
  releaseNotes: string;
  size: number;
  status: string;
  scheduledAt: number | null;
  deployedAt: number | null;
  createdAt: number;
}
interface WireEmailConfig {
  id: number;
  appId: string;
  senderName: string;
  senderEmail: string;
  bounceEmail: string;
  isActive: boolean;
  createdAt: number;
}
interface WireEmailTemplate {
  id: number;
  appId: string;
  name: string;
  subject: string;
  body: string;
  lastModified: number;
}
interface WireEmailLog {
  id: number;
  appId: string;
  recipient: string;
  subject: string;
  status: string;
  detail: string;
  timestamp: number;
}
interface WireKillSwitch {
  enabled: boolean;
  updatedAt: number;
}
interface WireZohoStatus {
  configured: boolean;
  accountId: string;
  fromAddress: string;
}

function unwireApp(w: WireApp) {
  return {
    id: w.id,
    name: w.name,
    baseUrl: unwireOpt(w.baseUrl),
    appCode: w.appCode,
    status: unwireVariant(w.status),
    lastHeartbeat: unwireOptTs(w.lastHeartbeat),
    addedAt: unwireTs(w.addedAt),
  };
}
function unwireAlert(w: WireAlert) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    metricType: w.metricType,
    severity: unwireVariant(w.severity),
    value: unwireId(w.value),
    threshold: unwireId(w.threshold),
    timestamp: unwireTs(w.timestamp),
    resolved: w.resolved,
    resolvedAt: unwireOptTs(w.resolvedAt),
  };
}
function unwireMetrics(w: WireMetrics) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    cpu: unwireId(w.cpu),
    memory: unwireId(w.memory),
    disk: unwireId(w.disk),
    apiLatency: unwireId(w.apiLatency),
    networkUptime: unwireId(w.networkUptime),
    connectionStatus: w.connectionStatus,
    timestamp: unwireTs(w.timestamp),
  };
}
function unwireUser(w: WireUser) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    externalId: w.externalId,
    name: w.name,
    email: w.email,
    role: unwireVariant(w.role),
    status: unwireVariant(w.status),
    lastActivity: unwireTs(w.lastActivity),
    createdAt: unwireTs(w.createdAt),
  };
}
function unwireUserActivity(w: WireUserActivity) {
  return {
    id: unwireId(w.id),
    userId: unwireId(w.userId),
    appId: w.appId,
    eventType: unwireVariant(w.eventType),
    description: w.description,
    timestamp: unwireTs(w.timestamp),
  };
}
function unwireNotification(w: WireNotification) {
  return {
    id: unwireId(w.id),
    title: w.title,
    body: w.body,
    severity: unwireVariant(w.severity),
    notifType: unwireVariant(w.notifType),
    appId: unwireOpt(w.appId),
    isRead: w.isRead,
    snoozed: w.snoozed,
    snoozedUntil: unwireOptTs(w.snoozedUntil),
    createdAt: unwireTs(w.createdAt),
  };
}
function unwireIssue(w: WireIssue) {
  return {
    id: unwireId(w.id),
    title: w.title,
    description: w.description,
    severity: unwireVariant(w.severity),
    status: unwireVariant(w.status),
    appId: w.appId,
    assignedTo: unwireOpt(w.assignedTo === null ? null : unwireId(w.assignedTo)),
    createdAt: unwireTs(w.createdAt),
    updatedAt: unwireTs(w.updatedAt),
  };
}
function unwireIssueComment(w: WireIssueComment) {
  return {
    id: unwireId(w.id),
    issueId: unwireId(w.issueId),
    content: w.content,
    authorId: unwireId(w.authorId),
    timestamp: unwireTs(w.timestamp),
  };
}
function unwireUpdate(w: WireUpdate) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    version: w.version,
    releaseNotes: w.releaseNotes,
    size: unwireId(w.size),
    status: unwireVariant(w.status),
    scheduledAt: unwireOptTs(w.scheduledAt),
    deployedAt: unwireOptTs(w.deployedAt),
    createdAt: unwireTs(w.createdAt),
  };
}
function unwireEmailConfig(w: WireEmailConfig) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    senderName: w.senderName,
    senderEmail: w.senderEmail,
    bounceEmail: w.bounceEmail,
    isActive: w.isActive,
    createdAt: unwireTs(w.createdAt),
  };
}
function unwireEmailTemplate(w: WireEmailTemplate) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    name: w.name,
    subject: w.subject,
    body: w.body,
    lastModified: unwireTs(w.lastModified),
  };
}
function unwireEmailLog(w: WireEmailLog) {
  return {
    id: unwireId(w.id),
    appId: w.appId,
    recipient: w.recipient,
    subject: w.subject,
    status: unwireVariant(w.status),
    detail: w.detail,
    timestamp: unwireTs(w.timestamp),
  };
}
function unwireKillSwitch(w: WireKillSwitch) {
  return { enabled: w.enabled, updatedAt: unwireTs(w.updatedAt) };
}

// ── Actor construction ────────────────────────────────────────────────────

function call<TReq, TRes>(functions: Functions, name: string) {
  const fn = httpsCallable<TReq, TRes>(functions, name);
  return async (data?: TReq): Promise<TRes> => (await fn(data as TReq)).data;
}

export function createActor(): _SERVICE {
  const functions = getFirebaseFunctions();

  return {
    // ── Apps ──────────────────────────────────────────────────────────
    createApp: async (name) => {
      const w = await call<{ name: string }, WireApp>(functions, "createApp")({ name });
      return unwireApp(w) as any;
    },
    setAppBaseUrl: async (id, baseUrl) => {
      const w = await call<{ id: string; baseUrl: string }, WireApp>(functions, "setAppBaseUrl")({ id, baseUrl });
      return unwireApp(w) as any;
    },
    renameApp: async (id, name) => {
      const w = await call<{ id: string; name: string }, WireApp>(functions, "renameApp")({ id, name });
      return unwireApp(w) as any;
    },
    recordHeartbeat: async (appCode) =>
      call<{ appCode: string }, boolean>(functions, "recordHeartbeat")({ appCode }),
    setAppManualStatus: async (id, status) => {
      const w = await call<{ id: string; status: string }, WireApp>(functions, "setAppManualStatus")({
        id,
        status: wireVariant(status as unknown as Record<string, null>),
      });
      return unwireApp(w) as any;
    },
    regenerateAppCode: async (id) => {
      const w = await call<{ id: string }, WireApp>(functions, "regenerateAppCode")({ id });
      return unwireApp(w) as any;
    },
    removeApp: async (id) => call<{ id: string }, boolean>(functions, "removeApp")({ id }),
    listApps: async () => {
      const list = await call<undefined, WireApp[]>(functions, "listApps")();
      return list.map(unwireApp) as any;
    },
    getApp: async (id) => {
      const w = await call<{ id: string }, WireApp | null>(functions, "getApp")({ id });
      return unwireOpt(w === null ? null : unwireApp(w)) as any;
    },

    // ── Kill switch ───────────────────────────────────────────────────
    getKillSwitch: async () => {
      const w = await call<undefined, WireKillSwitch>(functions, "getKillSwitch")();
      return unwireKillSwitch(w) as any;
    },
    setKillSwitch: async (enabled) => {
      const w = await call<{ enabled: boolean }, WireKillSwitch>(functions, "setKillSwitch")({ enabled });
      return unwireKillSwitch(w) as any;
    },

    // ── Users ─────────────────────────────────────────────────────────
    createUser: async (appId, name, email, role) => {
      const w = await call<
        { appId: string; name: string; email: string; role: string },
        WireUser
      >(functions, "createUser")({
        appId,
        name,
        email,
        role: wireVariant(role as unknown as Record<string, null>),
      });
      return unwireUser(w) as any;
    },
    syncAppUsers: async (appCode, incoming) =>
      call<
        { appCode: string; incoming: [string, string, string][] },
        boolean
      >(functions, "syncAppUsers")({ appCode, incoming }),
    getUserStatusForApp: async (appCode, externalId) => {
      const w = await call<
        { appCode: string; externalId: string },
        string | null
      >(functions, "getUserStatusForApp")({ appCode, externalId });
      return unwireOpt(w === null ? null : unwireVariant(w)) as any;
    },
    updateUserRole: async (id, role) =>
      call<{ id: number; role: string }, void>(functions, "updateUserRole")({
        id: wireId(id),
        role: wireVariant(role as unknown as Record<string, null>),
      }),
    acceptUser: async (id) => call<{ id: number }, void>(functions, "acceptUser")({ id: wireId(id) }),
    rejectUser: async (id) => call<{ id: number }, void>(functions, "rejectUser")({ id: wireId(id) }),
    holdUser: async (id) => call<{ id: number }, void>(functions, "holdUser")({ id: wireId(id) }),
    removeUser: async (id) => call<{ id: number }, void>(functions, "removeUser")({ id: wireId(id) }),
    listUsers: async () => {
      const list = await call<undefined, WireUser[]>(functions, "listUsers")();
      return list.map(unwireUser) as any;
    },
    listUsersByApp: async (appId) => {
      const list = await call<{ appId: string }, WireUser[]>(functions, "listUsersByApp")({ appId });
      return list.map(unwireUser) as any;
    },
    listPendingUsers: async () => {
      const list = await call<undefined, WireUser[]>(functions, "listPendingUsers")();
      return list.map(unwireUser) as any;
    },
    logUserActivity: async (userId, appId, eventType, description) =>
      call<
        { userId: number; appId: string; eventType: string; description: string },
        void
      >(functions, "logUserActivity")({
        userId: wireId(userId),
        appId,
        eventType: wireVariant(eventType as unknown as Record<string, null>),
        description,
      }),
    listUserActivities: async (appId) => {
      const list = await call<{ appId: string }, WireUserActivity[]>(functions, "listUserActivities")({ appId });
      return list.map(unwireUserActivity) as any;
    },

    // ── Monitoring ────────────────────────────────────────────────────
    submitMetrics: async (appId, cpu, memory, disk, apiLatency, networkUptime, connectionStatus) => {
      const w = await call<
        {
          appId: string;
          cpu: number;
          memory: number;
          disk: number;
          apiLatency: number;
          networkUptime: number;
          connectionStatus: string;
        },
        WireMetrics
      >(functions, "submitMetrics")({
        appId,
        cpu: wireId(cpu),
        memory: wireId(memory),
        disk: wireId(disk),
        apiLatency: wireId(apiLatency),
        networkUptime: wireId(networkUptime),
        connectionStatus,
      });
      return unwireMetrics(w) as any;
    },
    getLatestMetrics: async (appId) => {
      const w = await call<{ appId: string }, WireMetrics | null>(functions, "getLatestMetrics")({ appId });
      return unwireOpt(w === null ? null : unwireMetrics(w)) as any;
    },
    getMetricsHistory: async (appId) => {
      const list = await call<{ appId: string }, WireMetrics[]>(functions, "getMetricsHistory")({ appId });
      return list.map(unwireMetrics) as any;
    },
    createAlert: async (appId, metricType, severity, value, threshold) => {
      const w = await call<
        { appId: string; metricType: string; severity: string; value: number; threshold: number },
        WireAlert
      >(functions, "createAlert")({
        appId,
        metricType,
        severity: wireVariant(severity as unknown as Record<string, null>),
        value: wireId(value),
        threshold: wireId(threshold),
      });
      return unwireAlert(w) as any;
    },
    resolveAlert: async (id) => call<{ id: number }, void>(functions, "resolveAlert")({ id: wireId(id) }),
    listActiveAlerts: async () => {
      const list = await call<undefined, WireAlert[]>(functions, "listActiveAlerts")();
      return list.map(unwireAlert) as any;
    },
    listAlertHistory: async (appId) => {
      const list = await call<{ appId: string }, WireAlert[]>(functions, "listAlertHistory")({ appId });
      return list.map(unwireAlert) as any;
    },

    // ── Notifications ─────────────────────────────────────────────────
    createNotification: async (title, body, severity, notifType, appId) => {
      const w = await call<
        { title: string; body: string; severity: string; notifType: string; appId: string | null },
        WireNotification
      >(functions, "createNotification")({
        title,
        body,
        severity: wireVariant(severity as unknown as Record<string, null>),
        notifType: wireVariant(notifType as unknown as Record<string, null>),
        appId: wireOpt(appId),
      });
      return unwireNotification(w) as any;
    },
    markNotificationRead: async (id) =>
      call<{ id: number }, void>(functions, "markNotificationRead")({ id: wireId(id) }),
    markAllNotificationsRead: async () =>
      call<undefined, void>(functions, "markAllNotificationsRead")(),
    dismissNotification: async (id) =>
      call<{ id: number }, void>(functions, "dismissNotification")({ id: wireId(id) }),
    snoozeNotification: async (id, until) =>
      call<{ id: number; until: number }, void>(functions, "snoozeNotification")({
        id: wireId(id),
        until: wireTs(until),
      }),
    listNotifications: async (notifType, appId, isRead) => {
      const list = await call<
        { notifType: string | null; appId: string | null; isRead: boolean | null },
        WireNotification[]
      >(functions, "listNotifications")({
        notifType: wireOptVariant(notifType),
        appId: wireOpt(appId),
        isRead: wireOpt(isRead),
      });
      return list.map(unwireNotification) as any;
    },

    // ── Issues ────────────────────────────────────────────────────────
    createIssue: async (title, description, severity, appId, assignedTo) => {
      const w = await call<
        { title: string; description: string; severity: string; appId: string; assignedTo: number | null },
        WireIssue
      >(functions, "createIssue")({
        title,
        description,
        severity: wireVariant(severity as unknown as Record<string, null>),
        appId,
        assignedTo: wireOptId(assignedTo),
      });
      return unwireIssue(w) as any;
    },
    updateIssue: async (id, title, description, severity, status, assignedTo) =>
      call<
        {
          id: number;
          title: string;
          description: string;
          severity: string;
          status: string;
          assignedTo: number | null;
        },
        void
      >(functions, "updateIssue")({
        id: wireId(id),
        title,
        description,
        severity: wireVariant(severity as unknown as Record<string, null>),
        status: wireVariant(status as unknown as Record<string, null>),
        assignedTo: wireOptId(assignedTo),
      }),
    resolveIssue: async (id) => call<{ id: number }, void>(functions, "resolveIssue")({ id: wireId(id) }),
    addIssueComment: async (issueId, content, authorId) => {
      const w = await call<
        { issueId: number; content: string; authorId: number },
        WireIssueComment
      >(functions, "addIssueComment")({
        issueId: wireId(issueId),
        content,
        authorId: wireId(authorId),
      });
      return unwireIssueComment(w) as any;
    },
    listIssues: async (appId, status, severity) => {
      const list = await call<
        { appId: string | null; status: string | null; severity: string | null },
        WireIssue[]
      >(functions, "listIssues")({
        appId: wireOpt(appId),
        status: wireOptVariant(status),
        severity: wireOptVariant(severity),
      });
      return list.map(unwireIssue) as any;
    },
    listIssueComments: async (issueId) => {
      const list = await call<{ issueId: number }, WireIssueComment[]>(functions, "listIssueComments")({
        issueId: wireId(issueId),
      });
      return list.map(unwireIssueComment) as any;
    },

    // ── Updates ───────────────────────────────────────────────────────
    createUpdate: async (appId, version, releaseNotes, size) => {
      const w = await call<
        { appId: string; version: string; releaseNotes: string; size: number },
        WireUpdate
      >(functions, "createUpdate")({ appId, version, releaseNotes, size: wireId(size) });
      return unwireUpdate(w) as any;
    },
    scheduleUpdate: async (id, scheduledAt) =>
      call<{ id: number; scheduledAt: number }, void>(functions, "scheduleUpdate")({
        id: wireId(id),
        scheduledAt: wireTs(scheduledAt),
      }),
    markUpdateDeployed: async (id) =>
      call<{ id: number }, void>(functions, "markUpdateDeployed")({ id: wireId(id) }),
    listAppUpdates: async (appId) => {
      const list = await call<{ appId: string }, WireUpdate[]>(functions, "listAppUpdates")({ appId });
      return list.map(unwireUpdate) as any;
    },
    listAllUpdates: async () => {
      const list = await call<undefined, WireUpdate[]>(functions, "listAllUpdates")();
      return list.map(unwireUpdate) as any;
    },

    // ── Email ─────────────────────────────────────────────────────────
    createEmailConfig: async (appId, senderName, senderEmail, bounceEmail) => {
      const w = await call<
        { appId: string; senderName: string; senderEmail: string; bounceEmail: string },
        WireEmailConfig
      >(functions, "createEmailConfig")({ appId, senderName, senderEmail, bounceEmail });
      return unwireEmailConfig(w) as any;
    },
    updateEmailConfig: async (id, senderName, senderEmail, bounceEmail, isActive) =>
      call<
        {
          id: number;
          senderName: string;
          senderEmail: string;
          bounceEmail: string;
          isActive: boolean;
        },
        void
      >(functions, "updateEmailConfig")({
        id: wireId(id),
        senderName,
        senderEmail,
        bounceEmail,
        isActive,
      }),
    deleteEmailConfig: async (id) =>
      call<{ id: number }, void>(functions, "deleteEmailConfig")({ id: wireId(id) }),
    listEmailConfigs: async (appId) => {
      const list = await call<{ appId: string }, WireEmailConfig[]>(functions, "listEmailConfigs")({ appId });
      return list.map(unwireEmailConfig) as any;
    },
    createEmailTemplate: async (appId, name, subject, body) => {
      const w = await call<
        { appId: string; name: string; subject: string; body: string },
        WireEmailTemplate
      >(functions, "createEmailTemplate")({ appId, name, subject, body });
      return unwireEmailTemplate(w) as any;
    },
    updateEmailTemplate: async (id, subject, body) =>
      call<{ id: number; subject: string; body: string }, void>(functions, "updateEmailTemplate")({
        id: wireId(id),
        subject,
        body,
      }),
    deleteEmailTemplate: async (id) =>
      call<{ id: number }, void>(functions, "deleteEmailTemplate")({ id: wireId(id) }),
    listEmailTemplates: async (appId) => {
      const list = await call<{ appId: string }, WireEmailTemplate[]>(functions, "listEmailTemplates")({
        appId,
      });
      return list.map(unwireEmailTemplate) as any;
    },
    listEmailLogs: async (appId) => {
      const list = await call<{ appId: string }, WireEmailLog[]>(functions, "listEmailLogs")({ appId });
      return list.map(unwireEmailLog) as any;
    },
    setZohoConfig: async (accountId, accessToken, fromAddress) =>
      call<{ accountId: string; accessToken: string; fromAddress: string }, void>(
        functions,
        "setZohoConfig",
      )({ accountId, accessToken, fromAddress }),
    getZohoStatus: async () => call<undefined, WireZohoStatus>(functions, "getZohoStatus")(),
    sendEmailNow: async (appId, recipient, subject, body) => {
      const w = await call<
        { appId: string; recipient: string; subject: string; body: string },
        WireEmailLog
      >(functions, "sendEmailNow")({ appId, recipient, subject, body });
      return unwireEmailLog(w) as any;
    },
    sendEmailBatch: async (appId, recipients, subject, body) => {
      const list = await call<
        { appId: string; recipients: string[]; subject: string; body: string },
        WireEmailLog[]
      >(functions, "sendEmailBatch")({ appId, recipients, subject, body });
      return list.map(unwireEmailLog) as any;
    },
  } as _SERVICE;
}
