import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, u as useNavigate, a as useProducts, b as useUsers, d as useActiveAlerts, e as useNotifications, f as useIssues, I as IssueStatus, g as useSyncProduct, h as useDisconnectProduct, P as ProductStatus, i as Package, U as Users, A as Activity, B as Bell, T as TriangleAlert, S as Shield, k as Button, R as RefreshCw, l as Badge, m as Settings, n as ue } from "./index-BCJFQ4-n.js";
import { S as Skeleton } from "./skeleton-DpPmXALx.js";
import { C as CircleCheck } from "./circle-check-BUlkgKWm.js";
import { U as Unplug } from "./unplug-pSsTeDSQ.js";
import { C as CircleX } from "./circle-x-C4brR7CL.js";
import { U as UserPlus } from "./user-plus-Ci0cc_sa.js";
import { Z as Zap } from "./zap-CbQ60J1W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M9 15h6", key: "cctwl0" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }]
];
const FilePlus = createLucideIcon("file-plus", __iconNode);
const ORB_COLORS = [
  "rgba(91, 157, 255, 0.9)",
  "rgba(147, 89, 255, 0.9)",
  "rgba(62, 211, 255, 0.9)",
  "rgba(197, 89, 255, 0.85)",
  "rgba(89, 200, 255, 0.85)"
];
function ParticleCore() {
  const canvasRef = reactExports.useRef(null);
  const animRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const cx = W / 2;
    const cy = H / 2;
    const orbs = ORB_COLORS.map((_, i) => ({
      angle: i / ORB_COLORS.length * Math.PI * 2,
      radius: 60 + i * 28,
      speed: 8e-3 - i * 1e-3,
      size: 7 - i * 0.8,
      trailParticles: []
    }));
    let t = 0;
    const particles = [];
    function spawnParticle(x, y, color) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        size: 1.5 + Math.random() * 2,
        color
      });
    }
    function drawCore() {
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      coreGrad.addColorStop(0, "rgba(255,255,255,0.95)");
      coreGrad.addColorStop(0.3, "rgba(120,180,255,0.8)");
      coreGrad.addColorStop(0.7, "rgba(100,60,220,0.5)");
      coreGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();
      for (let i = 0; i < 3; i++) {
        const r = 36 + i * 16 + Math.sin(t * 2 + i) * 4;
        const alpha = 0.3 - i * 0.08;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx.lineWidth = 1.5 - i * 0.3;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        100 + Math.sin(t) * 5,
        20,
        Math.PI / 12,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(91, 157, 255, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        140 + Math.sin(t + 1) * 6,
        26,
        -Math.PI / 8,
        0,
        Math.PI * 2
      );
      ctx.strokeStyle = "rgba(147, 89, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      const bgGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.max(W, H) * 0.7
      );
      bgGrad.addColorStop(0, "rgba(11, 46, 92, 0.5)");
      bgGrad.addColorStop(0.5, "rgba(30, 15, 60, 0.3)");
      bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);
      t += 0.012;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const progress = p.life / p.maxLife;
        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.7})`);
        ctx.fill();
      }
      drawCore();
      orbs.forEach((orb, i) => {
        orb.angle += orb.speed;
        const wobble = Math.sin(t * 3 + i) * 8;
        const ox = cx + Math.cos(orb.angle) * (orb.radius + wobble);
        const oy = cy + Math.sin(orb.angle) * (orb.radius * 0.4 + wobble * 0.3);
        if (Math.random() < 0.6) spawnParticle(ox, oy, ORB_COLORS[i]);
        const glowGrad = ctx.createRadialGradient(
          ox,
          oy,
          0,
          ox,
          oy,
          orb.size * 4
        );
        glowGrad.addColorStop(0, ORB_COLORS[i]);
        glowGrad.addColorStop(0.4, ORB_COLORS[i].replace(/[\d.]+\)$/, "0.4)"));
        glowGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = ORB_COLORS[i];
        ctx.fill();
      });
      if (Math.random() < 0.3) {
        const angle = Math.random() * Math.PI * 2;
        const r = 160 + Math.random() * 60;
        spawnParticle(
          cx + Math.cos(angle) * r,
          cy + Math.sin(angle) * r * 0.4,
          "rgba(180, 160, 255, 0.6)"
        );
      }
      animRef.current = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "w-full h-full",
      "data-ocid": "particle-core.canvas_target"
    }
  );
}
function formatTime(ns) {
  const ms = Number(ns) / 1e6;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return `${Math.floor(diff / 864e5)}d ago`;
}
const SEVERITY_COLORS = {
  critical: "#EF4444",
  high: "#F59E0B",
  warning: "#F59E0B",
  medium: "#60A5FA",
  low: "#34D399",
  info: "#34D399"
};
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accentColor,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-5 flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2 pt-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass-card rounded-xl p-5 flex items-start gap-4 transition-smooth hover:border-opacity-30",
      style: { boxShadow: `0 0 24px ${accentColor}12` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            style: {
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}30`
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: accentColor }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-[#E8E8FF] mt-0.5 leading-none metric-value", children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[rgba(232,232,255,0.4)] mt-1 font-mono", children: sub })
        ] })
      ]
    }
  );
}
function SectionLabel({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-4", children });
}
const SKELETON_KEYS_HEALTH = ["a", "b", "c", "d"];
const SKELETON_KEYS_PRODUCTS = ["e", "f", "g"];
const SKELETON_KEYS_ACTIVITY = ["h", "i", "j", "k"];
function DashboardPage() {
  const navigate = useNavigate();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: alerts, isLoading: loadingAlerts } = useActiveAlerts();
  const { data: notifications, isLoading: loadingNotifs } = useNotifications(
    null,
    null,
    null
  );
  const { data: issues, isLoading: loadingIssues } = useIssues(
    null,
    IssueStatus.open
  );
  const syncProduct = useSyncProduct();
  const disconnectProduct = useDisconnectProduct();
  const connectedCount = (products == null ? void 0 : products.filter((p) => p.status === ProductStatus.connected).length) ?? 0;
  const totalProducts = (products == null ? void 0 : products.length) ?? 0;
  const totalUsers = (users == null ? void 0 : users.length) ?? 0;
  const activeAlerts = (alerts == null ? void 0 : alerts.length) ?? 0;
  const unreadNotifs = (notifications == null ? void 0 : notifications.filter((n) => !n.isRead).length) ?? 0;
  const openIssues = (issues == null ? void 0 : issues.length) ?? 0;
  const isLoadingAny = loadingProducts || loadingUsers || loadingAlerts || loadingNotifs || loadingIssues;
  const systemStatus = activeAlerts === 0 ? "nominal" : activeAlerts <= 2 ? "warning" : "critical";
  const statusColor = systemStatus === "nominal" ? "#34D399" : systemStatus === "warning" ? "#F59E0B" : "#EF4444";
  const recentNotifs = (notifications ?? []).slice(0, 5);
  function handleSync(id, name) {
    syncProduct.mutate(id, {
      onSuccess: () => ue.success(`Synced ${name}`),
      onError: () => ue.error(`Sync failed for ${name}`)
    });
  }
  function handleDisconnect(id, name) {
    disconnectProduct.mutate(id, {
      onSuccess: () => ue.success(`${name} disconnected`),
      onError: () => ue.error(`Failed to disconnect ${name}`)
    });
  }
  const stats = [
    {
      icon: Package,
      label: "Products",
      value: totalProducts,
      sub: `${connectedCount} connected`,
      accentColor: "#5B9DFF",
      loading: loadingProducts
    },
    {
      icon: Users,
      label: "Total Users",
      value: totalUsers,
      sub: "across all products",
      accentColor: "#A855F7",
      loading: loadingUsers
    },
    {
      icon: Activity,
      label: "Active Alerts",
      value: activeAlerts,
      sub: activeAlerts === 0 ? "All systems nominal" : "Require attention",
      accentColor: activeAlerts > 0 ? "#F59E0B" : "#34D399",
      loading: loadingAlerts
    },
    {
      icon: Bell,
      label: "Notifications",
      value: unreadNotifs,
      sub: "unread messages",
      accentColor: "#60A5FA",
      loading: loadingNotifs
    },
    {
      icon: TriangleAlert,
      label: "Open Issues",
      value: openIssues,
      sub: openIssues === 0 ? "All resolved" : "Awaiting resolution",
      accentColor: openIssues > 0 ? "#EF4444" : "#34D399",
      loading: loadingIssues
    },
    {
      icon: Shield,
      label: "System Health",
      value: systemStatus === "nominal" ? "Good" : systemStatus === "warning" ? "Warn" : "Crit",
      sub: systemStatus === "nominal" ? "No active threats" : `${activeAlerts} alert(s) active`,
      accentColor: statusColor,
      loading: loadingAlerts
    }
  ];
  const quickActions = [
    {
      icon: Package,
      label: "Register Product",
      desc: "Add a new app via 6-digit code",
      accentColor: "#5B9DFF",
      path: "/products",
      ocid: "dashboard.quick_action.register_product"
    },
    {
      icon: UserPlus,
      label: "Invite User",
      desc: "Add a user to a product",
      accentColor: "#A855F7",
      path: "/users",
      ocid: "dashboard.quick_action.invite_user"
    },
    {
      icon: TriangleAlert,
      label: "View Alerts",
      desc: `${activeAlerts} active alert${activeAlerts !== 1 ? "s" : ""}`,
      accentColor: activeAlerts > 0 ? "#F59E0B" : "#34D399",
      path: "/monitoring",
      ocid: "dashboard.quick_action.view_alerts"
    },
    {
      icon: FilePlus,
      label: "Create Issue",
      desc: "Report a new platform issue",
      accentColor: "#EC4899",
      path: "/issues",
      ocid: "dashboard.quick_action.create_issue"
    },
    {
      icon: Zap,
      label: "Deploy Update",
      desc: "Push a version update",
      accentColor: "#8B5CF6",
      path: "/updates",
      ocid: "dashboard.quick_action.deploy_update"
    },
    {
      icon: Settings,
      label: "Settings",
      desc: "Console configuration",
      accentColor: "#64748B",
      path: "/settings",
      ocid: "dashboard.quick_action.settings"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative rounded-2xl overflow-hidden",
        style: {
          background: "linear-gradient(160deg, rgba(11,46,92,0.55) 0%, rgba(74,26,107,0.4) 60%, rgba(0,0,0,0.6) 100%)",
          border: "1px solid rgba(91,157,255,0.18)",
          height: "260px"
        },
        "data-ocid": "dashboard.hero.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(91,157,255,0.1) 0%, rgba(147,89,255,0.06) 40%, transparent 70%)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleCore, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 px-6 pb-5 pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-widest mb-1", children: "VYAN Labs · Command Nexus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold gradient-text", children: "VYAN Netra" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "w-2 h-2 rounded-full animate-pulse",
                  style: { background: statusColor }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs font-mono capitalize",
                  style: { color: statusColor },
                  children: systemStatus
                }
              )
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dashboard.stats.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "System Overview" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { ...s }, s.label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dashboard.health.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "System Health Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "glass-card rounded-xl px-5 py-4 flex flex-wrap items-center gap-6",
          "data-ocid": "dashboard.health.panel",
          children: isLoadingAny ? SKELETON_KEYS_HEALTH.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }, k)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthPill,
              {
                label: "Overall Status",
                value: systemStatus,
                color: statusColor,
                Icon: systemStatus === "nominal" ? CircleCheck : TriangleAlert
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthPill,
              {
                label: "Unread Notifs",
                value: String(unreadNotifs),
                color: unreadNotifs > 0 ? "#F59E0B" : "#34D399",
                Icon: Bell
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthPill,
              {
                label: "Open Issues",
                value: String(openIssues),
                color: openIssues > 0 ? "#EF4444" : "#34D399",
                Icon: TriangleAlert
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthPill,
              {
                label: "Active Alerts",
                value: String(activeAlerts),
                color: activeAlerts > 0 ? "#F59E0B" : "#34D399",
                Icon: Activity
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthPill,
              {
                label: "Connected",
                value: `${connectedCount}/${totalProducts}`,
                color: "#5B9DFF",
                Icon: Package
              }
            )
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dashboard.products.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Connected Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-xs font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF] -mt-4",
              onClick: () => navigate({ to: "/products" }),
              "data-ocid": "dashboard.products.view_all_button",
              children: "View all →"
            }
          )
        ] }),
        loadingProducts ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_KEYS_PRODUCTS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, k)) }) : !products || products.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass-card rounded-xl p-10 flex flex-col items-center justify-center gap-3",
            "data-ocid": "dashboard.products.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-10 h-10 text-[rgba(91,157,255,0.35)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[rgba(232,232,255,0.45)] font-mono text-center", children: [
                "No products registered yet.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                "Use a 6-digit code to connect a product."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "mt-2 border-[rgba(91,157,255,0.3)] text-[rgba(91,157,255,0.8)]",
                  onClick: () => navigate({ to: "/products" }),
                  "data-ocid": "dashboard.products.register_button",
                  children: "Register Product"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: products.slice(0, 6).map((product, i) => {
          const isConnected = product.status === ProductStatus.connected;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass-card rounded-xl px-4 py-3.5 flex items-center gap-3 group",
              "data-ocid": `dashboard.product.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex-shrink-0 w-2.5 h-2.5 rounded-full",
                    style: {
                      background: isConnected ? "#34D399" : "#6B7280",
                      boxShadow: isConnected ? "0 0 6px rgba(52,211,153,0.6)" : "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold text-[#E8E8FF] truncate", children: product.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] tracking-widest", children: product.code }),
                    product.lastSync[0] ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.25)]", children: [
                      "· synced ",
                      formatTime(product.lastSync[0])
                    ] }) : null
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full",
                    style: {
                      background: isConnected ? "rgba(52,211,153,0.1)" : "rgba(107,114,128,0.12)",
                      color: isConnected ? "#34D399" : "#9CA3AF",
                      border: `1px solid ${isConnected ? "rgba(52,211,153,0.22)" : "rgba(107,114,128,0.18)"}`
                    },
                    children: isConnected ? "connected" : "offline"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "w-7 h-7",
                      title: "Sync",
                      disabled: syncProduct.isPending,
                      onClick: () => handleSync(product.id, product.name),
                      "data-ocid": `dashboard.product.sync_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-[rgba(91,157,255,0.7)]" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "w-7 h-7",
                      title: "View",
                      onClick: () => navigate({ to: "/products" }),
                      "data-ocid": `dashboard.product.view_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5 text-[rgba(232,232,255,0.4)]" })
                    }
                  ),
                  isConnected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "w-7 h-7",
                      title: "Disconnect",
                      disabled: disconnectProduct.isPending,
                      onClick: () => handleDisconnect(product.id, product.name),
                      "data-ocid": `dashboard.product.disconnect_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Unplug, { className: "w-3.5 h-3.5 text-[rgba(239,68,68,0.6)]" })
                    }
                  )
                ] })
              ]
            },
            product.id.toString()
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dashboard.activity.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Recent Activity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-xs font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF] -mt-4",
              onClick: () => navigate({ to: "/notifications" }),
              "data-ocid": "dashboard.activity.view_all_button",
              children: "View all →"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "glass-card rounded-xl divide-y",
            style: { borderColor: "rgba(91,157,255,0.12)" },
            "data-ocid": "dashboard.activity.list",
            children: loadingNotifs ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children: SKELETON_KEYS_ACTIVITY.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, k)) }) : recentNotifs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-10 flex flex-col items-center justify-center gap-3",
                "data-ocid": "dashboard.activity.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "w-8 h-8 text-[rgba(91,157,255,0.3)]" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-[rgba(232,232,255,0.4)] font-mono", children: "No recent notifications" })
                ]
              }
            ) : recentNotifs.map((notif, i) => {
              const sev = Object.keys(notif.severity)[0];
              const color = SEVERITY_COLORS[sev] ?? "#60A5FA";
              const isCritical = sev === "critical";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 px-4 py-3.5 first:rounded-t-xl last:rounded-b-xl",
                  style: {
                    background: notif.isRead ? "transparent" : "rgba(91,157,255,0.04)",
                    borderColor: "rgba(91,157,255,0.1)"
                  },
                  "data-ocid": `dashboard.activity.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-0.5", children: isCritical ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4", style: { color } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4", style: { color } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body text-[#E8E8FF] truncate", children: notif.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 truncate", children: notif.body })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-col items-end gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: "text-[9px] font-mono px-1.5 py-0 capitalize",
                          style: {
                            borderColor: `${color}30`,
                            color,
                            background: `${color}0D`
                          },
                          children: sev
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)]", children: formatTime(notif.createdAt) })
                    ] })
                  ]
                },
                notif.id.toString()
              );
            })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dashboard.quick_actions.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionLabel, { children: "Quick Actions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "glass-card rounded-xl p-4 flex flex-col items-center gap-2.5 text-center transition-smooth hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(91,157,255,0.5)]",
          style: { cursor: "pointer" },
          onClick: () => navigate({ to: action.path }),
          "data-ocid": action.ocid,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-9 h-9 rounded-lg flex items-center justify-center",
                style: {
                  background: `${action.accentColor}15`,
                  border: `1px solid ${action.accentColor}28`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  action.icon,
                  {
                    className: "w-4 h-4",
                    style: { color: action.accentColor }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-semibold text-[#E8E8FF] leading-tight", children: action.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 leading-tight", children: action.desc })
            ] })
          ]
        },
        action.label
      )) })
    ] })
  ] });
}
function HealthPill({ label, value, color, Icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
        style: { background: `${color}18`, border: `1px solid ${color}30` },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3.5 h-3.5" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-sm font-display font-bold capitalize metric-value",
          style: { color },
          children: value
        }
      )
    ] })
  ] });
}
export {
  DashboardPage as default
};
