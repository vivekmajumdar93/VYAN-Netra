import { SectionHeader } from "@/components/common/Section";
import StatusPill from "@/components/common/StatusPill";
import { FIELD_CLASS, LABEL_CLASS } from "@/components/common/dialog-style";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import {
  type AppViewUI,
  useClients,
  useRegenerateAppCode,
  useRemoveApp,
  useSetAppBaseUrl,
  useUpdateApp,
} from "@/hooks/use-backend";
import { useConnectionState, useHealthCheck } from "@/hooks/use-health-check";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  Copy,
  Loader2,
  RadioTower,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VYAN_OWNER = "__vyan__";

async function copyText(text: string, done: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(done);
  } catch {
    toast.error("Copy failed — select the text and copy it manually");
  }
}

export default function ConnectionPanel({
  app,
  consoleEnabled,
}: { app: AppViewUI; consoleEnabled: boolean }) {
  const navigate = useNavigate();
  const state = useConnectionState(app);
  const { run: runHealth, isTesting } = useHealthCheck(app, consoleEnabled);
  const setBaseUrl = useSetAppBaseUrl();
  const updateApp = useUpdateApp();
  const regenerate = useRegenerateAppCode();
  const remove = useRemoveApp();
  const { data: clients } = useClients();

  const [urlDraft, setUrlDraft] = useState(app.baseUrl ?? "");
  const [nameDraft, setNameDraft] = useState(app.name);
  const [descDraft, setDescDraft] = useState(app.description ?? "");
  const [kindDraft, setKindDraft] = useState(app.kind);
  const [ownerDraft, setOwnerDraft] = useState(app.clientId ?? VYAN_OWNER);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  useEffect(() => {
    setUrlDraft(app.baseUrl ?? "");
    setNameDraft(app.name);
    setDescDraft(app.description ?? "");
    setKindDraft(app.kind);
    setOwnerDraft(app.clientId ?? VYAN_OWNER);
  }, [app]);

  const detailsChanged =
    nameDraft.trim() !== app.name ||
    descDraft.trim() !== (app.description ?? "") ||
    kindDraft !== app.kind ||
    ownerDraft !== (app.clientId ?? VYAN_OWNER);

  async function saveUrl() {
    if (!urlDraft.trim()) return;
    try {
      await setBaseUrl.mutateAsync({ id: app.id, baseUrl: urlDraft.trim() });
      toast.success("Base URL saved");
    } catch {
      toast.error("Could not save the Base URL");
    }
  }

  async function saveDetails() {
    if (!nameDraft.trim()) return;
    try {
      await updateApp.mutateAsync({
        id: app.id,
        name: nameDraft.trim(),
        description: descDraft.trim() || null,
        kind: kindDraft,
        ownerType: ownerDraft === VYAN_OWNER ? "vyan" : "client",
        clientId: ownerDraft === VYAN_OWNER ? null : ownerDraft,
      });
      toast.success("Details saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save details",
      );
    }
  }

  async function doRegenerate() {
    try {
      await regenerate.mutateAsync(app.id);
      toast.success("New pairing code generated. Re-embed it in the app.");
    } catch {
      toast.error("Could not regenerate the code");
    }
  }

  async function doRemove() {
    try {
      await remove.mutateAsync(app.id);
      toast.success(`${app.name} removed`);
      navigate({ to: "/" });
    } catch {
      toast.error("Could not remove the app");
    }
  }

  const envSnippet = [
    `VYAN_APP_CODE=${app.appCode}`,
    `NETRA_FIREBASE_PROJECT_ID=${import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "<your Firebase project id>"}`,
    `NETRA_CONSOLE_ORIGIN=${window.location.origin}`,
  ].join("\n");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-6">
        <section className="glass-card rounded-xl p-5 space-y-4">
          <SectionHeader title="Pairing code" />
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl tracking-[0.3em] text-white flex-1">
              {app.appCode}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyText(app.appCode, "Pairing code copied")}
              className="text-[rgba(232,232,255,0.6)]"
              aria-label="Copy pairing code"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmRegen(true)}
              className="text-[rgba(232,232,255,0.6)] hover:text-amber-300"
              aria-label="Regenerate pairing code"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <p className={`${LABEL_CLASS} mb-1.5`}>Environment for the app</p>
            <pre className="text-[11px] font-mono text-emerald-200/90 bg-[rgba(0,0,0,0.35)] border border-[rgba(91,157,255,0.12)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {envSnippet}
            </pre>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyText(envSnippet, "Environment copied")}
              className="mt-1.5 h-7 px-2 text-[11px] font-mono text-[rgba(232,232,255,0.5)]"
            >
              <Copy className="w-3 h-3 mr-1.5" /> Copy
            </Button>
          </div>
        </section>

        <section className="glass-card rounded-xl p-5 space-y-3">
          <SectionHeader
            title="Health check"
            action={<StatusPill state={state} />}
          />
          <div className="space-y-1.5">
            <Label htmlFor="base-url" className={LABEL_CLASS}>
              Base URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="base-url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://your-app.example.com/api/netra"
                className={FIELD_CLASS}
                data-ocid="console.base_url.input"
              />
              <Button
                size="sm"
                onClick={saveUrl}
                disabled={
                  !urlDraft.trim() ||
                  urlDraft.trim() === (app.baseUrl ?? "") ||
                  setBaseUrl.isPending
                }
                className="h-9 font-mono text-xs"
              >
                Save
              </Button>
            </div>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] leading-relaxed">
              The path that serves <code>/health</code>, without the trailing
              <code> /health</code>. Netra calls it straight from your browser.
            </p>
          </div>
          <Button
            size="sm"
            onClick={runHealth}
            disabled={isTesting || !app.baseUrl || !consoleEnabled}
            title={
              consoleEnabled
                ? undefined
                : "The console kill switch is off (Settings)"
            }
            className="h-9 font-mono text-xs bg-[rgba(91,157,255,0.12)] hover:bg-[rgba(91,157,255,0.22)] text-blue-200 border border-[rgba(91,157,255,0.3)]"
            data-ocid="console.health_check_button"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <RadioTower className="w-3.5 h-3.5 mr-2" /> Run health check
              </>
            )}
          </Button>
        </section>
      </div>

      <div className="space-y-6">
        <section className="glass-card rounded-xl p-5 space-y-4">
          <SectionHeader title="Details" />
          <div className="space-y-1.5">
            <Label htmlFor="detail-name" className={LABEL_CLASS}>
              Name
            </Label>
            <Input
              id="detail-name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className={FIELD_CLASS}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="detail-desc" className={LABEL_CLASS}>
              Description
            </Label>
            <Input
              id="detail-desc"
              value={descDraft}
              onChange={(e) => setDescDraft(e.target.value)}
              maxLength={120}
              className={FIELD_CLASS}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={LABEL_CLASS}>Type</Label>
              <Select
                value={kindDraft}
                onValueChange={(v) => setKindDraft(v as "app" | "website")}
              >
                <SelectTrigger className={FIELD_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="app">App</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className={LABEL_CLASS}>Belongs to</Label>
              <Select value={ownerDraft} onValueChange={setOwnerDraft}>
                <SelectTrigger className={FIELD_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={VYAN_OWNER}>VYAN (own product)</SelectItem>
                  {(clients ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      Client: {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            size="sm"
            onClick={saveDetails}
            disabled={
              !detailsChanged || !nameDraft.trim() || updateApp.isPending
            }
            className="h-9 font-mono text-xs"
          >
            {updateApp.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5" /> Save details
              </>
            )}
          </Button>
        </section>

        <section className="rounded-xl p-5 space-y-3 border border-red-500/25 bg-red-500/[0.04]">
          <SectionHeader title="Danger zone" />
          <p className="text-[11px] font-mono text-[rgba(232,232,255,0.5)] leading-relaxed">
            Removing an app deletes its pairing, declared controls and live
            figures from Netra. The app itself is not touched.
          </p>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmRemove(true)}
            className="h-9 font-mono text-xs text-red-300 hover:bg-red-500/10 border border-red-500/30"
            data-ocid="console.remove_button"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove {app.name}
          </Button>
        </section>
      </div>

      <AlertDialog open={confirmRegen} onOpenChange={setConfirmRegen}>
        <AlertDialogContent
          style={{
            background: "rgba(8,14,35,0.97)",
            border: "1px solid rgba(91,157,255,0.2)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[#E8E8FF]">
              Regenerate the pairing code?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.6)]">
              The old code stops working immediately and the app shows as
              awaiting connection until you re-embed the new one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void doRegenerate()}
              className="font-mono text-xs"
            >
              Regenerate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent
          style={{
            background: "rgba(8,14,35,0.97)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[#E8E8FF]">
              Remove {app.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.6)]">
              This cannot be undone. You would need to register it again and
              re-embed a new pairing code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void doRemove()}
              className="font-mono text-xs bg-red-600 hover:bg-red-500 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
