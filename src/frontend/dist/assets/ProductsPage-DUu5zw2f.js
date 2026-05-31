import { c as createLucideIcon, r as reactExports, a as useProducts, P as ProductStatus, j as jsxRuntimeExports, k as Button, i as Package, h as useDisconnectProduct, o as useReconnectProduct, g as useSyncProduct, R as RefreshCw, n as ue, L as Link2, p as useRegisterProduct } from "./index-B0U-vI18.js";
import { I as Input } from "./input-ChBNhlJN.js";
import { L as Label } from "./label-dd52H_Md.js";
import { S as Skeleton } from "./skeleton-C_urTQDW.js";
import { P as Plus } from "./plus-D5BLP1nV.js";
import { S as Search } from "./search-Y9EMY528.js";
import { Z as Zap } from "./zap-D_xA7PSe.js";
import { C as Clock } from "./clock-BxmsDJr5.js";
import { U as Unplug } from "./unplug-BKLvYMGo.js";
import { X } from "./x-jRxL18Io.js";
import "./index-CLpxXFLZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M16 14h.01", key: "1gbofw" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M16 18h.01", key: "kzsmim" }]
];
const CalendarDays = createLucideIcon("calendar-days", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7", key: "10o201" }],
  ["path", { d: "M15 7h2a5 5 0 0 1 4 8", key: "1d3206" }],
  ["line", { x1: "8", x2: "12", y1: "12", y2: "12", key: "rvw6j4" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22", key: "a6p6uj" }]
];
const Link2Off = createLucideIcon("link-2-off", __iconNode);
function formatTimestamp(ts) {
  if (!ts || ts === 0n) return "—";
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatRelativeTime(ts) {
  if (!ts || ts === 0n) return "Never";
  const ms = Number(ts) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function isAlphanumeric(str) {
  return /^[A-Z0-9]{6}$/.test(str);
}
const DOT_KEYS = ["d1", "d2", "d3", "d4", "d5", "d6"];
function RegisterModal({ onClose }) {
  const [name, setName] = reactExports.useState("");
  const [desc, setDesc] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [codeError, setCodeError] = reactExports.useState("");
  const register = useRegisterProduct();
  function validateCode(val) {
    if (val.length > 0 && !isAlphanumeric(val)) {
      setCodeError("Must be exactly 6 alphanumeric characters (A–Z, 0–9)");
    } else {
      setCodeError("");
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAlphanumeric(code)) {
      setCodeError("Must be exactly 6 alphanumeric characters (A–Z, 0–9)");
      return;
    }
    try {
      await register.mutateAsync({ name, description: desc, code });
      ue.success(`“${name}” connected to VYAN Netra`, {
        description: `Product code ${code} registered successfully`
      });
      onClose();
    } catch {
      ue.error("Failed to register product", {
        description: "Check the 6-digit code and try again"
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" },
      "data-ocid": "products.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-2xl p-6 relative",
          style: {
            background: "linear-gradient(135deg, rgba(11,46,92,0.97) 0%, rgba(74,26,107,0.97) 100%)",
            border: "1px solid rgba(91,157,255,0.3)",
            boxShadow: "0 0 80px rgba(91,157,255,0.15), 0 0 40px rgba(147,89,255,0.1), inset 0 1px 1px rgba(255,255,255,0.06)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
                    style: {
                      background: "rgba(91,157,255,0.15)",
                      border: "1px solid rgba(91,157,255,0.3)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Unplug, { className: "w-4 h-4 text-blue-400" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-[#E8E8FF]", children: "Register Product" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[rgba(232,232,255,0.4)] font-mono mt-0.5", children: "Connect via 6-digit code" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close modal",
                  "data-ocid": "products.close_button",
                  className: "p-1.5 rounded-lg hover:bg-[rgba(232,232,255,0.06)] transition-colors mt-0.5",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-[rgba(232,232,255,0.4)]" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "reg-code",
                    className: "text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]",
                    children: "6-Digit Product Code"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "reg-code",
                    value: code,
                    onChange: (e) => {
                      const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                      setCode(val);
                      validateCode(val);
                    },
                    maxLength: 6,
                    placeholder: "AB12CD",
                    required: true,
                    autoFocus: true,
                    "data-ocid": "products.code.input",
                    className: "font-mono tracking-[0.3em] text-center text-lg h-12 bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.25)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.6)] transition-colors"
                  }
                ),
                codeError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-mono text-red-400 mt-1",
                    "data-ocid": "products.code.field_error",
                    children: codeError
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-1.5 mt-2", children: DOT_KEYS.map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-0.5 w-6 rounded-full transition-all duration-200",
                    style: {
                      background: i < code.length ? "rgba(91,157,255,0.8)" : "rgba(91,157,255,0.15)"
                    }
                  },
                  k
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "reg-name",
                    className: "text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]",
                    children: "Product Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "reg-name",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    required: true,
                    placeholder: "VYAN Core, Netra Web, …",
                    "data-ocid": "products.name.input",
                    className: "bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.5)] transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    htmlFor: "reg-desc",
                    className: "text-[10px] font-mono uppercase tracking-widest text-[rgba(232,232,255,0.45)]",
                    children: [
                      "Description",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case tracking-normal text-[rgba(232,232,255,0.25)] ml-1", children: "(optional)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "reg-desc",
                    value: desc,
                    onChange: (e) => setDesc(e.target.value),
                    placeholder: "What does this product do?",
                    "data-ocid": "products.desc.input",
                    className: "bg-[rgba(0,0,0,0.3)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.15)] focus:border-[rgba(91,157,255,0.5)] transition-colors"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: onClose,
                    className: "flex-1 border-[rgba(232,232,255,0.12)] text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] hover:bg-[rgba(232,232,255,0.06)]",
                    "data-ocid": "products.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: register.isPending || !name || code.length !== 6 || !!codeError,
                    className: "flex-1 disabled:opacity-40",
                    style: {
                      background: "linear-gradient(135deg, rgba(91,157,255,0.3) 0%, rgba(147,89,255,0.3) 100%)",
                      border: "1px solid rgba(91,157,255,0.4)",
                      color: "#E8E8FF"
                    },
                    "data-ocid": "products.submit_button",
                    children: register.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 mr-2 animate-spin" }),
                      "Connecting…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 mr-2" }),
                      "Connect"
                    ] })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ProductCard({
  product,
  index
}) {
  var _a;
  const disconnect = useDisconnectProduct();
  const reconnect = useReconnectProduct();
  const sync = useSyncProduct();
  const isConnected = product.status === ProductStatus.connected;
  async function handleSync() {
    try {
      await sync.mutateAsync(product.id);
      ue.success(`Synced “${product.name}”`, {
        description: "Latest data pulled from the product"
      });
    } catch {
      ue.error("Sync failed", {
        description: "Unable to reach the product"
      });
    }
  }
  async function handleDisconnect() {
    try {
      await disconnect.mutateAsync(product.id);
      ue.info(`“${product.name}” disconnected`);
    } catch {
      ue.error("Disconnect failed");
    }
  }
  async function handleReconnect() {
    try {
      await reconnect.mutateAsync(product.id);
      ue.success(`“${product.name}” reconnected`, {
        description: "Product is now live in VYAN Netra"
      });
    } catch {
      ue.error("Reconnect failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl flex flex-col gap-0 overflow-hidden transition-smooth hover:scale-[1.015] group",
      style: {
        background: isConnected ? "linear-gradient(145deg, rgba(11,46,92,0.55) 0%, rgba(8,14,32,0.7) 60%)" : "rgba(8,12,24,0.65)",
        border: isConnected ? "1px solid rgba(91,157,255,0.18)" : "1px solid rgba(100,100,120,0.12)",
        backdropFilter: "blur(12px)",
        boxShadow: isConnected ? "0 4px 32px rgba(91,157,255,0.07), inset 0 1px 0 rgba(255,255,255,0.03)" : "none"
      },
      "data-ocid": `products.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-px w-full",
            style: {
              background: isConnected ? "linear-gradient(90deg, transparent 0%, rgba(91,157,255,0.5) 40%, rgba(147,89,255,0.5) 70%, transparent 100%)" : "rgba(100,100,120,0.08)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                  style: {
                    background: isConnected ? "rgba(91,157,255,0.12)" : "rgba(80,80,100,0.1)",
                    border: isConnected ? "1px solid rgba(91,157,255,0.22)" : "1px solid rgba(100,100,120,0.14)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Package,
                    {
                      className: "w-5 h-5",
                      style: {
                        color: isConnected ? "#5b9dff" : "rgba(150,150,180,0.4)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-display font-semibold text-[#E8E8FF] truncate leading-tight", children: product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.3)] truncate mt-0.5", children: product.description || "No description" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full",
                style: {
                  background: isConnected ? "rgba(52,211,153,0.1)" : "rgba(80,80,100,0.12)",
                  color: isConnected ? "#34D399" : "rgba(150,150,180,0.5)",
                  border: `1px solid ${isConnected ? "rgba(52,211,153,0.22)" : "rgba(100,100,120,0.15)"}`,
                  boxShadow: isConnected ? "0 0 8px rgba(52,211,153,0.15)" : "none"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "w-1.5 h-1.5 rounded-full",
                      style: {
                        background: isConnected ? "#34D399" : "rgba(120,120,150,0.5)",
                        boxShadow: isConnected ? "0 0 4px #34D399" : "none"
                      }
                    }
                  ),
                  isConnected ? "connected" : "disconnected"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-wider", children: "Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-xs font-mono tracking-[0.2em] px-2.5 py-1 rounded-lg",
                style: {
                  background: "rgba(91,157,255,0.08)",
                  border: "1px solid rgba(91,157,255,0.15)",
                  color: "#5b9dff"
                },
                children: product.code
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg px-3 py-2",
                style: {
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(91,157,255,0.06)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3 text-[rgba(91,157,255,0.5)]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono uppercase tracking-wider text-[rgba(232,232,255,0.25)]", children: "Registered" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.55)]", children: formatTimestamp(product.registeredAt) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg px-3 py-2",
                style: {
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid rgba(91,157,255,0.06)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-[rgba(147,89,255,0.5)]" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono uppercase tracking-wider text-[rgba(232,232,255,0.25)]", children: "Last Sync" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.55)]", children: formatRelativeTime(((_a = product.lastSync) == null ? void 0 : _a[0]) ?? 0n) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1 pt-1 border-t",
              style: { borderColor: "rgba(91,157,255,0.08)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleSync,
                    disabled: sync.isPending,
                    "aria-label": "Sync product",
                    "data-ocid": `products.sync.button.${index}`,
                    className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(91,157,255,0.1)] disabled:opacity-50",
                    style: { color: "rgba(91,157,255,0.7)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          className: `w-3 h-3 ${sync.isPending ? "animate-spin" : ""}`
                        }
                      ),
                      "Sync"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "aria-label": "View product details",
                    "data-ocid": `products.view.button.${index}`,
                    onClick: () => ue.info("Product detail view coming soon", {
                      description: `Full details for "${product.name}" will be available in the next release`
                    }),
                    className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(147,89,255,0.1)]",
                    style: { color: "rgba(147,89,255,0.7)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
                      "Details"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
                isConnected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleDisconnect,
                    disabled: disconnect.isPending,
                    "aria-label": "Disconnect product",
                    "data-ocid": `products.disconnect.button.${index}`,
                    className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(239,68,68,0.1)] disabled:opacity-50",
                    style: { color: "rgba(239,68,68,0.6)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link2Off, { className: "w-3 h-3" }),
                      "Disconnect"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleReconnect,
                    disabled: reconnect.isPending,
                    "aria-label": "Reconnect product",
                    "data-ocid": `products.reconnect.button.${index}`,
                    className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all hover:bg-[rgba(52,211,153,0.1)] disabled:opacity-50",
                    style: { color: "rgba(52,211,153,0.7)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3 h-3" }),
                      "Reconnect"
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
function ProductSkeleton({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl overflow-hidden",
      style: {
        background: "rgba(8,14,32,0.5)",
        border: "1px solid rgba(91,157,255,0.07)"
      },
      "data-ocid": `products.loading_state.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-[rgba(91,157,255,0.07)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl bg-[rgba(91,157,255,0.06)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32 bg-[rgba(91,157,255,0.06)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-24 bg-[rgba(91,157,255,0.04)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full bg-[rgba(91,157,255,0.06)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 rounded-lg bg-[rgba(91,157,255,0.05)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg bg-[rgba(91,157,255,0.04)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg bg-[rgba(91,157,255,0.04)]" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg bg-[rgba(91,157,255,0.04)]" })
        ] })
      ]
    }
  );
}
function ProductsPage() {
  const [showModal, setShowModal] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const { data: products, isLoading } = useProducts();
  const filtered = (products ?? []).filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || activeTab === "connected" && p.status === ProductStatus.connected || activeTab === "disconnected" && p.status === ProductStatus.disconnected;
    return matchesSearch && matchesTab;
  });
  const connectedCount = (products ?? []).filter(
    (p) => p.status === ProductStatus.connected
  ).length;
  const disconnectedCount = (products ?? []).filter(
    (p) => p.status === ProductStatus.disconnected
  ).length;
  const tabs = [
    { id: "all", label: "All", count: (products == null ? void 0 : products.length) ?? 0 },
    { id: "connected", label: "Connected", count: connectedCount },
    { id: "disconnected", label: "Disconnected", count: disconnectedCount }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "products.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-[#E8E8FF] text-glow-silver", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-50", children: "Loading…" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#5b9dff" }, children: (products == null ? void 0 : products.length) ?? 0 }),
          " registered · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#34D399" }, children: connectedCount }),
          " connected"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowModal(true),
          className: "gap-2 flex-shrink-0",
          style: {
            background: "linear-gradient(135deg, rgba(91,157,255,0.2) 0%, rgba(147,89,255,0.2) 100%)",
            border: "1px solid rgba(91,157,255,0.35)",
            color: "#E8E8FF",
            boxShadow: "0 0 20px rgba(91,157,255,0.15)"
          },
          "data-ocid": "products.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Register Product"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(91,157,255,0.4)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search by name or code…",
            "data-ocid": "products.search_input",
            className: "pl-9 bg-[rgba(8,14,32,0.7)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)] focus:border-[rgba(91,157,255,0.4)] transition-colors"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center gap-1 rounded-xl p-1 flex-shrink-0",
          style: {
            background: "rgba(8,14,32,0.7)",
            border: "1px solid rgba(91,157,255,0.12)"
          },
          children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setActiveTab(tab.id),
              "data-ocid": `products.filter.${tab.id}`,
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
              style: {
                background: activeTab === tab.id ? "linear-gradient(135deg, rgba(91,157,255,0.2) 0%, rgba(147,89,255,0.2) 100%)" : "transparent",
                border: activeTab === tab.id ? "1px solid rgba(91,157,255,0.25)" : "1px solid transparent",
                color: activeTab === tab.id ? "#E8E8FF" : "rgba(232,232,255,0.35)"
              },
              children: [
                tab.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded-full",
                    style: {
                      background: activeTab === tab.id ? "rgba(91,157,255,0.2)" : "rgba(91,157,255,0.07)",
                      color: activeTab === tab.id ? "#5b9dff" : "rgba(91,157,255,0.5)"
                    },
                    children: tab.count
                  }
                )
              ]
            },
            tab.id
          ))
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3", children: [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductSkeleton, { index: i }, i)) }) : filtered.length === 0 && (products ?? []).length === 0 ? (
      /* True empty state */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl p-16 flex flex-col items-center gap-5",
          style: {
            background: "rgba(8,14,32,0.4)",
            border: "1px dashed rgba(91,157,255,0.18)",
            backdropFilter: "blur(8px)"
          },
          "data-ocid": "products.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-20 h-20 rounded-full flex items-center justify-center",
                  style: {
                    background: "radial-gradient(circle, rgba(91,157,255,0.15) 0%, rgba(147,89,255,0.08) 60%, transparent 100%)",
                    border: "1px solid rgba(91,157,255,0.2)",
                    boxShadow: "0 0 32px rgba(91,157,255,0.1)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 text-[rgba(91,157,255,0.4)]" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -top-1 -right-1 w-4 h-4 rounded-full",
                  style: {
                    background: "rgba(147,89,255,0.3)",
                    border: "1px solid rgba(147,89,255,0.5)",
                    boxShadow: "0 0 8px rgba(147,89,255,0.4)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -bottom-1 -left-1 w-3 h-3 rounded-full",
                  style: {
                    background: "rgba(91,157,255,0.25)",
                    border: "1px solid rgba(91,157,255,0.4)"
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-[rgba(232,232,255,0.6)]", children: "No products in the void" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.3)] max-w-sm", children: "Connect your apps, websites, and platforms to VYAN Netra using their unique 6-digit code" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setShowModal(true),
                className: "gap-2 mt-1",
                style: {
                  background: "linear-gradient(135deg, rgba(91,157,255,0.15) 0%, rgba(147,89,255,0.15) 100%)",
                  border: "1px solid rgba(91,157,255,0.3)",
                  color: "#E8E8FF"
                },
                "data-ocid": "products.empty.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                  "Register First Product"
                ]
              }
            )
          ]
        }
      )
    ) : filtered.length === 0 ? (
      /* Filtered empty state */
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl p-12 flex flex-col items-center gap-4",
          style: {
            background: "rgba(8,14,32,0.35)",
            border: "1px dashed rgba(91,157,255,0.1)"
          },
          "data-ocid": "products.filtered_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-8 h-8 text-[rgba(91,157,255,0.25)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-display text-[rgba(232,232,255,0.4)]", children: [
                "No results for “",
                search || activeTab,
                "”"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.2)] mt-1", children: "Try a different name or code" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setSearch("");
                  setActiveTab("all");
                },
                className: "text-xs font-mono text-[rgba(91,157,255,0.6)] hover:text-[#5b9dff] transition-colors",
                children: "Clear filters"
              }
            )
          ]
        }
      )
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3", children: filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p, index: i + 1 }, p.id.toString())) }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterModal, { onClose: () => setShowModal(false) })
  ] });
}
export {
  ProductsPage as default
};
