// Timestamps from the backend adapter arrive as nanosecond bigints; plain
// JSON domains (stats, commands, errors) use milliseconds.
export function nsToMs(ns: bigint): number {
  return Number(ns / 1_000_000n);
}

export function timeAgo(ms: number, now: number = Date.now()): string {
  const diff = Math.max(0, now - ms);
  if (diff < 5_000) return "just now";
  if (diff < 60_000) return `${Math.floor(diff / 1_000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const NUMBER_FORMAT = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

export function formatStatValue(
  value: number | string | boolean,
  unit?: string,
): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return unit ? `${value} ${unit}` : value;
  const text = NUMBER_FORMAT.format(value);
  if (!unit) return text;
  return unit === "%" ? `${text}%` : `${text} ${unit}`;
}

// A figure is stale once the app has missed several reporting intervals.
export const STATS_STALE_MS = 3 * 60 * 1000;
