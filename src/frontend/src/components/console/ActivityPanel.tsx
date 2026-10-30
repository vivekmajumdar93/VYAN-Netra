import type { CommandStatus, ErrorSeverity } from "@/backend";
import { EmptyState, SectionHeader } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import {
  useAppErrors,
  useCancelCommand,
  useCommandHistory,
} from "@/hooks/use-backend";
import { formatDateTime, timeAgo } from "@/lib/format";
import { AlertCircle, AlertTriangle, History, Info, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLE: Record<CommandStatus, { label: string; color: string }> = {
  pending: { label: "Waiting for app", color: "#60A5FA" },
  acknowledged: { label: "Done", color: "#34D399" },
  failed: { label: "Failed", color: "#EF4444" },
  expired: { label: "Expired", color: "#F59E0B" },
  cancelled: { label: "Cancelled", color: "#9CA3AF" },
};

const SEVERITY_ICON: Record<
  ErrorSeverity,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  critical: { icon: AlertCircle, color: "#EF4444" },
  warning: { icon: AlertTriangle, color: "#F59E0B" },
  info: { icon: Info, color: "#60A5FA" },
};

export default function ActivityPanel({ appId }: { appId: string }) {
  const { data: commands } = useCommandHistory(appId);
  const { data: errors } = useAppErrors(appId);
  const cancel = useCancelCommand();

  async function onCancel(id: number) {
    try {
      await cancel.mutateAsync({ id, appId });
      toast.success("Command cancelled");
    } catch {
      toast.error("Could not cancel — the app may already have it");
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section data-ocid="activity.commands">
        <SectionHeader title="Commands" />
        {!commands || commands.length === 0 ? (
          <EmptyState
            icon={History}
            title="No commands issued"
            body="Anything you run from Controls is listed here with exactly what the app reported back."
          />
        ) : (
          <div className="glass-card rounded-xl divide-y divide-[rgba(91,157,255,0.1)]">
            {commands.map((cmd) => {
              const style = STATUS_STYLE[cmd.status];
              const params = Object.entries(cmd.params);
              return (
                <div key={cmd.id} className="px-4 py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-body font-semibold text-[#E8E8FF] truncate">
                      {cmd.label}
                    </p>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0"
                      style={{
                        color: style.color,
                        borderColor: `${style.color}40`,
                        background: `${style.color}14`,
                      }}
                    >
                      {style.label}
                    </span>
                  </div>
                  {params.length > 0 ? (
                    <p className="text-[11px] font-mono text-[rgba(232,232,255,0.45)] truncate">
                      {params.map(([k, v]) => `${k}: ${String(v)}`).join(" · ")}
                    </p>
                  ) : null}
                  {cmd.result ? (
                    <p
                      className="text-[11px] font-mono leading-relaxed"
                      style={{
                        color:
                          cmd.status === "failed" || cmd.status === "expired"
                            ? style.color
                            : "rgba(232,232,255,0.6)",
                      }}
                    >
                      {cmd.result}
                    </p>
                  ) : null}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)]">
                      Issued {formatDateTime(cmd.issuedAt)}
                      {cmd.status === "pending"
                        ? ` · expires ${new Date(cmd.expiresAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                        : ""}
                    </p>
                    {cmd.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCancel(cmd.id)}
                        disabled={cancel.isPending}
                        className="h-6 px-2 text-[10px] font-mono text-[rgba(232,232,255,0.5)] hover:text-red-300"
                      >
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section data-ocid="activity.errors">
        <SectionHeader title="Errors reported by the app" />
        {!errors || errors.length === 0 ? (
          <EmptyState
            icon={AlertCircle}
            title="No errors reported"
            body="When the app hits a failure it tells Netra, and it is listed here with its source and time."
          />
        ) : (
          <div className="glass-card rounded-xl divide-y divide-[rgba(91,157,255,0.1)]">
            {errors.map((err) => {
              const { icon: Icon, color } = SEVERITY_ICON[err.severity];
              return (
                <div
                  key={err.id}
                  className="flex items-start gap-3 px-4 py-3.5"
                >
                  <Icon
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider">
                      {err.source}
                    </p>
                    <p className="text-sm font-body text-[#E8E8FF] mt-0.5 break-words">
                      {err.message}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] flex-shrink-0">
                    {timeAgo(err.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
