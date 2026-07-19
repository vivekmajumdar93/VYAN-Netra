import { UpdateStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAllUpdates,
  useApps,
  useCreateUpdate,
  useMarkUpdateDeployed,
  useScheduleUpdate,
} from "@/hooks/use-backend";
import type { UpdateView } from "@/types";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  GitCommitHorizontal,
  HardDrive,
  Plus,
  RefreshCw,
  Rocket,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ─────────────────────────────────────────────────────────────────

type StatusKey = "pending" | "scheduled" | "deployed" | "failed";

function getStatusKey(status: UpdateStatus): StatusKey {
  if (status === UpdateStatus.pending) return "pending";
  if (status === UpdateStatus.scheduled) return "scheduled";
  if (status === UpdateStatus.deployed) return "deployed";
  return "failed";
}

type StatusIconProps = { className?: string; style?: React.CSSProperties };

const STATUS_META: Record<
  StatusKey,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    Icon: (props: StatusIconProps) => React.JSX.Element;
  }
> = {
  pending: {
    label: "Pending",
    bg: "rgba(251,191,36,0.10)",
    text: "#FCD34D",
    border: "rgba(251,191,36,0.28)",
    Icon: (props) => <RefreshCw {...props} />,
  },
  scheduled: {
    label: "Scheduled",
    bg: "rgba(91,157,255,0.10)",
    text: "#7BBDFF",
    border: "rgba(91,157,255,0.28)",
    Icon: (props) => <Calendar {...props} />,
  },
  deployed: {
    label: "Deployed",
    bg: "rgba(52,211,153,0.10)",
    text: "#34D399",
    border: "rgba(52,211,153,0.28)",
    Icon: (props) => <CheckCircle2 {...props} />,
  },
  failed: {
    label: "Failed",
    bg: "rgba(239,68,68,0.10)",
    text: "#F87171",
    border: "rgba(239,68,68,0.28)",
    Icon: (props) => <XCircle {...props} />,
  },
};

