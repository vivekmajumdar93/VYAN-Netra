/* eslint-disable */

// @ts-nocheck

// The stable data-access contract between the frontend and whatever backend
// is behind it. Originally generated (by hand) from the ICP/Motoko
// canister's candid interface; now implemented by Firebase Cloud Functions
// instead (see src/backend.ts + functions/src/domains/*.ts) — the shapes
// below are kept byte-for-byte identical on purpose, so this migration
// never had to touch hooks/use-backend.ts or any page/component. Swapping
// the backend again in the future only requires a new implementation of
// `_SERVICE`, same as this one did.

// Candid actors originally typed every method as `(...args) => Promise<Ret>`
// via @icp-sdk/core's ActorMethod; redefined locally now that there's no
// candid/ICP dependency left in the frontend.
export type ActorMethod<
  Args extends unknown[] = unknown[],
  Ret = unknown,
> = (...args: Args) => Promise<Ret>;

export type ActivityEventType = { 'action' : null } |
  { 'login' : null } |
  { 'permissionChange' : null };
export type AppId = string;
export type AppStatus = { 'pending' : null } |
  { 'connected' : null } |
  { 'disconnected' : null };
export interface AppView {
  'id' : AppId,
  'name' : string,
  'baseUrl' : [] | [string],
  'appCode' : string,
  'status' : AppStatus,
  'lastHeartbeat' : [] | [Timestamp],
  'addedAt' : Timestamp,
}
export interface AlertView {
  'id' : Id,
  'resolved' : boolean,
  'value' : bigint,
  'threshold' : bigint,
  'appId' : string,
  'timestamp' : Timestamp,
  'severity' : MetricSeverity,
  'metricType' : string,
  'resolvedAt' : [] | [Timestamp],
}
export type EmailConfigId = bigint;
export interface EmailConfigView {
  'id' : EmailConfigId,
  'bounceEmail' : string,
  'createdAt' : Timestamp,
  'appId' : string,
  'isActive' : boolean,
  'senderName' : string,
  'senderEmail' : string,
}
export interface EmailLog {
  'id' : Id,
  'status' : EmailStatus,
  'subject' : string,
  'recipient' : string,
  'appId' : string,
  'detail' : string,
  'timestamp' : Timestamp,
}
export type EmailStatus = { 'sent' : null } |
  { 'failed' : null } |
  { 'bounced' : null };
export interface EmailTemplateView {
  'id' : Id,
  'subject' : string,
  'body' : string,
  'name' : string,
  'appId' : string,
  'lastModified' : Timestamp,
}
export interface ZohoStatusView {
  'configured' : boolean,
  'accountId' : string,
  'fromAddress' : string,
}
export interface KillSwitchView {
  'enabled' : boolean,
  'updatedAt' : Timestamp,
}
export type Id = bigint;
export interface IssueComment {
  'id' : Id,
  'content' : string,
  'authorId' : bigint,
  'issueId' : IssueId,
  'timestamp' : Timestamp,
}
export type IssueId = bigint;
export type IssueSeverity = { 'low' : null } |
  { 'high' : null } |
  { 'critical' : null } |
  { 'medium' : null };
export type IssueStatus = { 'resolved' : null } |
  { 'in_progress' : null } |
  { 'open' : null };
export interface IssueView {
  'id' : IssueId,
  'status' : IssueStatus,
  'title' : string,
  'assignedTo' : [] | [bigint],
  'createdAt' : Timestamp,
  'description' : string,
  'appId' : string,
  'updatedAt' : Timestamp,
  'severity' : IssueSeverity,
}
export type MetricSeverity = { 'warning' : null } |
  { 'info' : null } |
  { 'critical' : null };
export type NotificationSeverity = { 'warning' : null } |
  { 'info' : null } |
  { 'critical' : null };
export type NotificationType = { 'systemAlert' : null } |
  { 'user' : null } |
  { 'update' : null } |
  { 'issue' : null };
export interface NotificationView {
  'id' : Id,
  'title' : string,
  'notifType' : NotificationType,
  'body' : string,
  'createdAt' : Timestamp,
  'appId' : [] | [string],
  'isRead' : boolean,
  'snoozedUntil' : [] | [Timestamp],
  'severity' : NotificationSeverity,
  'snoozed' : boolean,
}
export interface SystemMetrics {
  'id' : Id,
  'cpu' : bigint,
  'memory' : bigint,
  'disk' : bigint,
  'appId' : string,
  'connectionStatus' : string,
  'timestamp' : Timestamp,
  'networkUptime' : bigint,
  'apiLatency' : bigint,
}
export type Time = bigint;
export type Timestamp = bigint;
export type UpdateId = bigint;
export type UpdateStatus = { 'deployed' : null } |
  { 'scheduled' : null } |
  { 'pending' : null } |
  { 'failed' : null };
export interface UpdateView {
  'id' : UpdateId,
  'status' : UpdateStatus,
  'deployedAt' : [] | [Timestamp],
  'createdAt' : Timestamp,
  'size' : bigint,
  'appId' : string,
  'releaseNotes' : string,
  'version' : string,
  'scheduledAt' : [] | [Timestamp],
}
export interface UserActivity {
  'id' : Id,
  'userId' : UserId,
  'description' : string,
  'appId' : string,
  'timestamp' : Timestamp,
  'eventType' : ActivityEventType,
}
export type UserId = bigint;
export type UserRole = { 'manager' : null } |
  { 'admin' : null } |
  { 'viewer' : null };
export type UserStatus = { 'pending' : null } |
  { 'active' : null } |
  { 'held' : null } |
  { 'rejected' : null };
