// Plain (non-variant) types re-export directly from the backend boundary.
export type {
  SystemMetrics,
  EmailConfigView,
  EmailTemplateView,
  ZohoStatusView,
  IssueComment,
  Id,
  AppId,
  UserId,
  IssueId,
  UpdateId,
  EmailConfigId,
  Timestamp,
  Time,
} from "@/backend";

// View types that contain variant fields (severity/status/role/etc.) come
// from the hooks layer instead — that's where the raw candid encoding
// (`{ critical: null }`) gets converted to plain string enums.
export type {
  AppViewUI as AppView,
  UserViewUI as UserView,
  AlertViewUI as AlertView,
  IssueViewUI as IssueView,
  UpdateViewUI as UpdateView,
  NotificationViewUI as NotificationView,
  EmailLogUI as EmailLog,
  UserActivityUI as UserActivity,
} from "@/hooks/use-backend";

export {
  AppStatus,
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
