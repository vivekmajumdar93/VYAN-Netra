// VYAN Netra backend — Firebase Cloud Functions.
//
// This replaces the former ICP/Motoko canister one-for-one: every exported
// function here has the same name, same parameters, and same behavior as
// the actor method it replaces (see the git history of src/backend/ for
// the Motoko originals). The frontend's data-access layer
// (src/frontend/src/backend.ts) calls these by name via
// httpsCallable — the rest of the app never changed.

export {
  createApp,
  setAppBaseUrl,
  renameApp,
  recordHeartbeat,
  setAppManualStatus,
  regenerateAppCode,
  removeApp,
  listApps,
  getApp,
} from "./domains/apps.js";

export { getKillSwitch, setKillSwitch } from "./domains/settings.js";

export { requestAdminToken } from "./domains/auth.js";

export {
  createUser,
  syncAppUsers,
  getUserStatusForApp,
  updateUserRole,
  acceptUser,
  rejectUser,
  holdUser,
  removeUser,
  listUsers,
  listUsersByApp,
  listPendingUsers,
  logUserActivity,
  listUserActivities,
} from "./domains/users.js";

export {
  submitMetrics,
  getLatestMetrics,
  getMetricsHistory,
  createAlert,
  resolveAlert,
  listActiveAlerts,
  listAlertHistory,
} from "./domains/monitoring.js";

export {
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  snoozeNotification,
  listNotifications,
} from "./domains/notifications.js";

export {
  createIssue,
  updateIssue,
  resolveIssue,
  addIssueComment,
  listIssues,
  listIssueComments,
} from "./domains/issues.js";

export {
  createUpdate,
  scheduleUpdate,
  markUpdateDeployed,
  listAppUpdates,
  listAllUpdates,
} from "./domains/updates.js";

export {
  createEmailConfig,
  updateEmailConfig,
  deleteEmailConfig,
  listEmailConfigs,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  listEmailTemplates,
  listEmailLogs,
  setZohoConfig,
  getZohoStatus,
  sendEmailNow,
  sendEmailBatch,
} from "./domains/email.js";
