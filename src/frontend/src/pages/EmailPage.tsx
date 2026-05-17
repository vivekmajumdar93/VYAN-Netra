import type { EmailConfigView, EmailLog, EmailTemplateView } from "@/backend";
import { EmailStatus } from "@/backend";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateEmailConfig,
  useCreateEmailTemplate,
  useEmailConfigs,
  useEmailLogs,
  useEmailTemplates,
  useProducts,
  useUpdateEmailConfig,
  useUpdateEmailTemplate,
} from "@/hooks/use-backend";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit2,
  FileText,
  List,
  Mail,
  Plus,
  Settings2,
  X,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Constants ─────────────────────────────────────────────────────────────────

const GLASS = {
  background: "rgba(10,20,45,0.55)",
  border: "1px solid rgba(91,157,255,0.14)",
  backdropFilter: "blur(12px)",
};

const MODAL_OUTER = {
  background: "rgba(8,14,35,0.96)",
  border: "1px solid rgba(91,157,255,0.28)",
  boxShadow: "0 0 60px rgba(91,157,255,0.14), 0 0 120px rgba(74,26,107,0.1)",
};

function statusStyle(status: EmailStatus): {
  bg: string;
  text: string;
  icon: React.ReactNode;
} {
  switch (status) {
    case EmailStatus.sent:
      return {
        bg: "rgba(52,211,153,0.1)",
        text: "#34D399",
        icon: <CheckCircle2 className="w-3 h-3" />,
      };
    case EmailStatus.failed:
      return {
        bg: "rgba(239,68,68,0.1)",
        text: "#F87171",
        icon: <XCircle className="w-3 h-3" />,
      };
    case EmailStatus.bounced:
      return {
        bg: "rgba(251,191,36,0.1)",
        text: "#FCD34D",
        icon: <AlertTriangle className="w-3 h-3" />,
      };
  }
}

function fmtTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Section label (internal use) ─────────────────────────────────────────────

// ── Config Card ───────────────────────────────────────────────────────────────

