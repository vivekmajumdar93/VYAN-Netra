import {
  type ActivityEventType,
  type AlertView,
  type AppStatus,
  type AppView,
  type EmailConfigView,
  type EmailLog,
  type EmailStatus,
  type EmailTemplateView,
  type IssueComment,
  type IssueSeverity,
  type IssueStatus,
  type IssueView,
  type KillSwitchView,
  type NotificationSeverity,
  type NotificationType,
  type NotificationView,
  type SystemMetrics,
  type Time,
  type UpdateStatus,
  type UpdateView,
  type UserActivity,
  type UserRole,
  type UserStatus,
  type UserView,
  type ZohoStatusView,
  createActor,
  fromOpt,
  fromVariant,
  toOpt,
  toVariant,
} from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

// The Firebase-backed actor (backend.ts) has no async identity/handshake
// step the way the old ICP useActor did, so construction is synchronous —
// isFetching stays false. Kept as a hook (rather than a module-level
// singleton) so it participates in React's lifecycle the same way the
// rest of this file already assumes.
function useBackendActor() {
  const actor = useMemo(() => createActor(), []);
  return { actor, isFetching: false };
}

// ── UI-friendly view types (variant fields converted to string enums) ──────
export type AppViewUI = Omit<AppView, "status" | "baseUrl"> & {
  status: AppStatus;
  baseUrl: string | null;
};
export type UserViewUI = Omit<UserView, "role" | "status"> & {
  role: UserRole;
  status: UserStatus;
};
export type AlertViewUI = Omit<AlertView, "severity"> & { severity: string };
export type IssueViewUI = Omit<
  IssueView,
  "severity" | "status" | "assignedTo"
> & {
  severity: IssueSeverity;
  status: IssueStatus;
  assignedTo: bigint | null;
};
export type UpdateViewUI = Omit<
  UpdateView,
  "status" | "scheduledAt" | "deployedAt"
> & {
  status: UpdateStatus;
  scheduledAt: bigint | null;
  deployedAt: bigint | null;
};
export type NotificationViewUI = Omit<
  NotificationView,
  "severity" | "notifType" | "appId"
> & {
  severity: NotificationSeverity;
  notifType: NotificationType;
  appId: string | null;
};
export type EmailLogUI = Omit<EmailLog, "status"> & { status: EmailStatus };
export type UserActivityUI = Omit<UserActivity, "eventType"> & {
  eventType: ActivityEventType;
};

const mapApp = (a: AppView): AppViewUI => ({
  ...a,
  status: fromVariant<AppStatus>(a.status as unknown as Record<string, null>),
  baseUrl: fromOpt(a.baseUrl),
});
const mapUser = (u: UserView): UserViewUI => ({
  ...u,
  role: fromVariant<UserRole>(u.role as unknown as Record<string, null>),
  status: fromVariant<UserStatus>(u.status as unknown as Record<string, null>),
});
const mapAlert = (a: AlertView): AlertViewUI => ({
  ...a,
  severity: fromVariant(a.severity as unknown as Record<string, null>),
});
const mapIssue = (i: IssueView): IssueViewUI => ({
  ...i,
  severity: fromVariant<IssueSeverity>(
    i.severity as unknown as Record<string, null>,
  ),
  status: fromVariant<IssueStatus>(i.status as unknown as Record<string, null>),
  assignedTo: fromOpt(i.assignedTo),
});
const mapUpdate = (u: UpdateView): UpdateViewUI => ({
  ...u,
  status: fromVariant<UpdateStatus>(
    u.status as unknown as Record<string, null>,
  ),
  scheduledAt: fromOpt(u.scheduledAt),
  deployedAt: fromOpt(u.deployedAt),
});
const mapNotification = (n: NotificationView): NotificationViewUI => ({
  ...n,
  severity: fromVariant<NotificationSeverity>(
    n.severity as unknown as Record<string, null>,
  ),
  notifType: fromVariant<NotificationType>(
    n.notifType as unknown as Record<string, null>,
  ),
  appId: fromOpt(n.appId),
});
const mapEmailLog = (l: EmailLog): EmailLogUI => ({
  ...l,
  status: fromVariant<EmailStatus>(l.status as unknown as Record<string, null>),
});
const mapActivity = (a: UserActivity): UserActivityUI => ({
  ...a,
  eventType: fromVariant<ActivityEventType>(
    a.eventType as unknown as Record<string, null>,
  ),
});

