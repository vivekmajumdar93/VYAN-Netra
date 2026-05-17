// Re-export all backend types for convenience
export type {
  ProductView,
  UserView,
  SystemMetrics,
  AlertView,
  NotificationView,
  IssueView,
  UpdateView,
  EmailConfigView,
  EmailTemplateView,
  EmailLog,
  IssueComment,
  UserActivity,
  Id,
  ProductId,
  UserId,
  IssueId,
  UpdateId,
  EmailConfigId,
  Timestamp,
  Time,
} from "@/backend";

export {
  ProductStatus,
  UserStatus,
  UserRole,
  IssueSeverity,
  IssueStatus,
  NotificationSeverity,
  NotificationType,
  UpdateStatus,
  EmailStatus,
  ActivityEventType,
} from "@/backend";

export enum MetricSeverity {
  critical = "critical",
  warning = "warning",
  info = "info",
}

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
};