function ConfigCard({
  config,
  index,
}: { config: EmailConfigView; index: number }) {
  const updateConfig = useUpdateEmailConfig();
  const [editing, setEditing] = useState(false);
  const [senderName, setSenderName] = useState(config.senderName);
  const [senderEmail, setSenderEmail] = useState(config.senderEmail);
  const [bounceEmail, setBounceEmail] = useState(config.bounceEmail);
  const [isActive, setIsActive] = useState(config.isActive);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync({
        id: config.id,
        senderName,
        senderEmail,
        bounceEmail,
        isActive,
      });
      toast.success("Email config updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update config");
    }
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={GLASS}
      data-ocid={`email.config.item.${index}`}
    >
      <div className="px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(91,157,255,0.1)",
              border: "1px solid rgba(91,157,255,0.2)",
            }}
          >
            <Mail className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-body font-semibold text-[#E8E8FF] truncate">
              {config.senderName}
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.4)] truncate">
              {config.senderEmail}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: config.isActive
                ? "rgba(52,211,153,0.1)"
                : "rgba(107,114,128,0.15)",
              color: config.isActive ? "#34D399" : "#9CA3AF",
              border: `1px solid ${config.isActive ? "rgba(52,211,153,0.25)" : "rgba(107,114,128,0.2)"}`,
            }}
          >
            {config.isActive ? "active" : "inactive"}
          </span>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            aria-label="Edit config"
            data-ocid={`email.config.edit_button.${index}`}
            className="p-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-[rgba(232,232,255,0.45)]" />
          </button>
        </div>
      </div>

      {editing && (
        <form
          onSubmit={handleSave}
          className="px-5 pb-5 pt-1 border-t border-[rgba(91,157,255,0.08)]"
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
                Sender Name
              </Label>
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                required
                data-ocid={`email.config.sender_name.input.${index}`}
                className="h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
                Sender Email
              </Label>
              <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
                data-ocid={`email.config.sender_email.input.${index}`}
                className="h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
                Bounce Email
              </Label>
              <Input
                type="email"
                value={bounceEmail}
                onChange={(e) => setBounceEmail(e.target.value)}
                required
                data-ocid={`email.config.bounce_email.input.${index}`}
                className="h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider">
                Active
              </Label>
              <div className="flex items-center h-8">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  data-ocid={`email.config.active.switch.${index}`}
                />
                <span className="ml-2 text-xs font-mono text-[rgba(232,232,255,0.5)]">
                  {isActive ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditing(false)}
              className="text-xs"
              data-ocid={`email.config.cancel_button.${index}`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateConfig.isPending}
              className="text-xs"
              data-ocid={`email.config.save_button.${index}`}
            >
              {updateConfig.isPending ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Template Editor Modal ─────────────────────────────────────────────────────

interface TemplateModalProps {
  productId: bigint;
  existing?: EmailTemplateView;
  onClose: () => void;
}

function TemplateModal({ productId, existing, onClose }: TemplateModalProps) {
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const [name, setName] = useState(existing?.name ?? "");
  const [subject, setSubject] = useState(existing?.subject ?? "");
  const [body, setBody] = useState(existing?.body ?? "");

  const isPending = createTemplate.isPending || updateTemplate.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (existing) {
        await updateTemplate.mutateAsync({ id: existing.id, subject, body });
        toast.success("Template updated");
      } else {
        await createTemplate.mutateAsync({ productId, name, subject, body });
        toast.success("Template created");
      }
      onClose();
    } catch {
      toast.error(
        existing ? "Failed to update template" : "Failed to create template",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      data-ocid="email.template.dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-2xl"
        style={MODAL_OUTER}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(91,157,255,0.12)]">
          <div>
            <h2 className="text-base font-display font-bold text-[#E8E8FF]">
              {existing ? "Edit Template" : "New Template"}
            </h2>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5">
              {existing
                ? `Editing: ${existing.name}`
                : "Create a reusable email template"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="email.template.close_button"
            className="p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors"
          >
            <X className="w-4 h-4 text-[rgba(232,232,255,0.45)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!existing && (
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
                Template Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Welcome Email"
                data-ocid="email.template.name.input"
                className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
              Subject
            </Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Welcome to {{product_name}}"
              data-ocid="email.template.subject.input"
              className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
              HTML Body
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={12}
              placeholder="<html>\n  <body>\n    <h1>Hello {{name}}</h1>\n  </body>\n</html>"
              data-ocid="email.template.body.textarea"
              className="font-mono text-xs resize-y bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="email.template.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1"
              data-ocid="email.template.submit_button"
            >
              {isPending
                ? "Saving…"
                : existing
                  ? "Update Template"
                  : "Create Template"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Config Tab ────────────────────────────────────────────────────────────────

function AddConfigModal({
  productId,
  onClose,
}: { productId: bigint; onClose: () => void }) {
  const createConfig = useCreateEmailConfig();
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [bounceEmail, setBounceEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createConfig.mutateAsync({
        productId,
        senderName,
        senderEmail,
        bounceEmail,
      });
      toast.success("Email config created");
      onClose();
    } catch {
      toast.error("Failed to create config");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      data-ocid="email.config.dialog"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl"
        style={MODAL_OUTER}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(91,157,255,0.12)]">
          <h2 className="text-base font-display font-bold text-[#E8E8FF]">
            Add Email Config
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-ocid="email.config.close_button"
            className="p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors"
          >
            <X className="w-4 h-4 text-[rgba(232,232,255,0.45)]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
              Sender Name
            </Label>
            <Input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
              placeholder="VYAN Notifications"
              data-ocid="email.config.sender_name.input"
              className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
              Sender Email
            </Label>
            <Input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
              placeholder="no-reply@vyanlabs.com"
              data-ocid="email.config.sender_email_new.input"
              className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
              Bounce Email
            </Label>
            <Input
              type="email"
              value={bounceEmail}
              onChange={(e) => setBounceEmail(e.target.value)}
              required
              placeholder="bounce@vyanlabs.com"
              data-ocid="email.config.bounce_email_new.input"
              className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="email.config.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConfig.isPending}
              className="flex-1"
              data-ocid="email.config.submit_button"
            >
              {createConfig.isPending ? "Saving…" : "Save Config"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Config Tab Content ────────────────────────────────────────────────────────

function ConfigTab({ productId }: { productId: bigint }) {
  const { data: configs } = useEmailConfigs(productId);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-[rgba(232,232,255,0.4)]">
          {configs?.length ?? 0} configuration{configs?.length !== 1 ? "s" : ""}
        </p>
        <Button
          size="sm"
          onClick={() => setShowAdd(true)}
          className="gap-1.5 h-7 text-xs"
          data-ocid="email.config.add_button"
        >
          <Plus className="w-3 h-3" /> Add Config
        </Button>
      </div>

      {!configs?.length ? (
        <div
          className="rounded-xl p-12 flex flex-col items-center gap-3"
          style={{
            background: "rgba(10,20,45,0.4)",
            border: "1px solid rgba(91,157,255,0.08)",
          }}
          data-ocid="email.configs.empty_state"
        >
          <Settings2 className="w-8 h-8 text-[rgba(91,157,255,0.3)]" />
          <p className="text-sm font-mono text-[rgba(232,232,255,0.35)] text-center">
            No email configurations yet
          </p>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.2)] text-center">
            Add a config to start sending emails from this product
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {configs.map((c, i) => (
            <ConfigCard key={c.id.toString()} config={c} index={i + 1} />
          ))}
        </div>
      )}

      {showAdd && (
        <AddConfigModal
          productId={productId}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

// ── Templates Tab Content ─────────────────────────────────────────────────────

function TemplatesTab({ productId }: { productId: bigint }) {
  const { data: templates } = useEmailTemplates(productId);
  const [modalTarget, setModalTarget] = useState<
    EmailTemplateView | null | "new"
  >(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-[rgba(232,232,255,0.4)]">
          {templates?.length ?? 0} template{templates?.length !== 1 ? "s" : ""}
        </p>
        <Button
          size="sm"
          onClick={() => setModalTarget("new")}
          className="gap-1.5 h-7 text-xs"
          data-ocid="email.template.add_button"
        >
          <Plus className="w-3 h-3" /> New Template
        </Button>
      </div>

      {!templates?.length ? (
        <div
          className="rounded-xl p-12 flex flex-col items-center gap-3"
          style={{
            background: "rgba(10,20,45,0.4)",
            border: "1px solid rgba(91,157,255,0.08)",
          }}
          data-ocid="email.templates.empty_state"
        >
          <FileText className="w-8 h-8 text-[rgba(91,157,255,0.3)]" />
          <p className="text-sm font-mono text-[rgba(232,232,255,0.35)] text-center">
            No email templates yet
          </p>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.2)] text-center">
            Create a template to reuse across email campaigns
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {templates.map((t, i) => (
            <div
              key={t.id.toString()}
              className="rounded-xl px-5 py-4 flex items-center justify-between gap-4"
              style={GLASS}
              data-ocid={`email.template.item.${i + 1}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(74,26,107,0.3)",
                    border: "1px solid rgba(140,80,220,0.25)",
                  }}
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-body font-semibold text-[#E8E8FF] truncate">
                    {t.name}
                  </p>
                  <p className="text-xs font-mono text-[rgba(232,232,255,0.4)] truncate">
                    {t.subject}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1 text-[10px] font-mono text-[rgba(232,232,255,0.3)]">
                  <Calendar className="w-3 h-3" />
                  <span>{fmtTimestamp(t.lastModified)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalTarget(t)}
                  aria-label="Edit template"
                  data-ocid={`email.template.edit_button.${i + 1}`}
                  className="p-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[rgba(232,232,255,0.45)]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalTarget === "new" && (
        <TemplateModal
          productId={productId}
          onClose={() => setModalTarget(null)}
        />
      )}
      {modalTarget && modalTarget !== "new" && (
        <TemplateModal
          productId={productId}
          existing={modalTarget}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  );
}

// ── Logs Tab Content ──────────────────────────────────────────────────────────

function statusKey(status: EmailStatus): string {
  if (status === EmailStatus.sent) return "sent";
  if (status === EmailStatus.failed) return "failed";
  if (status === EmailStatus.bounced) return "bounced";
  return "failed";
}

function LogRow({ log, index }: { log: EmailLog; index: number }) {
  const key = statusKey(log.status);
  const style = statusStyle(log.status);

  return (
    <div
      className="grid grid-cols-[80px_1fr_1fr_120px] items-center gap-4 px-4 py-3 rounded-lg"
      style={{
        background: "rgba(10,20,45,0.45)",
        border: "1px solid rgba(91,157,255,0.07)",
      }}
      data-ocid={`email.log.item.${index}`}
    >
      <span
        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full w-fit"
        style={{
          background: style.bg,
          color: style.text,
          border: `1px solid ${style.text}30`,
        }}
      >
        {style.icon}
        {key}
      </span>
      <p
        className="text-xs font-body text-[#E8E8FF] truncate"
        title={log.subject}
      >
        {log.subject}
      </p>
      <p
        className="text-xs font-mono text-[rgba(232,232,255,0.5)] truncate"
        title={log.recipient}
      >
        {log.recipient}
      </p>
      <p className="text-[10px] font-mono text-[rgba(232,232,255,0.3)] text-right">
        {fmtTimestamp(log.timestamp)}
      </p>
    </div>
  );
}

function LogsTab({ productId }: { productId: bigint }) {
  const { data: logs } = useEmailLogs(productId);

  return (
    <div>
      {!logs?.length ? (
        <div
          className="rounded-xl p-12 flex flex-col items-center gap-3"
          style={{
            background: "rgba(10,20,45,0.4)",
            border: "1px solid rgba(91,157,255,0.08)",
          }}
          data-ocid="email.logs.empty_state"
        >
          <List className="w-8 h-8 text-[rgba(91,157,255,0.3)]" />
          <p className="text-sm font-mono text-[rgba(232,232,255,0.35)] text-center">
            No email logs yet
          </p>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.2)] text-center">
            Sent, failed and bounced emails will appear here
          </p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[80px_1fr_1fr_120px] gap-4 px-4 pb-2 mb-1">
            <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest">
              Status
            </span>
            <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest">
              Subject
            </span>
            <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest">
              Recipient
            </span>
            <span className="text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest text-right">
              Sent At
            </span>
          </div>
          <div className="space-y-1.5">
            {logs.map((l, i) => (
              <LogRow key={l.id.toString()} log={l} index={i + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Product Panel ─────────────────────────────────────────────────────────────

function ProductEmailPanel({ productId }: { productId: bigint }) {
  return (
    <Tabs defaultValue="config">
      <TabsList
        className="mb-5"
        style={{
          background: "rgba(91,157,255,0.07)",
          border: "1px solid rgba(91,157,255,0.12)",
        }}
      >
        <TabsTrigger
          value="config"
          data-ocid="email.config.tab"
          className="text-xs font-mono gap-1.5"
        >
          <Settings2 className="w-3 h-3" /> Config
        </TabsTrigger>
        <TabsTrigger
          value="templates"
          data-ocid="email.templates.tab"
          className="text-xs font-mono gap-1.5"
        >
          <FileText className="w-3 h-3" /> Templates
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          data-ocid="email.logs.tab"
          className="text-xs font-mono gap-1.5"
        >
          <List className="w-3 h-3" /> Logs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="config">
        <ConfigTab productId={productId} />
      </TabsContent>
      <TabsContent value="templates">
        <TemplatesTab productId={productId} />
      </TabsContent>
      <TabsContent value="logs">
        <LogsTab productId={productId} />
      </TabsContent>
    </Tabs>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EmailPage() {
  const { data: products } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const selectedProduct = products?.find(
    (p) => p.id.toString() === selectedProductId,
  );

  return (
    <div className="p-6" data-ocid="email.page">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-[#E8E8FF]">
            Email
          </h1>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-0.5">
            Configurations · Templates · Delivery Logs
          </p>
        </div>

        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger
            data-ocid="email.product.select"
            className="w-52 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] text-xs font-mono"
          >
            <SelectValue placeholder="Select product…" />
          </SelectTrigger>
          <SelectContent>
            {(products ?? []).map((p) => (
              <SelectItem
                key={p.id.toString()}
                value={p.id.toString()}
                className="font-mono text-xs"
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {!selectedProduct ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl p-16 flex flex-col items-center gap-4"
          style={{
            background: "rgba(10,20,45,0.5)",
            border: "1px solid rgba(91,157,255,0.1)",
          }}
          data-ocid="email.empty_state"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(91,157,255,0.08)",
              border: "1px solid rgba(91,157,255,0.15)",
            }}
          >
            <Mail className="w-7 h-7 text-[rgba(91,157,255,0.5)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-body font-medium text-[rgba(232,232,255,0.55)]">
              No product selected
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.25)] mt-1">
              Choose a product from the dropdown to manage its email settings
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={selectedProductId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Product badge */}
          <div className="flex items-center gap-2 mb-5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{
                background: "rgba(91,157,255,0.12)",
                border: "1px solid rgba(91,157,255,0.2)",
              }}
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-body font-semibold text-[#E8E8FF]">
              {selectedProduct.name}
            </span>
            <span className="text-xs font-mono text-[rgba(232,232,255,0.3)] ml-1">
              {selectedProduct.code}
            </span>
          </div>

          <ProductEmailPanel productId={selectedProduct.id} />
        </motion.div>
      )}
    </div>
  );
}
