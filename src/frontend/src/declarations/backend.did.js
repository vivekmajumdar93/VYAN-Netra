/* eslint-disable */

// @ts-nocheck

// Hand-written to match the current Motoko backend interface — see
// backend.did.d.ts for why this isn't tool-generated in this session.
// Regenerate for real via `pnpm bindgen` once you can build the backend.

import { IDL } from '@icp-sdk/core/candid';

export const Id = IDL.Nat;
export const Timestamp = IDL.Int;
export const Time = IDL.Int;
export const AppId = IDL.Text;
export const AppStatus = IDL.Variant({
  'pending' : IDL.Null,
  'connected' : IDL.Null,
  'disconnected' : IDL.Null,
});
export const AppView = IDL.Record({
  'id' : AppId,
  'name' : IDL.Text,
  'baseUrl' : IDL.Opt(IDL.Text),
  'appCode' : IDL.Text,
  'status' : AppStatus,
  'lastHeartbeat' : IDL.Opt(Timestamp),
  'addedAt' : Timestamp,
});
export const MetricSeverity = IDL.Variant({
  'warning' : IDL.Null,
  'info' : IDL.Null,
  'critical' : IDL.Null,
});
export const AlertView = IDL.Record({
  'id' : Id,
  'resolved' : IDL.Bool,
  'value' : IDL.Nat,
  'threshold' : IDL.Nat,
  'appId' : IDL.Text,
  'timestamp' : Timestamp,
  'severity' : MetricSeverity,
  'metricType' : IDL.Text,
  'resolvedAt' : IDL.Opt(Timestamp),
});
export const EmailStatus = IDL.Variant({
  'sent' : IDL.Null,
  'failed' : IDL.Null,
  'bounced' : IDL.Null,
});
export const EmailLog = IDL.Record({
  'id' : Id,
  'status' : EmailStatus,
  'subject' : IDL.Text,
  'recipient' : IDL.Text,
  'appId' : IDL.Text,
  'detail' : IDL.Text,
  'timestamp' : Timestamp,
});
export const EmailConfigId = IDL.Nat;
export const EmailConfigView = IDL.Record({
  'id' : EmailConfigId,
  'bounceEmail' : IDL.Text,
  'createdAt' : Timestamp,
  'appId' : IDL.Text,
  'isActive' : IDL.Bool,
  'senderName' : IDL.Text,
  'senderEmail' : IDL.Text,
});
export const EmailTemplateView = IDL.Record({
  'id' : Id,
  'subject' : IDL.Text,
  'body' : IDL.Text,
  'name' : IDL.Text,
  'appId' : IDL.Text,
  'lastModified' : Timestamp,
});
export const ZohoStatusView = IDL.Record({
  'configured' : IDL.Bool,
  'accountId' : IDL.Text,
  'fromAddress' : IDL.Text,
});
export const KillSwitchView = IDL.Record({
  'enabled' : IDL.Bool,
  'updatedAt' : Timestamp,
});
export const IssueId = IDL.Nat;
export const IssueComment = IDL.Record({
  'id' : Id,
  'content' : IDL.Text,
  'authorId' : IDL.Nat,
  'issueId' : IssueId,
  'timestamp' : Timestamp,
});
export const IssueSeverity = IDL.Variant({
  'low' : IDL.Null,
  'high' : IDL.Null,
  'critical' : IDL.Null,
  'medium' : IDL.Null,
});
export const IssueStatus = IDL.Variant({
  'resolved' : IDL.Null,
  'in_progress' : IDL.Null,
  'open' : IDL.Null,
});
export const IssueView = IDL.Record({
  'id' : IssueId,
  'status' : IssueStatus,
  'title' : IDL.Text,
  'assignedTo' : IDL.Opt(IDL.Nat),
  'createdAt' : Timestamp,
  'description' : IDL.Text,
  'appId' : IDL.Text,
  'updatedAt' : Timestamp,
  'severity' : IssueSeverity,
});
export const NotificationSeverity = IDL.Variant({
  'warning' : IDL.Null,
  'info' : IDL.Null,
  'critical' : IDL.Null,
});
export const NotificationType = IDL.Variant({
  'systemAlert' : IDL.Null,
  'user' : IDL.Null,
  'update' : IDL.Null,
  'issue' : IDL.Null,
});
export const NotificationView = IDL.Record({
  'id' : Id,
  'title' : IDL.Text,
  'notifType' : NotificationType,
  'body' : IDL.Text,
  'createdAt' : Timestamp,
  'appId' : IDL.Opt(IDL.Text),
  'isRead' : IDL.Bool,
  'snoozedUntil' : IDL.Opt(Timestamp),
  'severity' : NotificationSeverity,
  'snoozed' : IDL.Bool,
});
export const UpdateId = IDL.Nat;
export const UpdateStatus = IDL.Variant({
  'deployed' : IDL.Null,
  'scheduled' : IDL.Null,
  'pending' : IDL.Null,
  'failed' : IDL.Null,
});
export const UpdateView = IDL.Record({
  'id' : UpdateId,
  'status' : UpdateStatus,
  'deployedAt' : IDL.Opt(Timestamp),
  'createdAt' : Timestamp,
  'size' : IDL.Nat,
  'appId' : IDL.Text,
  'releaseNotes' : IDL.Text,
  'version' : IDL.Text,
  'scheduledAt' : IDL.Opt(Timestamp),
});
export const UserRole = IDL.Variant({
  'manager' : IDL.Null,
  'admin' : IDL.Null,
  'viewer' : IDL.Null,
});
export const UserId = IDL.Nat;
export const UserStatus = IDL.Variant({
  'pending' : IDL.Null,
  'active' : IDL.Null,
  'held' : IDL.Null,
  'rejected' : IDL.Null,
});
export const UserView = IDL.Record({
  'id' : UserId,
  'appId' : IDL.Text,
  'externalId' : IDL.Text,
  'status' : UserStatus,
  'lastActivity' : Timestamp,
  'name' : IDL.Text,
  'createdAt' : Timestamp,
  'role' : UserRole,
  'email' : IDL.Text,
});
export const SystemMetrics = IDL.Record({
  'id' : Id,
  'cpu' : IDL.Nat,
  'memory' : IDL.Nat,
  'disk' : IDL.Nat,
  'appId' : IDL.Text,
  'connectionStatus' : IDL.Text,
  'timestamp' : Timestamp,
  'networkUptime' : IDL.Nat,
  'apiLatency' : IDL.Nat,
});
export const ActivityEventType = IDL.Variant({
  'action' : IDL.Null,
  'login' : IDL.Null,
  'permissionChange' : IDL.Null,
});
export const UserActivity = IDL.Record({
  'id' : Id,
  'userId' : UserId,
  'description' : IDL.Text,
  'appId' : IDL.Text,
  'timestamp' : Timestamp,
  'eventType' : ActivityEventType,
});

