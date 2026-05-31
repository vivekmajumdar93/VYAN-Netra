import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, E as useComposedRefs, F as cn, a as useProducts, a7 as Mail, a8 as useEmailConfigs, k as Button, a9 as useEmailTemplates, aa as useEmailLogs, ab as useUpdateEmailConfig, ac as useCreateEmailConfig, ad as useCreateEmailTemplate, ae as useUpdateEmailTemplate, n as ue, af as EmailStatus, T as TriangleAlert } from "./index-B0U-vI18.js";
import { I as Input } from "./input-ChBNhlJN.js";
import { L as Label } from "./label-dd52H_Md.js";
import { e as createCollection, u as useDirection, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-nfius15g.js";
import { S as Switch } from "./switch-B28J_Qjl.js";
import { P as Primitive, c as composeEventHandlers, a as createContextScope, u as useControllableState } from "./index-xf975W9k.js";
import { u as useId, b as useCallbackRef } from "./Combination-sG4yWX_x.js";
import { P as Presence } from "./index-DvMjmoQo.js";
import { T as Textarea } from "./textarea-Odi5Ecqs.js";
import { m as motion } from "./proxy-DrXJd9GG.js";
import { P as Plus } from "./plus-D5BLP1nV.js";
import { C as Calendar } from "./calendar-BG3hIUj3.js";
import { X } from "./x-jRxL18Io.js";
import { C as CircleX } from "./circle-x-YLQRWRpo.js";
import { C as CircleCheck } from "./circle-check-q76y3x7a.js";
import "./index-CLpxXFLZ.js";
import "./index-CdREqOPf.js";
import "./check-Ckl5WtrJ.js";
import "./chevron-up-CuGZzQMJ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
];
const List$1 = createLucideIcon("list", __iconNode$2);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 7h-9", key: "3s1dr2" }],
  ["path", { d: "M14 17H5", key: "gfn3mx" }],
  ["circle", { cx: "17", cy: "17", r: "3", key: "18b49y" }],
  ["circle", { cx: "7", cy: "7", r: "3", key: "dfmy0x" }]
];
const Settings2 = createLucideIcon("settings-2", __iconNode);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const GLASS = {
  background: "rgba(10,20,45,0.55)",
  border: "1px solid rgba(91,157,255,0.14)",
  backdropFilter: "blur(12px)"
};
const MODAL_OUTER = {
  background: "rgba(8,14,35,0.96)",
  border: "1px solid rgba(91,157,255,0.28)",
  boxShadow: "0 0 60px rgba(91,157,255,0.14), 0 0 120px rgba(74,26,107,0.1)"
};
function statusStyle(status) {
  switch (status) {
    case EmailStatus.sent:
      return {
        bg: "rgba(52,211,153,0.1)",
        text: "#34D399",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" })
      };
    case EmailStatus.failed:
      return {
        bg: "rgba(239,68,68,0.1)",
        text: "#F87171",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3" })
      };
    case EmailStatus.bounced:
      return {
        bg: "rgba(251,191,36,0.1)",
        text: "#FCD34D",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" })
      };
  }
}
function fmtTimestamp(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ConfigCard({
  config,
  index
}) {
  const updateConfig = useUpdateEmailConfig();
  const [editing, setEditing] = reactExports.useState(false);
  const [senderName, setSenderName] = reactExports.useState(config.senderName);
  const [senderEmail, setSenderEmail] = reactExports.useState(config.senderEmail);
  const [bounceEmail, setBounceEmail] = reactExports.useState(config.bounceEmail);
  const [isActive, setIsActive] = reactExports.useState(config.isActive);
  async function handleSave(e) {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync({
        id: config.id,
        senderName,
        senderEmail,
        bounceEmail,
        isActive
      });
      ue.success("Email config updated");
      setEditing(false);
    } catch {
      ue.error("Failed to update config");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden",
      style: GLASS,
      "data-ocid": `email.config.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                style: {
                  background: "rgba(91,157,255,0.1)",
                  border: "1px solid rgba(91,157,255,0.2)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-blue-400" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold text-[#E8E8FF] truncate", children: config.senderName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)] truncate", children: config.senderEmail })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
                style: {
                  background: config.isActive ? "rgba(52,211,153,0.1)" : "rgba(107,114,128,0.15)",
                  color: config.isActive ? "#34D399" : "#9CA3AF",
                  border: `1px solid ${config.isActive ? "rgba(52,211,153,0.25)" : "rgba(107,114,128,0.2)"}`
                },
                children: config.isActive ? "active" : "inactive"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setEditing(!editing),
                "aria-label": "Edit config",
                "data-ocid": `email.config.edit_button.${index}`,
                className: "p-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-[rgba(232,232,255,0.45)]" })
              }
            )
          ] })
        ] }),
        editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleSave,
            className: "px-5 pb-5 pt-1 border-t border-[rgba(91,157,255,0.08)]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider", children: "Sender Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: senderName,
                      onChange: (e) => setSenderName(e.target.value),
                      required: true,
                      "data-ocid": `email.config.sender_name.input.${index}`,
                      className: "h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider", children: "Sender Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "email",
                      value: senderEmail,
                      onChange: (e) => setSenderEmail(e.target.value),
                      required: true,
                      "data-ocid": `email.config.sender_email.input.${index}`,
                      className: "h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider", children: "Bounce Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      type: "email",
                      value: bounceEmail,
                      onChange: (e) => setBounceEmail(e.target.value),
                      required: true,
                      "data-ocid": `email.config.bounce_email.input.${index}`,
                      className: "h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-wider", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Switch,
                      {
                        checked: isActive,
                        onCheckedChange: setIsActive,
                        "data-ocid": `email.config.active.switch.${index}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-xs font-mono text-[rgba(232,232,255,0.5)]", children: isActive ? "Yes" : "No" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    size: "sm",
                    onClick: () => setEditing(false),
                    className: "text-xs",
                    "data-ocid": `email.config.cancel_button.${index}`,
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    size: "sm",
                    disabled: updateConfig.isPending,
                    className: "text-xs",
                    "data-ocid": `email.config.save_button.${index}`,
                    children: updateConfig.isPending ? "Saving…" : "Save Changes"
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
function TemplateModal({ productId, existing, onClose }) {
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const [name, setName] = reactExports.useState((existing == null ? void 0 : existing.name) ?? "");
  const [subject, setSubject] = reactExports.useState((existing == null ? void 0 : existing.subject) ?? "");
  const [body, setBody] = reactExports.useState((existing == null ? void 0 : existing.body) ?? "");
  const isPending = createTemplate.isPending || updateTemplate.isPending;
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (existing) {
        await updateTemplate.mutateAsync({ id: existing.id, subject, body });
        ue.success("Template updated");
      } else {
        await createTemplate.mutateAsync({ productId, name, subject, body });
        ue.success("Template created");
      }
      onClose();
    } catch {
      ue.error(
        existing ? "Failed to update template" : "Failed to create template"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" },
      "data-ocid": "email.template.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
          className: "w-full max-w-2xl rounded-2xl",
          style: MODAL_OUTER,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-[rgba(91,157,255,0.12)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-[#E8E8FF]", children: existing ? "Edit Template" : "New Template" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5", children: existing ? `Editing: ${existing.name}` : "Create a reusable email template" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close",
                  "data-ocid": "email.template.close_button",
                  className: "p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-[rgba(232,232,255,0.45)]" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
              !existing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "Template Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    required: true,
                    placeholder: "Welcome Email",
                    "data-ocid": "email.template.name.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "Subject" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    required: true,
                    placeholder: "Welcome to {{product_name}}",
                    "data-ocid": "email.template.subject.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "HTML Body" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    value: body,
                    onChange: (e) => setBody(e.target.value),
                    required: true,
                    rows: 12,
                    placeholder: "<html>\\n  <body>\\n    <h1>Hello {{name}}</h1>\\n  </body>\\n</html>",
                    "data-ocid": "email.template.body.textarea",
                    className: "font-mono text-xs resize-y bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: onClose,
                    className: "flex-1",
                    "data-ocid": "email.template.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: isPending,
                    className: "flex-1",
                    "data-ocid": "email.template.submit_button",
                    children: isPending ? "Saving…" : existing ? "Update Template" : "Create Template"
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
function AddConfigModal({
  productId,
  onClose
}) {
  const createConfig = useCreateEmailConfig();
  const [senderName, setSenderName] = reactExports.useState("");
  const [senderEmail, setSenderEmail] = reactExports.useState("");
  const [bounceEmail, setBounceEmail] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createConfig.mutateAsync({
        productId,
        senderName,
        senderEmail,
        bounceEmail
      });
      ue.success("Email config created");
      onClose();
    } catch {
      ue.error("Failed to create config");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" },
      "data-ocid": "email.config.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
          className: "w-full max-w-md rounded-2xl",
          style: MODAL_OUTER,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-[rgba(91,157,255,0.12)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-[#E8E8FF]", children: "Add Email Config" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close",
                  "data-ocid": "email.config.close_button",
                  className: "p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-[rgba(232,232,255,0.45)]" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "Sender Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: senderName,
                    onChange: (e) => setSenderName(e.target.value),
                    required: true,
                    placeholder: "VYAN Notifications",
                    "data-ocid": "email.config.sender_name.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "Sender Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "email",
                    value: senderEmail,
                    onChange: (e) => setSenderEmail(e.target.value),
                    required: true,
                    placeholder: "no-reply@vyanlabs.com",
                    "data-ocid": "email.config.sender_email_new.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-wider", children: "Bounce Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "email",
                    value: bounceEmail,
                    onChange: (e) => setBounceEmail(e.target.value),
                    required: true,
                    placeholder: "bounce@vyanlabs.com",
                    "data-ocid": "email.config.bounce_email_new.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: onClose,
                    className: "flex-1",
                    "data-ocid": "email.config.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: createConfig.isPending,
                    className: "flex-1",
                    "data-ocid": "email.config.submit_button",
                    children: createConfig.isPending ? "Saving…" : "Save Config"
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
function ConfigTab({ productId }) {
  const { data: configs } = useEmailConfigs(productId);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)]", children: [
        (configs == null ? void 0 : configs.length) ?? 0,
        " configuration",
        (configs == null ? void 0 : configs.length) !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowAdd(true),
          className: "gap-1.5 h-7 text-xs",
          "data-ocid": "email.config.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
            " Add Config"
          ]
        }
      )
    ] }),
    !(configs == null ? void 0 : configs.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-12 flex flex-col items-center gap-3",
        style: {
          background: "rgba(10,20,45,0.4)",
          border: "1px solid rgba(91,157,255,0.08)"
        },
        "data-ocid": "email.configs.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-8 h-8 text-[rgba(91,157,255,0.3)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[rgba(232,232,255,0.35)] text-center", children: "No email configurations yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.2)] text-center", children: "Add a config to start sending emails from this product" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: configs.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigCard, { config: c, index: i + 1 }, c.id.toString())) }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddConfigModal,
      {
        productId,
        onClose: () => setShowAdd(false)
      }
    )
  ] });
}
function TemplatesTab({ productId }) {
  const { data: templates } = useEmailTemplates(productId);
  const [modalTarget, setModalTarget] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)]", children: [
        (templates == null ? void 0 : templates.length) ?? 0,
        " template",
        (templates == null ? void 0 : templates.length) !== 1 ? "s" : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setModalTarget("new"),
          className: "gap-1.5 h-7 text-xs",
          "data-ocid": "email.template.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
            " New Template"
          ]
        }
      )
    ] }),
    !(templates == null ? void 0 : templates.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-12 flex flex-col items-center gap-3",
        style: {
          background: "rgba(10,20,45,0.4)",
          border: "1px solid rgba(91,157,255,0.08)"
        },
        "data-ocid": "email.templates.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-[rgba(91,157,255,0.3)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[rgba(232,232,255,0.35)] text-center", children: "No email templates yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.2)] text-center", children: "Create a template to reuse across email campaigns" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: templates.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl px-5 py-4 flex items-center justify-between gap-4",
        style: GLASS,
        "data-ocid": `email.template.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                style: {
                  background: "rgba(74,26,107,0.3)",
                  border: "1px solid rgba(140,80,220,0.25)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-purple-400" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-semibold text-[#E8E8FF] truncate", children: t.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)] truncate", children: t.subject })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] font-mono text-[rgba(232,232,255,0.3)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fmtTimestamp(t.lastModified) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setModalTarget(t),
                "aria-label": "Edit template",
                "data-ocid": `email.template.edit_button.${i + 1}`,
                className: "p-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-[rgba(232,232,255,0.45)]" })
              }
            )
          ] })
        ]
      },
      t.id.toString()
    )) }),
    modalTarget === "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TemplateModal,
      {
        productId,
        onClose: () => setModalTarget(null)
      }
    ),
    modalTarget && modalTarget !== "new" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TemplateModal,
      {
        productId,
        existing: modalTarget,
        onClose: () => setModalTarget(null)
      }
    )
  ] });
}
function statusKey(status) {
  if (status === EmailStatus.sent) return "sent";
  if (status === EmailStatus.failed) return "failed";
  if (status === EmailStatus.bounced) return "bounced";
  return "failed";
}
function LogRow({ log, index }) {
  const key = statusKey(log.status);
  const style = statusStyle(log.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[80px_1fr_1fr_120px] items-center gap-4 px-4 py-3 rounded-lg",
      style: {
        background: "rgba(10,20,45,0.45)",
        border: "1px solid rgba(91,157,255,0.07)"
      },
      "data-ocid": `email.log.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full w-fit",
            style: {
              background: style.bg,
              color: style.text,
              border: `1px solid ${style.text}30`
            },
            children: [
              style.icon,
              key
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-body text-[#E8E8FF] truncate",
            title: log.subject,
            children: log.subject
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-mono text-[rgba(232,232,255,0.5)] truncate",
            title: log.recipient,
            children: log.recipient
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.3)] text-right", children: fmtTimestamp(log.timestamp) })
      ]
    }
  );
}
function LogsTab({ productId }) {
  const { data: logs } = useEmailLogs(productId);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: !(logs == null ? void 0 : logs.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl p-12 flex flex-col items-center gap-3",
      style: {
        background: "rgba(10,20,45,0.4)",
        border: "1px solid rgba(91,157,255,0.08)"
      },
      "data-ocid": "email.logs.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(List$1, { className: "w-8 h-8 text-[rgba(91,157,255,0.3)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-[rgba(232,232,255,0.35)] text-center", children: "No email logs yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.2)] text-center", children: "Sent, failed and bounced emails will appear here" })
      ]
    }
  ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[80px_1fr_1fr_120px] gap-4 px-4 pb-2 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest", children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest", children: "Subject" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest", children: "Recipient" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-mono text-[rgba(232,232,255,0.25)] uppercase tracking-widest text-right", children: "Sent At" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: logs.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(LogRow, { log: l, index: i + 1 }, l.id.toString())) })
  ] }) });
}
function ProductEmailPanel({ productId }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "config", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      TabsList,
      {
        className: "mb-5",
        style: {
          background: "rgba(91,157,255,0.07)",
          border: "1px solid rgba(91,157,255,0.12)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "config",
              "data-ocid": "email.config.tab",
              className: "text-xs font-mono gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "w-3 h-3" }),
                " Config"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "templates",
              "data-ocid": "email.templates.tab",
              className: "text-xs font-mono gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3 h-3" }),
                " Templates"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "logs",
              "data-ocid": "email.logs.tab",
              className: "text-xs font-mono gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(List$1, { className: "w-3 h-3" }),
                " Logs"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "config", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfigTab, { productId }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "templates", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TemplatesTab, { productId }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "logs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogsTab, { productId }) })
  ] });
}
function EmailPage() {
  const { data: products } = useProducts();
  const [selectedProductId, setSelectedProductId] = reactExports.useState("");
  const selectedProduct = products == null ? void 0 : products.find(
    (p) => p.id.toString() === selectedProductId
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", "data-ocid": "email.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-[#E8E8FF]", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] mt-0.5", children: "Configurations · Templates · Delivery Logs" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedProductId, onValueChange: setSelectedProductId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            "data-ocid": "email.product.select",
            className: "w-52 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF] text-xs font-mono",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select product…" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (products ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectItem,
          {
            value: p.id.toString(),
            className: "font-mono text-xs",
            children: p.name
          },
          p.id.toString()
        )) })
      ] })
    ] }),
    !selectedProduct ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "rounded-2xl p-16 flex flex-col items-center gap-4",
        style: {
          background: "rgba(10,20,45,0.5)",
          border: "1px solid rgba(91,157,255,0.1)"
        },
        "data-ocid": "email.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-2xl flex items-center justify-center",
              style: {
                background: "rgba(91,157,255,0.08)",
                border: "1px solid rgba(91,157,255,0.15)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-7 h-7 text-[rgba(91,157,255,0.5)]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-[rgba(232,232,255,0.55)]", children: "No product selected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.25)] mt-1", children: "Choose a product from the dropdown to manage its email settings" })
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-6 h-6 rounded-md flex items-center justify-center",
                style: {
                  background: "rgba(91,157,255,0.12)",
                  border: "1px solid rgba(91,157,255,0.2)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3.5 h-3.5 text-blue-400" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-body font-semibold text-[#E8E8FF]", children: selectedProduct.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[rgba(232,232,255,0.3)] ml-1", children: selectedProduct.code })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProductEmailPanel, { productId: selectedProduct.id })
        ]
      },
      selectedProductId
    )
  ] });
}
export {
  EmailPage as default
};
