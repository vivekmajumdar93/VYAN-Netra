import { EmptyState, SectionHeader } from "@/components/common/Section";
import { useAppStats, useLatestMetrics } from "@/hooks/use-backend";
import { STATS_STALE_MS, formatStatValue, nsToMs, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Activity, Gauge } from "lucide-react";

const TONE_COLORS = {
  good: "#34D399",
  warn: "#F59E0B",
  bad: "#EF4444",
  neutral: "#5B9DFF",
} as const;

function Freshness({ at, label }: { at: number; label: string }) {
  const stale = Date.now() - at > STATS_STALE_MS;
  return (
    <span
      className={cn(
        "text-[10px] font-mono",
        stale ? "text-amber-400" : "text-[rgba(232,232,255,0.35)]",
      )}
    >
      {stale ? "Stale · " : ""}
      {label} {timeAgo(at)}
    </span>
  );
}

export default function LiveStatsPanel({ appId }: { appId: string }) {
  const { data: stats, isLoading } = useAppStats(appId);
  const { data: metrics } = useLatestMetrics(appId);

  const groups = new Map<string, NonNullable<typeof stats>["stats"]>();
  for (const stat of stats?.stats ?? []) {
    const key = stat.group ?? "Live figures";
    groups.set(key, [...(groups.get(key) ?? []), stat]);
  }

  const metricTiles = metrics
    ? [
        { label: "CPU", value: `${Number(metrics.cpu)}%` },
        { label: "Memory", value: `${Number(metrics.memory)}%` },
        { label: "Disk", value: `${Number(metrics.disk)}%` },
        { label: "API latency", value: `${Number(metrics.apiLatency)} ms` },
        { label: "Bridge uptime", value: `${Number(metrics.networkUptime)}%` },
      ]
    : [];
  const metricsAt = metrics ? nsToMs(metrics.timestamp) : 0;

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader
          title="Live figures"
          action={
            stats ? <Freshness at={stats.updatedAt} label="Reported" /> : null
          }
        />
        {isLoading ? null : groups.size === 0 ? (
          <EmptyState
            icon={Activity}
            title="This app hasn't reported any figures yet"
            body="Live figures are measured by the app itself and pushed to Netra every minute. They appear here as soon as it connects and the console kill switch is on."
          />
        ) : (
          <div className="space-y-6">
            {[...groups.entries()].map(([group, items]) => (
              <div key={group}>
                <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-widest mb-2">
                  {group}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((stat) => {
                    const color = TONE_COLORS[stat.tone ?? "neutral"];
                    return (
                      <div
                        key={stat.key}
                        className="glass-card rounded-xl px-4 py-3.5 min-w-0"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <p className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider truncate">
                          {stat.label}
                        </p>
                        <p className="text-xl font-display font-bold text-[#E8E8FF] metric-value mt-1 truncate">
                          {formatStatValue(stat.value, stat.unit)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="System health"
          action={
            metrics ? <Freshness at={metricsAt} label="Measured" /> : null
          }
        />
        {metricTiles.length === 0 ? (
          <EmptyState
            icon={Gauge}
            title="No system measurements yet"
            body="CPU, memory, disk, latency and bridge uptime are measured by the app and pushed with each heartbeat."
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {metricTiles.map((tile) => (
              <div
                key={tile.label}
                className="glass-card rounded-xl px-4 py-3.5"
              >
                <p className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
                  {tile.label}
                </p>
                <p className="text-xl font-display font-bold text-[#E8E8FF] metric-value mt-1">
                  {tile.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
