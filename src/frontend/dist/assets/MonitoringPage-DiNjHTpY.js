import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, E as useComposedRefs, F as cn, a as useProducts, d as useActiveAlerts, G as useResolveAlert, A as Activity, T as TriangleAlert, k as Button, R as RefreshCw, n as ue, H as useLatestMetrics, J as useMetricsHistory, K as useAlertHistory, M as useSubmitMetrics } from "./index-BCJFQ4-n.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, a as createContextScope, b as createSlot, d as createContext2 } from "./index-CgD3lSY3.js";
import { u as useId, P as Portal$1, h as hideOthers, R as ReactRemoveScroll, a as useFocusGuards, F as FocusScope, D as DismissableLayer } from "./Combination-D7_teDzu.js";
import { P as Presence } from "./index-BxgbILVk.js";
import { X } from "./x-BWJjv8ZZ.js";
import { I as Input } from "./input-DMBUQZmY.js";
import { L as Label } from "./label-Bl69gsBZ.js";
import { S as ShieldCheck } from "./shield-check-JUemDo3J.js";
import { m as motion } from "./proxy-cW3awFM8.js";
import { C as CircleCheck } from "./circle-check-BUlkgKWm.js";
import { Z as Zap } from "./zap-CbQ60J1W.js";
import { I as Info } from "./info-DBjD5j6o.js";
import { C as Clock } from "./clock-BSAl9IO0.js";
import "./index-XCDx2eqQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
      key: "18mbvz"
    }
  ],
  ["path", { d: "M6.453 15h11.094", key: "3shlmq" }],
  ["path", { d: "M8.5 2h7", key: "csnxdl" }]
];
const FlaskConical = createLucideIcon("flask-conical", __iconNode$1);
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
      d: "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2",
      key: "4b9dqc"
    }
  ],
  [
    "path",
    {
      d: "M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2",
      key: "22nnkd"
    }
  ],
  ["path", { d: "M6 6h.01", key: "1utrut" }],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "m13 6-4 6h6l-4 6", key: "14hqih" }]
];
const ServerCrash = createLucideIcon("server-crash", __iconNode);
var MetricSeverity = /* @__PURE__ */ ((MetricSeverity2) => {
  MetricSeverity2["critical"] = "critical";
  MetricSeverity2["warning"] = "warning";
  MetricSeverity2["info"] = "info";
  return MetricSeverity2;
})(MetricSeverity || {});
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog$1 = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog$1.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal$1 = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children: child }) })) });
};
DialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay$1.displayName = OVERLAY_NAME;
var Slot = createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent$1.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          var _a;
          event.preventDefault();
          (_a = context.triggerRef.current) == null ? void 0 : _a.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          var _a, _b;
          (_a = props.onCloseAutoFocus) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) (_b = context.triggerRef.current) == null ? void 0 : _b.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          var _a, _b;
          (_a = props.onInteractOutside) == null ? void 0 : _a.call(props, event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = (_b = context.triggerRef.current) == null ? void 0 : _b.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    var _a;
    const describedById = (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog$1;
var Portal = DialogPortal$1;
var Overlay = DialogOverlay$1;
var Content = DialogContent$1;
var Title = DialogTitle$1;
var Close = DialogClose;
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function formatTs(ts) {
  try {
    return new Date(Number(ts / 1000000n)).toLocaleTimeString();
  } catch {
    return "--";
  }
}
function severityColor(sev) {
  if (sev === MetricSeverity.critical)
    return {
      ring: "#EF4444",
      bg: "rgba(239,68,68,0.08)",
      text: "#EF4444",
      border: "rgba(239,68,68,0.25)"
    };
  if (sev === MetricSeverity.warning)
    return {
      ring: "#F59E0B",
      bg: "rgba(245,158,11,0.08)",
      text: "#F59E0B",
      border: "rgba(245,158,11,0.25)"
    };
  return {
    ring: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    text: "#60A5FA",
    border: "rgba(59,130,246,0.2)"
  };
}
function getSev(rawSev) {
  const s = String(rawSev).toLowerCase();
  if (s.includes("critical")) return MetricSeverity.critical;
  if (s.includes("warning")) return MetricSeverity.warning;
  return MetricSeverity.info;
}
function metricColor(pct) {
  if (pct > 80) return "#EF4444";
  if (pct > 60) return "#F59E0B";
  return "#34D399";
}
const R = 28;
const CIRC = 2 * Math.PI * R;
function CircularRing({
  label,
  value,
  pct
}) {
  const color = metricColor(pct);
  const dash = pct / 100 * CIRC;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-16 h-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "64", height: "64", viewBox: "0 0 64 64", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "32",
            cy: "32",
            r: R,
            fill: "none",
            stroke: "rgba(91,157,255,0.1)",
            strokeWidth: "4"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "32",
            cy: "32",
            r: R,
            fill: "none",
            stroke: color,
            strokeWidth: "4",
            strokeLinecap: "round",
            strokeDasharray: `${dash} ${CIRC - dash}`,
            strokeDashoffset: CIRC / 4,
            style: {
              transition: "stroke-dasharray 0.8s ease",
              filter: `drop-shadow(0 0 4px ${color}80)`
            }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono font-bold", style: { color }, children: value }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider text-center leading-tight", children: label })
  ] });
}
function Sparkline({
  data,
  field,
  color
}) {
  if (!data || data.length < 2)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.2)]", children: "No history" }) });
  const pts = data.slice(-24).map((m) => Number(m[field]));
  const max = Math.max(...pts, 1);
  const W = 120;
  const H = 32;
  const step = W / (pts.length - 1);
  const path = pts.map(
    (v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(H - v / max * H).toFixed(1)}`
  ).join(" ");
  const area = `${path} L ${((pts.length - 1) * step).toFixed(1)} ${H} L 0 ${H} Z`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      viewBox: `0 0 ${W} ${H}`,
      "aria-hidden": "true",
      className: "overflow-visible",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `spark-grad-${field}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: area, fill: `url(#spark-grad-${field})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: path,
            fill: "none",
            stroke: color,
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        )
      ]
    }
  );
}
const DEFAULT_FORM = {
  cpu: "45",
  memory: "62",
  disk: "38",
  apiLatency: "120",
  networkUptime: "99",
  connectionStatus: "online"
};
function SubmitMetricsModal({
  product,
  open,
  onClose
}) {
  const submit = useSubmitMetrics();
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    submit.mutate(
      {
        productId: product.id,
        cpu: BigInt(form.cpu || "0"),
        memory: BigInt(form.memory || "0"),
        disk: BigInt(form.disk || "0"),
        apiLatency: BigInt(form.apiLatency || "0"),
        networkUptime: BigInt(form.networkUptime || "0"),
        connectionStatus: form.connectionStatus
      },
      {
        onSuccess: () => {
          ue.success(`Metrics submitted for ${product.name}`);
          onClose();
        },
        onError: () => ue.error("Failed to submit metrics")
      }
    );
  }
  const numFields = [
    { key: "cpu", label: "CPU %", placeholder: "0-100" },
    { key: "memory", label: "Memory %", placeholder: "0-100" },
    { key: "disk", label: "Disk %", placeholder: "0-100" },
    { key: "apiLatency", label: "API Latency ms", placeholder: "e.g. 120" },
    { key: "networkUptime", label: "Network Uptime %", placeholder: "0-100" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md",
      style: {
        background: "rgba(8,14,35,0.96)",
        border: "1px solid rgba(91,157,255,0.2)",
        backdropFilter: "blur(20px)"
      },
      "data-ocid": "monitoring.submit_metrics.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-sm font-display font-semibold text-[#E8E8FF]", children: [
          "Submit Test Metrics — ",
          product.name
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            numFields.map(({ key, label, placeholder }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "text",
                  value: form[key],
                  onChange: (e) => set(key, e.target.value),
                  placeholder,
                  className: "h-8 text-xs font-mono bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]",
                  "data-ocid": `monitoring.submit_metrics.${key}.input`
                }
              )
            ] }, key)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider", children: "Connection Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "text",
                  value: form.connectionStatus,
                  onChange: (e) => set("connectionStatus", e.target.value),
                  placeholder: "online / degraded / offline",
                  className: "h-8 text-xs font-mono bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]",
                  "data-ocid": "monitoring.submit_metrics.connectionStatus.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: submit.isPending,
                className: "flex-1 h-8 text-xs font-mono",
                "data-ocid": "monitoring.submit_metrics.submit_button",
                children: submit.isPending ? "Submitting…" : "Submit Metrics"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: onClose,
                className: "h-8 text-xs font-mono border-[rgba(91,157,255,0.2)] text-[rgba(232,232,255,0.6)]",
                "data-ocid": "monitoring.submit_metrics.cancel_button",
                children: "Cancel"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function XCircleIcon({
  className,
  style
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      className,
      style,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      role: "img",
      "aria-label": "Error indicator",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Error indicator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 9l-6 6M9 9l6 6" })
      ]
    }
  );
}
function AlertRow({
  alert,
  index,
  onResolve,
  resolving
}) {
  const sev = getSev(alert.severity);
  const col = severityColor(sev);
  const SevIcon = sev === MetricSeverity.critical ? XCircleIcon : sev === MetricSeverity.warning ? TriangleAlert : Info;
  const sevLabel = String(alert.severity).replace(/[{}']/g, "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: index * 0.05 },
      className: "flex items-center gap-3 rounded-xl p-3",
      style: {
        background: col.bg,
        border: `1px solid ${col.border}`,
        backdropFilter: "blur(8px)"
      },
      "data-ocid": `monitoring.alert.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SevIcon, { className: "w-4 h-4 flex-shrink-0", style: { color: col.text } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-body font-medium text-[#E8E8FF] truncate", children: alert.metricType }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5", children: [
            alert.productId,
            " · ",
            formatTs(alert.timestamp)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[9px] font-mono px-1.5 py-0.5 rounded-full",
              style: {
                background: col.bg,
                color: col.text,
                border: `1px solid ${col.border}`
              },
              children: sevLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.35)]", children: [
            alert.value.toString(),
            " / ",
            alert.threshold.toString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onResolve(alert.id),
            disabled: resolving,
            className: "flex-shrink-0 text-[10px] font-mono px-2.5 py-1 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50",
            style: {
              background: "rgba(52,211,153,0.1)",
              color: "#34D399",
              border: "1px solid rgba(52,211,153,0.25)"
            },
            "data-ocid": `monitoring.resolve.button.${index}`,
            children: "Resolve"
          }
        )
      ]
    }
  );
}
function ProductMetricCard({
  product,
  index
}) {
  var _a, _b;
  const { data: metrics } = useLatestMetrics(product.id);
  const { data: history } = useMetricsHistory(product.id);
  const { data: alertHist } = useAlertHistory(product.id);
  const [submitOpen, setSubmitOpen] = reactExports.useState(false);
  const cpu = metrics ? Math.min(100, Number(metrics.cpu)) : 0;
  const mem = metrics ? Math.min(100, Number(metrics.memory)) : 0;
  const disk = metrics ? Math.min(100, Number(metrics.disk)) : 0;
  const latPct = metrics ? Math.min(100, Number(metrics.apiLatency) / 10) : 0;
  const uptime = metrics ? Math.min(100, Number(metrics.networkUptime)) : 0;
  const isOnline = !!((_a = metrics == null ? void 0 : metrics.connectionStatus) == null ? void 0 : _a.toLowerCase().includes("online"));
  const isDegraded = !!((_b = metrics == null ? void 0 : metrics.connectionStatus) == null ? void 0 : _b.toLowerCase().includes("degraded"));
  const connColor = isOnline ? "#34D399" : isDegraded ? "#F59E0B" : "#EF4444";
  const connBg = isOnline ? "rgba(52,211,153,0.1)" : isDegraded ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: index * 0.08 },
        className: "rounded-xl p-5 space-y-4",
        style: {
          background: "rgba(10,20,45,0.6)",
          border: "1px solid rgba(91,157,255,0.12)",
          backdropFilter: "blur(12px)"
        },
        "data-ocid": `monitoring.product.item.${index}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-display font-semibold text-[#E8E8FF] truncate", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.3)] mt-0.5", children: [
                "code: ",
                product.code
              ] })
            ] }),
            metrics && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0",
                style: {
                  background: connBg,
                  color: connColor,
                  border: `1px solid ${connColor}40`
                },
                children: metrics.connectionStatus
              }
            )
          ] }),
          metrics ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircularRing, { label: "CPU", value: `${cpu}%`, pct: cpu }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircularRing, { label: "Memory", value: `${mem}%`, pct: mem }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircularRing, { label: "Disk", value: `${disk}%`, pct: disk })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CircularRing,
                {
                  label: "Latency",
                  value: `${metrics.apiLatency}ms`,
                  pct: latPct
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircularRing, { label: "Uptime", value: `${uptime}%`, pct: uptime }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-16 h-16 rounded-full flex items-center justify-center",
                    style: {
                      background: `${connColor}18`,
                      border: `2px solid ${connColor}50`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-5 h-5", style: { color: connColor } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-wider", children: "Status" })
              ] })
            ] }),
            history && history.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-lg p-3 space-y-2",
                style: {
                  background: "rgba(91,157,255,0.04)",
                  border: "1px solid rgba(91,157,255,0.08)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider mb-2", children: "Last 24 readings" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                    {
                      field: "cpu",
                      label: "CPU",
                      color: "#5B9DFF"
                    },
                    {
                      field: "memory",
                      label: "Memory",
                      color: "#A855F7"
                    },
                    {
                      field: "disk",
                      label: "Disk",
                      color: "#F59E0B"
                    },
                    {
                      field: "networkUptime",
                      label: "Uptime",
                      color: "#34D399"
                    }
                  ].map(({ field, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-[8px] font-mono mb-1",
                        style: { color: `${color}B0` },
                        children: label
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { data: history, field, color })
                  ] }, field)) })
                ]
              }
            ),
            alertHist && alertHist.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider", children: [
                "Recent resolved (",
                alertHist.length,
                ")"
              ] }),
              alertHist.slice(0, 2).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 rounded-lg px-2.5 py-1.5",
                  style: {
                    background: "rgba(52,211,153,0.05)",
                    border: "1px solid rgba(52,211,153,0.1)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 text-emerald-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] flex-1 truncate", children: a.metricType }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)]", children: formatTs(a.timestamp) })
                  ]
                },
                a.id.toString()
              ))
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.3)]", children: "No metrics submitted yet" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setSubmitOpen(true),
              className: "w-full flex items-center justify-center gap-1.5 rounded-lg h-8 text-[10px] font-mono transition-all hover:opacity-80",
              style: {
                background: "rgba(91,157,255,0.08)",
                border: "1px solid rgba(91,157,255,0.18)",
                color: "rgba(91,157,255,0.8)"
              },
              "data-ocid": `monitoring.submit_metrics.open_modal_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "w-3 h-3" }),
                "Submit Test Metrics"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitMetricsModal,
      {
        product,
        open: submitOpen,
        onClose: () => setSubmitOpen(false)
      }
    )
  ] });
}
function ProductAlertHistoryRows({ product }) {
  const { data: hist } = useAlertHistory(product.id);
  if (!(hist == null ? void 0 : hist.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: hist.slice(0, 5).map((a, i) => {
    const sev = getSev(a.severity);
    const col = severityColor(sev);
    const sevLabel = String(a.severity).replace(/[{}']/g, "");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 px-4 py-2.5 border-b border-[rgba(91,157,255,0.05)] last:border-0 hover:bg-[rgba(91,157,255,0.03)] transition-colors",
        "data-ocid": `monitoring.alert_history.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[#E8E8FF] truncate", children: a.metricType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.3)] truncate", children: product.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[9px] font-mono px-1.5 py-0.5 rounded-full h-fit self-center w-fit",
              style: {
                background: col.bg,
                color: col.text,
                border: `1px solid ${col.border}`
              },
              children: sevLabel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] self-center", children: a.value.toString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] self-center", children: formatTs(a.timestamp) })
        ]
      },
      a.id.toString()
    );
  }) });
}
function AlertHistorySection({ products }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "monitoring.alert_history.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4", style: { color: "rgba(91,157,255,0.7)" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest", children: "Alert History" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: {
          background: "rgba(10,20,45,0.5)",
          border: "1px solid rgba(91,157,255,0.1)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 px-4 py-2 border-b border-[rgba(91,157,255,0.08)]", children: ["Metric / Product", "Severity", "Value", "Time"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[9px] font-mono text-[rgba(232,232,255,0.3)] uppercase tracking-wider",
              children: h
            },
            h
          )) }),
          products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductAlertHistoryRows, { product: p }, p.id.toString())),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "px-4 py-3 text-center",
              "data-ocid": "monitoring.alert_history.empty_state",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.25)]", children: "No resolved alerts yet" })
            }
          )
        ]
      }
    )
  ] });
}
function MonitoringPage() {
  const { data: products, isLoading, refetch: refetchProducts } = useProducts();
  const { data: alerts, refetch: refetchAlerts } = useActiveAlerts();
  const resolve = useResolveAlert();
  const criticalCount = (alerts == null ? void 0 : alerts.filter((a) => getSev(a.severity) === MetricSeverity.critical).length) ?? 0;
  const warningCount = (alerts == null ? void 0 : alerts.filter((a) => getSev(a.severity) === MetricSeverity.warning).length) ?? 0;
  const overallStatus = criticalCount > 0 ? "critical" : warningCount > 0 ? "warning" : "nominal";
  const statusConfig = {
    critical: {
      label: "Critical",
      color: "#EF4444",
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.3)",
      Icon: ServerCrash
    },
    warning: {
      label: "Warning",
      color: "#F59E0B",
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.3)",
      Icon: TriangleAlert
    },
    nominal: {
      label: "All Systems Good",
      color: "#34D399",
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.25)",
      Icon: ShieldCheck
    }
  };
  const sc = statusConfig[overallStatus];
  const sortedAlerts = alerts ? [...alerts].sort((a, b) => {
    const rank = (sev) => {
      const k = getSev(sev);
      return k === MetricSeverity.critical ? 0 : k === MetricSeverity.warning ? 1 : 2;
    };
    return rank(a.severity) - rank(b.severity);
  }) : [];
  function handleRefresh() {
    refetchProducts();
    refetchAlerts();
    ue.success("Refreshing system data…");
  }
  function handleResolve(id) {
    resolve.mutate(id, {
      onSuccess: () => ue.success("Alert resolved"),
      onError: () => ue.error("Failed to resolve alert")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-8", "data-ocid": "monitoring.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-lg flex items-center justify-center",
            style: {
              background: "rgba(91,157,255,0.12)",
              border: "1px solid rgba(91,157,255,0.2)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4", style: { color: "#5B9DFF" } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-base font-display font-bold text-[#E8E8FF]", children: "System Monitor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)]", children: "Real-time infrastructure oversight" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full",
            style: {
              background: sc.bg,
              color: sc.color,
              border: `1px solid ${sc.border}`
            },
            "data-ocid": "monitoring.overall_status.badge",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(sc.Icon, { className: "w-3.5 h-3.5" }),
              sc.label,
              ((alerts == null ? void 0 : alerts.length) ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-1 text-[9px] px-1.5 py-0.5 rounded-full",
                  style: { background: `${sc.color}25`, color: sc.color },
                  children: alerts.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: handleRefresh,
            className: "h-8 gap-1.5 text-xs font-mono border-[rgba(91,157,255,0.2)] text-[rgba(232,232,255,0.7)] hover:text-[#E8E8FF]",
            "data-ocid": "monitoring.refresh.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
              "Refresh"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "monitoring.alerts.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest", children: "Active Alerts" }),
        sortedAlerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.15)] text-red-400 border border-[rgba(239,68,68,0.25)]", children: sortedAlerts.length })
      ] }),
      sortedAlerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "rounded-xl p-6 flex items-center gap-3",
          style: {
            background: "rgba(52,211,153,0.05)",
            border: "1px solid rgba(52,211,153,0.15)"
          },
          "data-ocid": "monitoring.alerts.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-emerald-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-medium text-emerald-300", children: "All systems nominal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5", children: "No active alerts at this time" })
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: sortedAlerts.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AlertRow,
        {
          alert: a,
          index: i + 1,
          onResolve: handleResolve,
          resolving: resolve.isPending
        },
        a.id.toString()
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "monitoring.metrics.section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4", style: { color: "#5B9DFF" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest", children: "Product Metrics" }),
        (products == null ? void 0 : products.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[rgba(91,157,255,0.1)] text-blue-400 border border-[rgba(91,157,255,0.2)]", children: [
          products.length,
          " connected"
        ] }) : null
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-xl h-72 animate-pulse",
          style: {
            background: "rgba(91,157,255,0.06)",
            border: "1px solid rgba(91,157,255,0.1)"
          },
          "data-ocid": `monitoring.loading_state.${i}`
        },
        i
      )) }) : !(products == null ? void 0 : products.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl p-12 flex flex-col items-center gap-4",
          style: {
            background: "rgba(10,20,45,0.5)",
            border: "1px solid rgba(91,157,255,0.1)"
          },
          "data-ocid": "monitoring.metrics.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-14 h-14 rounded-full flex items-center justify-center",
                style: {
                  background: "rgba(91,157,255,0.08)",
                  border: "1px solid rgba(91,157,255,0.15)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Activity,
                  {
                    className: "w-7 h-7",
                    style: { color: "rgba(91,157,255,0.4)" }
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-medium text-[rgba(232,232,255,0.5)]", children: "No products registered" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.3)] mt-1", children: "Register a product to start monitoring" })
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProductMetricCard,
        {
          product: p,
          index: i + 1
        },
        p.id.toString()
      )) })
    ] }),
    products && products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AlertHistorySection, { products })
  ] });
}
export {
  MonitoringPage as default
};
