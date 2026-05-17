import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDismissNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useSnoozeNotification,
} from "@/hooks/use-backend";
import type { NotificationView } from "@/types";
import { NotificationSeverity, NotificationType } from "@/types";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  Info,
  Monitor,
  RefreshCw,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabKey = "all" | "unread" | "critical" | "warning" | "info" | "snoozed";
type TypeFilter = "all" | "system" | "user" | "issue" | "update";
type DateRange = "today" | "7days" | "30days";
type SnoozeDuration = "1h" | "24h" | "7d";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function relativeTime(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function withinDateRange(ts: bigint, range: DateRange): boolean {
  const ms = Number(ts) / 1_000_000;
  const now = Date.now();
  if (range === "today") return now - ms < 86_400_000;
  if (range === "7days") return now - ms < 7 * 86_400_000;
  return now - ms < 30 * 86_400_000;
}

function severityLabel(s: NotificationSeverity): string {
  if (s === NotificationSeverity.critical) return "Critical";
  if (s === NotificationSeverity.warning) return "Warning";
  return "Info";
}

function typeLabel(t: NotificationType): string {
  if (t === NotificationType.systemAlert) return "System";
  if (t === NotificationType.user) return "User";
  if (t === NotificationType.issue) return "Issue";
  return "Update";
}

function snoozeDurationMs(d: SnoozeDuration): number {
  if (d === "1h") return 3_600_000;
  if (d === "24h") return 86_400_000;
  return 7 * 86_400_000;
}

// ─── Severity config ──────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<
  NotificationSeverity,
  { border: string; glow: string; iconColor: string; badgeClass: string }
> = {
  [NotificationSeverity.critical]: {
    border: "border-l-red-500",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.2)]",
    iconColor: "text-red-400",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  [NotificationSeverity.warning]: {
    border: "border-l-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    iconColor: "text-amber-400",
    badgeClass: "bg-amber-400/15 text-amber-400 border-amber-400/30",
  },
  [NotificationSeverity.info]: {
    border: "border-l-blue-400",
    glow: "",
    iconColor: "text-blue-400",
    badgeClass: "bg-blue-400/15 text-blue-400 border-blue-400/30",
  },
};