export interface UserView {
  'id' : UserId,
  'appId' : string,
  'externalId' : string,
  'status' : UserStatus,
  'lastActivity' : Timestamp,
  'name' : string,
  'createdAt' : Timestamp,
  'role' : UserRole,
  'email' : string,
}
export interface _SERVICE {
  'acceptUser' : ActorMethod<[bigint], undefined>,
  'addIssueComment' : ActorMethod<[bigint, string, bigint], IssueComment>,
  'createAlert' : ActorMethod<
    [string, string, MetricSeverity, bigint, bigint],
    AlertView
  >,
  'createApp' : ActorMethod<[string], AppView>,
  'createEmailConfig' : ActorMethod<
    [string, string, string, string],
    EmailConfigView
  >,
  'createEmailTemplate' : ActorMethod<
    [string, string, string, string],
    EmailTemplateView
  >,
  'createIssue' : ActorMethod<
    [string, string, IssueSeverity, string, [] | [bigint]],
    IssueView
  >,
  'createNotification' : ActorMethod<
    [string, string, NotificationSeverity, NotificationType, [] | [string]],
    NotificationView
  >,
  'createUpdate' : ActorMethod<[string, string, string, bigint], UpdateView>,
  'createUser' : ActorMethod<[string, string, string, UserRole], UserView>,
  'deleteEmailConfig' : ActorMethod<[bigint], undefined>,
  'deleteEmailTemplate' : ActorMethod<[bigint], undefined>,
  'dismissNotification' : ActorMethod<[bigint], undefined>,
  'getApp' : ActorMethod<[string], [] | [AppView]>,
  'getKillSwitch' : ActorMethod<[], KillSwitchView>,
  'getLatestMetrics' : ActorMethod<[string], [] | [SystemMetrics]>,
  'getMetricsHistory' : ActorMethod<[string], Array<SystemMetrics>>,
  'getUserStatusForApp' : ActorMethod<[string, string], [] | [UserStatus]>,
  'getZohoStatus' : ActorMethod<[], ZohoStatusView>,
  'holdUser' : ActorMethod<[bigint], undefined>,
  'listActiveAlerts' : ActorMethod<[], Array<AlertView>>,
  'listAlertHistory' : ActorMethod<[string], Array<AlertView>>,
  'listAllUpdates' : ActorMethod<[], Array<UpdateView>>,
  'listAppUpdates' : ActorMethod<[string], Array<UpdateView>>,
  'listApps' : ActorMethod<[], Array<AppView>>,
  'listEmailConfigs' : ActorMethod<[string], Array<EmailConfigView>>,
  'listEmailLogs' : ActorMethod<[string], Array<EmailLog>>,
  'listEmailTemplates' : ActorMethod<[string], Array<EmailTemplateView>>,
  'listIssueComments' : ActorMethod<[bigint], Array<IssueComment>>,
  'listIssues' : ActorMethod<
    [[] | [string], [] | [IssueStatus], [] | [IssueSeverity]],
    Array<IssueView>
  >,
  'listNotifications' : ActorMethod<
    [[] | [NotificationType], [] | [string], [] | [boolean]],
    Array<NotificationView>
  >,
  'listPendingUsers' : ActorMethod<[], Array<UserView>>,
  'listUserActivities' : ActorMethod<[string], Array<UserActivity>>,
  'listUsers' : ActorMethod<[], Array<UserView>>,
  'listUsersByApp' : ActorMethod<[string], Array<UserView>>,
  'logUserActivity' : ActorMethod<
    [bigint, string, ActivityEventType, string],
    undefined
  >,
  'markAllNotificationsRead' : ActorMethod<[], undefined>,
  'markNotificationRead' : ActorMethod<[bigint], undefined>,
  'markUpdateDeployed' : ActorMethod<[bigint], undefined>,
  'recordHeartbeat' : ActorMethod<[string], boolean>,
  'regenerateAppCode' : ActorMethod<[string], AppView>,
  'rejectUser' : ActorMethod<[bigint], undefined>,
  'removeApp' : ActorMethod<[string], boolean>,
  'removeUser' : ActorMethod<[bigint], undefined>,
  'renameApp' : ActorMethod<[string, string], AppView>,
  'resolveAlert' : ActorMethod<[bigint], undefined>,
  'resolveIssue' : ActorMethod<[bigint], undefined>,
  'scheduleUpdate' : ActorMethod<[bigint, Time], undefined>,
  'sendEmailBatch' : ActorMethod<
    [string, Array<string>, string, string],
    Array<EmailLog>
  >,
  'sendEmailNow' : ActorMethod<[string, string, string, string], EmailLog>,
  'setAppBaseUrl' : ActorMethod<[string, string], AppView>,
  'setAppManualStatus' : ActorMethod<[string, AppStatus], AppView>,
  'setKillSwitch' : ActorMethod<[boolean], KillSwitchView>,
  'setZohoConfig' : ActorMethod<[string, string, string], undefined>,
  'snoozeNotification' : ActorMethod<[bigint, Time], undefined>,
  'submitMetrics' : ActorMethod<
    [string, bigint, bigint, bigint, bigint, bigint, string],
    SystemMetrics
  >,
  'syncAppUsers' : ActorMethod<
    [string, Array<[string, string, string]>],
    boolean
  >,
  'updateEmailConfig' : ActorMethod<
    [bigint, string, string, string, boolean],
    undefined
  >,
  'updateEmailTemplate' : ActorMethod<[bigint, string, string], undefined>,
  'updateIssue' : ActorMethod<
    [bigint, string, string, IssueSeverity, IssueStatus, [] | [bigint]],
    undefined
  >,
  'updateUserRole' : ActorMethod<[bigint, UserRole], undefined>,
}