// ── Apps ─────────────────────────────────────────────────────────────────────
export function useApps() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listApps()).map(mapApp);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useApp(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["app", id],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getApp(id);
      const view = fromOpt(result);
      return view ? mapApp(view) : null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateApp() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not connected");
      return mapApp(await actor.createApp(name));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useSetAppBaseUrl() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; baseUrl: string }) => {
      if (!actor) throw new Error("Not connected");
      return mapApp(await actor.setAppBaseUrl(args.id, args.baseUrl));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useRenameApp() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; name: string }) => {
      if (!actor) throw new Error("Not connected");
      return mapApp(await actor.renameApp(args.id, args.name));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useSetAppManualStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; status: AppStatus }) => {
      if (!actor) throw new Error("Not connected");
      return mapApp(
        await actor.setAppManualStatus(
          args.id,
          toVariant(args.status) as never,
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useRegenerateAppCode() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return mapApp(await actor.regenerateAppCode(id));
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

export function useRemoveApp() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeApp(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["apps"] }),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function useUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listUsers()).map(mapUser);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUsersByApp(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users", "app", appId],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listUsersByApp(appId)).map(mapUser);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function usePendingUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users", "pending"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listPendingUsers()).map(mapUser);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useCreateUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      name: string;
      email: string;
      role: UserRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      return mapUser(
        await actor.createUser(
          args.appId,
          args.name,
          args.email,
          toVariant(args.role) as never,
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUserRole() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserRole(args.id, toVariant(args.role) as never);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useAcceptUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.acceptUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRejectUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useHoldUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.holdUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRemoveUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUserActivities(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["user-activities", appId],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listUserActivities(appId)).map(mapActivity);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useLogUserActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      userId: bigint;
      appId: string;
      eventType: ActivityEventType;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logUserActivity(
        args.userId,
        args.appId,
        toVariant(args.eventType) as never,
        args.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-activities"] }),
  });
}

// ── Monitoring ────────────────────────────────────────────────────────────────
export function useLatestMetrics(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["metrics-latest", appId],
    queryFn: async () => {
      if (!actor) return null;
      return fromOpt(await actor.getLatestMetrics(appId));
    },
    enabled: !!actor && !isFetching && !!appId,
    refetchInterval: 30_000,
  });
}

export function useMetricsHistory(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["metrics-history", appId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMetricsHistory(appId);
    },
    enabled: !!actor && !isFetching && !!appId,
    refetchInterval: 60_000,
  });
}

export function useSubmitMetrics() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      cpu: bigint;
      memory: bigint;
      disk: bigint;
      apiLatency: bigint;
      networkUptime: bigint;
      connectionStatus: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitMetrics(
        args.appId,
        args.cpu,
        args.memory,
        args.disk,
        args.apiLatency,
        args.networkUptime,
        args.connectionStatus,
      );
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["metrics-latest", vars.appId] }),
  });
}

export function useActiveAlerts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["alerts-active"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listActiveAlerts()).map(mapAlert);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAlertHistory(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["alerts-history", appId],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listAlertHistory(appId)).map(mapAlert);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useResolveAlert() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.resolveAlert(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts-active"] }),
  });
}

// ── Notifications ─────────────────────────────────────────────────────────────
export function useNotifications(
  notifType?: NotificationType | null,
  appId?: string | null,
  isRead?: boolean | null,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["notifications", notifType, appId, isRead],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listNotifications(
        notifType ? (toOpt(toVariant(notifType)) as never) : [],
        toOpt(appId ?? null),
        toOpt(isRead ?? null),
      );
      return result.map(mapNotification);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 20_000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationRead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useMarkAllNotificationsRead() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.markAllNotificationsRead();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useDismissNotification() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.dismissNotification(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useSnoozeNotification() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; until: Time }) => {
      if (!actor) throw new Error("Not connected");
      return actor.snoozeNotification(args.id, args.until);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useCreateNotification() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      body: string;
      severity: NotificationSeverity;
      notifType: NotificationType;
      appId?: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return mapNotification(
        await actor.createNotification(
          args.title,
          args.body,
          toVariant(args.severity) as never,
          toVariant(args.notifType) as never,
          toOpt(args.appId ?? null),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ── Issues ────────────────────────────────────────────────────────────────────
export function useIssues(
  appId?: string | null,
  status?: IssueStatus | null,
  severity?: IssueSeverity | null,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["issues", appId, status, severity],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.listIssues(
        toOpt(appId ?? null),
        status ? (toOpt(toVariant(status)) as never) : [],
        severity ? (toOpt(toVariant(severity)) as never) : [],
      );
      return result.map(mapIssue);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateIssue() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      description: string;
      severity: IssueSeverity;
      appId: string;
      assignedTo?: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return mapIssue(
        await actor.createIssue(
          args.title,
          args.description,
          toVariant(args.severity) as never,
          args.appId,
          toOpt(args.assignedTo ?? null),
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues"] }),
  });
}

export function useResolveIssue() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.resolveIssue(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues"] }),
  });
}

export function useUpdateIssue() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      title: string;
      description: string;
      severity: IssueSeverity;
      status: IssueStatus;
      assignedTo?: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateIssue(
        args.id,
        args.title,
        args.description,
        toVariant(args.severity) as never,
        toVariant(args.status) as never,
        toOpt(args.assignedTo ?? null),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["issues"] }),
  });
}

