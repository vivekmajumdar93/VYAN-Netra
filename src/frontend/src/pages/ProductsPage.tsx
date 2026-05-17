import { ProductStatus } from "@/backend";
import type { ProductView } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDisconnectProduct,
  useProducts,
  useReconnectProduct,
  useRegisterProduct,
  useSyncProduct,
} from "@/hooks/use-backend";
import {
  CalendarDays,
  Clock,
  Link2,
  Link2Off,
  Package,
  Plus,
  RefreshCw,
  Search,
  Unplug,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  if (!ts || ts === 0n) return "—";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(ts: bigint): string {
  if (!ts || ts === 0n) return "Never";
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function isAlphanumeric(str: string): boolean {
  return /^[A-Z0-9]{6}$/.test(str);
}

// ── Register Modal ─────────────────────────────────────────────────────────────

const DOT_KEYS = ["d1", "d2", "d3", "d4", "d5", "d6"] as const;

function RegisterModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const register = useRegisterProduct();

  function validateCode(val: string) {
    if (val.length > 0 && !isAlphanumeric(val)) {
      setCodeError("Must be exactly 6 alphanumeric characters (A–Z, 0–9)");
    } else {
      setCodeError("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAlphanumeric(code)) {
      setCodeError("Must be exactly 6 alphanumeric characters (A–Z, 0–9)");
      return;
    }
    try {
      await register.mutateAsync({ name, description: desc, code });
      toast.success(`“${name}” connected to VYAN Netra`, {
        description: `Product code ${code} registered successfully`,
      });
      onClose();
    } catch {
      toast.error("Failed to register product", {
        description: "Check the 6-digit code and try again",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
      data-ocid="products.dialog"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 relative"
        style={{
          background:
            "linear-gradient(135deg, rgba(11,46,92,0.97) 0%, rgba(74,26,107,0.97) 100%)",
          border: "1px solid rgba(91,157,255,0.3)",
          boxShadow:
            "0 0 80px rgba(91,157,255,0.15), 0 0 40px rgba(147,89,255,0.1), inset 0 1px 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(91,157,255,0.15)",
                border: "1px solid rgba(91,157,255,0.3)",
              }}
            >
              <Unplug className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-[#E8E8FF]">
                Register Product
              </h2>
              <p className="text-xs text-[rgba(232,232,255,0.4)] font-mono mt-0.5">
                Connect via 6-digit code
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            data-ocid="products.close_button"
            className="p-1.5 rounded-lg hover:bg-[rgba(232,232,255,0.06)] transition-colors mt-0.5"
          >
            <X className="w-4 h-4 text-[rgba(232,232,255,0.4)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="reg-code"
              className="text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]"
            >
              6-Digit Product Code
            </Label>
            <Input
              id="reg-code"
              value={code}
              onChange={(e) => {
                const val = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                setCode(val);
                validateCode(val);
              }}
              maxLength={6}
              placeholder="AB12CD"
              required
              autoFocus
              data-ocid="products.code.input"
              className="font-mono tracking-[0.3em] text-center text-lg h-12 bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.25)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.6)] transition-colors"
            />
            {codeError && (
              <p
                className="text-[10px] font-mono text-red-400 mt-1"
                data-ocid="products.code.field_error"
              >
                {codeError}
              </p>
            )}
            <div className="flex justify-center gap-1.5 mt-2">
              {DOT_KEYS.map((k, i) => (
                <div
                  key={k}
                  className="h-0.5 w-6 rounded-full transition-all duration-200"
                  style={{
                    background:
                      i < code.length
                        ? "rgba(91,157,255,0.8)"
                        : "rgba(91,157,255,0.15)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-name"
              className="text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]"
            >
              Product Name
            </Label>
            <Input
              id="reg-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="VYAN Core, Netra Web, …"
              data-ocid="products.name.input"
              className="bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.5)] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="reg-desc"
              className="text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]"
            >
              Description
              <span className="normal-case tracking-normal text-[rgba(232,232,255,0.25)] ml-1">
                (optional)
              </span>
            </Label>
            <Input
              id="reg-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What does this product do?"
              data-ocid="products.desc.input"
              className="bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.5)] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-[rgba(232,232,255,0.12)] text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] hover:bg-[rgba(232,232,255,0.06)]"
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                register.isPending || !name || code.length !== 6 || !!codeError
              }
              className="flex-1 disabled:opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, rgba(91,157,255,0.3) 0%, rgba(147,89,255,0.3) 100%)",
                border: "1px solid rgba(91,157,255,0.4)",
                color: "#E8E8FF",
              }}
              data-ocid="products.submit_button"
            >
              {register.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────────

function ProductCard({
  product,
  index,
}: {
  product: ProductView;
  index: number;
}) {
  const disconnect = useDisconnectProduct();
  const reconnect = useReconnectProduct();
  const sync = useSyncProduct();
  const isConnected = product.status === ProductStatus.connected;

  async function handleSync() {
    try {
      await sync.mutateAsync(product.id);
      toast.success(`Synced “${product.name}”`, {
        description: "Latest data pulled from the product",
      });
    } catch {
      toast.error("Sync failed", {
        description: "Unable to reach the product",
      });
    }
  }

  async function handleDisconnect() {
    try {
      await disconnect.mutateAsync(product.id);
      toast.info(`“${product.name}” disconnected`);
    } catch {
      toast.error("Disconnect failed");
    }
  }

  async function handleReconnect() {
    try {
      await reconnect.mutateAsync(product.id);
      toast.success(`“${product.name}” reconnected`, {
        description: "Product is now live in VYAN Netra",
      });
    } catch {
      toast.error("Reconnect failed");
    }
  }

  return (
    <div
      className="rounded-2xl flex flex-col gap-0 overflow-hidden transition-smooth hover:scale-[1.015] group"
      style={{
        background: isConnected
          ? "linear-gradient(145deg, rgba(11,46,92,0.55) 0%, rgba(8,14,32,0.7) 60%)"
          : "rgba(8,12,24,0.65)",
        border: isConnected
          ? "1px solid rgba(91,157,255,0.18)"
          : "1px solid rgba(100,100,120,0.12)",
        backdropFilter: "blur(12px)",
        boxShadow: isConnected
          ? "0 4px 32px rgba(91,157,255,0.07), inset 0 1px 0 rgba(255,255,255,0.03)"
          : "none",
      }}
      data-ocid={`products.item.${index}`}
    >
      {/* Top accent bar */}
      <div
        className="h-px w-full"
        style={{
          background: isConnected
            ? "linear-gradient(90deg, transparent 0%, rgba(91,157,255,0.5) 40%, rgba(147,89,255,0.5) 70%, transparent 100%)"
            : "rgba(100,100,120,0.08)",
        }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isConnected
                  ? "rgba(91,157,255,0.12)"
                  : "rgba(80,80,100,0.1)",
                border: isConnected
                  ? "1px solid rgba(91,157,255,0.22)"
                  : "1px solid rgba(100,100,120,0.14)",
              }}
            >
              <Package
                className="w-5 h-5"
                style={{
                  color: isConnected ? "#5b9dff" : "rgba(150,150,180,0.4)",
                }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate leading-tight">
                {product.name}
              </h3>
              <p className="text-[11px] font-mono text-[rgba(232,232,255,0.3)] truncate mt-0.5">
                {product.description || "No description"}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span
            className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full"
            style={{
              background: isConnected
                ? "rgba(52,211,153,0.1)"
                : "rgba(80,80,100,0.12)",
              color: isConnected ? "#34D399" : "rgba(150,150,180,0.5)",
              border: `1px solid ${
                isConnected ? "rgba(52,211,153,0.22)" : "rgba(100,100,120,0.15)"
              }`,
              boxShadow: isConnected ? "0 0 8px rgba(52,211,153,0.15)" : "none",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isConnected ? "#34D399" : "rgba(120,120,150,0.5)",
                boxShadow: isConnected ? "0 0 4px #34D399" : "none",
              }}
            />
            {isConnected ? "connected" : "disconnected"}
          </span>
        </div>

        {/* Code badge */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-wider">
            Code
          </span>
          <span
            className="text-xs font-mono tracking-[0.2em] px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(91,157,255,0.08)",
              border: "1px solid rgba(91,157,255,0.15)",
              color: "#5b9dff",
            }}
          >
            {product.code}
          </span>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded-lg px-3 py-2"
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(91,157,255,0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <CalendarDays className="w-3 h-3 text-[rgba(91,157,255,0.5)]" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-[rgba(232,232,255,0.25)]">
                Registered
              </span>
            </div>
            <span className="text-[11px] font-mono text-[rgba(232,232,255,0.55)]">
              {formatTimestamp(product.registeredAt)}
            </span>
          </div>
          <div
            className="rounded-lg px-3 py-2"
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(91,157,255,0.06)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-[rgba(147,89,255,0.5)]" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-[rgba(232,232,255,0.25)]">
                Last Sync
              </span>
            </div>
            <span className="text-[11px] font-mono text-[rgba(232,232,255,0.55)]">
              {formatRelativeTime(product.lastSync?.[0] ?? 0n)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1 pt-1 border-t"
          style={{ borderColor: "rgba(91,157,255,0.08)" }}
        >
          <button
            type="button"
            onClick={handleSync}
            disabled={sync.isPending}
            aria-label="Sync product"
            data-ocid={`products.sync.button.${index}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(91,157,255,0.1)] disabled:opacity-50"
            style={{ color: "rgba(91,157,255,0.7)" }}
          >
            <RefreshCw
              className={`w-3 h-3 ${sync.isPending ? "animate-spin" : ""}`}
            />
            Sync
          </button>

          <button
            type="button"
            aria-label="View product details"
            data-ocid={`products.view.button.${index}`}
            onClick={() =>
              toast.info("Product detail view coming soon", {
                description: `Full details for "${product.name}" will be available in the next release`,
              })
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(147,89,255,0.1)]"
            style={{ color: "rgba(147,89,255,0.7)" }}
          >
            <Zap className="w-3 h-3" />
            Details
          </button>

          <div className="flex-1" />

          {isConnected ? (
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={disconnect.isPending}
              aria-label="Disconnect product"
              data-ocid={`products.disconnect.button.${index}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(239,68,68,0.1)] disabled:opacity-50"
              style={{ color: "rgba(239,68,68,0.6)" }}
            >
              <Link2Off className="w-3 h-3" />
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReconnect}
              disabled={reconnect.isPending}
              aria-label="Reconnect product"
              data-ocid={`products.reconnect.button.${index}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(52,211,153,0.1)] disabled:opacity-50"
              style={{ color: "rgba(52,211,153,0.7)" }}
            >
              <Link2 className="w-3 h-3" />
              Reconnect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────────

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8,14,32,0.5)",
        border: "1px solid rgba(91,157,255,0.07)",
      }}
      data-ocid={`products.loading_state.${index}`}
    >
      <div className="h-px bg-[rgba(91,157,255,0.07)]" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl bg-[rgba(91,157,255,0.06)]" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-32 bg-[rgba(91,157,255,0.06)]" />
            <Skeleton className="h-2.5 w-24 bg-[rgba(91,157,255,0.04)]" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full bg-[rgba(91,157,255,0.06)]" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg bg-[rgba(91,157,255,0.05)]" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-12 rounded-lg bg-[rgba(91,157,255,0.04)]" />
          <Skeleton className="h-12 rounded-lg bg-[rgba(91,157,255,0.04)]" />
        </div>
        <Skeleton className="h-8 w-full rounded-lg bg-[rgba(91,157,255,0.04)]" />
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

type FilterTab = "all" | "connected" | "disconnected";

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { data: products, isLoading } = useProducts();

  const filtered = (products ?? []).filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "connected" && p.status === ProductStatus.connected) ||
      (activeTab === "disconnected" && p.status === ProductStatus.disconnected);
    return matchesSearch && matchesTab;
  });

  const connectedCount = (products ?? []).filter(
    (p) => p.status === ProductStatus.connected,
  ).length;
  const disconnectedCount = (products ?? []).filter(
    (p) => p.status === ProductStatus.disconnected,
  ).length;

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all", label: "All", count: products?.length ?? 0 },
    { id: "connected", label: "Connected", count: connectedCount },
    { id: "disconnected", label: "Disconnected", count: disconnectedCount },
  ];

  return (
    <div className="p-6 space-y-6" data-ocid="products.page">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-[#E8E8FF] text-glow-silver">
            Products
          </h1>
          <p className="text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1">
            {isLoading ? (
              <span className="opacity-50">Loading…</span>
            ) : (
              <>
                <span style={{ color: "#5b9dff" }}>
                  {products?.length ?? 0}
                </span>
                {" registered · "}
                <span style={{ color: "#34D399" }}>{connectedCount}</span>
                {" connected"}
              </>
            )}
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="gap-2 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(91,157,255,0.2) 0%, rgba(147,89,255,0.2) 100%)",
            border: "1px solid rgba(91,157,255,0.35)",
            color: "#E8E8FF",
            boxShadow: "0 0 20px rgba(91,157,255,0.15)",
          }}
          data-ocid="products.add_button"
        >
          <Plus className="w-4 h-4" />
          Register Product
        </Button>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(91,157,255,0.4)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code…"
            data-ocid="products.search_input"
            className="pl-9 bg-[rgba(8,14,32,0.7)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)] focus:border-[rgba(91,157,255,0.4)] transition-colors"
          />
        </div>

        <div
          className="flex items-center gap-1 rounded-xl p-1 flex-shrink-0"
          style={{
            background: "rgba(8,14,32,0.7)",
            border: "1px solid rgba(91,157,255,0.12)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`products.filter.${tab.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
              style={{
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, rgba(91,157,255,0.2) 0%, rgba(147,89,255,0.2) 100%)"
                    : "transparent",
                border:
                  activeTab === tab.id
                    ? "1px solid rgba(91,157,255,0.25)"
                    : "1px solid transparent",
                color:
                  activeTab === tab.id ? "#E8E8FF" : "rgba(232,232,255,0.35)",
              }}
            >
              {tab.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background:
                    activeTab === tab.id
                      ? "rgba(91,157,255,0.2)"
                      : "rgba(91,157,255,0.07)",
                  color:
                    activeTab === tab.id ? "#5b9dff" : "rgba(91,157,255,0.5)",
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filtered.length === 0 && (products ?? []).length === 0 ? (
        /* True empty state */
        <div
          className="rounded-2xl p-16 flex flex-col items-center gap-5"
          style={{
            background: "rgba(8,14,32,0.4)",
            border: "1px dashed rgba(91,157,255,0.18)",
            backdropFilter: "blur(8px)",
          }}
          data-ocid="products.empty_state"
        >
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle, rgba(91,157,255,0.15) 0%, rgba(147,89,255,0.08) 60%, transparent 100%)",
                border: "1px solid rgba(91,157,255,0.2)",
                boxShadow: "0 0 32px rgba(91,157,255,0.1)",
              }}
            >
              <Package className="w-8 h-8 text-[rgba(91,157,255,0.4)]" />
            </div>
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
              style={{
                background: "rgba(147,89,255,0.3)",
                border: "1px solid rgba(147,89,255,0.5)",
                boxShadow: "0 0 8px rgba(147,89,255,0.4)",
              }}
            />
            <div
              className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full"
              style={{
                background: "rgba(91,157,255,0.25)",
                border: "1px solid rgba(91,157,255,0.4)",
              }}
            />
          </div>
          <div className="text-center space-y-2">
            <p className="text-base font-display font-semibold text-[rgba(232,232,255,0.6)]">
              No products in the void
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.3)] max-w-sm">
              Connect your apps, websites, and platforms to VYAN Netra using
              their unique 6-digit code
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="gap-2 mt-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(91,157,255,0.15) 0%, rgba(147,89,255,0.15) 100%)",
              border: "1px solid rgba(91,157,255,0.3)",
              color: "#E8E8FF",
            }}
            data-ocid="products.empty.add_button"
          >
            <Zap className="w-4 h-4" />
            Register First Product
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        /* Filtered empty state */
        <div
          className="rounded-2xl p-12 flex flex-col items-center gap-4"
          style={{
            background: "rgba(8,14,32,0.35)",
            border: "1px dashed rgba(91,157,255,0.1)",
          }}
          data-ocid="products.filtered_empty_state"
        >
          <Search className="w-8 h-8 text-[rgba(91,157,255,0.25)]" />
          <div className="text-center">
            <p className="text-sm font-display text-[rgba(232,232,255,0.4)]">
              No results for “{search || activeTab}”
            </p>
            <p className="text-xs font-mono text-[rgba(232,232,255,0.2)] mt-1">
              Try a different name or code
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveTab("all");
            }}
            className="text-xs font-mono text-[rgba(91,157,255,0.6)] hover:text-[#5b9dff] transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id.toString()} product={p} index={i + 1} />
          ))}
        </div>
      )}

      {showModal && <RegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
