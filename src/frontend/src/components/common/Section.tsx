import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "text-[11px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-widest",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function SectionHeader({
  title,
  action,
}: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <SectionLabel>{title}</SectionLabel>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-card rounded-xl px-6 py-12 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(91,157,255,0.08)] border border-[rgba(91,157,255,0.16)]">
        <Icon className="w-5 h-5 text-[rgba(91,157,255,0.7)]" />
      </div>
      <p className="text-sm font-body font-semibold text-[#E8E8FF]">{title}</p>
      {body && (
        <p className="text-xs font-mono text-[rgba(232,232,255,0.45)] max-w-md leading-relaxed">
          {body}
        </p>
      )}
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  color = "#5B9DFF",
  loading = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  color?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl px-4 py-3.5 min-w-0">
        <p className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider truncate">
          {label}
        </p>
        <Skeleton className="h-6 w-14 mt-1.5" />
        <Skeleton className="h-3 w-20 mt-2" />
      </div>
    );
  }
  return (
    <div
      className="glass-card rounded-xl px-4 py-3.5 min-w-0"
      style={{ boxShadow: `0 0 20px ${color}10`, borderColor: `${color}26` }}
    >
      <p className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider truncate">
        {label}
      </p>
      <p
        className="text-xl font-display font-bold mt-1 leading-none metric-value truncate"
        style={{ color: "#E8E8FF" }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[10px] font-mono mt-1.5 truncate" style={{ color }}>
          {sub}
        </p>
      )}
    </div>
  );
}
