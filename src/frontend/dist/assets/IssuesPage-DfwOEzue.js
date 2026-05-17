import { c as createLucideIcon, r as reactExports, f as useIssues, a as useProducts, b as useUsers, I as IssueStatus, j as jsxRuntimeExports, T as TriangleAlert, k as Button, Y as IssueSeverity, Z as useResolveIssue, l as Badge, C as ChevronDown, _ as useCreateIssue, n as ue, $ as useIssueComments, a0 as useAddIssueComment, a1 as useUpdateIssue } from "./index-BCJFQ4-n.js";
import { I as Input } from "./input-DMBUQZmY.js";
import { S as Skeleton } from "./skeleton-DpPmXALx.js";
import { T as Textarea } from "./textarea-Bgq5930i.js";
import { Z as Zap } from "./zap-CbQ60J1W.js";
import { C as CircleCheck } from "./circle-check-BUlkgKWm.js";
import { P as Plus } from "./plus-DObSqLEn.js";
import { S as Search } from "./search-DqizQwqj.js";
import { m as motion } from "./proxy-cW3awFM8.js";
import { A as AnimatePresence } from "./index-BUwWT3XR.js";
import { C as Clock } from "./clock-BSAl9IO0.js";
import { C as ChevronUp } from "./chevron-up-DX6hR0JY.js";
import { X } from "./x-BWJjv8ZZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
];
const Bug = createLucideIcon("bug", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode$1);
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function relativeTime(ts) {
  const ms = Number(ts / 1000000n);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}
