import type { ControlParam, ControlSpec } from "@/backend";
import { EmptyState } from "@/components/common/Section";
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
import { Switch } from "@/components/ui/switch";
import {
  useCapabilities,
  useIssueCommand,
  useKillSwitch,
} from "@/hooks/use-backend";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Loader2,
  SlidersHorizontal,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FIELD_CLASS, LABEL_CLASS } from "../common/dialog-style";

type FieldValue = string | boolean;

function initialValue(param: ControlParam): FieldValue {
  return param.type === "boolean" ? false : "";
}

function ParamField({
  param,
  value,
  onChange,
  idPrefix,
}: {
  param: ControlParam;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  idPrefix: string;
}) {
  const id = `${idPrefix}-${param.name}`;
  const label = (
    <Label htmlFor={id} className={LABEL_CLASS}>
      {param.label}
      {param.required ? <span className="text-red-400"> *</span> : null}
    </Label>
  );
  switch (param.type) {
    case "boolean":
      return (
        <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 bg-[rgba(91,157,255,0.05)] border border-[rgba(91,157,255,0.12)]">
          {label}
          <Switch
            id={id}
            checked={value === true}
            onCheckedChange={(checked) => onChange(checked)}
          />
        </div>
      );
    case "select":
      return (
        <div className="space-y-1.5">
          {label}
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={onChange}
          >
            <SelectTrigger id={id} className={cn(FIELD_CLASS, "h-9")}>
              <SelectValue placeholder="Choose…" />
            </SelectTrigger>
            <SelectContent>
              {(param.options ?? []).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    default:
      return (
        <div className="space-y-1.5">
          {label}
          <Input
            id={id}
            type={param.type === "number" ? "number" : "text"}
            inputMode={param.type === "number" ? "decimal" : undefined}
            step={param.type === "number" ? "any" : undefined}
            min={param.min}
            max={param.max}
            placeholder={param.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className={cn(FIELD_CLASS, "h-9")}
          />
          {param.type === "number" &&
          (param.min !== undefined || param.max !== undefined) ? (
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)]">
              {param.min !== undefined ? `min ${param.min}` : ""}
              {param.min !== undefined && param.max !== undefined ? " · " : ""}
              {param.max !== undefined ? `max ${param.max}` : ""}
            </p>
          ) : null}
        </div>
      );
  }
}

function ControlCard({
  appId,
  control,
  disabled,
}: { appId: string; control: ControlSpec; disabled: boolean }) {
  const issue = useIssueCommand();
  const params = control.params ?? [];
  const [values, setValues] = useState<Record<string, FieldValue>>(() =>
    Object.fromEntries(params.map((p) => [p.name, initialValue(p)])),
  );
  const [confirming, setConfirming] = useState(false);

  function collect(): Record<string, string | number | boolean> | null {
    const out: Record<string, string | number | boolean> = {};
    for (const param of params) {
      const raw = values[param.name];
      if (param.type === "boolean") {
        out[param.name] = raw === true;
        continue;
      }
      if (raw === "" || raw === undefined) {
        if (param.required) {
          toast.error(`${param.label} is required`);
          return null;
        }
        continue;
      }
      out[param.name] = param.type === "number" ? Number(raw) : String(raw);
    }
    return out;
  }

  async function send() {
    const collected = collect();
    if (!collected) return;
    try {
      await issue.mutateAsync({
        appId,
        type: control.id,
        params: collected,
      });
      toast.success(
        `${control.label} queued — the app picks it up within about a minute`,
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not queue command",
      );
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (collect() === null) return;
    if (control.danger || control.confirm) setConfirming(true);
    else void send();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card rounded-xl p-4 flex flex-col gap-3"
      style={{
        borderColor: control.danger ? "rgba(239,68,68,0.3)" : undefined,
      }}
      data-ocid={`control.${control.id}`}
    >
      <div>
        <div className="flex items-center gap-2">
          {control.danger ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          ) : null}
          <h4 className="text-sm font-display font-semibold text-[#E8E8FF]">
            {control.label}
          </h4>
        </div>
        {control.description ? (
          <p className="text-[11px] font-mono text-[rgba(232,232,255,0.45)] mt-1 leading-relaxed">
            {control.description}
          </p>
        ) : null}
      </div>

      {params.length > 0 ? (
        <div
          className={cn(
            "grid gap-3",
            params.length > 1 ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {params.map((param) => (
            <ParamField
              key={param.name}
              param={param}
              idPrefix={control.id}
              value={values[param.name] ?? initialValue(param)}
              onChange={(v) =>
                setValues((prev) => ({ ...prev, [param.name]: v }))
              }
            />
          ))}
        </div>
      ) : null}

      <Button
        type="submit"
        size="sm"
        disabled={disabled || issue.isPending}
        className={cn(
          "mt-auto h-9 font-mono text-xs border",
          control.danger
            ? "bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30"
            : "bg-[rgba(91,157,255,0.12)] hover:bg-[rgba(91,157,255,0.22)] text-blue-200 border-[rgba(91,157,255,0.3)]",
        )}
        data-ocid={`control.${control.id}.submit`}
      >
        {issue.isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          control.label
        )}
      </Button>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent
          style={{
            background: "rgba(8,14,35,0.97)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[#E8E8FF]">
              {control.label}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.6)] leading-relaxed">
              {control.confirm ??
                "This runs immediately on the app once it picks the command up."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void send()}
              className="font-mono text-xs bg-red-600 hover:bg-red-500 text-white"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

export default function ControlsPanel({
  appId,
  connected,
}: { appId: string; connected: boolean }) {
  const { data: caps, isLoading } = useCapabilities(appId);
  const { data: killSwitch } = useKillSwitch();
  const consoleOff = killSwitch ? !killSwitch.enabled : false;

  if (isLoading) return null;

  if (!caps || caps.controls.length === 0) {
    return (
      <EmptyState
        icon={SlidersHorizontal}
        title="This app hasn't declared any controls"
        body="Controls belong to the app, not to Netra. Once the app connects with its pairing code it publishes its own list, and each control appears here automatically. To add one, add it to the app."
      />
    );
  }

  const groups = new Map<string, ControlSpec[]>();
  for (const control of caps.controls) {
    const key = control.group ?? "Controls";
    groups.set(key, [...(groups.get(key) ?? []), control]);
  }

  return (
    <div className="space-y-6">
      {consoleOff ? (
        <div className="flex items-start gap-3 rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-mono text-amber-200 leading-relaxed">
            The console kill switch is off, so apps are not receiving commands.
            Turn it on in Settings to run anything below.
          </p>
        </div>
      ) : !connected ? (
        <div className="flex items-start gap-3 rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/30">
          <WifiOff className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs font-mono text-amber-200 leading-relaxed">
            This app is not connected. A command waits up to 10 minutes for it
            to reconnect, then expires without running.
          </p>
        </div>
      ) : null}

      {[...groups.entries()].map(([group, controls]) => (
        <section key={group}>
          <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-widest mb-3">
            {group}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {controls.map((control) => (
              <ControlCard
                key={control.id}
                appId={appId}
                control={control}
                disabled={consoleOff}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)]">
        Declared by the app {timeAgo(caps.updatedAt)}. Netra validates each
        command against the app's own definition before queuing it.
      </p>
    </div>
  );
}
