import { c as createLucideIcon, r as reactExports, e as useNotifications, N as useMarkAllNotificationsRead, O as NotificationSeverity, Q as NotificationType, j as jsxRuntimeExports, B as Bell, k as Button, n as ue, V as useMarkNotificationRead, W as useDismissNotification, l as Badge, C as ChevronDown, T as TriangleAlert, R as RefreshCw, X as useSnoozeNotification } from "./index-B0U-vI18.js";
import { S as Skeleton } from "./skeleton-C_urTQDW.js";
import { m as motion } from "./proxy-DrXJd9GG.js";
import { A as AnimatePresence } from "./index-DMUJ_te1.js";
import { C as Check } from "./check-Ckl5WtrJ.js";
import { T as Trash2 } from "./trash-2-l3l4MEia.js";
import { C as Clock } from "./clock-BxmsDJr5.js";
import { C as CircleAlert } from "./circle-alert-lAuFozwt.js";
import { I as Info } from "./info-BXEIKKY1.js";
import { U as User } from "./user-CiGUKWHK.js";
import { Z as Zap } from "./zap-D_xA7PSe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", key: "1hqiys" }]
];
const BellOff = createLucideIcon("bell-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
];
const Monitor = createLucideIcon("monitor", __iconNode);
function relativeTime(ts) {
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
function withinDateRange(ts, range) {
  const ms = Number(ts) / 1e6;
  const now = Date.now();
  if (range === "today") return now - ms < 864e5;
  if (range === "7days") return now - ms < 7 * 864e5;
  return now - ms < 30 * 864e5;
}
function severityLabel(s) {
  if (s === NotificationSeverity.critical) return "Critical";
  if (s === NotificationSeverity.warning) return "Warning";
  return "Info";
}
function typeLabel(t) {
  if (t === NotificationType.systemAlert) return "System";
  if (t === NotificationType.user) return "User";
  if (t === NotificationType.issue) return "Issue";
  return "Update";
}
function snoozeDurationMs(d) {
  if (d === "1h") return 36e5;
  if (d === "24h") return 864e5;
  return 7 * 864e5;
}
const SEVERITY_CONFIG = {
  [NotificationSeverity.critical]: {
    border: "border-l-red-500",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.2)]",
    iconColor: "text-red-400",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30"
  },
  [NotificationSeverity.warning]: {
    border: "border-l-amber-400",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
    iconColor: "text-amber-400",
    badgeClass: "bg-amber-400/15 text-amber-400 border-amber-400/30"
  },
  [NotificationSeverity.info]: {
    border: "border-l-blue-400",
    glow: "",
    iconColor: "text-blue-400",
    badgeClass: "bg-blue-400/15 text-blue-400 border-blue-400/30"
  }
};
const TYPE_CONFIG = {
  [NotificationType.systemAlert]: {
    badgeClass: "bg-violet-500/15 text-violet-300 border-violet-500/30"
  },
  [NotificationType.user]: {
    badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
  },
  [NotificationType.issue]: {
    badgeClass: "bg-orange-500/15 text-orange-300 border-orange-500/30"
  },
  [NotificationType.update]: {
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  }
};
function SeverityIcon({
  severity,
  className
}) {
  if (severity === NotificationSeverity.critical)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className });
  if (severity === NotificationSeverity.warning)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className });
}
function TypeIcon({
  type,
  className
}) {
  if (type === NotificationType.systemAlert)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className });
  if (type === NotificationType.user) return /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className });
  if (type === NotificationType.issue) return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className });
}
function SnoozeMenu({ id, onClose }) {
  const snooze = useSnoozeNotification();
  const options = [
    { label: "1 hour", value: "1h" },
    { label: "24 hours", value: "24h" },
    { label: "7 days", value: "7d" }
  ];
  const handleSnooze = (duration) => {
    const until = BigInt(Date.now() + snoozeDurationMs(duration)) * 1000000n;
    snooze.mutate(
      { id, until },
      {
        onSuccess: () => {
          ue.success(`Snoozed for ${duration}`);
          onClose();
        },
        onError: () => ue.error("Failed to snooze")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.92, y: -4 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.92, y: -4 },
      transition: { duration: 0.15 },
      className: "absolute right-0 top-full mt-1 z-50 glass-card rounded-lg overflow-hidden min-w-[140px]",
      "data-ocid": "notifications.snooze_popover",
      children: options.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground/80 hover:bg-accent/10 hover:text-foreground transition-smooth",
          onClick: () => handleSnooze(opt.value),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            opt.label
          ]
        },
        opt.value
      ))
    }
  );
}
function NotificationRow({
  notification,
  index
}) {
  const [showSnooze, setShowSnooze] = reactExports.useState(false);
  const snoozeRef = reactExports.useRef(null);
  const markRead = useMarkNotificationRead();
  const dismiss = useDismissNotification();
  const cfg = SEVERITY_CONFIG[notification.severity];
  const typeCfg = TYPE_CONFIG[notification.notifType];
  const isUnread = !notification.isRead;
  const isSnoozed = notification.snoozed;
  const handleMarkRead = reactExports.useCallback(() => {
    markRead.mutate(notification.id, {
      onSuccess: () => ue.success("Marked as read"),
      onError: () => ue.error("Failed to mark read")
    });
  }, [markRead, notification.id]);
  const handleDismiss = reactExports.useCallback(() => {
    dismiss.mutate(notification.id, {
      onSuccess: () => ue.success("Notification dismissed"),
      onError: () => ue.error("Failed to dismiss")
    });
  }, [dismiss, notification.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -8 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 8 },
      transition: { duration: 0.2, delay: index * 0.04 },
      "data-ocid": `notifications.item.${index + 1}`,
      className: [
        "relative border-l-[3px] rounded-lg p-4 transition-smooth",
        isSnoozed ? "border-l-muted-foreground/40" : cfg.border,
        isUnread ? `glass-elevated ${cfg.glow}` : "glass opacity-70 hover:opacity-90"
      ].filter(Boolean).join(" "),
      children: [
        isUnread && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute inset-0 rounded-lg pointer-events-none",
            style: {
              background: `radial-gradient(ellipse at left center, ${notification.severity === NotificationSeverity.critical ? "rgba(239,68,68,0.06)" : notification.severity === NotificationSeverity.warning ? "rgba(251,191,36,0.05)" : "rgba(91,157,255,0.06)"} 0%, transparent 70%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `mt-0.5 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center glass ${notification.severity === NotificationSeverity.critical ? "bg-red-500/10" : notification.severity === NotificationSeverity.warning ? "bg-amber-400/10" : "bg-blue-400/10"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                SeverityIcon,
                {
                  severity: notification.severity,
                  className: `w-4 h-4 ${cfg.iconColor}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `text-sm font-semibold truncate max-w-[280px] ${isUnread ? "text-foreground" : "text-foreground/60"}`,
                    children: [
                      isUnread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 mb-0.5 align-middle" }),
                      notification.title
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-[10px] px-1.5 py-0 border ${cfg.badgeClass}`,
                    children: severityLabel(notification.severity)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-[10px] px-1.5 py-0 border ${typeCfg.badgeClass} flex items-center gap-1`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TypeIcon,
                        {
                          type: notification.notifType,
                          className: "w-2.5 h-2.5"
                        }
                      ),
                      typeLabel(notification.notifType)
                    ]
                  }
                ),
                notification.productId !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] px-1.5 py-0 border border-violet-400/30 bg-violet-400/10 text-violet-300",
                    children: [
                      "#",
                      notification.productId.toString()
                    ]
                  }
                ),
                isSnoozed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-[10px] px-1.5 py-0 border border-muted-foreground/30 bg-muted/20 text-muted-foreground flex items-center gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "w-2.5 h-2.5" }),
                      "Snoozed"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap flex-shrink-0", children: relativeTime(notification.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `mt-1 text-xs leading-relaxed line-clamp-2 ${isUnread ? "text-foreground/75" : "text-muted-foreground/60"}`,
                children: notification.body
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2.5", children: [
              isUnread && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  "data-ocid": `notifications.mark_read_button.${index + 1}`,
                  onClick: handleMarkRead,
                  disabled: markRead.isPending,
                  className: "h-6 px-2 text-[10px] text-foreground/60 hover:text-foreground hover:bg-accent/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3 mr-1" }),
                    "Mark Read"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  "data-ocid": `notifications.dismiss_button.${index + 1}`,
                  onClick: handleDismiss,
                  disabled: dismiss.isPending,
                  className: "h-6 px-2 text-[10px] text-foreground/60 hover:text-red-400 hover:bg-red-400/10",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1" }),
                    "Dismiss"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: snoozeRef, className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    "data-ocid": `notifications.snooze_button.${index + 1}`,
                    onClick: () => setShowSnooze((v) => !v),
                    className: "h-6 px-2 text-[10px] text-foreground/60 hover:text-amber-400 hover:bg-amber-400/10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                      "Snooze",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-2.5 h-2.5 ml-0.5" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showSnooze && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SnoozeMenu,
                  {
                    id: notification.id,
                    onClose: () => setShowSnooze(false)
                  }
                ) })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function NotificationSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-lg p-4 border-l-[3px] border-l-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full flex-shrink-0 bg-border/30" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40 bg-border/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 bg-border/30" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full bg-border/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 bg-border/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 bg-border/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-border/30" })
      ] })
    ] })
  ] }) });
}
function EmptyState({ tab }) {
  const messages = {
    all: {
      icon: "🔔",
      title: "No notifications yet",
      sub: "When products send alerts or events, they'll appear here."
    },
    unread: {
      icon: "✅",
      title: "All caught up",
      sub: "You have no unread notifications. Great work!"
    },
    critical: {
      icon: "🛡️",
      title: "No critical alerts",
      sub: "All systems are operating within normal parameters."
    },
    warning: {
      icon: "⚠️",
      title: "No warnings",
      sub: "No warning-level notifications in this range."
    },
    info: {
      icon: "ℹ️",
      title: "No informational notices",
      sub: "Check back later for system updates and info."
    },
    snoozed: {
      icon: "🌙",
      title: "No snoozed notifications",
      sub: "You haven't snoozed any notifications."
    }
  };
  const m = messages[tab];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-col items-center justify-center py-20 text-center",
      "data-ocid": "notifications.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl mb-4", children: m.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground/70", children: m.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 max-w-xs", children: m.sub })
      ]
    }
  );
}
const TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "critical", label: "Critical" },
  { key: "warning", label: "Warning" },
  { key: "info", label: "Info" },
  { key: "snoozed", label: "Snoozed" }
];
const TYPE_FILTERS = [
  { key: "all", label: "All Types" },
  { key: "system", label: "System" },
  { key: "user", label: "User" },
  { key: "issue", label: "Issue" },
  { key: "update", label: "Update" }
];
const DATE_RANGES = [
  { key: "today", label: "Today" },
  { key: "7days", label: "Last 7 Days" },
  { key: "30days", label: "Last 30 Days" }
];
const PAGE_SIZE = 20;
function NotificationsPage() {
  const [tab, setTab] = reactExports.useState("all");
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [dateRange, setDateRange] = reactExports.useState("30days");
  const [page, setPage] = reactExports.useState(1);
  const { data: allNotifs = [], isLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const filtered = reactExports.useMemo(() => {
    return allNotifs.filter((n) => {
      if (tab === "unread" && n.isRead) return false;
      if (tab === "critical" && n.severity !== NotificationSeverity.critical)
        return false;
      if (tab === "warning" && n.severity !== NotificationSeverity.warning)
        return false;
      if (tab === "info" && n.severity !== NotificationSeverity.info)
        return false;
      if (tab === "snoozed" && !n.snoozed) return false;
      if (typeFilter === "system" && n.notifType !== NotificationType.systemAlert)
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
  const unreadCount = reactExports.useMemo(
    () => allNotifs.filter((n) => !n.isRead).length,
    [allNotifs]
  );
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;
  const handleMarkAllRead = () => {
    markAllRead.mutate(void 0, {
      onSuccess: () => ue.success("All notifications marked as read"),
      onError: () => ue.error("Failed to mark all as read")
    });
  };
  const handleTabChange = (t) => {
    setTab(t);
    setPage(1);
  };
  const handleTypeFilter = (t) => {
    setTypeFilter(t);
    setPage(1);
  };
  const handleDateRange = (d) => {
    setDateRange(d);
    setPage(1);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-6 space-y-5", "data-ocid": "notifications.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start justify-between gap-4 flex-wrap",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl glass-elevated flex items-center justify-center glow-blue", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-5 h-5 text-blue-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground tracking-tight", children: "Notifications" }),
                unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30",
                    "data-ocid": "notifications.unread_badge",
                    children: unreadCount > 99 ? "99+" : unreadCount
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: isLoading ? "Loading…" : `${filtered.length} notification${filtered.length !== 1 ? "s" : ""} in view` })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              "data-ocid": "notifications.mark_all_read_button",
              onClick: handleMarkAllRead,
              disabled: markAllRead.isPending || unreadCount === 0,
              className: "glass border-border/40 hover:border-blue-400/40 hover:bg-blue-400/10 text-foreground/70 hover:text-foreground transition-smooth h-8 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "w-3.5 h-3.5 mr-1.5" }),
                "Mark All Read"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        className: "glass-card rounded-xl p-1 space-y-1",
        "data-ocid": "notifications.filter_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 overflow-x-auto", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `notifications.tab.${t.key}`,
              onClick: () => handleTabChange(t.key),
              className: [
                "relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-smooth whitespace-nowrap flex items-center gap-1.5",
                tab === t.key ? "bg-accent/20 text-foreground border border-accent/30" : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              ].join(" "),
              children: [
                t.label,
                t.key === "unread" && unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 text-[9px] font-bold flex items-center justify-center", children: unreadCount > 9 ? "9+" : unreadCount })
              ]
            },
            t.key
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap px-1 pb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap", children: TYPE_FILTERS.map((tf) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `notifications.type_filter.${tf.key}`,
                onClick: () => handleTypeFilter(tf.key),
                className: [
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-smooth",
                  typeFilter === tf.key ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                ].join(" "),
                children: tf.label
              },
              tf.key
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-4 bg-border/30 mx-0.5 hidden sm:block" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: DATE_RANGES.map((dr) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `notifications.date_filter.${dr.key}`,
                onClick: () => handleDateRange(dr.key),
                className: [
                  "px-2.5 py-1 rounded-md text-[11px] font-medium transition-smooth",
                  dateRange === dr.key ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50"
                ].join(" "),
                children: dr.label
              },
              dr.key
            )) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "notifications.list", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Array.from({ length: 6 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
      /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSkeleton, {}, i)
    )) }) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { tab }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: paginated.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      NotificationRow,
      {
        notification: n,
        index: i
      },
      n.id.toString()
    )) }) }),
    hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex justify-center pt-2",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            "data-ocid": "notifications.load_more_button",
            onClick: () => setPage((p) => p + 1),
            className: "glass border-border/40 hover:border-accent/40 text-muted-foreground hover:text-foreground transition-smooth text-xs",
            children: [
              "Load more (",
              filtered.length - paginated.length,
              " remaining)"
            ]
          }
        )
      }
    )
  ] });
}
export {
  NotificationsPage,
  NotificationsPage as default
};