function severityLabel(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const SEVERITY_COLORS = {
  [IssueSeverity.critical]: {
    border: "border-l-red-500",
    badge: "bg-red-500/20 text-red-300 border-red-500/40",
    dot: "bg-red-500"
  },
  [IssueSeverity.high]: {
    border: "border-l-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    dot: "bg-orange-400"
  },
  [IssueSeverity.medium]: {
    border: "border-l-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    dot: "bg-yellow-400"
  },
  [IssueSeverity.low]: {
    border: "border-l-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    dot: "bg-blue-400"
  }
};
const STATUS_STYLES = {
  [IssueStatus.open]: "bg-red-500/15 text-red-300 border-red-500/30",
  [IssueStatus.in_progress]: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  [IssueStatus.resolved]: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
};
const STATUS_LABEL = {
  [IssueStatus.open]: "Open",
  [IssueStatus.in_progress]: "In Progress",
  [IssueStatus.resolved]: "Resolved"
};
function IssueCommentPanel({
  issueId,
  users
}) {
  const { data: comments = [], isLoading } = useIssueComments(issueId);
  const addComment = useAddIssueComment();
  const [text, setText] = reactExports.useState("");
  function getAuthorName(authorId) {
    const u = users.find((u2) => u2.id === authorId);
    return (u == null ? void 0 : u.name) ?? `User #${authorId}`;
  }
  async function handleSubmit() {
    if (!text.trim()) return;
    try {
      await addComment.mutateAsync({
        issueId,
        content: text.trim(),
        authorId: 0n
      });
      setText("");
      ue.success("Comment added");
    } catch {
      ue.error("Failed to add comment");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "mt-4 pt-4 border-t border-white/5",
      "data-ocid": "issues.comment_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3", children: [
          "Comments (",
          comments.length,
          ")"
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : comments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-2", children: "No comments yet. Be the first to comment." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-4 max-h-60 overflow-y-auto pr-1", children: [...comments].sort((a, b) => Number(a.timestamp - b.timestamp)).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "glass rounded-lg p-3",
            "data-ocid": "issues.comment_item",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground/80", children: getAuthorName(c.authorId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: relativeTime(c.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90", children: c.content })
            ]
          },
          String(c.id)
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: text,
              onChange: (e) => setText(e.target.value),
              placeholder: "Add a comment…",
              className: "bg-white/5 border-white/10 text-sm",
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              },
              "data-ocid": "issues.comment_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: handleSubmit,
              disabled: !text.trim() || addComment.isPending,
              className: "shrink-0",
              "data-ocid": "issues.comment_submit_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
            }
          )
        ] })
      ]
    }
  );
}
function UpdateStatusModal({
  issue,
  users,
  onClose
}) {
  const updateIssue = useUpdateIssue();
  const [status, setStatus] = reactExports.useState(
    issue.status
  );
  const [severity, setSeverity] = reactExports.useState(
    issue.severity
  );
  const [assignedTo, setAssignedTo] = reactExports.useState(
    issue.assignedTo != null ? String(issue.assignedTo) : ""
  );
  async function handleSave() {
    try {
      await updateIssue.mutateAsync({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        severity,
        status,
        assignedTo: assignedTo ? BigInt(assignedTo) : void 0
      });
      ue.success("Issue updated");
      onClose();
    } catch {
      ue.error("Failed to update issue");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "issues.update_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/70 backdrop-blur-sm",
            role: "presentation",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            className: "relative glass-elevated rounded-2xl p-6 w-full max-w-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Update Issue" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "p-1 rounded-lg hover:bg-white/10 transition-smooth",
                    "aria-label": "Close",
                    "data-ocid": "issues.update_close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-muted-foreground" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "update-status-select",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "update-status-select",
                      value: status,
                      onChange: (e) => setStatus(e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                      "data-ocid": "issues.update_status_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueStatus.open, children: "Open" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueStatus.in_progress, children: "In Progress" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueStatus.resolved, children: "Resolved" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "update-severity-select",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Severity"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "update-severity-select",
                      value: severity,
                      onChange: (e) => setSeverity(e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                      "data-ocid": "issues.update_severity_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.critical, children: "Critical" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.high, children: "High" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.medium, children: "Medium" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.low, children: "Low" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "update-assign-select",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Assign To"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "update-assign-select",
                      value: assignedTo,
                      onChange: (e) => setAssignedTo(e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                      "data-ocid": "issues.update_assign_select",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
                        users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(u.id), children: u.name }, String(u.id)))
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: "flex-1",
                    onClick: onClose,
                    "data-ocid": "issues.update_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    className: "flex-1",
                    onClick: handleSave,
                    disabled: updateIssue.isPending,
                    "data-ocid": "issues.update_save_button",
                    children: updateIssue.isPending ? "Saving…" : "Save Changes"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function CreateIssueModal({
  products,
  users,
  onClose
}) {
  const createIssue = useCreateIssue();
  const [form, setForm] = reactExports.useState({
    productId: products[0] ? String(products[0].id) : "",
    title: "",
    description: "",
    severity: IssueSeverity.medium,
    assignedTo: ""
  });
  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  async function handleCreate() {
    if (!form.title.trim() || !form.productId) {
      ue.error("Product and title are required");
      return;
    }
    try {
      await createIssue.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        severity: form.severity,
        productId: BigInt(form.productId),
        assignedTo: form.assignedTo ? BigInt(form.assignedTo) : void 0
      });
      ue.success("Issue created");
      onClose();
    } catch {
      ue.error("Failed to create issue");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      "data-ocid": "issues.create_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-black/70 backdrop-blur-sm",
            role: "presentation",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95, y: 10 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 10 },
            className: "relative glass-elevated rounded-2xl p-6 w-full max-w-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-5 h-5 text-accent" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Create Issue" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: onClose,
                    className: "p-1 rounded-lg hover:bg-white/10 transition-smooth",
                    "aria-label": "Close",
                    "data-ocid": "issues.create_close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5 text-muted-foreground" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "create-product-select",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Product"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "select",
                    {
                      id: "create-product-select",
                      value: form.productId,
                      onChange: (e) => update("productId", e.target.value),
                      className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                      "data-ocid": "issues.create_product_select",
                      children: [
                        products.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No products" }),
                        products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(p.id), children: p.name }, String(p.id)))
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "create-title-input",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Title"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "create-title-input",
                      value: form.title,
                      onChange: (e) => update("title", e.target.value),
                      placeholder: "Brief issue title",
                      className: "bg-white/5 border-white/10",
                      "data-ocid": "issues.create_title_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "create-description-textarea",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                      children: "Description"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      id: "create-description-textarea",
                      value: form.description,
                      onChange: (e) => update("description", e.target.value),
                      placeholder: "Describe the issue in detail…",
                      rows: 4,
                      className: "bg-white/5 border-white/10 resize-none",
                      "data-ocid": "issues.create_description_textarea"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "create-severity-select",
                        className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                        children: "Severity"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        id: "create-severity-select",
                        value: form.severity,
                        onChange: (e) => update("severity", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                        "data-ocid": "issues.create_severity_select",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.critical, children: "Critical" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.high, children: "High" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.medium, children: "Medium" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.low, children: "Low" })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: "create-assign-select",
                        className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2 block",
                        children: "Assign To"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        id: "create-assign-select",
                        value: form.assignedTo,
                        onChange: (e) => update("assignedTo", e.target.value),
                        className: "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground",
                        "data-ocid": "issues.create_assign_select",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Unassigned" }),
                          users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(u.id), children: u.name }, String(u.id)))
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    className: "flex-1",
                    onClick: onClose,
                    "data-ocid": "issues.create_cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    className: "flex-1",
                    onClick: handleCreate,
                    disabled: createIssue.isPending,
                    "data-ocid": "issues.create_submit_button",
                    children: createIssue.isPending ? "Creating…" : "Create Issue"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function IssueCard({
  issue,
  index,
  products,
  users,
  expanded,
  onToggleExpand
}) {
  const resolveIssue = useResolveIssue();
  const [showUpdateModal, setShowUpdateModal] = reactExports.useState(false);
  const isResolved = issue.status === IssueStatus.resolved;
  const colors = SEVERITY_COLORS[issue.severity];
  const product = products.find((p) => p.id === issue.productId);
  const assignedUser = users.find(
    (u) => issue.assignedTo != null && u.id === issue.assignedTo
  );
  async function handleResolve(e) {
    e.stopPropagation();
    try {
      await resolveIssue.mutateAsync(issue.id);
      ue.success("Issue resolved");
    } catch {
      ue.error("Failed to resolve issue");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.05 },
        className: `glass-card rounded-xl border-l-4 ${colors.border} overflow-hidden transition-smooth hover:border-opacity-80 ${isResolved ? "opacity-60" : ""}`,
        "data-ocid": `issues.item.${index + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "p-4 w-full text-left cursor-pointer",
              onClick: onToggleExpand,
              "aria-expanded": expanded,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `mt-1.5 w-2 h-2 rounded-full shrink-0 ${colors.dot}`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h3",
                      {
                        className: `text-sm font-semibold text-foreground truncate ${isResolved ? "line-through text-muted-foreground" : ""}`,
                        children: issue.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs px-2 py-0.5 border ${colors.badge}`,
                        children: severityLabel(issue.severity)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs px-2 py-0.5 border ${STATUS_STYLES[issue.status]}`,
                        children: STATUS_LABEL[issue.status]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 line-clamp-2 break-words", children: issue.description || "No description provided." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2 flex-wrap", children: [
                    product && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 text-xs text-blue-300/80 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5", children: product.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                      "Created ",
                      relativeTime(issue.createdAt)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Updated ",
                      relativeTime(issue.updatedAt)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: assignedUser ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-violet-300/80", children: assignedUser.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic", children: "Unassigned" }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-1.5 shrink-0",
                    onClick: (e) => e.stopPropagation(),
                    onKeyDown: (e) => e.stopPropagation(),
                    children: [
                      !isResolved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          type: "button",
                          size: "sm",
                          variant: "outline",
                          onClick: handleResolve,
                          disabled: resolveIssue.isPending,
                          className: "text-xs h-7 px-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10",
                          "data-ocid": `issues.resolve_button.${index + 1}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 mr-1" }),
                            "Resolve"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          size: "sm",
                          variant: "outline",
                          onClick: () => setShowUpdateModal(true),
                          className: "text-xs h-7 px-2",
                          "data-ocid": `issues.update_button.${index + 1}`,
                          children: "Update"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "p-1 rounded-md hover:bg-white/10 transition-smooth",
                          "aria-label": expanded ? "Collapse" : "Expand",
                          "data-ocid": `issues.expand_button.${index + 1}`,
                          children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground" })
                        }
                      )
                    ]
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { height: 0, opacity: 0 },
              animate: { height: "auto", opacity: 1 },
              exit: { height: 0, opacity: 0 },
              transition: { duration: 0.25 },
              className: "overflow-hidden",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 border-t border-white/5 pt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2", children: "Full Description" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 whitespace-pre-wrap", children: issue.description || "No description provided." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IssueCommentPanel, { issueId: issue.id, users })
              ] })
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showUpdateModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      UpdateStatusModal,
      {
        issue,
        users,
        onClose: () => setShowUpdateModal(false)
      }
    ) })
  ] });
}
function IssuesPage() {
  const [statusTab, setStatusTab] = reactExports.useState("all");
  const [severityFilter, setSeverityFilter] = reactExports.useState("all");
  const [productFilter, setProductFilter] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const { data: allIssues = [], isLoading: issuesLoading } = useIssues();
  const { data: products = [] } = useProducts();
  const { data: users = [] } = useUsers();
  const counts = reactExports.useMemo(
    () => ({
      open: allIssues.filter(
        (i) => i.status === IssueStatus.open
      ).length,
      in_progress: allIssues.filter(
        (i) => i.status === IssueStatus.in_progress
      ).length,
      resolved: allIssues.filter(
        (i) => i.status === IssueStatus.resolved
      ).length
    }),
    [allIssues]
  );
  const filtered = reactExports.useMemo(() => {
    let list = [...allIssues];
    if (statusTab !== "all") {
      list = list.filter((i) => i.status === statusTab);
    }
    if (severityFilter !== "all") {
      list = list.filter(
        (i) => i.severity === severityFilter
      );
    }
    if (productFilter !== "all") {
      list = list.filter((i) => String(i.productId) === productFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => Number(b.createdAt - a.createdAt));
  }, [allIssues, statusTab, severityFilter, productFilter, search]);
  const STATUS_TABS = [
    { id: "all", label: "All", count: allIssues.length },
    { id: IssueStatus.open, label: "Open", count: counts.open },
    {
      id: IssueStatus.in_progress,
      label: "In Progress",
      count: counts.in_progress
    },
    { id: IssueStatus.resolved, label: "Resolved", count: counts.resolved }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen p-6", "data-ocid": "issues.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-accent/20 glow-violet", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-5 h-5 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold gradient-text", children: "Issues" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25 text-xs text-red-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
            counts.open,
            " Open"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-xs text-blue-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }),
            counts.in_progress,
            " In Progress"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/25 text-xs text-emerald-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
            counts.resolved,
            " Resolved"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setShowCreate(true),
          className: "gap-2",
          "data-ocid": "issues.create_open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Create Issue"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card rounded-xl p-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 mb-4 flex-wrap", children: STATUS_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setStatusTab(tab.id),
          className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-smooth ${statusTab === tab.id ? "bg-accent/20 text-accent border border-accent/40" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`,
          "data-ocid": `issues.filter.tab.${tab.id}`,
          children: [
            tab.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs px-1.5 py-0.5 rounded-full ${statusTab === tab.id ? "bg-accent/30" : "bg-white/10"}`,
                children: tab.count
              }
            )
          ]
        },
        tab.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: severityFilter,
              onChange: (e) => setSeverityFilter(e.target.value),
              className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground",
              "data-ocid": "issues.filter.severity_select",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Severities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.critical, children: "Critical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.high, children: "High" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.medium, children: "Medium" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: IssueSeverity.low, children: "Low" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: productFilter,
            onChange: (e) => setProductFilter(e.target.value),
            className: "bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground",
            "data-ocid": "issues.filter.product_select",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All Products" }),
              products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(p.id), children: p.name }, String(p.id)))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Search issues…",
              className: "pl-9 bg-white/5 border-white/10 text-sm",
              "data-ocid": "issues.filter.search_input"
            }
          )
        ] })
      ] })
    ] }),
    issuesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "issues.loading_state", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-2 h-2 rounded-full mt-1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-2/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4" })
      ] })
    ] }) }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "flex flex-col items-center justify-center py-20 glass-card rounded-xl",
        "data-ocid": "issues.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-2xl bg-accent/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-10 h-10 text-accent/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground/60 mb-1", children: "No issues found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: search || statusTab !== "all" || severityFilter !== "all" || productFilter !== "all" ? "Try adjusting your filters" : "Create your first issue to start tracking" }),
          allIssues.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => setShowCreate(true),
              className: "gap-2",
              "data-ocid": "issues.empty_create_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Create Issue"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((issue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      IssueCard,
      {
        issue,
        index: idx,
        products,
        users,
        expanded: expandedId === String(issue.id),
        onToggleExpand: () => setExpandedId(
          (prev) => prev === String(issue.id) ? null : String(issue.id)
        )
      },
      String(issue.id)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateIssueModal,
      {
        products,
        users,
        onClose: () => setShowCreate(false)
      }
    ) })
  ] });
}
export {
  IssuesPage as default
};
