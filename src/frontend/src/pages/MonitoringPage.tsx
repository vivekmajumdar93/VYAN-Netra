import type { SystemMetrics } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useActiveAlerts,
  useAlertHistory,
  useApps,
  useLatestMetrics,
  useMetricsHistory,
  useResolveAlert,
  useSubmitMetrics,
} from "@/hooks/use-backend";
import type { AlertView, AppView } from "@/types";
import { MetricSeverity } from "@/types";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FlaskConical,
  Info,
  RefreshCw,
  ServerCrash,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────
function formatTs(ts: bigint): string {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleTimeString();
  } catch {
    return "--";
  }
}

type SevKey =
  | MetricSeverity.critical
  | MetricSeverity.warning
  | MetricSeverity.info;

function severityColor(sev: SevKey): {
  ring: string;
  bg: string;
  text: string;
  border: string;
} {
  if (sev === MetricSeverity.critical)
    return {
      ring: "#EF4444",
      bg: "rgba(239,68,68,0.08)",
      text: "#EF4444",
      border: "rgba(239,68,68,0.25)",
    };
  if (sev === MetricSeverity.warning)
    return {
      ring: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      text: "#F59E0B",
      border: "rgba(245,158,11,0.25)",
    };
  return {
    ring: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    text: "#60A5FA",
    border: "rgba(59,130,246,0.2)",
  };
}

function getSev(rawSev: unknown): SevKey {
  const s = String(rawSev).toLowerCase();
  if (s.includes("critical")) return MetricSeverity.critical;
  if (s.includes("warning")) return MetricSeverity.warning;
  return MetricSeverity.info;
}

function metricColor(pct: number): string {
  if (pct > 80) return "#EF4444";
  if (pct > 60) return "#F59E0B";
  return "#34D399";
}

// ── Circular Ring ──────────────────────────────────────────────────────────
const R = 28;
const CIRC = 2 * Math.PI * R;

