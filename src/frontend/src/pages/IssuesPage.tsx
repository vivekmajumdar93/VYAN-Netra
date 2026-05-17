import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddIssueComment,
  useCreateIssue,
  useIssueComments,
  useIssues,
  useProducts,
  useResolveIssue,
  useUpdateIssue,
  useUsers,
} from "@/hooks/use-backend";
import { IssueSeverity, IssueStatus } from "@/types";
import type { IssueComment, IssueView, ProductView, UserView } from "@/types";
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ── Helpers ─────────────────────────────────────────────────────────────────
function relativeTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

function severityLabel(s: IssueSeverity): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const SEVERITY_COLORS: Record<
  IssueSeverity,
  { border: string; badge: string; dot: string }
> = {
  [IssueSeverity.critical]: {
    border: "border-l-red-500",
    badge: "bg-red-500/20 text-red-300 border-red-500/40",
    dot: "bg-red-500",
  },
  [IssueSeverity.high]: {
    border: "border-l-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    dot: "bg-orange-400",
  },
  [IssueSeverity.medium]: {
    border: "border-l-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    dot: "bg-yellow-400",
  },
  [IssueSeverity.low]: {
    border: "border-l-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    dot: "bg-blue-400",
  },
};

const STATUS_STYLES: Record<IssueStatus, string> = {
  [IssueStatus.open]: "bg-red-500/15 text-red-300 border-red-500/30",
  [IssueStatus.in_progress]: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  [IssueStatus.resolved]:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const STATUS_LABEL: Record<IssueStatus, string> = {
  [IssueStatus.open]: "Open",
  [IssueStatus.in_progress]: "In Progress",
  [IssueStatus.resolved]: "Resolved",
};

// ── IssueCommentPanel ─────────────────────────────────────────────────────────
function IssueCommentPanel({
  issueId,
  users,
}: { issueId: bigint; users: UserView[] }) {
  const { data: comments = [], isLoading } = useIssueComments(issueId);
  const addComment = useAddIssueComment();
  const [text, setText] = useState("");

  function getAuthorName(authorId: bigint): string {
    const u = users.find((u) => u.id === authorId);
    return u?.name ?? `User #${authorId}`;
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    try {
      await addComment.mutateAsync({
        issueId,
        content: text.trim(),
        authorId: 0n,
      });
      setText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    }
  }

  return (
    <div
      className="mt-4 pt-4 border-t border-white/5"
      data-ocid="issues.comment_panel"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
        Comments ({comments.length})
      </p>
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
          {[...comments]
            .sort((a, b) => Number(a.timestamp - b.timestamp))
            .map((c: IssueComment) => (
              <div
                key={String(c.id)}
                className="glass rounded-lg p-3"
                data-ocid="issues.comment_item"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground/80">
                    {getAuthorName(c.authorId)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {relativeTime(c.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-foreground/90">{c.content}</p>
              </div>
            ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="bg-white/5 border-white/10 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          data-ocid="issues.comment_input"
        />
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={!text.trim() || addComment.isPending}
          className="shrink-0"
          data-ocid="issues.comment_submit_button"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── UpdateStatusModal ─────────────────────────────────────────────────────────
function UpdateStatusModal({
  issue,
  users,
  onClose,
}: {
  issue: IssueView;
  users: UserView[];
  onClose: () => void;
}) {
  const updateIssue = useUpdateIssue();
  const [status, setStatus] = useState<IssueStatus>(
    issue.status as IssueStatus,
  );
  const [severity, setSeverity] = useState<IssueSeverity>(
    issue.severity as IssueSeverity,
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    issue.assignedTo != null ? String(issue.assignedTo) : "",
  );

  async function handleSave() {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        severity,
        status,
        assignedTo: assignedTo ? BigInt(assignedTo) : undefined,
      });
      toast.success("Issue updated");
      onClose();
    } catch {
      toast.error("Failed to update issue");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="issues.update_dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative glass-elevated rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-foreground">
            Update Issue
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-smooth"
            aria-label="Close"
            data-ocid="issues.update_close_button"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="update-status-select"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Status
            </label>
            <select
              id="update-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as IssueStatus)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
              data-ocid="issues.update_status_select"
            >
              <option value={IssueStatus.open}>Open</option>
              <option value={IssueStatus.in_progress}>In Progress</option>
              <option value={IssueStatus.resolved}>Resolved</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="update-severity-select"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Severity
            </label>
            <select
              id="update-severity-select"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
              data-ocid="issues.update_severity_select"
            >
              <option value={IssueSeverity.critical}>Critical</option>
              <option value={IssueSeverity.high}>High</option>
              <option value={IssueSeverity.medium}>Medium</option>
              <option value={IssueSeverity.low}>Low</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="update-assign-select"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Assign To
            </label>
            <select
              id="update-assign-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
              data-ocid="issues.update_assign_select"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={String(u.id)} value={String(u.id)}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="issues.update_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSave}
            disabled={updateIssue.isPending}
            data-ocid="issues.update_save_button"
          >
            {updateIssue.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── CreateIssueModal ──────────────────────────────────────────────────────────
function CreateIssueModal({
  products,
  users,
  onClose,
}: {
  products: ProductView[];
  users: UserView[];
  onClose: () => void;
}) {
  const createIssue = useCreateIssue();
  const [form, setForm] = useState({
    productId: products[0] ? String(products[0].id) : "",
    title: "",
    description: "",
    severity: IssueSeverity.medium,
    assignedTo: "",
  });

  function update(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleCreate() {
    if (!form.title.trim() || !form.productId) {
      toast.error("Product and title are required");
      return;
    }
    try {
      await createIssue.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        severity: form.severity as IssueSeverity,
        productId: BigInt(form.productId),
        assignedTo: form.assignedTo ? BigInt(form.assignedTo) : undefined,
      });
      toast.success("Issue created");
      onClose();
    } catch {
      toast.error("Failed to create issue");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="issues.create_dialog"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        role="presentation"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative glass-elevated rounded-2xl p-6 w-full max-w-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/20">
              <Bug className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Create Issue
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-smooth"
            aria-label="Close"
            data-ocid="issues.create_close_button"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="create-product-select"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Product
            </label>
            <select
              id="create-product-select"
              value={form.productId}
              onChange={(e) => update("productId", e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
              data-ocid="issues.create_product_select"
            >
              {products.length === 0 && <option value="">No products</option>}
              {products.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="create-title-input"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Title
            </label>
            <Input
              id="create-title-input"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Brief issue title"
              className="bg-white/5 border-white/10"
              data-ocid="issues.create_title_input"
            />
          </div>
          <div>
            <label
              htmlFor="create-description-textarea"
              className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
            >
              Description
            </label>
            <Textarea
              id="create-description-textarea"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the issue in detail…"
              rows={4}
              className="bg-white/5 border-white/10 resize-none"
              data-ocid="issues.create_description_textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="create-severity-select"
                className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
              >
                Severity
              </label>
              <select
                id="create-severity-select"
                value={form.severity}
                onChange={(e) => update("severity", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
                data-ocid="issues.create_severity_select"
              >
                <option value={IssueSeverity.critical}>Critical</option>
                <option value={IssueSeverity.high}>High</option>
                <option value={IssueSeverity.medium}>Medium</option>
                <option value={IssueSeverity.low}>Low</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="create-assign-select"
                className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block"
              >
                Assign To
              </label>
              <select
                id="create-assign-select"
                value={form.assignedTo}
                onChange={(e) => update("assignedTo", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
                data-ocid="issues.create_assign_select"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={String(u.id)} value={String(u.id)}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="issues.create_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleCreate}
            disabled={createIssue.isPending}
            data-ocid="issues.create_submit_button"
          >
            {createIssue.isPending ? "Creating…" : "Create Issue"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── IssueCard ─────────────────────────────────────────────────────────────────
function IssueCard({
  issue,
  index,
  products,
  users,
  expanded,
  onToggleExpand,
}: {
  issue: IssueView;
  index: number;
  products: ProductView[];
  users: UserView[];
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const resolveIssue = useResolveIssue();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const isResolved = (issue.status as IssueStatus) === IssueStatus.resolved;
  const colors = SEVERITY_COLORS[issue.severity as IssueSeverity];
  const product = products.find((p) => p.id === issue.productId);
  const assignedUser = users.find(
    (u) => issue.assignedTo != null && u.id === issue.assignedTo,
  );

  async function handleResolve(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await resolveIssue.mutateAsync(issue.id);
      toast.success("Issue resolved");
    } catch {
      toast.error("Failed to resolve issue");
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`glass-card rounded-xl border-l-4 ${colors.border} overflow-hidden transition-smooth hover:border-opacity-80 ${
          isResolved ? "opacity-60" : ""
        }`}
        data-ocid={`issues.item.${index + 1}`}
      >
        {/* Main row */}
        <button
          type="button"
          className="p-4 w-full text-left cursor-pointer"
          onClick={onToggleExpand}
          aria-expanded={expanded}
        >
          <div className="flex items-start gap-3">
            {/* Severity dot */}
            <span
              className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${colors.dot}`}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`text-sm font-semibold text-foreground truncate ${
                    isResolved ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {issue.title}
                </h3>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 border ${colors.badge}`}
                >
                  {severityLabel(issue.severity as IssueSeverity)}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 border ${STATUS_STYLES[issue.status as IssueStatus]}`}
                >
                  {STATUS_LABEL[issue.status as IssueStatus]}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                {issue.description || "No description provided."}
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {product && (
                  <span className="inline-flex items-center gap-1 text-xs text-blue-300/80 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5">
                    {product.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Created {relativeTime(issue.createdAt)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Updated {relativeTime(issue.updatedAt)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {assignedUser ? (
                    <span className="text-violet-300/80">
                      {assignedUser.name}
                    </span>
                  ) : (
                    <span className="italic">Unassigned</span>
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {!isResolved && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleResolve}
                  disabled={resolveIssue.isPending}
                  className="text-xs h-7 px-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                  data-ocid={`issues.resolve_button.${index + 1}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Resolve
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowUpdateModal(true)}
                className="text-xs h-7 px-2"
                data-ocid={`issues.update_button.${index + 1}`}
              >
                Update
              </Button>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-white/10 transition-smooth"
                aria-label={expanded ? "Collapse" : "Expand"}
                data-ocid={`issues.expand_button.${index + 1}`}
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-white/5 pt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                  Full Description
                </p>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                  {issue.description || "No description provided."}
                </p>
                <IssueCommentPanel issueId={issue.id} users={users} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showUpdateModal && (
          <UpdateStatusModal
            issue={issue}
            users={users}
            onClose={() => setShowUpdateModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── IssuesPage ────────────────────────────────────────────────────────────────
type StatusTab = "all" | IssueStatus;
type SeverityFilter = "all" | IssueSeverity;

export default function IssuesPage() {
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data: allIssues = [], isLoading: issuesLoading } = useIssues();
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers();

  // Status counts
  const counts = useMemo(
    () => ({
      open: allIssues.filter(
        (i) => (i.status as IssueStatus) === IssueStatus.open,
      ).length,
      in_progress: allIssues.filter(
        (i) => (i.status as IssueStatus) === IssueStatus.in_progress,
      ).length,
      resolved: allIssues.filter(
        (i) => (i.status as IssueStatus) === IssueStatus.resolved,
      ).length,
    }),
    [allIssues],
  );

  // Filtered list
  const filtered = useMemo(() => {
    let list = [...allIssues];
    if (statusTab !== "all") {
      list = list.filter((i) => (i.status as IssueStatus) === statusTab);
    }
    if (severityFilter !== "all") {
      list = list.filter(
        (i) => (i.severity as IssueSeverity) === severityFilter,
      );
    }
    if (productFilter !== "all") {
      list = list.filter((i) => String(i.productId) === productFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => Number(b.createdAt - a.createdAt));
  }, [allIssues, statusTab, severityFilter, productFilter, search]);

  const STATUS_TABS: { id: StatusTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: allIssues.length },
    { id: IssueStatus.open, label: "Open", count: counts.open },
    {
      id: IssueStatus.in_progress,
      label: "In Progress",
      count: counts.in_progress,
    },
    { id: IssueStatus.resolved, label: "Resolved", count: counts.resolved },
  ];

  return (
    <div className="min-h-screen p-6" data-ocid="issues.page">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-accent/20 glow-violet">
              <Bug className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-display font-bold gradient-text">
              Issues
            </h1>
          </div>
          <div className="flex items-center gap-2 ml-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-xs text-red-300">
              <AlertTriangle className="w-3 h-3" />
              {counts.open} Open
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-xs text-blue-300">
              <Zap className="w-3 h-3" />
              {counts.in_progress} In Progress
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-xs text-emerald-300">
              <CheckCircle2 className="w-3 h-3" />
              {counts.resolved} Resolved
            </span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setShowCreate(true)}
          className="gap-2"
          data-ocid="issues.create_open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Create Issue
        </Button>
      </div>

      {/* Filter bar */}
      <div className="glass-card rounded-xl p-4 mb-6">
        {/* Status tabs */}
        <div className="flex items-center gap-1 mb-4 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-smooth ${
                statusTab === tab.id
                  ? "bg-accent/20 text-accent border border-accent/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              data-ocid={`issues.filter.tab.${tab.id}`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  statusTab === tab.id ? "bg-accent/30" : "bg-white/10"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Severity + Product + Search */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value as SeverityFilter)
              }
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground"
              data-ocid="issues.filter.severity_select"
            >
              <option value="all">All Severities</option>
              <option value={IssueSeverity.critical}>Critical</option>
              <option value={IssueSeverity.high}>High</option>
              <option value={IssueSeverity.medium}>Medium</option>
              <option value={IssueSeverity.low}>Low</option>
            </select>
          </div>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground"
            data-ocid="issues.filter.product_select"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issues…"
              className="pl-9 bg-white/5 border-white/10 text-sm"
              data-ocid="issues.filter.search_input"
            />
          </div>
        </div>
      </div>

      {/* Issue list */}
      {issuesLoading ? (
        <div className="space-y-3" data-ocid="issues.loading_state">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <div className="flex gap-3">
                <Skeleton className="w-2 h-2 rounded-full mt-1.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 glass-card rounded-xl"
          data-ocid="issues.empty_state"
        >
          <div className="p-4 rounded-2xl bg-accent/10 mb-4">
            <MessageSquare className="w-10 h-10 text-accent/60" />
          </div>
          <p className="text-lg font-semibold text-foreground/60 mb-1">
            No issues found
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {search ||
            statusTab !== "all" ||
            severityFilter !== "all" ||
            productFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first issue to start tracking"}
          </p>
          {allIssues.length === 0 && (
            <Button
              type="button"
              onClick={() => setShowCreate(true)}
              className="gap-2"
              data-ocid="issues.empty_create_button"
            >
              <Plus className="w-4 h-4" />
              Create Issue
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue, idx) => (
            <IssueCard
              key={String(issue.id)}
              issue={issue}
              index={idx}
              products={products}
              users={users}
              expanded={expandedId === String(issue.id)}
              onToggleExpand={() =>
                setExpandedId((prev) =>
                  prev === String(issue.id) ? null : String(issue.id),
                )
              }
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateIssueModal
            products={products}
            users={users}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
