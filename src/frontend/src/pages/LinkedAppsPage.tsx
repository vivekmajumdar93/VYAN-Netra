import type { LinkedAppView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLinkedAppContext } from "@/context/linked-app-context";
import {
  useLinkedApps,
  useRegisterLinkedApp,
  useRemoveLinkedApp,
  useUpdateLinkedAppStatus,
} from "@/hooks/use-linked-apps";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  RadioTower,
  Trash2,
  WifiOff,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ── App Code validation ─────────────────────────────────────────────────────
const APP_CODE_REGEX = /^[A-Z0-9]{6}$/;

function validateAppCode(code: string): string | null {
  if (!code) return "App Code is required";
  if (code.length !== 6) return "App Code must be exactly 6 characters";
  if (!APP_CODE_REGEX.test(code))
    return "App Code must be uppercase letters and digits only";
  return null;
}

// ── Connection status badge ──────────────────────────────────────────────────
type StatusType = "connected" | "disconnected" | "refused" | "unknown";

function StatusBadge({ status }: { status: StatusType }) {
  const configs = {
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
      icon: <XCircle className="w-3 h-3 animate-pulse" />,
      className:
        "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse",
    },
    unknown: {
      label: "Unknown",
      icon: <RadioTower className="w-3 h-3" />,
      className:
        "bg-[rgba(91,157,255,0.1)] text-[rgba(232,232,255,0.55)] border-[rgba(91,157,255,0.2)]",
    },
  };
  const cfg = configs[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border",
        cfg.className,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ── Registration form ────────────────────────────────────────────────────────
function RegisterForm() {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [appCode, setAppCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const register = useRegisterLinkedApp();

  function handleCodeChange(val: string) {
    const upper = val.toUpperCase();
    setAppCode(upper);
    if (codeError) setCodeError(validateAppCode(upper));
  }

  function handleCodeBlur() {
    setCodeError(validateAppCode(appCode));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateAppCode(appCode);
    if (err) {
      setCodeError(err);
      return;
    }
    if (!name.trim() || !baseUrl.trim()) return;

    try {
      await register.mutateAsync({
        name: name.trim(),
        baseUrl: baseUrl.trim(),
        appCode,
      });
      toast.success(`"${name.trim()}" linked to VYAN Netra`);
      setName("");
      setBaseUrl("");
      setAppCode("");
      setCodeError(null);
    } catch {
      toast.error("Failed to register linked app");
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
      data-ocid="linked-apps.register.card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Plus className="w-4 h-4 text-blue-400" />
        <h2 className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest">
          Register New Application
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="app-name"
              className="text-xs font-mono text-[rgba(232,232,255,0.5)]"
            >
              Application Name
            </Label>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VYAN Ṛtam"
              required
              data-ocid="linked-apps.name.input"
              className="bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="app-code"
              className="text-xs font-mono text-[rgba(232,232,255,0.5)]"
            >
              6-Digit App Code
            </Label>
            <Input
              id="app-code"
              value={appCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onBlur={handleCodeBlur}
              placeholder="e.g. RTAM6X"
              maxLength={6}
              required
              data-ocid="linked-apps.code.input"
              className={cn(
                "bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm tracking-widest uppercase",
                codeError
                  ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20"
                  : "focus:border-blue-500/50 focus:ring-blue-500/20",
              )}
            />
            {codeError && (
              <p
                className="text-[10px] font-mono text-red-400 flex items-center gap-1 mt-1"
                data-ocid="linked-apps.code.field_error"
              >
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {codeError}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="base-url"
            className="text-xs font-mono text-[rgba(232,232,255,0.5)]"
          >
            Base API URL
          </Label>
          <Input
            id="base-url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-app.vercel.app/api"
            required
            type="url"
            data-ocid="linked-apps.url.input"
            className="bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>

        <Button
          type="submit"
          disabled={register.isPending}
          data-ocid="linked-apps.register.submit_button"
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-mono text-sm tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(91,157,255,0.25)]"
        >
          {register.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering…
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" /> Register Application
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}

// ── App card ─────────────────────────────────────────────────────────────────
interface AppCardProps {
  app: LinkedAppView;
  index: number;
  isActive: boolean;
  onSetActive: () => void;
}

function AppCard({ app, index, isActive, onSetActive }: AppCardProps) {
  const { connectionStatusMap, setConnectionStatus } = useLinkedAppContext();
  const updateStatus = useUpdateLinkedAppStatus();
  const removeApp = useRemoveLinkedApp();
  const testDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTestRef = useRef<number>(0);
  const [isTesting, setIsTesting] = useState(false);

  const derivedStatus: StatusType =
    (connectionStatusMap[app.id] as StatusType) ??
    (app.status === "connected"
      ? "connected"
      : app.status === "refused"
        ? "refused"
        : app.status === "disconnected"
          ? "disconnected"
          : "unknown");

  const handleTestConnection = useCallback(async () => {
    const now = Date.now();
    if (isTesting || now - lastTestRef.current < 2000) return;

    if (testDebounceRef.current) clearTimeout(testDebounceRef.current);

    testDebounceRef.current = setTimeout(async () => {
      lastTestRef.current = Date.now();
      setIsTesting(true);

      const url = `${app.baseUrl.replace(/\/$/, "")}/health`;
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "X-App-Code": app.appCode,
          },
          signal: AbortSignal.timeout(8000),
        });

        if (res.status === 401 || res.status === 403) {
          setConnectionStatus(app.id, "refused");
          await updateStatus.mutateAsync({ id: app.id, status: "refused" });
          toast.error("Connection Refused: Invalid 6-Digit VYAN App Code.");
        } else if (res.ok) {
          setConnectionStatus(app.id, "connected");
          await updateStatus.mutateAsync({ id: app.id, status: "connected" });
          toast.success(`${app.name} is reachable`);
        } else {
          setConnectionStatus(app.id, "disconnected");
          await updateStatus.mutateAsync({
            id: app.id,
            status: "disconnected",
          });
          toast.warning(`${app.name} returned HTTP ${res.status}`);
        }
      } catch {
        setConnectionStatus(app.id, "disconnected");
        await updateStatus.mutateAsync({ id: app.id, status: "disconnected" });
        toast.warning(`${app.name} is unreachable`);
      } finally {
        setIsTesting(false);
      }
    }, 50);
  }, [app, isTesting, setConnectionStatus, updateStatus]);

  async function handleRemove() {
    try {
      await removeApp.mutateAsync(app.id);
      toast.success(`${app.name} removed from VYAN Netra`);
    } catch {
      toast.error("Failed to remove application");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        "rounded-xl p-5 cursor-pointer transition-all duration-200",
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
      onClick={onSetActive}
      data-ocid={`linked-apps.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate">
              {app.name}
            </h3>
            {isActive && (
              <Badge
                variant="outline"
                className="text-[9px] font-mono px-1.5 py-0 border-blue-500/40 text-blue-400 bg-blue-500/10"
              >
                ACTIVE
              </Badge>
            )}
          </div>
          <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 truncate">
            {app.baseUrl}
          </p>
        </div>
        <StatusBadge status={derivedStatus} />
      </div>

      {/* Code chip */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-lg tracking-widest"
          style={{
            background: "rgba(147,89,255,0.12)",
            border: "1px solid rgba(147,89,255,0.25)",
            color: "rgba(196,160,255,0.9)",
          }}
        >
          <ExternalLink className="w-3 h-3" />
          {app.appCode}
        </span>
        <span className="text-[10px] font-mono text-[rgba(232,232,255,0.25)]">
          ID: {app.id.slice(0, 20)}…
        </span>
      </div>

      {/* Error message on refused */}
      {derivedStatus === "refused" && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-[10px] font-mono text-red-400"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          data-ocid={`linked-apps.refused.error_state.${index + 1}`}
        >
          <XCircle className="w-3 h-3 flex-shrink-0" />
          Connection Refused: Invalid 6-Digit VYAN App Code.
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Button
          size="sm"
          onClick={handleTestConnection}
          disabled={isTesting}
          data-ocid={`linked-apps.test.button.${index + 1}`}
          className="flex-1 text-[11px] font-mono h-8 bg-[rgba(91,157,255,0.1)] hover:bg-[rgba(91,157,255,0.18)] text-blue-300 border border-[rgba(91,157,255,0.25)] hover:border-[rgba(91,157,255,0.4)] transition-all duration-200"
        >
          {isTesting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Testing…
            </>
          ) : (
            <>
              <RadioTower className="w-3 h-3 mr-1.5" /> Test Connection
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleRemove}
          disabled={removeApp.isPending}
          data-ocid={`linked-apps.delete_button.${index + 1}`}
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
export default function LinkedAppsPage() {
  const { data: apps = [], isLoading } = useLinkedApps();
  const { selectedApp, setSelectedApp } = useLinkedAppContext();

  return (
    <div className="p-6 max-w-4xl" data-ocid="linked-apps.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-7"
      >
        <div className="flex items-center gap-2 mb-1">
          <Link2 className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-display font-bold text-[#E8E8FF]">
            Linked Applications
          </h1>
        </div>
        <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1">
          Connect VYAN ecosystem apps using their unique 6-digit App Code. All
          management queries are routed with{" "}
          <code className="text-violet-300 bg-[rgba(147,89,255,0.1)] px-1 rounded">
            X-App-Code
          </code>{" "}
          authorization.
        </p>
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(11,46,92,0.35), rgba(74,26,107,0.25))",
          border: "1px solid rgba(91,157,255,0.15)",
        }}
      >
        <RadioTower className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <p className="text-[11px] font-mono text-[rgba(232,232,255,0.55)] leading-relaxed">
          Clicking a card marks it as the{" "}
          <span className="text-blue-400">active app</span>. All bridge requests
          will be routed to the active app's registered URL. Requests returning
          401/403 are automatically flagged as{" "}
          <span className="text-red-400">refused</span>.
        </p>
      </motion.div>

      {/* Registration form */}
      <div className="mb-8">
        <RegisterForm />
      </div>

      {/* Apps list */}
      <div>
        <h2 className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-3">
          Registered Applications · {apps.length}
        </h2>

        {isLoading ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="linked-apps.list.loading_state"
          >
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
            data-ocid="linked-apps.list.empty_state"
          >
            <Link2 className="w-8 h-8 text-[rgba(91,157,255,0.35)]" />
            <p className="text-sm font-display text-[rgba(232,232,255,0.4)]">
              No applications linked yet
            </p>
            <p className="text-[11px] font-mono text-[rgba(232,232,255,0.25)] text-center max-w-xs">
              Register your first VYAN ecosystem app above using its 6-digit App
              Code.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map((app, i) => (
              <AppCard
                key={app.id}
                app={app}
                index={i}
                isActive={selectedApp?.id === app.id}
                onSetActive={() =>
                  setSelectedApp(selectedApp?.id === app.id ? null : app)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
