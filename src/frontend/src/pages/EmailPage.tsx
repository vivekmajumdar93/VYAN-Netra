import type { EmailConfigView, EmailTemplateView } from "@/backend";
import { EmailStatus } from "@/backend";
import { UserStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  useApps,
  useCreateEmailConfig,
  useCreateEmailTemplate,
  useEmailConfigs,
  useEmailLogs,
  useEmailTemplates,
  useSendEmailBatch,
  useUpdateEmailConfig,
  useUpdateEmailTemplate,
  useUsersByApp,
} from "@/hooks/use-backend";
import type { EmailLog } from "@/types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit2,
  FileText,
  List,
  Mail,
  Plus,
  Send,
  Settings2,
  Users,
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
  appId: string;
  existing?: EmailTemplateView;
  onClose: () => void;
}

function TemplateModal({ appId, existing, onClose }: TemplateModalProps) {
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
        await createTemplate.mutateAsync({ appId, name, subject, body });
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
              placeholder="Welcome to {{app_name}}"
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
  appId,
  onClose,
}: { appId: string; onClose: () => void }) {
  const createConfig = useCreateEmailConfig();
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [bounceEmail, setBounceEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createConfig.mutateAsync({
        appId,
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
              placeholder="no-reply@vyan.com"
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
              placeholder="bounce@vyan.com"
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

function ConfigTab({ appId }: { appId: string }) {
  const { data: configs } = useEmailConfigs(appId);
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
            Add a config to start sending emails from this app
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
        <AddConfigModal appId={appId} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}

// ── Templates Tab Content ─────────────────────────────────────────────────────

function TemplatesTab({ appId }: { appId: string }) {
  const { data: templates } = useEmailTemplates(appId);
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
        <TemplateModal appId={appId} onClose={() => setModalTarget(null)} />
      )}
      {modalTarget && modalTarget !== "new" && (
        <TemplateModal
          appId={appId}
          existing={modalTarget}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  );
}

// ── Compose Tab Content ───────────────────────────────────────────────────────
// Select this app's users (any combination), pick a VYAN template or write
// a one-off message, and send — real delivery via the Zoho outcall on the
// backend, logged into the Logs tab either way.

function ComposeTab({ appId }: { appId: string }) {
  const { data: users } = useUsersByApp(appId);
  const { data: templates } = useEmailTemplates(appId);
  const sendBatch = useSendEmailBatch();

  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(
    new Set(),
  );
  const [extraRecipients, setExtraRecipients] = useState("");
  const [templateId, setTemplateId] = useState<string>("custom");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const acceptedUsers = (users ?? []).filter(
    (u) => u.status === UserStatus.active,
  );

  function toggleUser(id: string) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelectedUserIds((prev) =>
      prev.size === acceptedUsers.length
        ? new Set()
        : new Set(acceptedUsers.map((u) => u.id.toString())),
    );
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    if (id === "custom") return;
    const tmpl = templates?.find((t) => t.id.toString() === id);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  }

  async function handleSend() {
    const picked = acceptedUsers.filter((u) =>
      selectedUserIds.has(u.id.toString()),
    );
    const extras = extraRecipients
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter(Boolean);
    const recipients = [...picked.map((u) => u.email), ...extras];

    if (recipients.length === 0) {
      toast.error("Select at least one user or add a recipient email");
      return;
    }
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required");
      return;
    }

    try {
      const logs = await sendBatch.mutateAsync({
        appId,
        recipients,
        subject: subject.trim(),
        body: body.trim(),
      });
      const failed = logs.filter((l) => l.status !== EmailStatus.sent).length;
      if (failed === 0) {
        toast.success(`Sent to ${logs.length} recipient(s)`);
      } else {
        toast.warning(
          `Sent ${logs.length - failed}/${logs.length} — ${failed} failed (see Logs tab)`,
        );
      }
      setSelectedUserIds(new Set());
      setExtraRecipients("");
    } catch {
      toast.error("Failed to send — check Zoho is configured in Settings");
    }
  }

  return (
    <div className="space-y-5">
      {/* Recipients */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3 h-3" /> Recipients · {acceptedUsers.length}{" "}
            accepted user(s)
          </Label>
          {acceptedUsers.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-[10px] font-mono text-blue-400 hover:text-blue-300"
              data-ocid="email.compose.select_all"
            >
              {selectedUserIds.size === acceptedUsers.length
                ? "Deselect all"
                : "Select all"}
            </button>
          )}
        </div>
        <div
          className="rounded-xl p-3 max-h-48 overflow-y-auto space-y-1"
          style={GLASS}
          data-ocid="email.compose.user_list"
        >
          {acceptedUsers.length === 0 ? (
            <p className="text-xs font-mono text-[rgba(232,232,255,0.3)] px-2 py-3 text-center">
              No accepted users for this app yet — moderate pending users on the
              Users page, or add recipients below.
            </p>
          ) : (
            acceptedUsers.map((u) => {
              const checkboxId = `compose-user-${u.id.toString()}`;
              return (
                <div
                  key={u.id.toString()}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.06)]"
                >
                  <Checkbox
                    id={checkboxId}
                    checked={selectedUserIds.has(u.id.toString())}
                    onCheckedChange={() => toggleUser(u.id.toString())}
                    data-ocid={`email.compose.user_checkbox.${u.id.toString()}`}
                  />
                  <label
                    htmlFor={checkboxId}
                    className="flex items-center gap-2.5 cursor-pointer min-w-0"
                  >
                    <span className="text-xs font-body text-[#E8E8FF] truncate">
                      {u.name}
                    </span>
                    <span className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] truncate">
                      {u.email}
                    </span>
                  </label>
                </div>
              );
            })
          )}
        </div>
        <Textarea
          value={extraRecipients}
          onChange={(e) => setExtraRecipients(e.target.value)}
          placeholder="Additional recipients (comma or newline separated)"
          rows={2}
          data-ocid="email.compose.extra_recipients"
          className="mt-2 font-mono text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)]"
        />
      </div>

      {/* Template picker */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
          VYAN Template
        </Label>
        <Select value={templateId} onValueChange={applyTemplate}>
          <SelectTrigger
            data-ocid="email.compose.template_select"
            className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] text-xs font-mono"
          >
            <SelectValue placeholder="Custom message" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom" className="font-mono text-xs">
              Custom message
            </SelectItem>
            {(templates ?? []).map((t) => (
              <SelectItem
                key={t.id.toString()}
                value={t.id.toString()}
                className="font-mono text-xs"
              >
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Subject + body */}
      <div className="space-y-1.5">
        <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
          Subject
        </Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line"
          data-ocid="email.compose.subject"
          className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider">
          Body
        </Label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder="Message body"
          data-ocid="email.compose.body"
          className="font-mono text-xs resize-y bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
        />
      </div>

      <Button
        onClick={handleSend}
        disabled={sendBatch.isPending}
        className="gap-1.5"
        data-ocid="email.compose.send_button"
      >
        <Send className="w-3.5 h-3.5" />
        {sendBatch.isPending ? "Sending…" : "Send"}
      </Button>
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

function LogsTab({ appId }: { appId: string }) {
  const { data: logs } = useEmailLogs(appId);

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

// ── App Panel ─────────────────────────────────────────────────────────────

function AppEmailPanel({ appId }: { appId: string }) {
  return (
    <Tabs defaultValue="compose">
      <TabsList
        className="mb-5"
        style={{
          background: "rgba(91,157,255,0.07)",
          border: "1px solid rgba(91,157,255,0.12)",
        }}
      >
        <TabsTrigger
          value="compose"
          data-ocid="email.compose.tab"
          className="text-xs font-mono gap-1.5"
        >
          <Send className="w-3 h-3" /> Compose
        </TabsTrigger>
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

      <TabsContent value="compose">
        <ComposeTab appId={appId} />
      </TabsContent>
      <TabsContent value="config">
        <ConfigTab appId={appId} />
      </TabsContent>
      <TabsContent value="templates">
        <TemplatesTab appId={appId} />
      </TabsContent>
      <TabsContent value="logs">
        <LogsTab appId={appId} />
      </TabsContent>
    </Tabs>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EmailPage() {
  const { data: apps } = useApps();
  const [selectedAppId, setSelectedAppId] = useState<string>("");

  const selectedApp = apps?.find((p) => p.id.toString() === selectedAppId);

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

        <Select value={selectedAppId} onValueChange={setSelectedAppId}>
          <SelectTrigger
            data-ocid="email.app.select"
            className="w-52 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] text-xs font-mono"
          >
            <SelectValue placeholder="Select app…" />
          </SelectTrigger>
          <SelectContent>
            {(apps ?? []).map((p) => (
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
      {!selectedApp ? (
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
              No app selected
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.25)] mt-1">
              Choose an app from the dropdown to manage its email settings
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={selectedAppId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* App badge */}
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
              {selectedApp.name}
            </span>
            <span className="text-xs font-mono text-[rgba(232,232,255,0.3)] ml-1">
              {selectedApp.appCode}
            </span>
          </div>

          <AppEmailPanel appId={selectedApp.id} />
        </motion.div>
      )}
    </div>
  );
}