export const idlService = IDL.Service({
  'acceptUser' : IDL.Func([IDL.Nat], [], []),
  'addIssueComment' : IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Nat],
      [IssueComment],
      [],
    ),
  'createAlert' : IDL.Func(
      [IDL.Text, IDL.Text, MetricSeverity, IDL.Nat, IDL.Nat],
      [AlertView],
      [],
    ),
  'createApp' : IDL.Func([IDL.Text], [AppView], []),
  'createEmailConfig' : IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [EmailConfigView],
      [],
    ),
  'createEmailTemplate' : IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [EmailTemplateView],
      [],
    ),
  'createIssue' : IDL.Func(
      [IDL.Text, IDL.Text, IssueSeverity, IDL.Text, IDL.Opt(IDL.Nat)],
      [IssueView],
      [],
    ),
  'createNotification' : IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        NotificationSeverity,
        NotificationType,
        IDL.Opt(IDL.Text),
      ],
      [NotificationView],
      [],
    ),
  'createUpdate' : IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
      [UpdateView],
      [],
    ),
  'createUser' : IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, UserRole],
      [UserView],
      [],
    ),
  'deleteEmailConfig' : IDL.Func([IDL.Nat], [], []),
  'deleteEmailTemplate' : IDL.Func([IDL.Nat], [], []),
  'dismissNotification' : IDL.Func([IDL.Nat], [], []),
  'getApp' : IDL.Func([IDL.Text], [IDL.Opt(AppView)], ['query']),
  'getKillSwitch' : IDL.Func([], [KillSwitchView], ['query']),
  'getLatestMetrics' : IDL.Func(
      [IDL.Text],
      [IDL.Opt(SystemMetrics)],
      ['query'],
    ),
  'getMetricsHistory' : IDL.Func(
      [IDL.Text],
      [IDL.Vec(SystemMetrics)],
      ['query'],
    ),
  'getUserStatusForApp' : IDL.Func(
      [IDL.Text, IDL.Text],
      [IDL.Opt(UserStatus)],
      ['query'],
    ),
  'getZohoStatus' : IDL.Func([], [ZohoStatusView], ['query']),
  'holdUser' : IDL.Func([IDL.Nat], [], []),
  'listActiveAlerts' : IDL.Func([], [IDL.Vec(AlertView)], ['query']),
  'listAlertHistory' : IDL.Func([IDL.Text], [IDL.Vec(AlertView)], ['query']),
  'listAllUpdates' : IDL.Func([], [IDL.Vec(UpdateView)], ['query']),
  'listAppUpdates' : IDL.Func([IDL.Text], [IDL.Vec(UpdateView)], ['query']),
  'listApps' : IDL.Func([], [IDL.Vec(AppView)], ['query']),
  'listEmailConfigs' : IDL.Func(
      [IDL.Text],
      [IDL.Vec(EmailConfigView)],
      ['query'],
    ),
  'listEmailLogs' : IDL.Func([IDL.Text], [IDL.Vec(EmailLog)], ['query']),
  'listEmailTemplates' : IDL.Func(
      [IDL.Text],
      [IDL.Vec(EmailTemplateView)],
      ['query'],
    ),
  'listIssueComments' : IDL.Func(
      [IDL.Nat],
      [IDL.Vec(IssueComment)],
      ['query'],
    ),
  'listIssues' : IDL.Func(
      [IDL.Opt(IDL.Text), IDL.Opt(IssueStatus), IDL.Opt(IssueSeverity)],
      [IDL.Vec(IssueView)],
      ['query'],
    ),
  'listNotifications' : IDL.Func(
      [IDL.Opt(NotificationType), IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
      [IDL.Vec(NotificationView)],
      ['query'],
    ),
  'listPendingUsers' : IDL.Func([], [IDL.Vec(UserView)], ['query']),
  'listUserActivities' : IDL.Func(
      [IDL.Text],
      [IDL.Vec(UserActivity)],
      ['query'],
    ),
  'listUsers' : IDL.Func([], [IDL.Vec(UserView)], ['query']),
  'listUsersByApp' : IDL.Func([IDL.Text], [IDL.Vec(UserView)], ['query']),
  'logUserActivity' : IDL.Func(
      [IDL.Nat, IDL.Text, ActivityEventType, IDL.Text],
      [],
      [],
    ),
  'markAllNotificationsRead' : IDL.Func([], [], []),
  'markNotificationRead' : IDL.Func([IDL.Nat], [], []),
  'markUpdateDeployed' : IDL.Func([IDL.Nat], [], []),
  'recordHeartbeat' : IDL.Func([IDL.Text], [IDL.Bool], []),
  'regenerateAppCode' : IDL.Func([IDL.Text], [AppView], []),
  'rejectUser' : IDL.Func([IDL.Nat], [], []),
  'removeApp' : IDL.Func([IDL.Text], [IDL.Bool], []),
  'removeUser' : IDL.Func([IDL.Nat], [], []),
  'renameApp' : IDL.Func([IDL.Text, IDL.Text], [AppView], []),
  'resolveAlert' : IDL.Func([IDL.Nat], [], []),
  'resolveIssue' : IDL.Func([IDL.Nat], [], []),
  'scheduleUpdate' : IDL.Func([IDL.Nat, Time], [], []),
  'sendEmailBatch' : IDL.Func(
      [IDL.Text, IDL.Vec(IDL.Text), IDL.Text, IDL.Text],
      [IDL.Vec(EmailLog)],
      [],
    ),
  'sendEmailNow' : IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [EmailLog],
      [],
    ),
  'setAppBaseUrl' : IDL.Func([IDL.Text, IDL.Text], [AppView], []),
  'setAppManualStatus' : IDL.Func([IDL.Text, AppStatus], [AppView], []),
  'setKillSwitch' : IDL.Func([IDL.Bool], [KillSwitchView], []),
  'setZohoConfig' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
  'snoozeNotification' : IDL.Func([IDL.Nat, Time], [], []),
  'submitMetrics' : IDL.Func(
      [IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Text],
      [SystemMetrics],
      [],
    ),
  'syncAppUsers' : IDL.Func(
      [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Text))],
      [IDL.Bool],
      [],
    ),
  'updateEmailConfig' : IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
      [],
      [],
    ),
  'updateEmailTemplate' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], []),
  'updateIssue' : IDL.Func(
      [
        IDL.Nat,
        IDL.Text,
        IDL.Text,
        IssueSeverity,
        IssueStatus,
        IDL.Opt(IDL.Nat),
      ],
      [],
      [],
    ),
  'updateUserRole' : IDL.Func([IDL.Nat, UserRole], [], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const Id = IDL.Nat;
  const Timestamp = IDL.Int;
  const Time = IDL.Int;
  const AppId = IDL.Text;
  const AppStatus = IDL.Variant({
    'pending' : IDL.Null,
    'connected' : IDL.Null,
    'disconnected' : IDL.Null,
  });
  const AppView = IDL.Record({
    'id' : AppId,
    'name' : IDL.Text,
    'baseUrl' : IDL.Opt(IDL.Text),
    'appCode' : IDL.Text,
    'status' : AppStatus,
    'lastHeartbeat' : IDL.Opt(Timestamp),
    'addedAt' : Timestamp,
  });
  const MetricSeverity = IDL.Variant({
    'warning' : IDL.Null,
    'info' : IDL.Null,
    'critical' : IDL.Null,
  });
  const AlertView = IDL.Record({
    'id' : Id,
    'resolved' : IDL.Bool,
    'value' : IDL.Nat,
    'threshold' : IDL.Nat,
    'appId' : IDL.Text,
    'timestamp' : Timestamp,
    'severity' : MetricSeverity,
    'metricType' : IDL.Text,
    'resolvedAt' : IDL.Opt(Timestamp),
  });
  const EmailStatus = IDL.Variant({
    'sent' : IDL.Null,
    'failed' : IDL.Null,
    'bounced' : IDL.Null,
  });
  const EmailLog = IDL.Record({
    'id' : Id,
    'status' : EmailStatus,
    'subject' : IDL.Text,
    'recipient' : IDL.Text,
    'appId' : IDL.Text,
    'detail' : IDL.Text,
    'timestamp' : Timestamp,
  });
  const EmailConfigId = IDL.Nat;
  const EmailConfigView = IDL.Record({
    'id' : EmailConfigId,
    'bounceEmail' : IDL.Text,
    'createdAt' : Timestamp,
    'appId' : IDL.Text,
    'isActive' : IDL.Bool,
    'senderName' : IDL.Text,
    'senderEmail' : IDL.Text,
  });
  const EmailTemplateView = IDL.Record({
    'id' : Id,
    'subject' : IDL.Text,
    'body' : IDL.Text,
    'name' : IDL.Text,
    'appId' : IDL.Text,
    'lastModified' : Timestamp,
  });
  const ZohoStatusView = IDL.Record({
    'configured' : IDL.Bool,
    'accountId' : IDL.Text,
    'fromAddress' : IDL.Text,
  });
  const KillSwitchView = IDL.Record({
    'enabled' : IDL.Bool,
    'updatedAt' : Timestamp,
  });
  const IssueId = IDL.Nat;
  const IssueComment = IDL.Record({
    'id' : Id,
    'content' : IDL.Text,
    'authorId' : IDL.Nat,
    'issueId' : IssueId,
    'timestamp' : Timestamp,
  });
  const IssueSeverity = IDL.Variant({
    'low' : IDL.Null,
    'high' : IDL.Null,
    'critical' : IDL.Null,
    'medium' : IDL.Null,
  });
  const IssueStatus = IDL.Variant({
    'resolved' : IDL.Null,
    'in_progress' : IDL.Null,
    'open' : IDL.Null,
  });
  const IssueView = IDL.Record({
    'id' : IssueId,
    'status' : IssueStatus,
    'title' : IDL.Text,
    'assignedTo' : IDL.Opt(IDL.Nat),
    'createdAt' : Timestamp,
    'description' : IDL.Text,
    'appId' : IDL.Text,
    'updatedAt' : Timestamp,
    'severity' : IssueSeverity,
  });
  const NotificationSeverity = IDL.Variant({
    'warning' : IDL.Null,
    'info' : IDL.Null,
    'critical' : IDL.Null,
  });
  const NotificationType = IDL.Variant({
    'systemAlert' : IDL.Null,
    'user' : IDL.Null,
    'update' : IDL.Null,
    'issue' : IDL.Null,
  });
  const NotificationView = IDL.Record({
    'id' : Id,
    'title' : IDL.Text,
    'notifType' : NotificationType,
    'body' : IDL.Text,
    'createdAt' : Timestamp,
    'appId' : IDL.Opt(IDL.Text),
    'isRead' : IDL.Bool,
    'snoozedUntil' : IDL.Opt(Timestamp),
    'severity' : NotificationSeverity,
    'snoozed' : IDL.Bool,
  });
  const UpdateId = IDL.Nat;
  const UpdateStatus = IDL.Variant({
    'deployed' : IDL.Null,
    'scheduled' : IDL.Null,
    'pending' : IDL.Null,
    'failed' : IDL.Null,
  });
  const UpdateView = IDL.Record({
    'id' : UpdateId,
    'status' : UpdateStatus,
    'deployedAt' : IDL.Opt(Timestamp),
    'createdAt' : Timestamp,
    'size' : IDL.Nat,
    'appId' : IDL.Text,
    'releaseNotes' : IDL.Text,
    'version' : IDL.Text,
    'scheduledAt' : IDL.Opt(Timestamp),
  });
  const UserRole = IDL.Variant({
    'manager' : IDL.Null,
    'admin' : IDL.Null,
    'viewer' : IDL.Null,
  });
  const UserId = IDL.Nat;
  const UserStatus = IDL.Variant({
    'pending' : IDL.Null,
    'active' : IDL.Null,
    'held' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const UserView = IDL.Record({
    'id' : UserId,
    'appId' : IDL.Text,
    'externalId' : IDL.Text,
    'status' : UserStatus,
    'lastActivity' : Timestamp,
    'name' : IDL.Text,
    'createdAt' : Timestamp,
    'role' : UserRole,
    'email' : IDL.Text,
  });
  const SystemMetrics = IDL.Record({
    'id' : Id,
    'cpu' : IDL.Nat,
    'memory' : IDL.Nat,
    'disk' : IDL.Nat,
    'appId' : IDL.Text,
    'connectionStatus' : IDL.Text,
    'timestamp' : Timestamp,
    'networkUptime' : IDL.Nat,
    'apiLatency' : IDL.Nat,
  });
  const ActivityEventType = IDL.Variant({
    'action' : IDL.Null,
    'login' : IDL.Null,
    'permissionChange' : IDL.Null,
  });
  const UserActivity = IDL.Record({
    'id' : Id,
    'userId' : UserId,
    'description' : IDL.Text,
    'appId' : IDL.Text,
    'timestamp' : Timestamp,
    'eventType' : ActivityEventType,
  });

  return IDL.Service({
    'acceptUser' : IDL.Func([IDL.Nat], [], []),
    'addIssueComment' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Nat],
        [IssueComment],
        [],
      ),
    'createAlert' : IDL.Func(
        [IDL.Text, IDL.Text, MetricSeverity, IDL.Nat, IDL.Nat],
        [AlertView],
        [],
      ),
    'createApp' : IDL.Func([IDL.Text], [AppView], []),
    'createEmailConfig' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [EmailConfigView],
        [],
      ),
    'createEmailTemplate' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [EmailTemplateView],
        [],
      ),
    'createIssue' : IDL.Func(
        [IDL.Text, IDL.Text, IssueSeverity, IDL.Text, IDL.Opt(IDL.Nat)],
        [IssueView],
        [],
      ),
    'createNotification' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          NotificationSeverity,
          NotificationType,
          IDL.Opt(IDL.Text),
        ],
        [NotificationView],
        [],
      ),
    'createUpdate' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat],
        [UpdateView],
        [],
      ),
    'createUser' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, UserRole],
        [UserView],
        [],
      ),
    'deleteEmailConfig' : IDL.Func([IDL.Nat], [], []),
    'deleteEmailTemplate' : IDL.Func([IDL.Nat], [], []),
    'dismissNotification' : IDL.Func([IDL.Nat], [], []),
    'getApp' : IDL.Func([IDL.Text], [IDL.Opt(AppView)], ['query']),
    'getKillSwitch' : IDL.Func([], [KillSwitchView], ['query']),
    'getLatestMetrics' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(SystemMetrics)],
        ['query'],
      ),
    'getMetricsHistory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(SystemMetrics)],
        ['query'],
      ),
    'getUserStatusForApp' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Opt(UserStatus)],
        ['query'],
      ),
    'getZohoStatus' : IDL.Func([], [ZohoStatusView], ['query']),
    'holdUser' : IDL.Func([IDL.Nat], [], []),
    'listActiveAlerts' : IDL.Func([], [IDL.Vec(AlertView)], ['query']),
    'listAlertHistory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(AlertView)],
        ['query'],
      ),
    'listAllUpdates' : IDL.Func([], [IDL.Vec(UpdateView)], ['query']),
    'listAppUpdates' : IDL.Func([IDL.Text], [IDL.Vec(UpdateView)], ['query']),
    'listApps' : IDL.Func([], [IDL.Vec(AppView)], ['query']),
    'listEmailConfigs' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(EmailConfigView)],
        ['query'],
      ),
    'listEmailLogs' : IDL.Func([IDL.Text], [IDL.Vec(EmailLog)], ['query']),
    'listEmailTemplates' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(EmailTemplateView)],
        ['query'],
      ),
    'listIssueComments' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IssueComment)],
        ['query'],
      ),
    'listIssues' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IssueStatus), IDL.Opt(IssueSeverity)],
        [IDL.Vec(IssueView)],
        ['query'],
      ),
    'listNotifications' : IDL.Func(
        [IDL.Opt(NotificationType), IDL.Opt(IDL.Text), IDL.Opt(IDL.Bool)],
        [IDL.Vec(NotificationView)],
        ['query'],
      ),
    'listPendingUsers' : IDL.Func([], [IDL.Vec(UserView)], ['query']),
    'listUserActivities' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(UserActivity)],
        ['query'],
      ),
    'listUsers' : IDL.Func([], [IDL.Vec(UserView)], ['query']),
    'listUsersByApp' : IDL.Func([IDL.Text], [IDL.Vec(UserView)], ['query']),
    'logUserActivity' : IDL.Func(
        [IDL.Nat, IDL.Text, ActivityEventType, IDL.Text],
        [],
        [],
      ),
    'markAllNotificationsRead' : IDL.Func([], [], []),
    'markNotificationRead' : IDL.Func([IDL.Nat], [], []),
    'markUpdateDeployed' : IDL.Func([IDL.Nat], [], []),
    'recordHeartbeat' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'regenerateAppCode' : IDL.Func([IDL.Text], [AppView], []),
    'rejectUser' : IDL.Func([IDL.Nat], [], []),
    'removeApp' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'removeUser' : IDL.Func([IDL.Nat], [], []),
    'renameApp' : IDL.Func([IDL.Text, IDL.Text], [AppView], []),
    'resolveAlert' : IDL.Func([IDL.Nat], [], []),
    'resolveIssue' : IDL.Func([IDL.Nat], [], []),
    'scheduleUpdate' : IDL.Func([IDL.Nat, Time], [], []),
    'sendEmailBatch' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Text, IDL.Text],
        [IDL.Vec(EmailLog)],
        [],
      ),
    'sendEmailNow' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [EmailLog],
        [],
      ),
    'setAppBaseUrl' : IDL.Func([IDL.Text, IDL.Text], [AppView], []),
    'setAppManualStatus' : IDL.Func([IDL.Text, AppStatus], [AppView], []),
    'setKillSwitch' : IDL.Func([IDL.Bool], [KillSwitchView], []),
    'setZohoConfig' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [], []),
    'snoozeNotification' : IDL.Func([IDL.Nat, Time], [], []),
    'submitMetrics' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat, IDL.Text],
        [SystemMetrics],
        [],
      ),
    'syncAppUsers' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Text))],
        [IDL.Bool],
        [],
      ),
    'updateEmailConfig' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Bool],
        [],
        [],
      ),
    'updateEmailTemplate' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [], []),
    'updateIssue' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Text,
          IssueSeverity,
          IssueStatus,
          IDL.Opt(IDL.Nat),
        ],
        [],
        [],
      ),
    'updateUserRole' : IDL.Func([IDL.Nat, UserRole], [], []),
  });
};

export const init = ({ IDL }) => { return []; };
