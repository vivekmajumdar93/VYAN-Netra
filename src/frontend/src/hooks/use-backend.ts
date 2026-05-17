import { createActor } from "@/backend";
import type {
  ActivityEventType,
  EmailStatus,
  IssueSeverity,
  IssueStatus,
  NotificationSeverity,
  NotificationType,
  Time,
  UserRole,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useBackendActor() {
  return useActor(createActor);
}

// ── Products ──────────────────────────────────────────────────────────────────
export function useProducts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      description: string;
      code: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerProduct(args.name, args.description, args.code);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDisconnectProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.disconnectProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useReconnectProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.reconnectProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProductMeta() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      id: bigint;
      name: string;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProductMeta(args.id, args.name, args.description);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useSyncProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.syncProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────
export function useUsers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUsersByProduct(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["users", "product", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsersByProduct(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      productId: bigint;
      name: string;
      email: string;
      role: UserRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createUser(args.productId, args.name, args.email, args.role);
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
      return actor.updateUserRole(args.id, args.role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useSuspendUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.suspendUser(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRestoreUser() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.restoreUser(id);
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

export function useUserActivities(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["user-activities", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUserActivities(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLogUserActivity() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      userId: bigint;
      productId: bigint;
      eventType: ActivityEventType;
      description: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.logUserActivity(
        args.userId,
        args.productId,
        args.eventType,
        args.description,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-activities"] }),
  });
}

// ── Monitoring ────────────────────────────────────────────────────────────────
export function useLatestMetrics(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["metrics-latest", productId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLatestMetrics(productId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useMetricsHistory(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["metrics-history", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMetricsHistory(productId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60_000,
  });
}

export function useSubmitMetrics() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      productId: bigint;
      cpu: bigint;
      memory: bigint;
      disk: bigint;
      apiLatency: bigint;
      networkUptime: bigint;
      connectionStatus: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitMetrics(
        args.productId,
        args.cpu,
        args.memory,
        args.disk,
        args.apiLatency,
        args.networkUptime,
        args.connectionStatus,
      );
    },
    onSuccess: (_, vars) =>
      qc.invalidateQueries({
        queryKey: ["metrics-latest", vars.productId.toString()],
      }),
  });
}

export function useActiveAlerts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["alerts-active"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listActiveAlerts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

export function useAlertHistory(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["alerts-history", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAlertHistory(productId);
    },
    enabled: !!actor && !isFetching,
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
  productId?: bigint | null,
  isRead?: boolean | null,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["notifications", notifType, productId?.toString(), isRead],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotifications(
        notifType ?? null,
        productId ?? null,
        isRead ?? null,
      );
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
      productId?: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createNotification(
        args.title,
        args.body,
        args.severity,
        args.notifType,
        args.productId ?? null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ── Issues ────────────────────────────────────────────────────────────────────
export function useIssues(
  productId?: bigint | null,
  status?: IssueStatus | null,
  severity?: IssueSeverity | null,
) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["issues", productId?.toString(), status, severity],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIssues(
        productId ?? null,
        status ?? null,
        severity ?? null,
      );
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
      productId: bigint;
      assignedTo?: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createIssue(
        args.title,
        args.description,
        args.severity,
        args.productId,
        args.assignedTo ?? null,
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
        args.severity,
        args.status,
        args.assignedTo ?? null,
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
      return actor.listAllUpdates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductUpdates(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["updates", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProductUpdates(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateUpdate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      productId: bigint;
      version: string;
      releaseNotes: string;
      size: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createUpdate(
        args.productId,
        args.version,
        args.releaseNotes,
        args.size,
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
export function useEmailConfigs(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-configs", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmailConfigs(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEmailTemplates(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-templates", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmailTemplates(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEmailLogs(productId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["email-logs", productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmailLogs(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateEmailConfig() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      productId: bigint;
      senderName: string;
      senderEmail: string;
      bounceEmail: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEmailConfig(
        args.productId,
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
      productId: bigint;
      name: string;
      subject: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEmailTemplate(
        args.productId,
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

export function useAddEmailLog() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      productId: bigint;
      recipient: string;
      subject: string;
      status: EmailStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addEmailLog(
        args.productId,
        args.recipient,
        args.subject,
        args.status,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["email-logs"] }),
  });
}
