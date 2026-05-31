import { c as createLucideIcon, r as reactExports, a2 as useAllUpdates, a as useProducts, a3 as UpdateStatus, j as jsxRuntimeExports, R as RefreshCw, a4 as useMarkUpdateDeployed, C as ChevronDown, a5 as useCreateUpdate, a6 as useScheduleUpdate, k as Button, n as ue } from "./index-B0U-vI18.js";
import { I as Input } from "./input-ChBNhlJN.js";
import { L as Label } from "./label-dd52H_Md.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-nfius15g.js";
import { S as Skeleton } from "./skeleton-C_urTQDW.js";
import { T as Textarea } from "./textarea-Odi5Ecqs.js";
import { P as Plus } from "./plus-D5BLP1nV.js";
import { C as ChevronUp } from "./chevron-up-CuGZzQMJ.js";
import { C as CircleCheck } from "./circle-check-q76y3x7a.js";
import { C as CircleX } from "./circle-x-YLQRWRpo.js";
import { C as Calendar } from "./calendar-BG3hIUj3.js";
import "./index-CLpxXFLZ.js";
import "./index-xf975W9k.js";
import "./Combination-sG4yWX_x.js";
import "./index-CdREqOPf.js";
import "./check-Ckl5WtrJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["line", { x1: "3", x2: "9", y1: "12", y2: "12", key: "1dyftd" }],
  ["line", { x1: "15", x2: "21", y1: "12", y2: "12", key: "oup4p8" }]
];
const GitCommitHorizontal = createLucideIcon("git-commit-horizontal", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
];
const HardDrive = createLucideIcon("hard-drive", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }]
];
const Rocket = createLucideIcon("rocket", __iconNode);
function getStatusKey(status) {
  if (status === UpdateStatus.pending) return "pending";
  if (status === UpdateStatus.scheduled) return "scheduled";
  if (status === UpdateStatus.deployed) return "deployed";
  return "failed";
}
const STATUS_META = {
  pending: {
    label: "Pending",
    bg: "rgba(251,191,36,0.10)",
    text: "#FCD34D",
    border: "rgba(251,191,36,0.28)",
    Icon: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { ...props })
  },
  scheduled: {
    label: "Scheduled",
    bg: "rgba(91,157,255,0.10)",
    text: "#7BBDFF",
    border: "rgba(91,157,255,0.28)",
    Icon: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { ...props })
  },
  deployed: {
    label: "Deployed",
    bg: "rgba(52,211,153,0.10)",
    text: "#34D399",
    border: "rgba(52,211,153,0.28)",
    Icon: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { ...props })
  },
  failed: {
    label: "Failed",
    bg: "rgba(239,68,68,0.10)",
    text: "#F87171",
    border: "rgba(239,68,68,0.28)",
    Icon: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { ...props })
  }
};
function formatBytes(kb) {
  const n = Number(kb);
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} GB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} MB`;
  return `${n} KB`;
}
function formatDate(ns) {
  return new Date(Number(ns) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function UpdateCard({
  update,
  index,
  productName
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const deploy = useMarkUpdateDeployed();
  const statusKey = getStatusKey(update.status);
  const meta = STATUS_META[statusKey];
  const StatusIcon = meta.Icon;
  const isDeployable = statusKey === "pending";
  const isMarkable = statusKey === "scheduled";
  const dateToShow = update.deployedAt != null ? { label: "Deployed", val: update.deployedAt } : update.scheduledAt != null ? { label: "Scheduled", val: update.scheduledAt } : null;
  async function handleDeploy() {
    try {
      await deploy.mutateAsync(update.id);
      ue.success(`v${update.version} deployed successfully`);
    } catch {
      ue.error("Failed to deploy update");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-xl p-5 transition-all duration-200",
      style: {
        background: "rgba(8,16,40,0.65)",
        border: "1px solid rgba(91,157,255,0.12)",
        backdropFilter: "blur(14px)"
      },
      "data-ocid": `updates.item.${index}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center",
            style: { background: meta.bg, border: `1px solid ${meta.border}` },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "w-4 h-4", style: { color: meta.text } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
                style: {
                  background: "rgba(91,157,255,0.10)",
                  color: "#7BBDFF",
                  border: "1px solid rgba(91,157,255,0.22)"
                },
                children: productName
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono font-bold text-sm",
                style: { color: "#E8E8FF" },
                children: [
                  "v",
                  update.version
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full",
                style: {
                  background: "rgba(232,232,255,0.05)",
                  color: "rgba(232,232,255,0.45)",
                  border: "1px solid rgba(232,232,255,0.1)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-2.5 h-2.5" }),
                  formatBytes(update.size)
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full",
                style: {
                  background: meta.bg,
                  color: meta.text,
                  border: `1px solid ${meta.border}`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "w-2.5 h-2.5" }),
                  meta.label
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs leading-relaxed mt-1 ${expanded ? "" : "line-clamp-2"}`,
              style: { color: "rgba(232,232,255,0.5)" },
              children: update.releaseNotes
            }
          ),
          update.releaseNotes.length > 120 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((v) => !v),
              className: "flex items-center gap-1 text-[10px] font-mono mt-1.5 transition-colors",
              style: { color: "rgba(91,157,255,0.7)" },
              "data-ocid": `updates.expand_button.${index}`,
              children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-3 h-3" }),
                " Collapse"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3 h-3" }),
                " Expand notes"
              ] })
            }
          ),
          dateToShow && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[10px] font-mono mt-2",
              style: { color: "rgba(232,232,255,0.28)" },
              children: [
                dateToShow.label,
                ": ",
                formatDate(dateToShow.val)
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex items-center gap-2 pt-0.5", children: [
          isDeployable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleDeploy,
              disabled: deploy.isPending,
              className: "flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all",
              style: {
                background: "rgba(52,211,153,0.08)",
                color: "#34D399",
                border: "1px solid rgba(52,211,153,0.25)"
              },
              "data-ocid": `updates.deploy_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "w-3 h-3" }),
                "Deploy Now"
              ]
            }
          ),
          isMarkable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleDeploy,
              disabled: deploy.isPending,
              className: "flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg transition-all",
              style: {
                background: "rgba(52,211,153,0.08)",
                color: "#34D399",
                border: "1px solid rgba(52,211,153,0.25)"
              },
              "data-ocid": `updates.mark_deployed_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
                "Mark Deployed"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
function UpdateSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "rounded-xl p-5",
      style: {
        background: "rgba(8,16,40,0.5)",
        border: "1px solid rgba(91,157,255,0.08)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-xl flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 rounded-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 rounded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-14 rounded-full" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4 rounded" })
        ] })
      ] })
    }
  );
}
const EMPTY_MESSAGES = {
  pending: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
      RefreshCw,
      {
        className: "w-10 h-10",
        style: { color: "rgba(251,191,36,0.3)" }
      }
    ),
    msg: "No pending updates — all systems current"
  },
  scheduled: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Calendar,
      {
        className: "w-10 h-10",
        style: { color: "rgba(91,157,255,0.3)" }
      }
    ),
    msg: "No scheduled updates"
  },
  deployed: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
      CircleCheck,
      {
        className: "w-10 h-10",
        style: { color: "rgba(52,211,153,0.3)" }
      }
    ),
    msg: "No deployed updates yet"
  },
  failed: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-10 h-10", style: { color: "rgba(239,68,68,0.3)" } }),
    msg: "No failed updates — great news!"
  },
  all: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
      RefreshCw,
      {
        className: "w-10 h-10",
        style: { color: "rgba(91,157,255,0.3)" }
      }
    ),
    msg: "No updates found"
  },
  changelog: {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(
      GitCommitHorizontal,
      {
        className: "w-10 h-10",
        style: { color: "rgba(52,211,153,0.3)" }
      }
    ),
    msg: "No deployed updates in changelog yet"
  }
};
function EmptyState({ tab }) {
  const { icon, msg } = EMPTY_MESSAGES[tab] ?? EMPTY_MESSAGES.all;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl p-16 flex flex-col items-center gap-4",
      style: {
        background: "rgba(8,16,40,0.45)",
        border: "1px solid rgba(91,157,255,0.08)"
      },
      "data-ocid": "updates.empty_state",
      children: [
        icon,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm font-mono text-center",
            style: { color: "rgba(232,232,255,0.35)" },
            children: msg
          }
        )
      ]
    }
  );
}
function ChangelogTimeline({
  updates,
  products
}) {
  const deployed = [...updates].filter((u) => u.status === UpdateStatus.deployed).sort((a, b) => {
    const ta = a.deployedAt ? Number(a.deployedAt) : 0;
    const tb = b.deployedAt ? Number(b.deployedAt) : 0;
    return tb - ta;
  });
  if (!deployed.length) return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { tab: "changelog" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute left-2 top-2 bottom-2 w-px",
        style: {
          background: "linear-gradient(to bottom, rgba(52,211,153,0.4), rgba(52,211,153,0.05))"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: deployed.map((u, i) => {
      var _a;
      const pName = ((_a = products.find((p) => p.id === u.productId)) == null ? void 0 : _a.name) ?? "Unknown";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative",
          "data-ocid": `updates.changelog.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute -left-[22px] top-3 w-3 h-3 rounded-full",
                style: {
                  background: "#34D399",
                  boxShadow: "0 0 8px rgba(52,211,153,0.5)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-4",
                style: {
                  background: "rgba(8,16,40,0.65)",
                  border: "1px solid rgba(52,211,153,0.12)",
                  backdropFilter: "blur(12px)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
                        style: {
                          background: "rgba(91,157,255,0.10)",
                          color: "#7BBDFF",
                          border: "1px solid rgba(91,157,255,0.22)"
                        },
                        children: pName
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono font-bold text-sm",
                        style: { color: "#E8E8FF" },
                        children: [
                          "v",
                          u.version
                        ]
                      }
                    ),
                    u.deployedAt != null && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "text-[10px] font-mono",
                        style: { color: "rgba(232,232,255,0.3)" },
                        children: formatDate(u.deployedAt)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs line-clamp-3",
                      style: { color: "rgba(232,232,255,0.5)" },
                      children: u.releaseNotes
                    }
                  )
                ]
              }
            )
          ]
        },
        u.id.toString()
      );
    }) })
  ] });
}
function CreateUpdateModal({ onClose }) {
  const { data: products } = useProducts();
  const createUpdate = useCreateUpdate();
  const scheduleUpdate = useScheduleUpdate();
  const [version, setVersion] = reactExports.useState("1.0.0");
  const [notes, setNotes] = reactExports.useState("");
  const [sizeKb, setSizeKb] = reactExports.useState("");
  const [productId, setProductId] = reactExports.useState("");
  const [scheduleAt, setScheduleAt] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!productId) {
      ue.error("Select a product");
      return;
    }
    try {
      const sizeBytes = BigInt(
        Math.round(Number.parseFloat(sizeKb || "0") * 1024)
      );
      const result = await createUpdate.mutateAsync({
        productId: BigInt(productId),
        version: version.trim(),
        releaseNotes: notes.trim(),
        size: sizeBytes
      });
      if (scheduleAt && (result == null ? void 0 : result.id) != null) {
        const scheduledNs = BigInt(new Date(scheduleAt).getTime()) * 1000000n;
        await scheduleUpdate.mutateAsync({
          id: result.id,
          scheduledAt: scheduledNs
        });
      }
      ue.success(
        `Update v${version} created${scheduleAt ? " & scheduled" : ""}`
      );
      onClose();
    } catch {
      ue.error("Failed to create update");
    }
  }
  const isPending = createUpdate.isPending || scheduleUpdate.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" },
      "data-ocid": "updates.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-2xl p-6 shadow-2xl",
          style: {
            background: "rgba(6,12,32,0.97)",
            border: "1px solid rgba(91,157,255,0.28)",
            boxShadow: "0 0 60px rgba(91,157,255,0.15), 0 0 120px rgba(74,26,107,0.15)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-lg flex items-center justify-center",
                    style: {
                      background: "rgba(91,157,255,0.12)",
                      border: "1px solid rgba(91,157,255,0.25)"
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "w-4 h-4", style: { color: "#7BBDFF" } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    className: "text-lg font-display font-bold",
                    style: { color: "#E8E8FF" },
                    children: "Release Update"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close",
                  "data-ocid": "updates.close_button",
                  className: "p-2 rounded-lg transition-colors",
                  style: { color: "rgba(232,232,255,0.4)" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    className: "text-[10px] font-mono uppercase tracking-widest",
                    style: { color: "rgba(232,232,255,0.45)" },
                    children: "Product"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: productId, onValueChange: setProductId, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "updates.product.select",
                      className: "text-sm",
                      style: {
                        background: "rgba(91,157,255,0.06)",
                        border: "1px solid rgba(91,157,255,0.2)",
                        color: "#E8E8FF"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select product" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (products ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id.toString())) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      className: "text-[10px] font-mono uppercase tracking-widest",
                      style: { color: "rgba(232,232,255,0.45)" },
                      children: "Version"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: version,
                      onChange: (e) => setVersion(e.target.value),
                      required: true,
                      placeholder: "1.2.3",
                      "data-ocid": "updates.version.input",
                      className: "font-mono text-sm",
                      style: {
                        background: "rgba(91,157,255,0.06)",
                        border: "1px solid rgba(91,157,255,0.2)",
                        color: "#E8E8FF"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      className: "text-[10px] font-mono uppercase tracking-widest",
                      style: { color: "rgba(232,232,255,0.45)" },
                      children: "Size (KB)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "number",
                      min: "0",
                      step: "0.1",
                      value: sizeKb,
                      onChange: (e) => setSizeKb(e.target.value),
                      required: true,
                      placeholder: "2457.6",
                      "data-ocid": "updates.size.input",
                      className: "font-mono text-sm",
                      style: {
                        background: "rgba(91,157,255,0.06)",
                        border: "1px solid rgba(91,157,255,0.2)",
                        color: "#E8E8FF"
                      }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    className: "text-[10px] font-mono uppercase tracking-widest",
                    style: { color: "rgba(232,232,255,0.45)" },
                    children: "Release Notes"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: notes,
                    onChange: (e) => setNotes(e.target.value),
                    placeholder: "Describe what changed: new features, bug fixes, improvements…",
                    "data-ocid": "updates.notes.textarea",
                    rows: 4,
                    className: "text-sm resize-none",
                    style: {
                      background: "rgba(91,157,255,0.06)",
                      border: "1px solid rgba(91,157,255,0.2)",
                      color: "#E8E8FF"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Label,
                  {
                    className: "text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5",
                    style: { color: "rgba(232,232,255,0.45)" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
                      " Schedule Date (optional)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "datetime-local",
                    value: scheduleAt,
                    onChange: (e) => setScheduleAt(e.target.value),
                    "data-ocid": "updates.schedule.input",
                    className: "font-mono text-sm",
                    style: {
                      background: "rgba(91,157,255,0.06)",
                      border: "1px solid rgba(91,157,255,0.2)",
                      color: "#E8E8FF",
                      colorScheme: "dark"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[10px] font-mono",
                    style: { color: "rgba(232,232,255,0.28)" },
                    children: "Leave empty to create as pending"
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
                    className: "flex-1",
                    "data-ocid": "updates.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "flex-1",
                    disabled: isPending,
                    "data-ocid": "updates.submit_button",
                    children: isPending ? "Creating…" : scheduleAt ? "Create & Schedule" : "Release Update"
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
const MAIN_TABS = [
  { id: "pending", label: "Pending" },
  { id: "scheduled", label: "Scheduled" },
  { id: "deployed", label: "Deployed" },
  { id: "failed", label: "Failed" },
  { id: "all", label: "All" }
];
function UpdatesPage() {
  const [showModal, setShowModal] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("pending");
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [productFilter, setProductFilter] = reactExports.useState("all");
  const { data: updates, isLoading: updatesLoading } = useAllUpdates();
  const { data: products } = useProducts();
  const pendingCount = (updates == null ? void 0 : updates.filter((u) => u.status === UpdateStatus.pending).length) ?? 0;
  const productMap = new Map(
    (products ?? []).map((p) => [p.id.toString(), p.name])
  );
  const filtered = (updates ?? []).filter((u) => {
    const matchesProduct = productFilter === "all" || u.productId.toString() === productFilter;
    if (!matchesProduct) return false;
    if (activeTab === "all") return true;
    return getStatusKey(u.status) === activeTab;
  });
  function tabCount(tab) {
    if (tab === "all")
      return (updates == null ? void 0 : updates.filter(
        (u) => productFilter === "all" || u.productId.toString() === productFilter
      ).length) ?? 0;
    return (updates == null ? void 0 : updates.filter((u) => {
      const matchP = productFilter === "all" || u.productId.toString() === productFilter;
      const statusKey = getStatusKey(u.status);
      return matchP && statusKey === tab;
    }).length) ?? 0;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", "data-ocid": "updates.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h1",
            {
              className: "text-2xl font-display font-bold",
              style: { color: "#E8E8FF" },
              children: "Updates"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs font-mono mt-0.5",
              style: { color: "rgba(232,232,255,0.35)" },
              children: "Release pipeline & changelog management"
            }
          )
        ] }),
        pendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "text-[10px] font-mono font-bold px-2.5 py-1 rounded-full",
            style: {
              background: "rgba(251,191,36,0.15)",
              color: "#FCD34D",
              border: "1px solid rgba(251,191,36,0.3)"
            },
            children: [
              pendingCount,
              " pending"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowModal(true),
          className: "flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-semibold transition-all",
          style: {
            background: "linear-gradient(135deg, rgba(91,157,255,0.2), rgba(74,26,107,0.3))",
            border: "1px solid rgba(91,157,255,0.35)",
            color: "#E8E8FF",
            boxShadow: "0 0 20px rgba(91,157,255,0.1)"
          },
          "data-ocid": "updates.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Release Update"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex rounded-lg p-0.5",
          style: {
            background: "rgba(8,16,40,0.6)",
            border: "1px solid rgba(91,157,255,0.12)"
          },
          children: ["list", "changelog"].map((mode) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setViewMode(mode),
              className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono capitalize transition-all",
              style: {
                background: viewMode === mode ? "rgba(91,157,255,0.18)" : "transparent",
                color: viewMode === mode ? "#E8E8FF" : "rgba(232,232,255,0.4)",
                border: viewMode === mode ? "1px solid rgba(91,157,255,0.25)" : "1px solid transparent"
              },
              "data-ocid": `updates.view_${mode}.toggle`,
              children: [
                mode === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(GitCommitHorizontal, { className: "w-3 h-3" }),
                mode === "list" ? "Updates" : "Changelog"
              ]
            },
            mode
          ))
        }
      ),
      viewMode === "list" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex rounded-lg p-0.5 overflow-x-auto",
          style: {
            background: "rgba(8,16,40,0.6)",
            border: "1px solid rgba(91,157,255,0.12)"
          },
          children: MAIN_TABS.map((tab) => {
            const count = tabCount(tab.id);
            const isActive = activeTab === tab.id;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setActiveTab(tab.id),
                className: "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap transition-all",
                style: {
                  background: isActive ? "rgba(91,157,255,0.18)" : "transparent",
                  color: isActive ? "#E8E8FF" : "rgba(232,232,255,0.4)",
                  border: isActive ? "1px solid rgba(91,157,255,0.25)" : "1px solid transparent"
                },
                "data-ocid": `updates.filter.${tab.id}.tab`,
                children: [
                  tab.label,
                  count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                      style: {
                        background: isActive ? "rgba(91,157,255,0.3)" : "rgba(91,157,255,0.1)",
                        color: isActive ? "#E8E8FF" : "rgba(232,232,255,0.4)"
                      },
                      children: count
                    }
                  )
                ]
              },
              tab.id
            );
          })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: productFilter, onValueChange: setProductFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "text-[11px] font-mono h-8 min-w-[140px]",
            style: {
              background: "rgba(8,16,40,0.6)",
              border: "1px solid rgba(91,157,255,0.18)",
              color: "rgba(232,232,255,0.7)"
            },
            "data-ocid": "updates.product_filter.select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Products" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Products" }),
          (products ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id.toString()))
        ] })
      ] }) })
    ] }),
    updatesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "updates.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UpdateSkeleton, {}, i)) }) : viewMode === "changelog" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChangelogTimeline,
      {
        updates: updates ?? [],
        products: (products ?? []).map((p) => ({ id: p.id, name: p.name }))
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { tab: activeTab }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateCard,
      {
        update: u,
        index: i + 1,
        productName: productMap.get(u.productId.toString()) ?? "Unknown"
      },
      u.id.toString()
    )) }),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateUpdateModal, { onClose: () => setShowModal(false) })
  ] });
}
export {
  UpdatesPage as default
};
