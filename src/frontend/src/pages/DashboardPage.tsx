import ParticleCore from "@/components/ParticleCore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useActiveAlerts,
  useApps,
  useIssues,
  useNotifications,
  useUsers,
} from "@/hooks/use-backend";
import { AppStatus, IssueStatus, NotificationSeverity } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  FilePlus,
  Layers,
  RefreshCw,
  Settings,
  Shield,
  UserPlus,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#EF4444",
  high: "#F59E0B",
  warning: "#F59E0B",
  medium: "#60A5FA",
  low: "#34D399",
  info: "#34D399",
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  sub: string;
  accentColor: string;
  loading?: boolean;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accentColor,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-5 flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }
  return (
    <div
      className="glass-card rounded-xl p-5 flex items-start gap-4 transition-smooth hover:border-opacity-30"
      style={{ boxShadow: `0 0 24px ${accentColor}12` }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}30`,
        }}
      >
        <span style={{ color: accentColor }}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-display font-bold text-[#E8E8FF] mt-0.5 leading-none metric-value">
          {value}
        </p>
        <p className="text-xs text-[rgba(232,232,255,0.4)] mt-1 font-mono">
          {sub}
        </p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-4">
      {children}
    </h2>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const SKELETON_KEYS_HEALTH = ["a", "b", "c", "d"] as const;
const SKELETON_KEYS_PRODUCTS = ["e", "f", "g"] as const;
const SKELETON_KEYS_ACTIVITY = ["h", "i", "j", "k"] as const;

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: apps, isLoading: loadingApps } = useApps();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: alerts, isLoading: loadingAlerts } = useActiveAlerts();
  const { data: notifications, isLoading: loadingNotifs } = useNotifications(
    null,
    null,
    null,
  );
  const { data: issues, isLoading: loadingIssues } = useIssues(
    null,
    IssueStatus.open,
  );

  const connectedCount =
    apps?.filter((a) => a.status === AppStatus.connected).length ?? 0;
  const totalApps = apps?.length ?? 0;
  const totalUsers = users?.length ?? 0;
  const activeAlerts = alerts?.length ?? 0;
  const unreadNotifs = notifications?.filter((n) => !n.isRead).length ?? 0;
  const openIssues = issues?.length ?? 0;

  const isLoadingAny =
    loadingApps ||
    loadingUsers ||
    loadingAlerts ||
    loadingNotifs ||
    loadingIssues;

  // System health
  const systemStatus =
    activeAlerts === 0 ? "nominal" : activeAlerts <= 2 ? "warning" : "critical";

  const statusColor =
    systemStatus === "nominal"
      ? "#34D399"
      : systemStatus === "warning"
        ? "#F59E0B"
        : "#EF4444";

  const recentNotifs = (notifications ?? []).slice(0, 5);

  const stats = [
    {
      icon: Layers,
      label: "Apps",
      value: totalApps,
      sub: `${connectedCount} connected`,
      accentColor: "#5B9DFF",
      loading: loadingApps,
    },
    {
      icon: Users,
      label: "Total Users",
      value: totalUsers,
      sub: "across all apps",
      accentColor: "#A855F7",
      loading: loadingUsers,
    },
    {
      icon: Activity,
      label: "Active Alerts",
      value: activeAlerts,
      sub: activeAlerts === 0 ? "All systems nominal" : "Require attention",
      accentColor: activeAlerts > 0 ? "#F59E0B" : "#34D399",
      loading: loadingAlerts,
    },
    {
      icon: Bell,
      label: "Notifications",
      value: unreadNotifs,
      sub: "unread messages",
      accentColor: "#60A5FA",
      loading: loadingNotifs,
    },
    {
      icon: AlertTriangle,
      label: "Open Issues",
      value: openIssues,
      sub: openIssues === 0 ? "All resolved" : "Awaiting resolution",
      accentColor: openIssues > 0 ? "#EF4444" : "#34D399",
      loading: loadingIssues,
    },
    {
      icon: Shield,
      label: "System Health",
      value:
        systemStatus === "nominal"
          ? "Good"
          : systemStatus === "warning"
            ? "Warn"
            : "Crit",
      sub:
        systemStatus === "nominal"
          ? "No active threats"
          : `${activeAlerts} alert(s) active`,
      accentColor: statusColor,
      loading: loadingAlerts,
    },
  ];

  const quickActions = [
    {
      icon: Layers,
      label: "Register App",
      desc: "Generate a pairing code for a new app",
      accentColor: "#5B9DFF",
      path: "/apps",
      ocid: "dashboard.quick_action.register_app",
    },
    {
      icon: UserPlus,
      label: "Invite User",
      desc: "Add a user to a product",
      accentColor: "#A855F7",
      path: "/users",
      ocid: "dashboard.quick_action.invite_user",
    },
    {
      icon: AlertTriangle,
      label: "View Alerts",
      desc: `${activeAlerts} active alert${activeAlerts !== 1 ? "s" : ""}`,
      accentColor: activeAlerts > 0 ? "#F59E0B" : "#34D399",
      path: "/monitoring",
      ocid: "dashboard.quick_action.view_alerts",
    },
    {
      icon: FilePlus,
      label: "Create Issue",
      desc: "Report a new platform issue",
      accentColor: "#EC4899",
      path: "/issues",
      ocid: "dashboard.quick_action.create_issue",
    },
    {
      icon: Zap,
      label: "Deploy Update",
      desc: "Push a version update",
      accentColor: "#8B5CF6",
      path: "/updates",
      ocid: "dashboard.quick_action.deploy_update",
    },
    {
      icon: Settings,
      label: "Settings",
      desc: "Console configuration",
      accentColor: "#64748B",
      path: "/settings",
      ocid: "dashboard.quick_action.settings",
    },
  ];

  return (
    <div className="p-6 space-y-8" data-ocid="dashboard.page">
      {/* ── Primordial Core Hero ───────────────────────────────── */}
      <section
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, rgba(11,46,92,0.55) 0%, rgba(74,26,107,0.4) 60%, rgba(0,0,0,0.6) 100%)",
          border: "1px solid rgba(91,157,255,0.18)",
          height: "260px",
        }}
        data-ocid="dashboard.hero.section"
      >
        {/* ambient nebula glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(91,157,255,0.1) 0%, rgba(147,89,255,0.06) 40%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <ParticleCore />

        {/* Hero label overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pointer-events-none">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-widest mb-1">
                VYAN · Command Nexus
              </p>
              <h1 className="text-2xl font-display font-bold gradient-text">
                VYAN Netra
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: statusColor }}
              />
              <span
                className="text-xs font-mono capitalize"
                style={{ color: statusColor }}
              >
                {systemStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <section data-ocid="dashboard.stats.section">
        <SectionLabel>System Overview</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ── System Health Bar ─────────────────────────────────── */}
      <section data-ocid="dashboard.health.section">
        <SectionLabel>System Health Summary</SectionLabel>
        <div
          className="glass-card rounded-xl px-5 py-4 flex flex-wrap items-center gap-6"
          data-ocid="dashboard.health.panel"
        >
          {isLoadingAny ? (
            SKELETON_KEYS_HEALTH.map((k) => (
              <Skeleton key={k} className="h-8 w-32" />
            ))
          ) : (
            <>
              <HealthPill
                label="Overall Status"
                value={systemStatus}
                color={statusColor}
                Icon={systemStatus === "nominal" ? CheckCircle2 : AlertTriangle}
              />
              <HealthPill
                label="Unread Notifs"
                value={String(unreadNotifs)}
                color={unreadNotifs > 0 ? "#F59E0B" : "#34D399"}
                Icon={Bell}
              />
              <HealthPill
                label="Open Issues"
                value={String(openIssues)}
                color={openIssues > 0 ? "#EF4444" : "#34D399"}
                Icon={AlertTriangle}
              />
              <HealthPill
                label="Active Alerts"
                value={String(activeAlerts)}
                color={activeAlerts > 0 ? "#F59E0B" : "#34D399"}
                Icon={Activity}
              />
              <HealthPill
                label="Connected"
                value={`${connectedCount}/${totalApps}`}
                color="#5B9DFF"
                Icon={Layers}
              />
            </>
          )}
        </div>
      </section>

      {/* ── Apps Grid + Recent Activity (2-col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Apps */}
        <section data-ocid="dashboard.apps.section">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Apps</SectionLabel>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF] -mt-4"
              onClick={() => navigate({ to: "/apps" })}
              data-ocid="dashboard.apps.view_all_button"
            >
              View all →
            </Button>
          </div>

          {loadingApps ? (
            <div className="space-y-3">
              {SKELETON_KEYS_PRODUCTS.map((k) => (
                <Skeleton key={k} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : !apps || apps.length === 0 ? (
            <div
              className="glass-card rounded-xl p-10 flex flex-col items-center justify-center gap-3"
              data-ocid="dashboard.apps.empty_state"
            >
              <Layers className="w-10 h-10 text-[rgba(91,157,255,0.35)]" />
              <p className="text-sm text-[rgba(232,232,255,0.45)] font-mono text-center">
                No apps registered yet.
                <br />
                Generate a pairing code to connect one.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 border-[rgba(91,157,255,0.3)] text-[rgba(91,157,255,0.8)]"
                onClick={() => navigate({ to: "/apps" })}
                data-ocid="dashboard.apps.register_button"
              >
                Register App
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 6).map((app, i) => {
                const isConnected = app.status === AppStatus.connected;
                return (
                  <button
                    key={app.id}
                    type="button"
                    className="w-full glass-card rounded-xl px-4 py-3.5 flex items-center gap-3 group cursor-pointer text-left"
                    onClick={() => navigate({ to: "/apps" })}
                    data-ocid={`dashboard.app.item.${i + 1}`}
                  >
                    {/* Status dot */}
                    <div
                      className="flex-shrink-0 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: isConnected ? "#34D399" : "#6B7280",
                        boxShadow: isConnected
                          ? "0 0 6px rgba(52,211,153,0.6)"
                          : "none",
                      }}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-semibold text-[#E8E8FF] truncate">
                        {app.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] tracking-widest">
                          {app.appCode}
                        </span>
                        {app.lastHeartbeat[0] ? (
                          <span className="text-[10px] font-mono text-[rgba(232,232,255,0.25)]">
                            · heartbeat {formatTime(app.lastHeartbeat[0])}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Status badge */}
                    <span
                      className="flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{
                        background: isConnected
                          ? "rgba(52,211,153,0.1)"
                          : "rgba(107,114,128,0.12)",
                        color: isConnected ? "#34D399" : "#9CA3AF",
                        border: `1px solid ${isConnected ? "rgba(52,211,153,0.22)" : "rgba(107,114,128,0.18)"}`,
                      }}
                    >
                      {app.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent Activity Feed */}
        <section data-ocid="dashboard.activity.section">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Recent Activity</SectionLabel>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF] -mt-4"
              onClick={() => navigate({ to: "/notifications" })}
              data-ocid="dashboard.activity.view_all_button"
            >
              View all →
            </Button>
          </div>

          <div
            className="glass-card rounded-xl divide-y"
            style={{ borderColor: "rgba(91,157,255,0.12)" }}
            data-ocid="dashboard.activity.list"
          >
            {loadingNotifs ? (
              <div className="p-4 space-y-4">
                {SKELETON_KEYS_ACTIVITY.map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : recentNotifs.length === 0 ? (
              <div
                className="p-10 flex flex-col items-center justify-center gap-3"
                data-ocid="dashboard.activity.empty_state"
              >
                <Bell className="w-8 h-8 text-[rgba(91,157,255,0.3)]" />
                <p className="text-sm text-[rgba(232,232,255,0.4)] font-mono">
                  No recent notifications
                </p>
              </div>
            ) : (
              recentNotifs.map((notif, i) => {
                const sev = Object.keys(notif.severity)[0] as string;
                const color = SEVERITY_COLORS[sev] ?? "#60A5FA";
                const isCritical = sev === "critical";
                return (
                  <div
                    key={notif.id.toString()}
                    className="flex items-start gap-3 px-4 py-3.5 first:rounded-t-xl last:rounded-b-xl"
                    style={{
                      background: notif.isRead
                        ? "transparent"
                        : "rgba(91,157,255,0.04)",
                      borderColor: "rgba(91,157,255,0.1)",
                    }}
                    data-ocid={`dashboard.activity.item.${i + 1}`}
                  >
                    {/* Severity icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isCritical ? (
                        <XCircle className="w-4 h-4" style={{ color }} />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" style={{ color }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-[#E8E8FF] truncate">
                        {notif.title}
                      </p>
                      <p className="text-[11px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 truncate">
                        {notif.body}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className="text-[9px] font-mono px-1.5 py-0 capitalize"
                        style={{
                          borderColor: `${color}30`,
                          color,
                          background: `${color}0D`,
                        }}
                      >
                        {sev}
                      </Badge>
                      <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)]">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <section data-ocid="dashboard.quick_actions.section">
        <SectionLabel>Quick Actions</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              className="glass-card rounded-xl p-4 flex flex-col items-center gap-2.5 text-center transition-smooth hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(91,157,255,0.5)]"
              style={{ cursor: "pointer" }}
              onClick={() => navigate({ to: action.path as "/" })}
              data-ocid={action.ocid}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `${action.accentColor}15`,
                  border: `1px solid ${action.accentColor}28`,
                }}
              >
                <action.icon
                  className="w-4 h-4"
                  style={{ color: action.accentColor }}
                />
              </div>
              <div>
                <p className="text-xs font-body font-semibold text-[#E8E8FF] leading-tight">
                  {action.label}
                </p>
                <p className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 leading-tight">
                  {action.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── HealthPill ────────────────────────────────────────────────────────────────

interface HealthPillProps {
  label: string;
  value: string;
  color: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function HealthPill({ label, value, color, Icon }: HealthPillProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <span style={{ color }}>
          <Icon className="w-3.5 h-3.5" />
        </span>
      </div>
      <div>
        <p className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider">
          {label}
        </p>
        <p
          className="text-sm font-display font-bold capitalize metric-value"
          style={{ color }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