function CircularRing({
  label,
  value,
  pct,
}: { label: string; value: string; pct: number }) {
  const color = metricColor(pct);
  const dash = (pct / 100) * CIRC;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="rgba(91,157,255,0.1)"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeDashoffset={CIRC / 4}
            style={{
              transition: "stroke-dasharray 0.8s ease",
              filter: `drop-shadow(0 0 4px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-mono font-bold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ── Sparkline ───────────────────────────────────────────────────────────────
type SparkField = keyof Pick<
  SystemMetrics,
  "cpu" | "memory" | "disk" | "apiLatency" | "networkUptime"
>;

function Sparkline({
  data,
  field,
  color,
}: { data: SystemMetrics[]; field: SparkField; color: string }) {
  if (!data || data.length < 2)
    return (
      <div className="h-8 flex items-center">
        <span className="text-[9px] font-mono text-[rgba(232,232,255,0.2)]">
          No history
        </span>
      </div>
    );

  const pts = data.slice(-24).map((m) => Number(m[field]));
  const max = Math.max(...pts, 1);
  const W = 120;
  const H = 32;
  const step = W / (pts.length - 1);
  const path = pts
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(H - (v / max) * H).toFixed(1)}`,
    )
    .join(" ");
  const area = `${path} L ${((pts.length - 1) * step).toFixed(1)} ${H} L 0 ${H} Z`;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`spark-grad-${field}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-grad-${field})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Submit Metrics Modal ────────────────────────────────────────────────────
type FormState = {
  cpu: string;
  memory: string;
  disk: string;
  apiLatency: string;
  networkUptime: string;
  connectionStatus: string;
};

const DEFAULT_FORM: FormState = {
  cpu: "45",
  memory: "62",
  disk: "38",
  apiLatency: "120",
  networkUptime: "99",
  connectionStatus: "online",
};

function SubmitMetricsModal({
  app,
  open,
  onClose,
}: { app: AppView; open: boolean; onClose: () => void }) {
  const submit = useSubmitMetrics();
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);

  function set(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit.mutate(
      {
        appId: app.id,
        cpu: BigInt(form.cpu || "0"),
        memory: BigInt(form.memory || "0"),
        disk: BigInt(form.disk || "0"),
        apiLatency: BigInt(form.apiLatency || "0"),
        networkUptime: BigInt(form.networkUptime || "0"),
        connectionStatus: form.connectionStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Metrics submitted for ${app.name}`);
          onClose();
        },
        onError: () => toast.error("Failed to submit metrics"),
      },
    );
  }

  const numFields: Array<{
    key: keyof FormState;
    label: string;
    placeholder: string;
  }> = [
    { key: "cpu", label: "CPU %", placeholder: "0-100" },
    { key: "memory", label: "Memory %", placeholder: "0-100" },
    { key: "disk", label: "Disk %", placeholder: "0-100" },
    { key: "apiLatency", label: "API Latency ms", placeholder: "e.g. 120" },
    { key: "networkUptime", label: "Network Uptime %", placeholder: "0-100" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md"
        style={{
          background: "rgba(8,14,35,0.96)",
          border: "1px solid rgba(91,157,255,0.2)",
          backdropFilter: "blur(20px)",
        }}
        data-ocid="monitoring.submit_metrics.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-sm font-display font-semibold text-[#E8E8FF]">
            Submit Test Metrics — {app.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {numFields.map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1">
                <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider">
                  {label}
                </Label>
                <Input
                  type="text"
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  className="h-8 text-xs font-mono bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]"
                  data-ocid={`monitoring.submit_metrics.${key}.input`}
                />
              </div>
            ))}
            <div className="space-y-1">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider">
                Connection Status
              </Label>
              <Input
                type="text"
                value={form.connectionStatus}
                onChange={(e) => set("connectionStatus", e.target.value)}
                placeholder="online / degraded / offline"
                className="h-8 text-xs font-mono bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]"
                data-ocid="monitoring.submit_metrics.connectionStatus.input"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={submit.isPending}
              className="flex-1 h-8 text-xs font-mono"
              data-ocid="monitoring.submit_metrics.submit_button"
            >
              {submit.isPending ? "Submitting…" : "Submit Metrics"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 text-xs font-mono border-[rgba(91,157,255,0.2)] text-[rgba(232,232,255,0.6)]"
              data-ocid="monitoring.submit_metrics.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Alert Row ──────────────────────────────────────────────────────────────
function XCircleIcon({
  className,
  style,
}: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      role="img"
      aria-label="Error indicator"
    >
      <title>Error indicator</title>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function AlertRow({
  alert,
  index,
  onResolve,
  resolving,
}: {
  alert: AlertView;
  index: number;
  onResolve: (id: bigint) => void;
  resolving: boolean;
}) {
  const sev = getSev(alert.severity);
  const col = severityColor(sev);
  const SevIcon =
    sev === MetricSeverity.critical
      ? XCircleIcon
      : sev === MetricSeverity.warning
        ? AlertTriangle
        : Info;
  const sevLabel = String(alert.severity).replace(/[{}']/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-xl p-3"
      style={{
        background: col.bg,
        border: `1px solid ${col.border}`,
        backdropFilter: "blur(8px)",
      }}
      data-ocid={`monitoring.alert.item.${index}`}
    >
      <SevIcon className="w-4 h-4 flex-shrink-0" style={{ color: col.text }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body font-medium text-[#E8E8FF] truncate">
          {alert.metricType}
        </p>
        <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5">
          {alert.appId} · {formatTs(alert.timestamp)}
        </p>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0">
        <span
          className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
          style={{
            background: col.bg,
            color: col.text,
            border: `1px solid ${col.border}`,
          }}
        >
          {sevLabel}
        </span>
        <p className="text-[9px] font-mono text-[rgba(232,232,255,0.35)]">
          {alert.value.toString()} / {alert.threshold.toString()}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onResolve(alert.id)}
        disabled={resolving}
        className="flex-shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50"
        style={{
          background: "rgba(52,211,153,0.1)",
          color: "#34D399",
          border: "1px solid rgba(52,211,153,0.25)",
        }}
        data-ocid={`monitoring.resolve.button.${index}`}
      >
        Resolve
      </button>
    </motion.div>
  );
}

// ── App Metric Card ────────────────────────────────────────────────────
function AppMetricCard({ app, index }: { app: AppView; index: number }) {
  const { data: metrics } = useLatestMetrics(app.id);
  const { data: history } = useMetricsHistory(app.id);
  const { data: alertHist } = useAlertHistory(app.id);
  const [submitOpen, setSubmitOpen] = useState(false);

  const cpu = metrics ? Math.min(100, Number(metrics.cpu)) : 0;
  const mem = metrics ? Math.min(100, Number(metrics.memory)) : 0;
  const disk = metrics ? Math.min(100, Number(metrics.disk)) : 0;
  const latPct = metrics ? Math.min(100, Number(metrics.apiLatency) / 10) : 0;
  const uptime = metrics ? Math.min(100, Number(metrics.networkUptime)) : 0;

  const isOnline = !!metrics?.connectionStatus
    ?.toLowerCase()
    .includes("online");
  const isDegraded = !!metrics?.connectionStatus
    ?.toLowerCase()
    .includes("degraded");
  const connColor = isOnline ? "#34D399" : isDegraded ? "#F59E0B" : "#EF4444";
  const connBg = isOnline
    ? "rgba(52,211,153,0.1)"
    : isDegraded
      ? "rgba(245,158,11,0.1)"
      : "rgba(239,68,68,0.1)";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="rounded-xl p-5 space-y-4"
        style={{
          background: "rgba(10,20,45,0.6)",
          border: "1px solid rgba(91,157,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
        data-ocid={`monitoring.app.item.${index}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate">
              {app.name}
            </h3>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] mt-0.5">
              code: {app.appCode}
            </p>
          </div>
          {metrics && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: connBg,
                color: connColor,
                border: `1px solid ${connColor}40`,
              }}
            >
              {metrics.connectionStatus}
            </span>
          )}
        </div>

        {/* Circular Rings */}
        {metrics ? (
          <>
            <div className="grid grid-cols-3 gap-2 py-1">
              <CircularRing label="CPU" value={`${cpu}%`} pct={cpu} />
              <CircularRing label="Memory" value={`${mem}%`} pct={mem} />
              <CircularRing label="Disk" value={`${disk}%`} pct={disk} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CircularRing
                label="Latency"
                value={`${metrics.apiLatency}ms`}
                pct={latPct}
              />
              <CircularRing label="Uptime" value={`${uptime}%`} pct={uptime} />
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `${connColor}18`,
                    border: `2px solid ${connColor}50`,
                  }}
                >
                  <Activity className="w-5 h-5" style={{ color: connColor }} />
                </div>
                <span className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider">
                  Status
                </span>
              </div>
            </div>

            {/* Sparklines */}
            {history && history.length >= 2 && (
              <div
                className="rounded-lg p-3 space-y-2"
                style={{
                  background: "rgba(91,157,255,0.04)",
                  border: "1px solid rgba(91,157,255,0.08)",
                }}
              >
                <p className="text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider mb-2">
                  Last 24 readings
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      field: "cpu" as SparkField,
                      label: "CPU",
                      color: "#5B9DFF",
                    },
                    {
                      field: "memory" as SparkField,
                      label: "Memory",
                      color: "#A855F7",
                    },
                    {
                      field: "disk" as SparkField,
                      label: "Disk",
                      color: "#F59E0B",
                    },
                    {
                      field: "networkUptime" as SparkField,
                      label: "Uptime",
                      color: "#34D399",
                    },
                  ].map(({ field, label, color }) => (
                    <div key={field}>
                      <p
                        className="text-[8px] font-mono mb-1"
                        style={{ color: `${color}B0` }}
                      >
                        {label}
                      </p>
                      <Sparkline data={history} field={field} color={color} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent resolved alerts */}
            {alertHist && alertHist.length > 0 && (
              <div className="space-y-1">
                <p className="text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider">
                  Recent resolved ({alertHist.length})
                </p>
                {alertHist.slice(0, 2).map((a) => (
                  <div
                    key={a.id.toString()}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5"
                    style={{
                      background: "rgba(52,211,153,0.05)",
                      border: "1px solid rgba(52,211,153,0.1)",
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] flex-1 truncate">
                      {a.metricType}
                    </span>
                    <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)]">
                      {formatTs(a.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="text-xs font-mono text-[rgba(232,232,255,0.3)]">
              No metrics submitted yet
            </p>
          </div>
        )}

        {/* Submit Test Metrics */}
        <button
          type="button"
          onClick={() => setSubmitOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg h-8 text-[10px] font-mono transition-all hover:opacity-80"
          style={{
            background: "rgba(91,157,255,0.08)",
            border: "1px solid rgba(91,157,255,0.18)",
            color: "rgba(91,157,255,0.8)",
          }}
          data-ocid={`monitoring.submit_metrics.open_modal_button.${index}`}
        >
          <FlaskConical className="w-3 h-3" />
          Submit Test Metrics
        </button>
      </motion.div>

      <SubmitMetricsModal
        app={app}
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
      />
    </>
  );
}

// ── Alert History Panel ────────────────────────────────────────────────────
function AppAlertHistoryRows({ app }: { app: AppView }) {
  const { data: hist } = useAlertHistory(app.id);
  if (!hist?.length) return null;
  return (
    <>
      {hist.slice(0, 5).map((a, i) => {
        const sev = getSev(a.severity);
        const col = severityColor(sev);
        const sevLabel = String(a.severity).replace(/[{}']/g, "");
        return (
          <div
            key={a.id.toString()}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 px-4 py-2.5 border-b border-[rgba(91,157,255,0.05)] last:border-0 hover:bg-[rgba(91,157,255,0.03)] transition-colors"
            data-ocid={`monitoring.alert_history.item.${i + 1}`}
          >
            <div className="min-w-0">
              <p className="text-xs font-mono text-[#E8E8FF] truncate">
                {a.metricType}
              </p>
              <p className="text-[9px] font-mono text-[rgba(232,232,255,0.3)] truncate">
                {app.name}
              </p>
            </div>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-full h-fit self-center w-fit"
              style={{
                background: col.bg,
                color: col.text,
                border: `1px solid ${col.border}`,
              }}
            >
              {sevLabel}
            </span>
            <span className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] self-center">
              {a.value.toString()}
            </span>
            <span className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] self-center">
              {formatTs(a.timestamp)}
            </span>
          </div>
        );
      })}
    </>
  );
}

function AlertHistorySection({ apps }: { apps: AppView[] }) {
  return (
    <section data-ocid="monitoring.alert_history.section">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4" style={{ color: "rgba(91,157,255,0.7)" }} />
        <h2 className="text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest">
          Alert History
        </h2>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(10,20,45,0.5)",
          border: "1px solid rgba(91,157,255,0.1)",
        }}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 px-4 py-2 border-b border-[rgba(91,157,255,0.08)]">
          {["Metric / App", "Severity", "Value", "Time"].map((h) => (
            <span
              key={h}
              className="text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider"
            >
              {h}
            </span>
          ))}
        </div>
        {apps.map((p) => (
          <AppAlertHistoryRows key={p.id.toString()} app={p} />
        ))}
        <div
          className="px-4 py-3 text-center"
          data-ocid="monitoring.alert_history.empty_state"
        >
          <p className="text-[10px] font-mono text-[rgba(232,232,255,0.25)]">
            No resolved alerts yet
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function MonitoringPage() {
  const { data: apps, isLoading, refetch: refetchApps } = useApps();
  const { data: alerts, refetch: refetchAlerts } = useActiveAlerts();
  const resolve = useResolveAlert();

  const criticalCount =
    alerts?.filter((a) => getSev(a.severity) === MetricSeverity.critical)
      .length ?? 0;
  const warningCount =
    alerts?.filter((a) => getSev(a.severity) === MetricSeverity.warning)
      .length ?? 0;

  const overallStatus =
    criticalCount > 0 ? "critical" : warningCount > 0 ? "warning" : "nominal";

  type StatusKey = "critical" | "warning" | "nominal";
  const statusConfig: Record<
    StatusKey,
    {
      label: string;
      color: string;
      bg: string;
      border: string;
      Icon: React.ElementType;
    }
  > = {
    critical: {
      label: "Critical",
      color: "#EF4444",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.3)",
      Icon: ServerCrash,
    },
    warning: {
      label: "Warning",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.3)",
      Icon: AlertTriangle,
    },
    nominal: {
      label: "All Systems Good",
      color: "#34D399",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.25)",
      Icon: ShieldCheck,
    },
  };
  const sc = statusConfig[overallStatus];

  const sortedAlerts = alerts
    ? [...alerts].sort((a, b) => {
        const rank = (sev: unknown) => {
          const k = getSev(sev);
          return k === MetricSeverity.critical
            ? 0
            : k === MetricSeverity.warning
              ? 1
              : 2;
        };
        return rank(a.severity) - rank(b.severity);
      })
    : [];

  function handleRefresh() {
    refetchApps();
    refetchAlerts();
    toast.success("Refreshing system data…");
  }

  function handleResolve(id: bigint) {
    resolve.mutate(id, {
      onSuccess: () => toast.success("Alert resolved"),
      onError: () => toast.error("Failed to resolve alert"),
    });
  }

  return (
    <div className="p-6 space-y-8" data-ocid="monitoring.page">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(91,157,255,0.12)",
              border: "1px solid rgba(91,157,255,0.2)",
            }}
          >
            <Activity className="w-4 h-4" style={{ color: "#5B9DFF" }} />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-[#E8E8FF]">
              System Monitor
            </h1>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)]">
              Real-time infrastructure oversight
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full"
            style={{
              background: sc.bg,
              color: sc.color,
              border: `1px solid ${sc.border}`,
            }}
            data-ocid="monitoring.overall_status.badge"
          >
            <sc.Icon className="w-3.5 h-3.5" />
            {sc.label}
            {(alerts?.length ?? 0) > 0 && (
              <span
                className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${sc.color}25`, color: sc.color }}
              >
                {alerts!.length}
              </span>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 gap-1.5 text-xs font-mono border-[rgba(91,157,255,0.2)] text-[rgba(232,232,255,0.7)] hover:text-[#E8E8FF]"
            data-ocid="monitoring.refresh.button"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Alerts Panel */}
      <section data-ocid="monitoring.alerts.section">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest">
            Active Alerts
          </h2>
          {sortedAlerts.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.15)] text-red-400 border border-[rgba(239,68,68,0.25)]">
              {sortedAlerts.length}
            </span>
          )}
        </div>
        {sortedAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-6 flex items-center gap-3"
            style={{
              background: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.15)",
            }}
            data-ocid="monitoring.alerts.empty_state"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-mono font-medium text-emerald-300">
                All systems nominal
              </p>
              <p className="text-[11px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5">
                No active alerts at this time
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {sortedAlerts.map((a, i) => (
              <AlertRow
                key={a.id.toString()}
                alert={a}
                index={i + 1}
                onResolve={handleResolve}
                resolving={resolve.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {/* Per-App Metrics Grid */}
      <section data-ocid="monitoring.metrics.section">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4" style={{ color: "#5B9DFF" }} />
          <h2 className="text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest">
            App Metrics
          </h2>
          {apps?.length ? (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(91,157,255,0.1)] text-blue-400 border border-[rgba(91,157,255,0.2)]">
              {apps.length} connected
            </span>
          ) : null}
        </div>
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl h-72 animate-pulse"
                style={{
                  background: "rgba(91,157,255,0.06)",
                  border: "1px solid rgba(91,157,255,0.1)",
                }}
                data-ocid={`monitoring.loading_state.${i}`}
              />
            ))}
          </div>
        ) : !apps?.length ? (
          <div
            className="rounded-xl p-12 flex flex-col items-center gap-4"
            style={{
              background: "rgba(10,20,45,0.5)",
              border: "1px solid rgba(91,157,255,0.1)",
            }}
            data-ocid="monitoring.metrics.empty_state"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(91,157,255,0.08)",
                border: "1px solid rgba(91,157,255,0.15)",
              }}
            >
              <Activity
                className="w-7 h-7"
                style={{ color: "rgba(91,157,255,0.4)" }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-display font-medium text-[rgba(232,232,255,0.5)]">
                No apps registered
              </p>
              <p className="text-xs font-mono text-[rgba(232,232,255,0.3)] mt-1">
                Register an app to start monitoring
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((p, i) => (
              <AppMetricCard key={p.id.toString()} app={p} index={i + 1} />
            ))}
          </div>
        )}
      </section>

      {/* Alert History Panel */}
      {apps && apps.length > 0 && <AlertHistorySection apps={apps} />}
    </div>
  );
}