export function useIssueComments(issueId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["issue-comments", issueId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIssueComments(issueId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddIssueComment() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      issueId: bigint;
      content: string;
      authorId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addIssueComment(args.issueId, args.content, args.authorId);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["issue-comments", vars.issueId.toString()],
      }),
  });
}

// ── Updates ───────────────────────────────────────────────────────────────────
export function useAllUpdates() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["updates-all"],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listAllUpdates()).map(mapUpdate);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAppUpdates(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["updates", appId],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listAppUpdates(appId)).map(mapUpdate);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useCreateUpdate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      version: string;
      releaseNotes: string;
      size: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return mapUpdate(
        await actor.createUpdate(
          args.appId,
          args.version,
          args.releaseNotes,
          args.size,
        ),
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["updates-all"] }),
  });
}

export function useMarkUpdateDeployed() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markUpdateDeployed(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["updates-all"] }),
  });
}

export function useScheduleUpdate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; scheduledAt: Time }) => {
      if (!actor) throw new Error("Not connected");
      return actor.scheduleUpdate(args.id, args.scheduledAt);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["updates-all"] }),
  });
}

// ── Email ─────────────────────────────────────────────────────────────────────
export function useEmailConfigs(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-configs", appId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmailConfigs(appId);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useEmailTemplates(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-templates", appId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmailTemplates(appId);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useEmailLogs(appId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-logs", appId],
    queryFn: async () => {
      if (!actor) return [];
      return (await actor.listEmailLogs(appId)).map(mapEmailLog);
    },
    enabled: !!actor && !isFetching && !!appId,
  });
}

export function useCreateEmailConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      senderName: string;
      senderEmail: string;
      bounceEmail: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEmailConfig(
        args.appId,
        args.senderName,
        args.senderEmail,
        args.bounceEmail,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email-configs"] }),
  });
}

export function useUpdateEmailConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      senderName: string;
      senderEmail: string;
      bounceEmail: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEmailConfig(
        args.id,
        args.senderName,
        args.senderEmail,
        args.bounceEmail,
        args.isActive,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email-configs"] }),
  });
}

export function useCreateEmailTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      name: string;
      subject: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEmailTemplate(
        args.appId,
        args.name,
        args.subject,
        args.body,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email-templates"] }),
  });
}

export function useUpdateEmailTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: bigint; subject: string; body: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEmailTemplate(args.id, args.subject, args.body);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email-templates"] }),
  });
}

export function useZohoStatus() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ZohoStatusView>({
    queryKey: ["zoho-status"],
    queryFn: async () => {
      if (!actor) return { configured: false, accountId: "", fromAddress: "" };
      return actor.getZohoStatus();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetZohoConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      accountId: string;
      accessToken: string;
      fromAddress: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setZohoConfig(
        args.accountId,
        args.accessToken,
        args.fromAddress,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["zoho-status"] }),
  });
}

// Sends to one recipient and logs the real (not simulated) result.
export function useSendEmailNow() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      recipient: string;
      subject: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return mapEmailLog(
        await actor.sendEmailNow(
          args.appId,
          args.recipient,
          args.subject,
          args.body,
        ),
      );
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["email-logs", vars.appId] }),
  });
}

// Sends to a batch of recipients (e.g. every accepted user of an app, or a
// hand-picked selection), one at a time so a single failure doesn't drop
// the rest. Returns one real log entry per recipient.
export function useSendEmailBatch() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      appId: string;
      recipients: string[];
      subject: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const logs = await actor.sendEmailBatch(
        args.appId,
        args.recipients,
        args.subject,
        args.body,
      );
      return logs.map(mapEmailLog);
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({ queryKey: ["email-logs", vars.appId] }),
  });
}

// ── Kill switch ──────────────────────────────────────────────────────────
// Console-wide gate on every outbound/cross-app action (email sends,
// heartbeat processing, and — client-side — health checks). Defaults to
// disabled on the backend, so nothing fires until an admin turns it on.
export function useKillSwitch() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<KillSwitchView>({
    queryKey: ["kill-switch"],
    queryFn: async () => {
      if (!actor) return { enabled: false, updatedAt: 0n };
      return actor.getKillSwitch();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

export function useSetKillSwitch() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!actor) throw new Error("Not connected");
      return actor.setKillSwitch(enabled);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kill-switch"] }),
  });
}
