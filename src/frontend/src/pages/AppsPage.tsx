import { AppStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppRegistryContext } from "@/context/app-context";
import {
  type AppViewUI,
  useApps,
  useCreateApp,
  useRegenerateAppCode,
  useRemoveApp,
  useRenameApp,
  useSetAppBaseUrl,
  useSetAppManualStatus,
} from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  Link2,
  Loader2,
  Pencil,
  Plus,
  RadioTower,
  RefreshCw,
  Trash2,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ── Live browser health check (Netra -> app's own /health, GET, X-App-Code header) ──
async function checkHealth(
  baseUrl: string,
  appCode: string,
): Promise<"connected" | "disconnected" | "refused"> {
  const url = `${baseUrl.replace(/\/$/, "")}/health`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", "X-App-Code": appCode },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 401 || res.status === 403) return "refused";
    return res.ok ? "connected" : "disconnected";
  } catch {
    return "disconnected";
  }
}

// ── Status badge ─────────────────────────────────────────────────────────────
type StatusType = "connected" | "disconnected" | "refused" | "pending";

function StatusBadge({ status }: { status: StatusType }) {
  const configs: Record<
    StatusType,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    connected: {
      label: "Connected",
      icon: <CheckCircle2 className="w-3 h-3" />,
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.25)]",
    },
    disconnected: {
      label: "Disconnected",
      icon: <WifiOff className="w-3 h-3" />,
      className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    refused: {
      label: "Refused",
      icon: <AlertCircle className="w-3 h-3 animate-pulse" />,
      className:
        "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse",
    },
    pending: {
      label: "Awaiting connection",
      icon: <RadioTower className="w-3 h-3" />,
      className:
        "bg-[rgba(91,157,255,0.1)] text-[rgba(232,232,255,0.55)] border-[rgba(91,157,255,0.2)]",
    },
  };
  const cfg = configs[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border whitespace-nowrap",
        cfg.className,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Register form: name only, code is server-generated ──────────────────────
function RegisterForm({ onCreated }: { onCreated: (app: AppViewUI) => void }) {
  const [name, setName] = useState("");
  const create = useCreateApp();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const app = await create.mutateAsync(name.trim());
      setName("");
      onCreated(app);
    } catch {
      toast.error("Failed to register app");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl p-5"
      style={{
        background: "rgba(10,20,45,0.7)",
        border: "1px solid rgba(91,157,255,0.18)",
        backdropFilter: "blur(14px)",
      }}
      data-ocid="apps.register.card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-4 h-4 text-blue-400" />
        <h2 className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest">
          Register New App
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 space-y-1.5">
          <Label
            htmlFor="app-name"
            className="text-xs font-mono text-[rgba(232,232,255,0.5)]"
          >
            App Name
          </Label>
          <Input
            id="app-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. VYAN Ṛtam"
            required
            data-ocid="apps.name.input"
            className="bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
        <Button
          type="submit"
          disabled={create.isPending}
          data-ocid="apps.register.submit_button"
          className="h-10 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-mono text-sm tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(91,157,255,0.25)]"
        >
          {create.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" /> Generate Pairing Code
            </>
          )}
        </Button>
      </form>
      <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] mt-3">
        VYAN Netra generates the 6-character App Code — you embed it in the new
        app's own code to complete the connection. No code is ever typed in by
        hand.
      </p>
    </motion.div>
  );
}

// ── Just-created code reveal (shown once) ────────────────────────────────────
function NewAppCodeBanner({
  app,
  onDismiss,
}: { app: AppViewUI; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(app.appCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl p-5 mb-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(11,46,92,0.3))",
        border: "1px solid rgba(52,211,153,0.3)",
      }}
      data-ocid="apps.new_code.banner"
    >
      <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest mb-2">
        "{app.name}" registered — copy this code now
      </p>
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xl tracking-[0.3em] text-white">
          {app.appCode}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyCode}
          className="h-8 text-emerald-300 hover:bg-emerald-500/10"
          data-ocid="apps.new_code.copy_button"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDismiss}
          className="h-8 ml-auto text-[rgba(232,232,255,0.4)]"
        >
          Done
        </Button>
      </div>
      <p className="text-[11px] font-mono text-[rgba(232,232,255,0.5)] mt-2 leading-relaxed">
        Embed this as <code className="text-emerald-300">VYAN_APP_CODE</code> in
        the new app's config, then set its Base URL below once deployed. The app
        shows "Awaiting connection" until it calls in.
      </p>
    </motion.div>
  );
}