const TYPE_CONFIG: Record<NotificationType, { badgeClass: string }> = {
  [NotificationType.systemAlert]: {
    badgeClass: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  },
  [NotificationType.user]: {
    badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
  [NotificationType.issue]: {
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
  [NotificationType.update]: {
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  },
};

function SeverityIcon({
  severity,
  className,
}: {
  severity: NotificationSeverity;
  className?: string;
}) {
  if (severity === NotificationSeverity.critical)
    return <AlertCircle className={className} />;
  if (severity === NotificationSeverity.warning)
    return <AlertTriangle className={className} />;
  return <Info className={className} />;
}

function TypeIcon({
  type,
  className,
}: {
  type: NotificationType;
  className?: string;
}) {
  if (type === NotificationType.systemAlert)
    return <Monitor className={className} />;
  if (type === NotificationType.user) return <User className={className} />;
  if (type === NotificationType.issue) return <Zap className={className} />;
  return <RefreshCw className={className} />;
}

// ─── Snooze Menu ────────────────────────────────────────────────────────────
function SnoozeMenu({ id, onClose }: { id: bigint; onClose: () => void }) {
  const snooze = useSnoozeNotification();
  const options: { label: string; value: SnoozeDuration }[] = [
    { label: "1 hour", value: "1h" },
    { label: "24 hours", value: "24h" },
    { label: "7 days", value: "7d" },
  ];

  const handleSnooze = (duration: SnoozeDuration) => {
    const until = BigInt(Date.now() + snoozeDurationMs(duration)) * 1_000_000n;
    snooze.mutate(
      { id, until },
      {
        onSuccess: () => {
          toast.success(`Snoozed for ${duration}`);
          onClose();
        },
        onError: () => toast.error("Failed to snooze"),
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-1 z-50 glass-card rounded-lg overflow-hidden min-w-[140px]"
      data-ocid="notifications.snooze_popover"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground/80 hover:bg-accent/10 hover:text-foreground transition-smooth"
          onClick={() => handleSnooze(opt.value)}
        >
          <Clock className="w-3 h-3" />
          {opt.label}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Notification Row ─────────────────────────────────────────────────────────
function NotificationRow({
  notification,
  index,
}: {
  notification: NotificationView;
  index: number;
}) {
  const [showSnooze, setShowSnooze] = useState(false);
  const snoozeRef = useRef<HTMLDivElement>(null);
  const markRead = useMarkNotificationRead();
  const dismiss = useDismissNotification();

  const cfg = SEVERITY_CONFIG[notification.severity];
  const typeCfg = TYPE_CONFIG[notification.notifType];
  const isUnread = !notification.isRead;
  const isSnoozed = notification.snoozed;

  const handleMarkRead = useCallback(() => {
    markRead.mutate(notification.id, {
      onSuccess: () => toast.success("Marked as read"),
      onError: () => toast.error("Failed to mark read"),
    });
  }, [markRead, notification.id]);

  const handleDismiss = useCallback(() => {
    dismiss.mutate(notification.id, {
      onSuccess: () => toast.success("Notification dismissed"),
      onError: () => toast.error("Failed to dismiss"),
    });
  }, [dismiss, notification.id]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      data-ocid={`notifications.item.${index + 1}`}
      className={[
        "relative border-l-[3px] rounded-lg p-4 transition-smooth",
        isSnoozed ? "border-l-muted-foreground/40" : cfg.border,
        isUnread
          ? `glass-elevated ${cfg.glow}`
          : "glass opacity-70 hover:opacity-90",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Unread glow strip */}
      {isUnread && (
        <span
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at left center, ${
              notification.severity === NotificationSeverity.critical
                ? "rgba(239,68,68,0.06)"
                : notification.severity === NotificationSeverity.warning
                  ? "rgba(251,191,36,0.05)"
                  : "rgba(91,157,255,0.06)"
            } 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center glass ${
            notification.severity === NotificationSeverity.critical
              ? "bg-red-500/10"
              : notification.severity === NotificationSeverity.warning
                ? "bg-amber-400/10"
                : "bg-blue-400/10"
          }`}
        >
          <SeverityIcon
            severity={notification.severity}
            className={`w-4 h-4 ${cfg.iconColor}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-semibold truncate max-w-[280px] ${
                  isUnread ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {isUnread && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 mb-0.5 align-middle" />
                )}
                {notification.title}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 border ${cfg.badgeClass}`}
              >
                {severityLabel(notification.severity)}
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 border ${typeCfg.badgeClass} flex items-center gap-1`}
              >
                <TypeIcon
                  type={notification.notifType}
                  className="w-2.5 h-2.5"
                />
                {typeLabel(notification.notifType)}
              </Badge>
              {notification.productId !== undefined && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border border-violet-400/30 bg-violet-400/10 text-violet-300"
                >
                  #{notification.productId.toString()}
                </Badge>
              )}
              {isSnoozed && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 border border-muted-foreground/30 bg-muted/20 text-muted-foreground flex items-center gap-1"
                >
                  <BellOff className="w-2.5 h-2.5" />
                  Snoozed
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
              {relativeTime(notification.createdAt)}
            </span>
          </div>

          <p
            className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
              isUnread ? "text-foreground/75" : "text-muted-foreground/60"
            }`}
          >
            {notification.body}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-1.5 mt-2.5">
            {isUnread && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid={`notifications.mark_read_button.${index + 1}`}
                onClick={handleMarkRead}
                disabled={markRead.isPending}
                className="h-6 px-2 text-[10px] text-foreground/60 hover:text-foreground hover:bg-accent/10"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark Read
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid={`notifications.dismiss_button.${index + 1}`}
              onClick={handleDismiss}
              disabled={dismiss.isPending}
              className="h-6 px-2 text-[10px] text-foreground/60 hover:text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Dismiss
            </Button>
            <div ref={snoozeRef} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                data-ocid={`notifications.snooze_button.${index + 1}`}
                onClick={() => setShowSnooze((v) => !v)}
                className="h-6 px-2 text-[10px] text-foreground/60 hover:text-amber-400 hover:bg-amber-400/10"
              >
                <Clock className="w-3 h-3 mr-1" />
                Snooze
                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
              </Button>
              <AnimatePresence>
                {showSnooze && (
                  <SnoozeMenu
                    id={notification.id}
                    onClose={() => setShowSnooze(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function NotificationSkeleton() {
  return (
    <div className="glass rounded-lg p-4 border-l-[3px] border-l-border">
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0 bg-border/30" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-40 bg-border/30" />
            <Skeleton className="h-4 w-16 bg-border/30" />
          </div>
          <Skeleton className="h-3 w-full bg-border/30" />
          <Skeleton className="h-3 w-3/4 bg-border/30" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-5 w-20 bg-border/30" />
            <Skeleton className="h-5 w-16 bg-border/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: TabKey }) {
  const messages: Record<TabKey, { icon: string; title: string; sub: string }> =
    {
      all: {
        icon: "🔔",
        title: "No notifications yet",
        sub: "When products send alerts or events, they'll appear here.",
      },
      unread: {
        icon: "✅",
        title: "All caught up",
        sub: "You have no unread notifications. Great work!",
      },
      critical: {
        icon: "🛡️",
        title: "No critical alerts",
        sub: "All systems are operating within normal parameters.",
      },
      warning: {
        icon: "⚠️",
        title: "No warnings",
        sub: "No warning-level notifications in this range.",
      },
      info: {
        icon: "ℹ️",
        title: "No informational notices",
        sub: "Check back later for system updates and info.",
      },
      snoozed: {
        icon: "🌙",
        title: "No snoozed notifications",
        sub: "You haven't snoozed any notifications.",
      },
    };
  const m = messages[tab];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      data-ocid="notifications.empty_state"
    >
      <span className="text-5xl mb-4">{m.icon}</span>
      <p className="text-base font-semibold text-foreground/70">{m.title}</p>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{m.sub}</p>
    </motion.div>
  );
}

// ─── Tabs & Filters ──────────────────────────────────────────────────────────
const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
  { key: "snoozed", label: "Snoozed" },
];

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "system", label: "System" },
  { key: "user", label: "User" },
  { key: "issue", label: "Issue" },
  { key: "update", label: "Update" },
];

const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" },
];

const PAGE_SIZE = 20;

// ─── Main Page ────────────────────────────────────────────────────────────────
export function NotificationsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("30days");
  const [page, setPage] = useState(1);

  const { data: allNotifs = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();

  const filtered = useMemo(() => {
    return allNotifs.filter((n) => {
      if (tab === "unread" && n.isRead) return false;
      if (tab === "critical" && n.severity !== NotificationSeverity.critical)
        return false;
      if (tab === "warning" && n.severity !== NotificationSeverity.warning)
        return false;
      if (tab === "info" && n.severity !== NotificationSeverity.info)
        return false;
      if (tab === "snoozed" && !n.snoozed) return false;

      if (
        typeFilter === "system" &&
        n.notifType !== NotificationType.systemAlert
      )
        return false;
      if (typeFilter === "user" && n.notifType !== NotificationType.user)
        return false;
      if (typeFilter === "issue" && n.notifType !== NotificationType.issue)
        return false;
      if (typeFilter === "update" && n.notifType !== NotificationType.update)
        return false;

      if (!withinDateRange(n.createdAt, dateRange)) return false;

      return true;
    });
  }, [allNotifs, tab, typeFilter, dateRange]);

  const unreadCount = useMemo(
    () => allNotifs.filter((n) => !n.isRead).length,
    [allNotifs],
  );

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Failed to mark all as read"),
    });
  };

  const handleTabChange = (t: TabKey) => {
    setTab(t);
    setPage(1);
  };
  const handleTypeFilter = (t: TypeFilter) => {
    setTypeFilter(t);
    setPage(1);
  };
  const handleDateRange = (d: DateRange) => {
    setDateRange(d);
    setPage(1);
  };

  return (
    <div className="min-h-screen p-6 space-y-5" data-ocid="notifications.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-elevated flex items-center justify-center glow-blue">
            <Bell className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-display font-bold text-foreground tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  data-ocid="notifications.unread_badge"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLoading
                ? "Loading…"
                : `${filtered.length} notification${
                    filtered.length !== 1 ? "s" : ""
                  } in view`}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          data-ocid="notifications.mark_all_read_button"
          onClick={handleMarkAllRead}
          disabled={markAllRead.isPending || unreadCount === 0}
          className="glass border-border/40 hover:border-blue-400/40 hover:bg-blue-400/10 text-foreground/70 hover:text-foreground transition-smooth h-8 text-xs"
        >
          <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
          Mark All Read
        </Button>
      </motion.div>

      {/* Filter Panel */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card rounded-xl p-1 space-y-1"
        data-ocid="notifications.filter_panel"
      >
        {/* Severity / status tabs */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              data-ocid={`notifications.tab.${t.key}`}
              onClick={() => handleTabChange(t.key)}
              className={[
                "relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap flex items-center gap-1.5",
                tab === t.key
                  ? "bg-accent/20 text-foreground border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
              ].join(" ")}
            >
              {t.label}
              {t.key === "unread" && unreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sub-filters */}
        <div className="flex items-center gap-2 flex-wrap px-1 pb-1">
          <div className="flex items-center gap-1 flex-wrap">
            {TYPE_FILTERS.map((tf) => (
              <button
                key={tf.key}
                type="button"
                data-ocid={`notifications.type_filter.${tf.key}`}
                onClick={() => handleTypeFilter(tf.key)}
                className={[
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-smooth",
                  typeFilter === tf.key
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50",
                ].join(" ")}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-border/30 mx-0.5 hidden sm:block" />

          <div className="flex items-center gap-1">
            {DATE_RANGES.map((dr) => (
              <button
                key={dr.key}
                type="button"
                data-ocid={`notifications.date_filter.${dr.key}`}
                onClick={() => handleDateRange(dr.key)}
                className={[
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-smooth",
                  dateRange === dr.key
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50",
                ].join(" ")}
              >
                {dr.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notification List */}
      <div className="space-y-2" data-ocid="notifications.list">
        {isLoading ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
              <NotificationSkeleton key={i} />
            ))}
          </>
        ) : paginated.length === 0 ? (
          <EmptyState tab={tab} />
        ) : (
          <AnimatePresence mode="popLayout">
            {paginated.map((n, i) => (
              <NotificationRow
                key={n.id.toString()}
                notification={n}
                index={i}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-2"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="notifications.load_more_button"
            onClick={() => setPage((p) => p + 1)}
            className="glass border-border/40 hover:border-accent/40 text-muted-foreground hover:text-foreground transition-smooth text-xs"
          >
            Load more ({filtered.length - paginated.length} remaining)
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export default NotificationsPage;
