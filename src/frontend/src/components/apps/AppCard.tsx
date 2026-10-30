import StatusPill, {
  type ConnectionState,
  connectionDot,
} from "@/components/common/StatusPill";
import { useAppStats } from "@/hooks/use-backend";
import type { AppViewUI } from "@/hooks/use-backend";
import { STATS_STALE_MS, formatStatValue, nsToMs, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Globe, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

export function appConnectionState(app: AppViewUI): ConnectionState {
  return app.status as ConnectionState;
}

export default function AppCard({
  app,
  index = 0,
}: { app: AppViewUI; index?: number }) {
  const { data: stats } = useAppStats(app.id);
  const state = appConnectionState(app);
  const KindIcon = app.kind === "website" ? Globe : LayoutGrid;
  const heartbeat = app.lastHeartbeat ? nsToMs(app.lastHeartbeat) : null;
  const stale = !stats || Date.now() - stats.updatedAt > STATS_STALE_MS;
  const shown = (stats?.stats ?? []).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        to="/apps/$appId"
        params={{ appId: app.id }}
        className="group glass-card rounded-xl p-5 flex flex-col gap-4 h-full transition-smooth hover:border-[rgba(91,157,255,0.4)] hover:shadow-[0_0_28px_rgba(91,157,255,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(91,157,255,0.6)]"
        data-ocid={`app.card.${index + 1}`}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(91,157,255,0.1)",
              border: "1px solid rgba(91,157,255,0.22)",
            }}
          >
            <KindIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate">
              {app.name}
            </h3>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5 truncate capitalize">
              {app.kind}
              {app.description ? ` · ${app.description}` : ""}
            </p>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
            style={{
              background: connectionDot(state),
              boxShadow:
                state === "connected"
                  ? `0 0 8px ${connectionDot(state)}`
                  : "none",
            }}
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 min-h-[52px]">
          {shown.length > 0 ? (
            shown.map((stat) => (
              <div
                key={stat.key}
                className={cn(
                  "rounded-lg px-3 py-2 bg-[rgba(91,157,255,0.05)] border border-[rgba(91,157,255,0.1)] min-w-0",
                  stale && "opacity-50",
                )}
              >
                <p className="text-[9px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider truncate">
                  {stat.label}
                </p>
                <p className="text-sm font-display font-bold text-[#E8E8FF] metric-value truncate mt-0.5">
                  {formatStatValue(stat.value, stat.unit)}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-[11px] font-mono text-[rgba(232,232,255,0.35)] self-center">
              No live figures reported yet
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-[rgba(91,157,255,0.1)]">
          <div className="min-w-0">
            <StatusPill state={state} />
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] mt-1.5 truncate">
              {heartbeat
                ? `Heartbeat ${timeAgo(heartbeat)}`
                : "No heartbeat yet"}
            </p>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-[rgba(91,157,255,0.8)] group-hover:text-blue-300 flex-shrink-0">
            Open console
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
