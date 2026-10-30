import ParticleCore from "@/components/ParticleCore";
import AppCard from "@/components/apps/AppCard";
import NewAppDialog from "@/components/apps/NewAppDialog";
import ClientCard from "@/components/clients/ClientCard";
import ClientDialog from "@/components/clients/ClientDialog";
import {
  EmptyState,
  SectionHeader,
  StatTile,
} from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/context/workspace-context";
import {
  useActiveAlerts,
  useApps,
  useClients,
  useNotifications,
  useUsers,
} from "@/hooks/use-backend";
import { nsToMs, timeAgo } from "@/lib/format";
import { AppStatus, UserStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Briefcase,
  CheckCircle2,
  Layers,
  Plus,
  UserCheck,
  WifiOff,
} from "lucide-react";
import { useState } from "react";

const SKELETON_KEYS = ["a", "b", "c", "d"] as const;
const CARD_SKELETON_KEYS = ["a", "b", "c"] as const;

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#EF4444",
  high: "#F59E0B",
  warning: "#F59E0B",
  medium: "#60A5FA",
  low: "#34D399",
  info: "#34D399",
};

interface AttentionItem {
  key: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  title: string;
  detail: string;
  to: "/users" | "/monitoring" | "/apps/$appId";
  params?: { appId: string };
}

