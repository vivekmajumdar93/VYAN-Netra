import { ActivityEventType, UserRole, UserStatus } from "@/backend";
import type { UserActivity, UserView } from "@/backend";
import { Badge } from "@/components/ui/badge";
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
import {
  useCreateUser,
  useProducts,
  useRemoveUser,
  useRestoreUser,
  useSuspendUser,
  useUpdateUserRole,
  useUserActivities,
  useUsers,
} from "@/hooks/use-backend";
import { formatDistanceToNow } from "date-fns";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Clock,
  LogIn,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShieldOff,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ──────────────────────────────────────────────────────────────────

function roleKey(r: UserRole): string {
  if (r === UserRole.admin) return "admin";
  if (r === UserRole.manager) return "manager";
  return "viewer";
}

function statusKey(s: UserStatus): string {
  return s === UserStatus.active ? "active" : "suspended";
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(ts: bigint): string {
  try {
    const ms = Number(ts / 1_000_000n);
    if (ms === 0) return "Never";
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

const ROLE_BG: Record<string, string> = {
  admin: "rgba(147,89,255,0.18)",
  manager: "rgba(91,157,255,0.16)",
  viewer: "rgba(52,211,153,0.13)",
};
const ROLE_COLOR: Record<string, string> = {
  admin: "#B78BFF",
  manager: "#7BBDFF",
  viewer: "#6EE7B7",
};
const ROLE_BORDER: Record<string, string> = {
  admin: "rgba(147,89,255,0.3)",
  manager: "rgba(91,157,255,0.3)",
  viewer: "rgba(52,211,153,0.3)",
};
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#5b9dff,#9359ff)",
  "linear-gradient(135deg,#9359ff,#e054a0)",
  "linear-gradient(135deg,#34d399,#5b9dff)",
  "linear-gradient(135deg,#fbbf24,#f87171)",
  "linear-gradient(135deg,#818cf8,#38bdf8)",
];

function avatarGradient(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  [ActivityEventType.login]: <LogIn className="w-3 h-3" />,
  [ActivityEventType.action]: <Activity className="w-3 h-3" />,
  [ActivityEventType.permissionChange]: <Settings className="w-3 h-3" />,
};

// ── ConfirmDialog ─────────────────────────────────────────────────────────────

function ConfirmDialog({
  title,
  body,
  danger,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      data-ocid="users.dialog"
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "rgba(8,14,34,0.96)",
          border: "1px solid rgba(91,157,255,0.2)",
          boxShadow: "0 0 56px rgba(91,157,255,0.1)",
        }}
      >
        <h3 className="text-base font-display font-bold text-[#E8E8FF] mb-2">
          {title}
        </h3>
        <p
          className={`text-sm font-body mb-6 ${
            danger ? "text-red-400" : "text-[rgba(232,232,255,0.55)]"
          }`}
        >
          {body}
        </p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            data-ocid="users.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className={`flex-1 ${
              danger
                ? "bg-red-600 hover:bg-red-500 border-red-600 text-white"
                : ""
            }`}
            onClick={onConfirm}
            data-ocid="users.confirm_button"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── ActivityPanel ─────────────────────────────────────────────────────────────

function ActivityPanel({ user }: { user: UserView }) {
  const { data: activities, isLoading } = useUserActivities(user.productId);
  const userActivities = (activities ?? [])
    .filter((a) => a.userId === user.id)
    .slice(0, 5);

  return (
    <tr>
      <td
        colSpan={7}
        className="px-0 pt-0 pb-0"
        style={{ background: "rgba(91,157,255,0.03)" }}
      >
        <div className="px-6 py-4">
          <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-3">
            Recent Activity
          </p>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}
            </div>
          ) : userActivities.length === 0 ? (
            <p className="text-xs font-mono text-[rgba(232,232,255,0.3)] italic">
              No activity recorded yet.
            </p>
          ) : (
            <div className="space-y-1.5">
              {userActivities.map((a: UserActivity) => (
                <div
                  key={a.id.toString()}
                  className="flex items-center gap-3 text-xs font-mono"
                >
                  <span className="text-[rgba(91,157,255,0.7)]">
                    {ACTIVITY_ICONS[a.eventType] ?? (
                      <Activity className="w-3 h-3" />
                    )}
                  </span>
                  <span className="text-[rgba(232,232,255,0.65)] flex-1">
                    {a.description || a.eventType}
                  </span>
                  <span className="text-[rgba(232,232,255,0.3)] flex-shrink-0">
                    {relativeTime(a.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── UserRow ───────────────────────────────────────────────────────────────────

function UserRow({
  user,
  index,
  productName,
}: {
  user: UserView;
  index: number;
  productName: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmSuspend, setConfirmSuspend] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [editingRole, setEditingRole] = useState(false);

  const suspend = useSuspendUser();
  const restore = useRestoreUser();
  const remove = useRemoveUser();
  const updateRole = useUpdateUserRole();

  const rk = roleKey(user.role);
  const isSuspended = user.status === UserStatus.suspended;

  return (
    <>
      <tr
        className="border-b border-[rgba(91,157,255,0.07)] hover:bg-[rgba(91,157,255,0.03)] transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setExpanded((v) => !v);
        }}
        tabIndex={0}
        data-ocid={`users.item.${index}`}
      >
        {/* Avatar + Name */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-display font-bold text-white flex-shrink-0"
              style={{ background: avatarGradient(user.name) }}
            >
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-body font-medium text-[#E8E8FF] truncate">
                {user.name}
              </p>
              <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] truncate">
                {user.email}
              </p>
            </div>
          </div>
        </td>

        {/* Product */}
        <td className="px-5 py-3.5">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(91,157,255,0.1)",
              color: "#7BBDFF",
              border: "1px solid rgba(91,157,255,0.2)",
            }}
          >
            {productName}
          </span>
        </td>

        {/* Role */}
        <td
          className="px-5 py-3.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {editingRole ? (
            <Select
              defaultValue={rk}
              onValueChange={(val) => {
                updateRole.mutate(
                  { id: user.id, role: val as UserRole },
                  {
                    onSuccess: () => {
                      toast.success("Role updated");
                      setEditingRole(false);
                    },
                    onError: () => toast.error("Failed to update role"),
                  },
                );
              }}
            >
              <SelectTrigger
                className="h-6 text-[10px] font-mono w-28 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                data-ocid={`users.role_select.${index}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <button
              type="button"
              onClick={() => setEditingRole(true)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full transition-smooth hover:opacity-80"
              style={{
                background: ROLE_BG[rk] ?? "rgba(91,157,255,0.1)",
                color: ROLE_COLOR[rk] ?? "#7BBDFF",
                border: `1px solid ${ROLE_BORDER[rk] ?? "rgba(91,157,255,0.2)"}`,
              }}
              title="Click to edit role"
              data-ocid={`users.role_badge.${index}`}
            >
              {rk}
            </button>
          )}
        </td>

        {/* Status */}
        <td className="px-5 py-3.5">
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{
              background: isSuspended
                ? "rgba(239,68,68,0.1)"
                : "rgba(52,211,153,0.12)",
              color: isSuspended ? "#F87171" : "#34D399",
              border: `1px solid ${
                isSuspended ? "rgba(239,68,68,0.25)" : "rgba(52,211,153,0.25)"
              }`,
            }}
          >
            {statusKey(user.status)}
          </span>
        </td>

        {/* Last Activity */}
        <td className="px-5 py-3.5">
          <span className="text-xs font-mono text-[rgba(232,232,255,0.35)] flex items-center gap-1.5">
            <Clock className="w-3 h-3 flex-shrink-0" />
            {relativeTime(user.lastActivity)}
          </span>
        </td>

        {/* Expand toggle */}
        <td className="px-3 py-3.5">
          <span className="text-[rgba(91,157,255,0.4)]">
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        </td>

        {/* Actions */}
        <td
          className="px-5 py-3.5"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end gap-1">
            {isSuspended ? (
              <button
                type="button"
                onClick={() => {
                  restore.mutate(user.id, {
                    onSuccess: () => toast.success(`${user.name} restored`),
                    onError: () => toast.error("Failed to restore"),
                  });
                }}
                aria-label="Restore user"
                data-ocid={`users.restore_button.${index}`}
                className="p-1.5 rounded-lg hover:bg-[rgba(52,211,153,0.1)] transition-colors"
                title="Restore"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmSuspend(true)}
                aria-label="Suspend user"
                data-ocid={`users.suspend_button.${index}`}
                className="p-1.5 rounded-lg hover:bg-[rgba(251,191,36,0.1)] transition-colors"
                title="Suspend"
              >
                <ShieldOff className="w-3.5 h-3.5 text-yellow-400" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmRemove(true)}
              aria-label="Remove user"
              data-ocid={`users.delete_button.${index}`}
              className="p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </td>
      </tr>

      {expanded && <ActivityPanel user={user} />}

      {confirmSuspend && (
        <ConfirmDialog
          title={`Suspend ${user.name}?`}
          body="This will prevent the user from accessing the product. You can restore them later."
          onConfirm={() => {
            suspend.mutate(user.id, {
              onSuccess: () => toast.success(`${user.name} suspended`),
              onError: () => toast.error("Failed to suspend"),
            });
            setConfirmSuspend(false);
          }}
          onCancel={() => setConfirmSuspend(false)}
        />
      )}

      {confirmRemove && (
        <ConfirmDialog
          title={`Remove ${user.name}?`}
          body="This action is permanent. The user will be removed from the product and all activity data will be lost."
          danger
          onConfirm={() => {
            remove.mutate(user.id, {
              onSuccess: () => toast.success(`${user.name} removed`),
              onError: () => toast.error("Failed to remove"),
            });
            setConfirmRemove(false);
          }}
          onCancel={() => setConfirmRemove(false)}
        />
      )}
    </>
  );
}

