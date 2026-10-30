import {
  DIALOG_STYLE,
  FIELD_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "@/components/common/dialog-style";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AppViewUI, useClients, useCreateApp } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Check, Copy, Globe, LayoutGrid, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VYAN_OWNER = "__vyan__";

interface NewAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Pre-selects who owns the new app; the owner can still be changed.
  defaultClientId?: string | null;
}

export default function NewAppDialog({
  open,
  onOpenChange,
  defaultClientId = null,
}: NewAppDialogProps) {
  const navigate = useNavigate();
  const create = useCreateApp();
  const { data: clients } = useClients();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"app" | "website">("app");
  const [owner, setOwner] = useState<string>(defaultClientId ?? VYAN_OWNER);
  const [description, setDescription] = useState("");
  const [created, setCreated] = useState<AppViewUI | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setKind("app");
      setOwner(defaultClientId ?? VYAN_OWNER);
      setDescription("");
      setCreated(null);
      setCopied(false);
    }
  }, [open, defaultClientId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const app = await create.mutateAsync({
        name: name.trim(),
        kind,
        ownerType: owner === VYAN_OWNER ? "vyan" : "client",
        clientId: owner === VYAN_OWNER ? null : owner,
        description: description.trim() || null,
      });
      setCreated(app);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to register");
    }
  }

  async function copyCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed — select the code and copy it manually");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        style={DIALOG_STYLE}
        data-ocid="new_app.dialog"
      >
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-[#E8E8FF]">
                {created.name} registered
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.5)]">
                Give the app this pairing code. It is the only credential the
                app and Netra share, so treat it like a password.
              </DialogDescription>
            </DialogHeader>
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(52,211,153,0.12), rgba(11,46,92,0.3))",
                border: "1px solid rgba(52,211,153,0.3)",
              }}
            >
              <span
                className="font-mono text-2xl tracking-[0.3em] text-white flex-1"
                data-ocid="new_app.code"
              >
                {created.appCode}
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => copyCode(created.appCode)}
                className="text-emerald-300 hover:bg-emerald-500/10"
                data-ocid="new_app.copy_button"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <ol className="text-[11px] font-mono text-[rgba(232,232,255,0.55)] space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>
                Set <code className="text-emerald-300">VYAN_APP_CODE</code> to
                this code in the app's environment, plus the Netra project ID
                and console origin.
              </li>
              <li>
                Open the app's console, set its Base URL, and run a health
                check.
              </li>
              <li>
                The app declares its own controls once it connects; they appear
                in its console automatically.
              </li>
            </ol>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-mono text-xs text-[rgba(232,232,255,0.6)]"
              >
                Close
              </Button>
              <Button
                type="button"
                className={PRIMARY_BUTTON_CLASS}
                onClick={() => {
                  onOpenChange(false);
                  navigate({
                    to: "/apps/$appId",
                    params: { appId: created.id },
                  });
                }}
                data-ocid="new_app.open_console_button"
              >
                Open console
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-display text-[#E8E8FF]">
                Register an app or website
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.5)]">
                Netra generates a pairing code. The app then declares its own
                controls and reports its own live figures.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <Label htmlFor="new-app-name" className={LABEL_CLASS}>
                Name
              </Label>
              <Input
                id="new-app-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. VYAN Vaṇijya"
                required
                autoFocus
                className={FIELD_CLASS}
                data-ocid="new_app.name.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label className={LABEL_CLASS}>Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["app", "App", LayoutGrid],
                    ["website", "Website", Globe],
                  ] as const
                ).map(([value, label, Icon]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setKind(value)}
                    aria-pressed={kind === value}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-mono border transition-colors",
                      kind === value
                        ? "border-blue-500/60 bg-blue-500/10 text-[#E8E8FF]"
                        : "border-[rgba(91,157,255,0.15)] text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF]",
                    )}
                    data-ocid={`new_app.kind.${value}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={LABEL_CLASS}>Belongs to</Label>
              <Select value={owner} onValueChange={setOwner}>
                <SelectTrigger
                  className={FIELD_CLASS}
                  data-ocid="new_app.owner.select"
                >
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

            <div className="space-y-1.5">
              <Label htmlFor="new-app-desc" className={LABEL_CLASS}>
                Description (optional)
              </Label>
              <Input
                id="new-app-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One line on what it is"
                maxLength={120}
                className={FIELD_CLASS}
                data-ocid="new_app.description.input"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="font-mono text-xs text-[rgba(232,232,255,0.6)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={create.isPending || !name.trim()}
                className={PRIMARY_BUTTON_CLASS}
                data-ocid="new_app.submit_button"
              >
                {create.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating…
                  </>
                ) : (
                  "Generate pairing code"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