export default function DashboardPage() {
  const { mode } = useWorkspace();
  const { data: apps, isLoading: loadingApps } = useApps();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: users } = useUsers();
  const { data: alerts } = useActiveAlerts();
  const { data: notifications, isLoading: loadingNotifs } = useNotifications(
    null,
    null,
    null,
  );
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);

  const isVyan = mode === "vyan";
  const allApps = apps ?? [];
  const scopedApps = allApps.filter((a) =>
    isVyan ? a.ownerType === "vyan" : a.ownerType === "client",
  );
  const scopedIds = new Set(scopedApps.map((a) => a.id));
  const scopedUsers = (users ?? []).filter((u) => scopedIds.has(u.appId));
  const scopedAlerts = (alerts ?? []).filter((a) => scopedIds.has(a.appId));
  const pendingUsers = scopedUsers.filter(
    (u) => u.status === UserStatus.pending,
  );
  const connected = scopedApps.filter((a) => a.status === AppStatus.connected);
  const loading = loadingApps || (!isVyan && loadingClients);

  const attention: AttentionItem[] = [
    ...scopedApps
      .filter((a) => a.status === AppStatus.disconnected)
      .map((a) => ({
        key: `down-${a.id}`,
        icon: WifiOff,
        color: "#F59E0B",
        title: `${a.name} is disconnected`,
        detail: a.lastHeartbeat
          ? `Last heartbeat ${timeAgo(nsToMs(a.lastHeartbeat))}`
          : "No heartbeat received",
        to: "/apps/$appId" as const,
        params: { appId: a.id },
      })),
    ...scopedApps
      .filter((a) => a.status === AppStatus.pending)
      .map((a) => ({
        key: `new-${a.id}`,
        icon: Layers,
        color: "#60A5FA",
        title: `${a.name} is awaiting its first connection`,
        detail: "Finish pairing from its console",
        to: "/apps/$appId" as const,
        params: { appId: a.id },
      })),
    ...(pendingUsers.length > 0
      ? [
          {
            key: "pending-users",
            icon: UserCheck,
            color: "#A855F7",
            title: `${pendingUsers.length} user${pendingUsers.length === 1 ? "" : "s"} awaiting review`,
            detail: "Accept, hold or reject from Users",
            to: "/users" as const,
          },
        ]
      : []),
    ...(scopedAlerts.length > 0
      ? [
          {
            key: "alerts",
            icon: AlertTriangle,
            color: "#EF4444",
            title: `${scopedAlerts.length} active alert${scopedAlerts.length === 1 ? "" : "s"}`,
            detail: "Open Monitoring to review",
            to: "/monitoring" as const,
          },
        ]
      : []),
  ];

  const clientRollups = new Map(
    (clients ?? []).map((c) => {
      const owned = allApps.filter((a) => a.clientId === c.id);
      return [
        c.id,
        {
          connected: owned.filter((a) => a.status === AppStatus.connected)
            .length,
          websites: owned.filter((a) => a.kind === "website").length,
        },
      ] as const;
    }),
  );

  const recentNotifs = (notifications ?? []).slice(0, 6);
  const unread = (notifications ?? []).filter((n) => !n.isRead).length;

  return (
    <div
      className="p-4 sm:p-6 space-y-8 max-w-[1600px] mx-auto"
      data-ocid="dashboard.page"
    >
      {/* ── Hero ── */}
      <section
        className="relative rounded-2xl overflow-hidden h-[168px]"
        style={{
          background:
            "linear-gradient(160deg, rgba(11,46,92,0.55) 0%, rgba(74,26,107,0.4) 60%, rgba(0,0,0,0.6) 100%)",
          border: "1px solid rgba(91,157,255,0.18)",
        }}
        data-ocid="dashboard.hero.section"
      >
        <ParticleCore />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-4 pointer-events-none flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest mb-1">
              VYAN Netra · {isVyan ? "Products" : "Clients"}
            </p>
            <h1 className="text-xl sm:text-2xl font-display font-bold gradient-text">
              {isVyan ? "VYAN workspace" : "Client workspace"}
            </h1>
          </div>
          <p className="hidden sm:block text-[11px] font-mono text-[rgba(232,232,255,0.5)] text-right">
            {isVyan
              ? "Every product VYAN owns"
              : "Everything VYAN builds for clients"}
          </p>
        </div>
      </section>

      {/* ── Overview ── */}
      <section data-ocid="dashboard.stats.section">
        <SectionHeader title="Overview" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {isVyan ? (
            <StatTile
              loading={loading}
              label="Products"
              value={scopedApps.length}
              sub={`${connected.length} connected`}
            />
          ) : (
            <StatTile
              loading={loading}
              label="Clients"
              value={(clients ?? []).length}
              sub={`${scopedApps.length} apps & sites`}
              color="#A855F7"
            />
          )}
          <StatTile
            loading={loading}
            label="Connected"
            value={`${connected.length}/${scopedApps.length}`}
            sub={
              scopedApps.length === 0
                ? "Nothing registered"
                : connected.length === scopedApps.length
                  ? "All online"
                  : `${scopedApps.length - connected.length} not connected`
            }
            color={
              scopedApps.length > 0 && connected.length === scopedApps.length
                ? "#34D399"
                : "#F59E0B"
            }
          />
          <StatTile
            loading={loading}
            label="Users"
            value={scopedUsers.length}
            sub="across these apps"
            color="#A855F7"
          />
          <StatTile
            loading={loading}
            label="Pending review"
            value={pendingUsers.length}
            sub={pendingUsers.length === 0 ? "None waiting" : "Need a decision"}
            color={pendingUsers.length > 0 ? "#F59E0B" : "#34D399"}
          />
          <StatTile
            loading={loading}
            label="Active alerts"
            value={scopedAlerts.length}
            sub={scopedAlerts.length === 0 ? "All clear" : "Need attention"}
            color={scopedAlerts.length > 0 ? "#EF4444" : "#34D399"}
          />
          <StatTile
            loading={loading}
            label="Unread"
            value={unread}
            sub="notifications"
            color="#60A5FA"
          />
        </div>
      </section>

      {/* ── Cards ── */}
      <section data-ocid="dashboard.cards.section">
        <SectionHeader
          title={isVyan ? "VYAN products" : "Clients"}
          action={
            <div className="flex items-center gap-2">
              {!isVyan && (
                <Button
                  size="sm"
                  onClick={() => setClientDialogOpen(true)}
                  className="h-8 text-xs font-mono bg-[rgba(147,89,255,0.15)] hover:bg-[rgba(147,89,255,0.25)] text-violet-200 border border-[rgba(147,89,255,0.3)]"
                  data-ocid="dashboard.add_client_button"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add client
                </Button>
              )}
              <Button
                size="sm"
                onClick={() => setAppDialogOpen(true)}
                className="h-8 text-xs font-mono bg-[rgba(91,157,255,0.12)] hover:bg-[rgba(91,157,255,0.22)] text-blue-200 border border-[rgba(91,157,255,0.28)]"
                data-ocid="dashboard.register_app_button"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Register app
              </Button>
            </div>
          }
        />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {CARD_SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-[212px] rounded-xl" />
            ))}
          </div>
        ) : isVyan ? (
          scopedApps.length === 0 ? (
            <EmptyState
              icon={Layers}
              title="No VYAN products registered yet"
              body="Register a product to generate its pairing code. Once it connects, it declares its own controls and live figures here."
              action={
                <Button
                  size="sm"
                  onClick={() => setAppDialogOpen(true)}
                  className="mt-1 font-mono text-xs"
                >
                  Register a product
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {scopedApps.map((app, i) => (
                <AppCard key={app.id} app={app} index={i} />
              ))}
            </div>
          )
        ) : (clients ?? []).length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No clients yet"
            body="Add a client, then register the apps and websites you build for them under it."
            action={
              <Button
                size="sm"
                onClick={() => setClientDialogOpen(true)}
                className="mt-1 font-mono text-xs"
              >
                Add your first client
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {(clients ?? []).map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                index={i}
                connected={clientRollups.get(client.id)?.connected ?? 0}
                websites={clientRollups.get(client.id)?.websites ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Attention + activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section data-ocid="dashboard.attention.section">
          <SectionHeader title="Needs attention" />
          <div className="glass-card rounded-xl divide-y divide-[rgba(91,157,255,0.1)]">
            {attention.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-body text-[rgba(232,232,255,0.7)]">
                  {scopedApps.length === 0
                    ? "Nothing to watch yet."
                    : "Everything is connected and clear."}
                </p>
              </div>
            ) : (
              attention.slice(0, 6).map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  params={item.params as { appId: string }}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-[rgba(91,157,255,0.05)] transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <item.icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: item.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-body text-[#E8E8FF] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] font-mono text-[rgba(232,232,255,0.4)] truncate">
                      {item.detail}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <section data-ocid="dashboard.activity.section">
          <SectionHeader
            title="Recent activity"
            action={
              <Link
                to="/notifications"
                className="text-[11px] font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF]"
              >
                View all →
              </Link>
            }
          />
          <div className="glass-card rounded-xl divide-y divide-[rgba(91,157,255,0.1)]">
            {loadingNotifs ? (
              <div className="p-4 space-y-3">
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : recentNotifs.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-6">
                <Bell className="w-5 h-5 text-[rgba(91,157,255,0.5)] flex-shrink-0" />
                <p className="text-sm font-body text-[rgba(232,232,255,0.5)]">
                  No notifications yet.
                </p>
              </div>
            ) : (
              recentNotifs.map((n, i) => {
                const color = SEVERITY_COLORS[n.severity] ?? "#60A5FA";
                return (
                  <div
                    key={n.id.toString()}
                    className="flex items-start gap-3 px-5 py-3.5"
                    style={{
                      background: n.isRead
                        ? "transparent"
                        : "rgba(91,157,255,0.04)",
                    }}
                    data-ocid={`dashboard.activity.item.${i + 1}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-body text-[#E8E8FF] truncate">
                        {n.title}
                      </p>
                      <p className="text-[11px] font-mono text-[rgba(232,232,255,0.4)] truncate">
                        {n.body}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] flex-shrink-0">
                      {timeAgo(nsToMs(n.createdAt))}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <NewAppDialog open={appDialogOpen} onOpenChange={setAppDialogOpen} />
      <ClientDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
      />
    </div>
  );
}