function formatBytes(kb: bigint): string {
  const n = Number(kb);
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} GB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} MB`;
  return `${n} KB`;
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── UpdateCard ─────────────────────────────────────────────────────────────

function UpdateCard({
  update,
  index,
  appName,
}: {
  update: UpdateView;
  index: number;
  appName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const deploy = useMarkUpdateDeployed();
  const statusKey = getStatusKey(update.status);
  const meta = STATUS_META[statusKey];
  const StatusIcon = meta.Icon;
  const isDeployable = statusKey === "pending";
  const isMarkable = statusKey === "scheduled";
  const dateToShow =
    update.deployedAt != null
      ? { label: "Deployed", val: update.deployedAt }
      : update.scheduledAt != null
        ? { label: "Scheduled", val: update.scheduledAt }
        : null;

  async function handleDeploy() {
    try {
      await deploy.mutateAsync(update.id);
      toast.success(`v${update.version} deployed successfully`);
    } catch {
      toast.error("Failed to deploy update");
    }
  }

  return (
    <div
      className="rounded-xl p-5 transition-all duration-200"
      style={{
        background: "rgba(8,16,40,0.65)",
        border: "1px solid rgba(91,157,255,0.12)",
        backdropFilter: "blur(14px)",
      }}
      data-ocid={`updates.item.${index}`}
    >
      <div className="flex items-start gap-4">
        {/* Status icon */}
        <div
          className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
        >
          <StatusIcon className="w-4 h-4" style={{ color: meta.text }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(91,157,255,0.10)",
                color: "#7BBDFF",
                border: "1px solid rgba(91,157,255,0.22)",
              }}
            >
              {appName}
            </span>
            <span
              className="font-mono font-bold text-sm"
              style={{ color: "#E8E8FF" }}
            >
              v{update.version}
            </span>
            <span
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(232,232,255,0.05)",
                color: "rgba(232,232,255,0.45)",
                border: "1px solid rgba(232,232,255,0.1)",
              }}
            >
              <HardDrive className="w-2.5 h-2.5" />
              {formatBytes(update.size)}
            </span>
            <span
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: meta.bg,
                color: meta.text,
                border: `1px solid ${meta.border}`,
              }}
            >
              <StatusIcon className="w-2.5 h-2.5" />
              {meta.label}
            </span>
          </div>

          <p
            className={`text-xs leading-relaxed mt-1 ${expanded ? "" : "line-clamp-2"}`}
            style={{ color: "rgba(232,232,255,0.5)" }}
          >
            {update.releaseNotes}
          </p>

          {update.releaseNotes.length > 120 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-[10px] font-mono mt-1.5 transition-colors"
              style={{ color: "rgba(91,157,255,0.7)" }}
              data-ocid={`updates.expand_button.${index}`}
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3 h-3" /> Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" /> Expand notes
                </>
              )}
            </button>
          )}

          {dateToShow && (
            <p
              className="text-[10px] font-mono mt-2"
              style={{ color: "rgba(232,232,255,0.28)" }}
            >
              {dateToShow.label}: {formatDate(dateToShow.val)}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 flex items-center gap-2 pt-0.5">
          {isDeployable && (
            <button
              type="button"
              onClick={handleDeploy}
              disabled={deploy.isPending}
              className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(52,211,153,0.08)",
                color: "#34D399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
              data-ocid={`updates.deploy_button.${index}`}
            >
              <Rocket className="w-3 h-3" />
              Deploy Now
            </button>
          )}
          {isMarkable && (
            <button
              type="button"
              onClick={handleDeploy}
              disabled={deploy.isPending}
              className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(52,211,153,0.08)",
                color: "#34D399",
                border: "1px solid rgba(52,211,153,0.25)",
              }}
              data-ocid={`updates.mark_deployed_button.${index}`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Mark Deployed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function UpdateSkeleton() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "rgba(8,16,40,0.5)",
        border: "1px solid rgba(91,157,255,0.08)",
      }}
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────

type TabId =
  | "pending"
  | "scheduled"
  | "deployed"
  | "failed"
  | "all"
  | "changelog";

const EMPTY_MESSAGES: Record<TabId, { icon: React.ReactNode; msg: string }> = {
  pending: {
    icon: (
      <RefreshCw
        className="w-10 h-10"
        style={{ color: "rgba(251,191,36,0.3)" }}
      />
    ),
    msg: "No pending updates — all systems current",
  },
  scheduled: {
    icon: (
      <Calendar
        className="w-10 h-10"
        style={{ color: "rgba(91,157,255,0.3)" }}
      />
    ),
    msg: "No scheduled updates",
  },
  deployed: {
    icon: (
      <CheckCircle2
        className="w-10 h-10"
        style={{ color: "rgba(52,211,153,0.3)" }}
      />
    ),
    msg: "No deployed updates yet",
  },
  failed: {
    icon: (
      <XCircle className="w-10 h-10" style={{ color: "rgba(239,68,68,0.3)" }} />
    ),
    msg: "No failed updates — great news!",
  },
  all: {
    icon: (
      <RefreshCw
        className="w-10 h-10"
        style={{ color: "rgba(91,157,255,0.3)" }}
      />
    ),
    msg: "No updates found",
  },
  changelog: {
    icon: (
      <GitCommitHorizontal
        className="w-10 h-10"
        style={{ color: "rgba(52,211,153,0.3)" }}
      />
    ),
    msg: "No deployed updates in changelog yet",
  },
};

function EmptyState({ tab }: { tab: TabId }) {
  const { icon, msg } = EMPTY_MESSAGES[tab] ?? EMPTY_MESSAGES.all;
  return (
    <div
      className="rounded-2xl p-16 flex flex-col items-center gap-4"
      style={{
        background: "rgba(8,16,40,0.45)",
        border: "1px solid rgba(91,157,255,0.08)",
      }}
      data-ocid="updates.empty_state"
    >
      {icon}
      <p
        className="text-sm font-mono text-center"
        style={{ color: "rgba(232,232,255,0.35)" }}
      >
        {msg}
      </p>
    </div>
  );
}

// ── Changelog Timeline ───────────────────────────────────────────────────────

function ChangelogTimeline({
  updates,
  apps,
}: {
  updates: UpdateView[];
  apps: Array<{ id: string; name: string }>;
}) {
  const deployed = [...updates]
    .filter((u) => u.status === UpdateStatus.deployed)
    .sort((a, b) => {
      const ta = a.deployedAt ? Number(a.deployedAt) : 0;
      const tb = b.deployedAt ? Number(b.deployedAt) : 0;
      return tb - ta;
    });

  if (!deployed.length) return <EmptyState tab="changelog" />;

  return (
    <div className="relative pl-6">
      <div
        className="absolute left-2 top-2 bottom-2 w-px"
        style={{
          background:
            "linear-gradient(to bottom, rgba(52,211,153,0.4), rgba(52,211,153,0.05))",
        }}
      />
      <div className="space-y-4">
        {deployed.map((u, i) => {
          const pName = apps.find((p) => p.id === u.appId)?.name ?? "Unknown";
          return (
            <div
              key={u.id.toString()}
              className="relative"
              data-ocid={`updates.changelog.item.${i + 1}`}
            >
              <div
                className="absolute -left-[22px] top-3 w-3 h-3 rounded-full"
                style={{
                  background: "#34D399",
                  boxShadow: "0 0 8px rgba(52,211,153,0.5)",
                }}
              />
              <div
                className="rounded-xl p-4"
                style={{
                  background: "rgba(8,16,40,0.65)",
                  border: "1px solid rgba(52,211,153,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(91,157,255,0.10)",
                      color: "#7BBDFF",
                      border: "1px solid rgba(91,157,255,0.22)",
                    }}
                  >
                    {pName}
                  </span>
                  <span
                    className="font-mono font-bold text-sm"
                    style={{ color: "#E8E8FF" }}
                  >
                    v{u.version}
                  </span>
                  {u.deployedAt != null && (
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "rgba(232,232,255,0.3)" }}
                    >
                      {formatDate(u.deployedAt)}
                    </span>
                  )}
                </div>
                <p
                  className="text-xs line-clamp-3"
                  style={{ color: "rgba(232,232,255,0.5)" }}
                >
                  {u.releaseNotes}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Create Update Modal ─────────────────────────────────────────────────────

function CreateUpdateModal({ onClose }: { onClose: () => void }) {
  const { data: apps } = useApps();
  const createUpdate = useCreateUpdate();
  const scheduleUpdate = useScheduleUpdate();
  const [version, setVersion] = useState("1.0.0");
  const [notes, setNotes] = useState("");
  const [sizeKb, setSizeKb] = useState("");
  const [appId, setAppId] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appId) {
      toast.error("Select an app");
      return;
    }
    try {
      const sizeBytes = BigInt(
        Math.round(Number.parseFloat(sizeKb || "0") * 1024),
      );
      const result = await createUpdate.mutateAsync({
        appId,
        version: version.trim(),
        releaseNotes: notes.trim(),
        size: sizeBytes,
      });
      if (scheduleAt && result?.id != null) {
        const scheduledNs = BigInt(new Date(scheduleAt).getTime()) * 1_000_000n;
        await scheduleUpdate.mutateAsync({
          id: result.id,
          scheduledAt: scheduledNs,
        });
      }
      toast.success(
        `Update v${version} created${scheduleAt ? " & scheduled" : ""}`,
      );
      onClose();
    } catch {
      toast.error("Failed to create update");
    }
  }

  const isPending = createUpdate.isPending || scheduleUpdate.isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      data-ocid="updates.dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{
          background: "rgba(6,12,32,0.97)",
          border: "1px solid rgba(91,157,255,0.28)",
          boxShadow:
            "0 0 60px rgba(91,157,255,0.15), 0 0 120px rgba(74,26,107,0.15)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(91,157,255,0.12)",
                border: "1px solid rgba(91,157,255,0.25)",
              }}
            >
              <Rocket className="w-4 h-4" style={{ color: "#7BBDFF" }} />
            </div>
            <h2
              className="text-lg font-display font-bold"
              style={{ color: "#E8E8FF" }}
            >
              Release Update
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="updates.close_button"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "rgba(232,232,255,0.4)" }}
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "rgba(232,232,255,0.45)" }}
            >
              App
            </Label>
            <Select value={appId} onValueChange={setAppId}>
              <SelectTrigger
                data-ocid="updates.app.select"
                className="text-sm"
                style={{
                  background: "rgba(91,157,255,0.06)",
                  border: "1px solid rgba(91,157,255,0.2)",
                  color: "#E8E8FF",
                }}
              >
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent>
                {(apps ?? []).map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: "rgba(232,232,255,0.45)" }}
              >
                Version
              </Label>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                required
                placeholder="1.2.3"
                data-ocid="updates.version.input"
                className="font-mono text-sm"
                style={{
                  background: "rgba(91,157,255,0.06)",
                  border: "1px solid rgba(91,157,255,0.2)",
                  color: "#E8E8FF",
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: "rgba(232,232,255,0.45)" }}
              >
                Size (KB)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={sizeKb}
                onChange={(e) => setSizeKb(e.target.value)}
                required
                placeholder="2457.6"
                data-ocid="updates.size.input"
                className="font-mono text-sm"
                style={{
                  background: "rgba(91,157,255,0.06)",
                  border: "1px solid rgba(91,157,255,0.2)",
                  color: "#E8E8FF",
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              className="text-[10px] font-mono uppercase tracking-widest"
              style={{ color: "rgba(232,232,255,0.45)" }}
            >
              Release Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what changed: new features, bug fixes, improvements…"
              data-ocid="updates.notes.textarea"
              rows={4}
              className="text-sm resize-none"
              style={{
                background: "rgba(91,157,255,0.06)",
                border: "1px solid rgba(91,157,255,0.2)",
                color: "#E8E8FF",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5"
              style={{ color: "rgba(232,232,255,0.45)" }}
            >
              <Calendar className="w-3 h-3" /> Schedule Date (optional)
            </Label>
            <Input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
              data-ocid="updates.schedule.input"
              className="font-mono text-sm"
              style={{
                background: "rgba(91,157,255,0.06)",
                border: "1px solid rgba(91,157,255,0.2)",
                color: "#E8E8FF",
                colorScheme: "dark",
              }}
            />
            <p
              className="text-[10px] font-mono"
              style={{ color: "rgba(232,232,255,0.28)" }}
            >
              Leave empty to create as pending
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="updates.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending}
              data-ocid="updates.submit_button"
            >
              {isPending
                ? "Creating…"
                : scheduleAt
                  ? "Create & Schedule"
                  : "Release Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

type MainTab = "pending" | "scheduled" | "deployed" | "failed" | "all";
type ViewMode = "list" | "changelog";

const MAIN_TABS: { id: MainTab; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "deployed", label: "Deployed" },
  { id: "failed", label: "Failed" },
  { id: "all", label: "All" },
];

export default function UpdatesPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>("pending");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [appFilter, setAppFilter] = useState<string>("all");

  const { data: updates, isLoading: updatesLoading } = useAllUpdates();
  const { data: apps } = useApps();

  const pendingCount =
    updates?.filter((u) => u.status === UpdateStatus.pending).length ?? 0;

  const appMap = new Map<string, string>(
    (apps ?? []).map((p) => [p.id.toString(), p.name]),
  );

  const filtered = (updates ?? []).filter((u) => {
    const matchesApp = appFilter === "all" || u.appId.toString() === appFilter;
    if (!matchesApp) return false;
    if (activeTab === "all") return true;
    return getStatusKey(u.status) === activeTab;
  });

  function tabCount(tab: MainTab): number {
    if (tab === "all")
      return (
        updates?.filter(
          (u) => appFilter === "all" || u.appId.toString() === appFilter,
        ).length ?? 0
      );
    return (
      updates?.filter((u) => {
        const matchP = appFilter === "all" || u.appId.toString() === appFilter;
        const statusKey = getStatusKey(u.status);
        return matchP && statusKey === tab;
      }).length ?? 0
    );
  }

  return (
    <div className="p-6 space-y-5" data-ocid="updates.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1
              className="text-2xl font-display font-bold"
              style={{ color: "#E8E8FF" }}
            >
              Updates
            </h1>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: "rgba(232,232,255,0.35)" }}
            >
              Release pipeline &amp; changelog management
            </p>
          </div>
          {pendingCount > 0 && (
            <span
              className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(251,191,36,0.15)",
                color: "#FCD34D",
                border: "1px solid rgba(251,191,36,0.3)",
              }}
            >
              {pendingCount} pending
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-semibold transition-all"
          style={{
            background:
              "linear-gradient(135deg, rgba(91,157,255,0.2), rgba(74,26,107,0.3))",
            border: "1px solid rgba(91,157,255,0.35)",
            color: "#E8E8FF",
            boxShadow: "0 0 20px rgba(91,157,255,0.1)",
          }}
          data-ocid="updates.add_button"
        >
          <Plus className="w-4 h-4" />
          Release Update
        </button>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View mode toggle */}
        <div
          className="flex rounded-lg p-0.5"
          style={{
            background: "rgba(8,16,40,0.6)",
            border: "1px solid rgba(91,157,255,0.12)",
          }}
        >
          {(["list", "changelog"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono capitalize transition-all"
              style={{
                background:
                  viewMode === mode ? "rgba(91,157,255,0.18)" : "transparent",
                color: viewMode === mode ? "#E8E8FF" : "rgba(232,232,255,0.4)",
                border:
                  viewMode === mode
                    ? "1px solid rgba(91,157,255,0.25)"
                    : "1px solid transparent",
              }}
              data-ocid={`updates.view_${mode}.toggle`}
            >
              {mode === "list" ? (
                <RefreshCw className="w-3 h-3" />
              ) : (
                <GitCommitHorizontal className="w-3 h-3" />
              )}
              {mode === "list" ? "Updates" : "Changelog"}
            </button>
          ))}
        </div>

        {/* Filter tabs (list mode only) */}
        {viewMode === "list" && (
          <div
            className="flex rounded-lg p-0.5 overflow-x-auto"
            style={{
              background: "rgba(8,16,40,0.6)",
              border: "1px solid rgba(91,157,255,0.12)",
            }}
          >
            {MAIN_TABS.map((tab) => {
              const count = tabCount(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap transition-all"
                  style={{
                    background: isActive
                      ? "rgba(91,157,255,0.18)"
                      : "transparent",
                    color: isActive ? "#E8E8FF" : "rgba(232,232,255,0.4)",
                    border: isActive
                      ? "1px solid rgba(91,157,255,0.25)"
                      : "1px solid transparent",
                  }}
                  data-ocid={`updates.filter.${tab.id}.tab`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: isActive
                          ? "rgba(91,157,255,0.3)"
                          : "rgba(91,157,255,0.1)",
                        color: isActive ? "#E8E8FF" : "rgba(232,232,255,0.4)",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* App filter dropdown */}
        <div className="ml-auto">
          <Select value={appFilter} onValueChange={setAppFilter}>
            <SelectTrigger
              className="text-[11px] font-mono h-8 min-w-[140px]"
              style={{
                background: "rgba(8,16,40,0.6)",
                border: "1px solid rgba(91,157,255,0.18)",
                color: "rgba(232,232,255,0.7)",
              }}
              data-ocid="updates.app_filter.select"
            >
              <SelectValue placeholder="All Apps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Apps</SelectItem>
              {(apps ?? []).map((p) => (
                <SelectItem key={p.id.toString()} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      {updatesLoading ? (
        <div className="space-y-3" data-ocid="updates.loading_state">
          {[1, 2, 3].map((i) => (
            <UpdateSkeleton key={i} />
          ))}
        </div>
      ) : viewMode === "changelog" ? (
        <ChangelogTimeline
          updates={updates ?? []}
          apps={(apps ?? []).map((p) => ({ id: p.id, name: p.name }))}
        />
      ) : filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => (
            <UpdateCard
              key={u.id.toString()}
              update={u}
              index={i + 1}
              appName={appMap.get(u.appId.toString()) ?? "Unknown"}
            />
          ))}
        </div>
      )}

      {showModal && <CreateUpdateModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