// ── InviteModal ───────────────────────────────────────────────────────────────

function InviteModal({ onClose }: { onClose: () => void }) {
  const { data: products } = useProducts();
  const createUser = useCreateUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [productId, setProductId] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) {
      toast.error("Select a product first");
      return;
    }
    try {
      await createUser.mutateAsync({
        productId: BigInt(productId),
        name,
        email,
        role: role as UserRole,
      });
      toast.success(`Invitation sent to ${email}`);
      onClose();
    } catch {
      toast.error("Failed to invite user");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      data-ocid="users.dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "rgba(8,14,34,0.96)",
          border: "1px solid rgba(91,157,255,0.25)",
          boxShadow:
            "0 0 64px rgba(91,157,255,0.12), 0 0 120px rgba(147,89,255,0.08)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#5b9dff,#9359ff)" }}
            >
              <UserPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-[#E8E8FF]">
                Invite User
              </h2>
              <p className="text-[10px] font-mono text-[rgba(232,232,255,0.35)]">
                Grant access to a connected product
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close invite dialog"
            data-ocid="users.close_button"
            className="p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors"
          >
            <X className="w-4 h-4 text-[rgba(232,232,255,0.5)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest">
              Product
            </Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger
                data-ocid="users.product.select"
                className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] focus:ring-[rgba(91,157,255,0.3)]"
              >
                <SelectValue placeholder="Select product…" />
              </SelectTrigger>
              <SelectContent>
                {products?.map((p) => (
                  <SelectItem key={p.id.toString()} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest">
                Full Name
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                data-ocid="users.name.input"
                className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger
                  data-ocid="users.role.select"
                  className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest">
              Email Address
            </Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jane@company.com"
              data-ocid="users.email.input"
              className="bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="users.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUser.isPending}
              className="flex-1 gap-2"
              data-ocid="users.submit_button"
            >
              {createUser.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending…
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> Invite User
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── SkeletonRows ──────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-[rgba(91,157,255,0.07)]">
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-2.5 w-40 rounded" />
              </div>
            </div>
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-20 rounded-full" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-16 rounded-full" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-4 w-16 rounded-full" />
          </td>
          <td className="px-5 py-3.5">
            <Skeleton className="h-3 w-24 rounded" />
          </td>
          <td className="px-3 py-3.5">
            <Skeleton className="h-4 w-4 rounded" />
          </td>
          <td className="px-5 py-3.5">
            <div className="flex justify-end gap-1">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// ── UsersPage ─────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterProduct, setFilterProduct] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: users, isLoading } = useUsers();
  const { data: products } = useProducts();

  // Build a product name lookup
  const productMap = new Map(
    (products ?? []).map((p) => [p.id.toString(), p.name]),
  );

  // Apply filters
  const filtered = (users ?? []).filter((u) => {
    const q = search.toLowerCase();
    if (
      q &&
      !u.name.toLowerCase().includes(q) &&
      !u.email.toLowerCase().includes(q)
    )
      return false;
    if (filterProduct !== "all" && u.productId.toString() !== filterProduct)
      return false;
    if (filterRole !== "all" && roleKey(u.role) !== filterRole) return false;
    if (filterStatus !== "all" && statusKey(u.status) !== filterStatus)
      return false;
    return true;
  });

  const totalCount = users?.length ?? 0;

  return (
    <div className="p-6 space-y-5" data-ocid="users.page">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#5b9dff22,#9359ff22)",
              border: "1px solid rgba(91,157,255,0.2)",
            }}
          >
            <Users className="w-5 h-5" style={{ color: "#7BBDFF" }} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-display font-bold text-[#E8E8FF]">
                Users
              </h1>
              {!isLoading && (
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(91,157,255,0.12)",
                    color: "#7BBDFF",
                    border: "1px solid rgba(91,157,255,0.2)",
                  }}
                  data-ocid="users.count_badge"
                >
                  {totalCount} total
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-0.5">
              Manage users across all connected products
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="gap-2 flex-shrink-0"
          data-ocid="users.invite_button"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </Button>
      </div>

      {/* ── Filter Bar ── */}
      <div
        className="rounded-xl p-4 flex flex-wrap items-center gap-3"
        style={{
          background: "rgba(8,14,34,0.7)",
          border: "1px solid rgba(91,157,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(91,157,255,0.5)] pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            data-ocid="users.search_input"
            className="pl-8 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] h-8 text-xs"
          />
        </div>

        {/* Product filter */}
        <Select value={filterProduct} onValueChange={setFilterProduct}>
          <SelectTrigger
            className="w-40 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]"
            data-ocid="users.product_filter.select"
          >
            <SelectValue placeholder="All Products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products?.map((p) => (
              <SelectItem key={p.id.toString()} value={p.id.toString()}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Role filter */}
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger
            className="w-32 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]"
            data-ocid="users.role_filter.select"
          >
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger
            className="w-32 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]"
            data-ocid="users.status_filter.select"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {/* Active filter pills */}
        {(search ||
          filterProduct !== "all" ||
          filterRole !== "all" ||
          filterStatus !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilterProduct("all");
              setFilterRole("all");
              setFilterStatus("all");
            }}
            className="h-8 px-2.5 text-[10px] font-mono text-[rgba(232,232,255,0.45)] hover:text-[#E8E8FF] flex items-center gap-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.08)] transition-colors"
            data-ocid="users.clear_filters"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(8,14,34,0.7)",
          border: "1px solid rgba(91,157,255,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isLoading ? (
          <table className="w-full">
            <thead>
              <TableHead />
            </thead>
            <tbody data-ocid="users.loading_state">
              <SkeletonRows />
            </tbody>
          </table>
        ) : !filtered.length ? (
          <EmptyState
            hasUsers={totalCount > 0}
            onInvite={() => setShowModal(true)}
          />
        ) : (
          <table className="w-full">
            <thead>
              <TableHead />
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <UserRow
                  key={user.id.toString()}
                  user={user}
                  index={i + 1}
                  productName={
                    productMap.get(user.productId.toString()) ?? "Unknown"
                  }
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <InviteModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

// ── TableHead ─────────────────────────────────────────────────────────────────

function TableHead() {
  const cols = [
    "User",
    "Product",
    "Role",
    "Status",
    "Last Activity",
    "",
    "Actions",
  ];
  const aligns = [
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-right",
  ];
  return (
    <tr className="border-b border-[rgba(91,157,255,0.1)]">
      {cols.map((c, i) => (
        <th
          key={c || `col-${i}`}
          className={`px-5 py-3 ${aligns[i]} text-[10px] font-mono text-[rgba(232,232,255,0.32)] uppercase tracking-widest`}
        >
          {c}
        </th>
      ))}
    </tr>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({
  hasUsers,
  onInvite,
}: {
  hasUsers: boolean;
  onInvite: () => void;
}) {
  return (
    <div
      className="py-20 flex flex-col items-center gap-4"
      data-ocid="users.empty_state"
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(91,157,255,0.08)",
          border: "1px solid rgba(91,157,255,0.15)",
        }}
      >
        <Users className="w-6 h-6 text-[rgba(91,157,255,0.4)]" />
      </div>
      <div className="text-center">
        <p className="text-sm font-body font-medium text-[rgba(232,232,255,0.55)]">
          {hasUsers ? "No users match your filters" : "No users yet"}
        </p>
        <p className="text-xs font-mono text-[rgba(232,232,255,0.28)] mt-1">
          {hasUsers
            ? "Try adjusting your search or filter criteria."
            : "Invite a user to a connected product to get started."}
        </p>
      </div>
      {!hasUsers && (
        <Button
          onClick={onInvite}
          variant="outline"
          className="gap-2 mt-1"
          data-ocid="users.empty_invite_button"
        >
          <Plus className="w-4 h-4" /> Invite First User
        </Button>
      )}
    </div>
  );
}