// ── App card ─────────────────────────────────────────────────────────────────
function AppCard({ app, index }: { app: AppViewUI; index: number }) {
  const {
    connectionStatusMap,
    setConnectionStatus,
    selectedApp,
    setSelectedApp,
  } = useAppRegistryContext();
  const setManualStatus = useSetAppManualStatus();
  const setBaseUrl = useSetAppBaseUrl();
  const renameApp = useRenameApp();
  const regenerateCode = useRegenerateAppCode();
  const removeApp = useRemoveApp();
  const testDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTestRef = useRef<number>(0);
  const [isTesting, setIsTesting] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(app.baseUrl ?? "");
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(app.name);

  const isActive = selectedApp?.id === app.id;
  const observed = connectionStatusMap[app.id];
  const derivedStatus: StatusType =
    app.status === AppStatus.pending && !observed
      ? "pending"
      : (observed ?? (app.status as StatusType));

  const handleTestConnection = useCallback(() => {
    const now = Date.now();
    if (isTesting || now - lastTestRef.current < 2000 || !app.baseUrl) return;
    if (testDebounceRef.current) clearTimeout(testDebounceRef.current);
    testDebounceRef.current = setTimeout(async () => {
      lastTestRef.current = Date.now();
      setIsTesting(true);
      const result = await checkHealth(app.baseUrl as string, app.appCode);
      setConnectionStatus(app.id, result);
      try {
        await setManualStatus.mutateAsync({
          id: app.id,
          status:
            result === "connected"
              ? AppStatus.connected
              : AppStatus.disconnected,
        });
      } catch {
        // best-effort — the client-side badge already reflects the result
      }
      if (result === "connected") toast.success(`${app.name} is reachable`);
      else if (result === "refused")
        toast.error("Connection Refused: Invalid App Code");
      else toast.warning(`${app.name} is unreachable`);
      setIsTesting(false);
    }, 50);
  }, [app, isTesting, setConnectionStatus, setManualStatus]);

  async function handleSaveUrl() {
    if (!urlDraft.trim()) return;
    try {
      await setBaseUrl.mutateAsync({ id: app.id, baseUrl: urlDraft.trim() });
      setEditingUrl(false);
      toast.success("Base URL saved");
    } catch {
      toast.error("Failed to save Base URL");
    }
  }

  async function handleSaveName() {
    if (!nameDraft.trim()) return;
    try {
      await renameApp.mutateAsync({ id: app.id, name: nameDraft.trim() });
      setRenaming(false);
    } catch {
      toast.error("Failed to rename app");
    }
  }

  async function handleRegenerateCode() {
    if (
      !confirm(
        `Regenerate ${app.name}'s App Code? The old code stops working immediately — you'll need to re-embed the new one.`,
      )
    )
      return;
    try {
      await regenerateCode.mutateAsync(app.id);
      toast.success("App Code regenerated — copy and re-embed it");
    } catch {
      toast.error("Failed to regenerate code");
    }
  }

  async function handleRemove() {
    if (!confirm(`Remove "${app.name}" from VYAN Netra?`)) return;
    try {
      await removeApp.mutateAsync(app.id);
      toast.success(`${app.name} removed`);
    } catch {
      toast.error("Failed to remove app");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "rounded-xl p-5 transition-all duration-200",
        isActive
          ? "ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(91,157,255,0.15)]"
          : "hover:ring-1 hover:ring-[rgba(91,157,255,0.2)]",
      )}
      style={{
        background: isActive ? "rgba(11,30,70,0.8)" : "rgba(10,20,45,0.6)",
        border: isActive
          ? "1px solid rgba(91,157,255,0.3)"
          : "1px solid rgba(91,157,255,0.12)",
        backdropFilter: "blur(14px)",
      }}
      data-ocid={`apps.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* biome-ignore lint/a11y/useSemanticElements: contains a nested rename <button>, so this can't itself be a <button> (invalid HTML) */}
        <div
          role="button"
          tabIndex={0}
          className="min-w-0 flex-1 cursor-pointer text-left"
          onClick={() => setSelectedApp(isActive ? null : app)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedApp(isActive ? null : app);
            }
          }}
        >
          {renaming ? (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="h-7 text-sm bg-[rgba(255,255,255,0.05)] border-[rgba(91,157,255,0.25)] text-[#E8E8FF]"
                autoFocus
              />
              <Button size="sm" className="h-7 px-2" onClick={handleSaveName}>
                <Check className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap group">
              <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate">
                {app.name}
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setNameDraft(app.name);
                  setRenaming(true);
                }}
                className="opacity-0 group-hover:opacity-100 text-[rgba(232,232,255,0.3)] hover:text-blue-400 transition-opacity"
                aria-label="Rename app"
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          )}
          <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 truncate">
            {app.baseUrl ?? "No Base URL set"}
          </p>
        </div>
        <StatusBadge status={derivedStatus} />
      </div>

      {/* Code chip */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-lg tracking-widest"
          style={{
            background: "rgba(147,89,255,0.12)",
            border: "1px solid rgba(147,89,255,0.25)",
            color: "rgba(196,160,255,0.9)",
          }}
        >
          <Link2 className="w-3 h-3" />
          {app.appCode}
        </span>
        <button
          type="button"
          onClick={handleRegenerateCode}
          className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] hover:text-amber-400 transition-colors flex items-center gap-1"
          data-ocid={`apps.regenerate_code.${index + 1}`}
        >
          <RefreshCw className="w-3 h-3" /> Regenerate
        </button>
      </div>

      {/* Base URL editor */}
      {editingUrl ? (
        <div className="flex items-center gap-2 mb-4">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://your-app.vercel.app/api"
            className="h-8 text-xs bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] font-mono"
            autoFocus
          />
          <Button size="sm" className="h-8" onClick={handleSaveUrl}>
            Save
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setUrlDraft(app.baseUrl ?? "");
            setEditingUrl(true);
          }}
          className="text-[10px] font-mono text-blue-400/70 hover:text-blue-400 mb-4 block transition-colors"
          data-ocid={`apps.set_url.${index + 1}`}
        >
          {app.baseUrl ? "Change Base URL" : "+ Set Base URL"}
        </button>
      )}

      {derivedStatus === "refused" && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-[10px] font-mono text-red-400"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          Connection Refused: App Code mismatch.
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleTestConnection}
          disabled={isTesting || !app.baseUrl}
          data-ocid={`apps.test.button.${index + 1}`}
          className="flex-1 text-[11px] font-mono h-8 bg-[rgba(91,157,255,0.1)] hover:bg-[rgba(91,157,255,0.18)] text-blue-300 border border-[rgba(91,157,255,0.25)] hover:border-[rgba(91,157,255,0.4)] transition-all duration-200"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Testing…
            </>
          ) : (
            <>
              <RadioTower className="w-3 h-3 mr-1.5" /> Health Check
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          disabled={removeApp.isPending}
          data-ocid={`apps.delete_button.${index + 1}`}
          className="h-8 w-8 p-0 text-[rgba(232,232,255,0.35)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          aria-label={`Remove ${app.name}`}
        >
          {removeApp.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AppsPage() {
  const { data: apps = [], isLoading } = useApps();
  const { connectionStatusMap, setConnectionStatus } = useAppRegistryContext();
  const [newApp, setNewApp] = useState<AppViewUI | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);
  const setManualStatus = useSetAppManualStatus();

  async function handleCheckAll() {
    setCheckingAll(true);
    const withUrl = apps.filter((a) => a.baseUrl);
    await Promise.all(
      withUrl.map(async (app) => {
        const result = await checkHealth(app.baseUrl as string, app.appCode);
        setConnectionStatus(app.id, result);
        try {
          await setManualStatus.mutateAsync({
            id: app.id,
            status:
              result === "connected"
                ? AppStatus.connected
                : AppStatus.disconnected,
          });
        } catch {
          // best-effort
        }
      }),
    );
    setCheckingAll(false);
    toast.success(`Checked ${withUrl.length} app(s)`);
  }

  const connectedCount = apps.filter((a) => {
    const observed = connectionStatusMap[a.id];
    return (observed ?? a.status) === "connected";
  }).length;

  return (
    <div className="p-6 max-w-4xl" data-ocid="apps.page">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-7"
      >
        <div className="flex items-center gap-2 mb-1">
          <Layers className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-display font-bold text-[#E8E8FF]">
            Apps
          </h1>
        </div>
        <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1">
          Every VYAN app — built or in progress — lives here. Netra generates
          each app's pairing code; requests to it carry{" "}
          <code className="text-violet-300 bg-[rgba(147,89,255,0.1)] px-1 rounded">
            X-App-Code
          </code>{" "}
          authorization.
        </p>
      </motion.div>

      {newApp && (
        <NewAppCodeBanner app={newApp} onDismiss={() => setNewApp(null)} />
      )}

      <div className="mb-8">
        <RegisterForm onCreated={setNewApp} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest">
            Registered Apps · {apps.length} · {connectedCount} connected
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCheckAll}
            disabled={checkingAll || apps.length === 0}
            data-ocid="apps.check_all.button"
            className="h-7 text-[10px] font-mono border-[rgba(91,157,255,0.25)] text-blue-300 hover:bg-[rgba(91,157,255,0.1)]"
          >
            {checkingAll ? (
              <>
                <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <RadioTower className="w-3 h-3 mr-1.5" /> Check All
              </>
            )}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        ) : apps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-10 flex flex-col items-center justify-center gap-3"
            style={{
              background: "rgba(10,20,45,0.4)",
              border: "1px dashed rgba(91,157,255,0.18)",
            }}
            data-ocid="apps.list.empty_state"
          >
            <Layers className="w-8 h-8 text-[rgba(91,157,255,0.35)]" />
            <p className="text-sm font-display text-[rgba(232,232,255,0.4)]">
              No apps registered yet
            </p>
            <p className="text-[11px] font-mono text-[rgba(232,232,255,0.25)] text-center max-w-xs">
              Generate your first App Code above.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
