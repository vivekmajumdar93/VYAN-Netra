import { appConnectionState } from "@/components/apps/AppCard";
import { EmptyState } from "@/components/common/Section";
import StatusPill from "@/components/common/StatusPill";
import ActivityPanel from "@/components/console/ActivityPanel";
import ConnectionPanel from "@/components/console/ConnectionPanel";
import ControlsPanel from "@/components/console/ControlsPanel";
import LiveStatsPanel from "@/components/console/LiveStatsPanel";
import UsersPanel from "@/components/console/UsersPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useApps,
  useClients,
  useCommandHistory,
  useKillSwitch,
  useUsersByApp,
} from "@/hooks/use-backend";
import { useConnectionState, useHealthCheck } from "@/hooks/use-health-check";
import { nsToMs, timeAgo } from "@/lib/format";
import { UserStatus } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Globe,
  LayoutGrid,
  Loader2,
  RadioTower,
  SearchX,
  WifiOff,
} from "lucide-react";
import { useState } from "react";

const TAB_CLASS =
  "font-mono text-xs px-4 py-2 rounded-lg text-[rgba(232,232,255,0.5)] data-[state=active]:text-[#E8E8FF] data-[state=active]:bg-[rgba(91,157,255,0.15)] data-[state=active]:shadow-[0_0_12px_rgba(91,157,255,0.2)] whitespace-nowrap";

export default function AppConsolePage() {
  const { appId } = useParams({ strict: false }) as { appId: string };
  const { data: apps, isLoading } = useApps();
  const { data: clients } = useClients();
  const { data: killSwitch } = useKillSwitch();
  const { data: users } = useUsersByApp(appId);
  const { data: commands } = useCommandHistory(appId);
  const [tab, setTab] = useState("overview");

  const app = (apps ?? []).find((a) => a.id === appId) ?? null;
  const consoleEnabled = killSwitch?.enabled ?? false;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <EmptyState
          icon={SearchX}
          title="This app isn't registered"
          body="It may have been removed. Head back to the dashboard to see what is connected."
          action={
            <Button asChild size="sm" className="mt-1 font-mono text-xs">
              <Link to="/">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ConsoleBody
      app={app}
      clientName={
        app.clientId
          ? ((clients ?? []).find((c) => c.id === app.clientId)?.name ??
            "Client")
          : null
      }
      tab={tab}
      onTab={setTab}
      consoleEnabled={consoleEnabled}
      pendingUsers={
        (users ?? []).filter((u) => u.status === UserStatus.pending).length
      }
      pendingCommands={
        (commands ?? []).filter((c) => c.status === "pending").length
      }
    />
  );
}

function ConsoleBody({
  app,
  clientName,
  tab,
  onTab,
  consoleEnabled,
  pendingUsers,
  pendingCommands,
}: {
  app: NonNullable<ReturnType<typeof useApps>["data"]>[number];
  clientName: string | null;
  tab: string;
  onTab: (tab: string) => void;
  consoleEnabled: boolean;
  pendingUsers: number;
  pendingCommands: number;
}) {
  const state = useConnectionState(app);
  const { run: runHealth, isTesting } = useHealthCheck(app, consoleEnabled);
  const KindIcon = app.kind === "website" ? Globe : LayoutGrid;
  const heartbeat = app.lastHeartbeat ? nsToMs(app.lastHeartbeat) : null;
  const connected = state === "connected";
  const dataStatus = appConnectionState(app);

  return (
    <div
      className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto"
      data-ocid="console.page"
    >
      <div className="space-y-4">
        <Link
          to={app.clientId ? "/clients/$clientId" : "/"}
          params={app.clientId ? { clientId: app.clientId } : undefined}
          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] transition-colors"
          data-ocid="console.back_link"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {clientName ?? "VYAN products"}
        </Link>

        <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(91,157,255,0.1)",
              border: "1px solid rgba(91,157,255,0.25)",
            }}
          >
            <KindIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1 basis-56">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-display font-bold text-[#E8E8FF] truncate">
                {app.name}
              </h2>
              <StatusPill state={state} />
            </div>
            <p className="text-[11px] font-mono text-[rgba(232,232,255,0.45)] mt-1 truncate capitalize">
              {app.kind}
              {clientName ? ` · ${clientName}` : " · VYAN"}
              {app.description ? ` · ${app.description}` : ""}
            </p>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] mt-0.5">
              {heartbeat
                ? `Last heartbeat ${timeAgo(heartbeat)}`
                : "No heartbeat received yet"}
            </p>
          </div>
          <Button
            size="sm"
            onClick={runHealth}
            disabled={isTesting || !app.baseUrl || !consoleEnabled}
            title={
              !app.baseUrl
                ? "Set a Base URL in the Connection tab first"
                : !consoleEnabled
                  ? "The console kill switch is off (Settings)"
                  : undefined
            }
            className="h-9 font-mono text-xs bg-[rgba(91,157,255,0.12)] hover:bg-[rgba(91,157,255,0.22)] text-blue-200 border border-[rgba(91,157,255,0.3)]"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <RadioTower className="w-3.5 h-3.5 mr-2" /> Health check
              </>
            )}
          </Button>
        </div>

        {dataStatus === "disconnected" ? (
          <div className="flex items-start gap-3 rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/30">
            <WifiOff className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-mono text-amber-200 leading-relaxed">
              {app.name} stopped sending heartbeats
              {heartbeat ? ` ${timeAgo(heartbeat)}` : ""}. Figures below are the
              last it reported, and commands will wait up to 10 minutes for it
              to come back.
            </p>
          </div>
        ) : null}
      </div>

      <Tabs value={tab} onValueChange={onTab}>
        <TabsList className="h-auto p-1 gap-1 bg-[rgba(91,157,255,0.06)] border border-[rgba(91,157,255,0.12)] rounded-xl w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className={TAB_CLASS}>
            Overview
          </TabsTrigger>
          <TabsTrigger value="controls" className={TAB_CLASS}>
            Controls
          </TabsTrigger>
          <TabsTrigger value="users" className={TAB_CLASS}>
            Users{pendingUsers > 0 ? ` (${pendingUsers})` : ""}
          </TabsTrigger>
          <TabsTrigger value="activity" className={TAB_CLASS}>
            Activity{pendingCommands > 0 ? ` (${pendingCommands})` : ""}
          </TabsTrigger>
          <TabsTrigger value="connection" className={TAB_CLASS}>
            Connection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <LiveStatsPanel appId={app.id} />
        </TabsContent>
        <TabsContent value="controls" className="mt-6">
          <ControlsPanel appId={app.id} connected={connected} />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UsersPanel app={app} />
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <ActivityPanel appId={app.id} />
        </TabsContent>
        <TabsContent value="connection" className="mt-6">
          <ConnectionPanel app={app} consoleEnabled={consoleEnabled} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
