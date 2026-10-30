import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, RadioTower, WifiOff } from "lucide-react";

export type ConnectionState =
  | "connected"
  | "disconnected"
  | "refused"
  | "pending";

const CONFIG: Record<
  ConnectionState,
  { label: string; icon: React.ReactNode; className: string; dot: string }
> = {
  connected: {
    label: "Connected",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "#34D399",
  },
  disconnected: {
    label: "Disconnected",
    icon: <WifiOff className="w-3 h-3" />,
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dot: "#F59E0B",
  },
  refused: {
    label: "Refused",
    icon: <AlertCircle className="w-3 h-3" />,
    className: "bg-red-500/10 text-red-400 border-red-500/30",
    dot: "#EF4444",
  },
  pending: {
    label: "Awaiting connection",
    icon: <RadioTower className="w-3 h-3" />,
    className:
      "bg-[rgba(91,157,255,0.1)] text-[rgba(232,232,255,0.6)] border-[rgba(91,157,255,0.2)]",
    dot: "#6B7280",
  },
};

export function connectionDot(state: ConnectionState): string {
  return CONFIG[state].dot;
}

export default function StatusPill({
  state,
  className,
}: { state: ConnectionState; className?: string }) {
  const cfg = CONFIG[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap",
        cfg.className,
        className,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
