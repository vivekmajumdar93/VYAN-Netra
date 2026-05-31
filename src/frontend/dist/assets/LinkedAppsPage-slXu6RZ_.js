import { c as createLucideIcon, an as useQuery, ao as useActor, ap as useQueryClient, aq as useMutation, ar as createActor, as as useLinkedAppContext, j as jsxRuntimeExports, L as Link2, r as reactExports, F as cn, k as Button, n as ue, l as Badge } from "./index-B0U-vI18.js";
import { I as Input } from "./input-ChBNhlJN.js";
import { L as Label } from "./label-dd52H_Md.js";
import { m as motion } from "./proxy-DrXJd9GG.js";
import { P as Plus } from "./plus-D5BLP1nV.js";
import { C as CircleAlert } from "./circle-alert-lAuFozwt.js";
import { E as ExternalLink } from "./external-link-3a6po7Lb.js";
import { C as CircleX } from "./circle-x-YLQRWRpo.js";
import { T as Trash2 } from "./trash-2-l3l4MEia.js";
import { C as CircleCheck } from "./circle-check-q76y3x7a.js";
import "./index-CLpxXFLZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9", key: "s0qx1y" }],
  ["path", { d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5", key: "1idnkw" }],
  ["circle", { cx: "12", cy: "9", r: "2", key: "1092wv" }],
  ["path", { d: "M16.2 4.8c2 2 2.26 5.11.8 7.47", key: "ojru2q" }],
  ["path", { d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1", key: "rhi7fg" }],
  ["path", { d: "M9.5 18h5", key: "mfy3pd" }],
  ["path", { d: "m8 22 4-11 4 11", key: "25yftu" }]
];
const RadioTower = createLucideIcon("radio-tower", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode);
function useLinkedAppsActor() {
  return useActor(createActor);
}
function useLinkedApps() {
  const { actor, isFetching } = useLinkedAppsActor();
  return useQuery({
    queryKey: ["linked-apps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLinkedApps();
    },
    enabled: !!actor && !isFetching
  });
}
function useRegisterLinkedApp() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerLinkedApp(args.name, args.baseUrl, args.appCode);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] })
  });
}
function useUpdateLinkedAppStatus() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLinkedAppStatus(args.id, args.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] })
  });
}
function useRemoveLinkedApp() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeLinkedApp(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] })
  });
}
const APP_CODE_REGEX = /^[A-Z0-9]{6}$/;
function validateAppCode(code) {
  if (!code) return "App Code is required";
  if (code.length !== 6) return "App Code must be exactly 6 characters";
  if (!APP_CODE_REGEX.test(code))
    return "App Code must be uppercase letters and digits only";
  return null;
}
function StatusBadge({ status }) {
  const configs = {
    connected: {
      label: "Connected",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.25)]"
    },
    disconnected: {
      label: "Disconnected",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-3 h-3" }),
      className: "bg-amber-500/10 text-amber-400 border-amber-500/30"
    },
    refused: {
      label: "Refused",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 animate-pulse" }),
      className: "bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)] animate-pulse"
    },
    unknown: {
      label: "Unknown",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioTower, { className: "w-3 h-3" }),
      className: "bg-[rgba(91,157,255,0.1)] text-[rgba(232,232,255,0.55)] border-[rgba(91,157,255,0.2)]"
    }
  };
  const cfg = configs[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border",
        cfg.className
      ),
      children: [
        cfg.icon,
        cfg.label
      ]
    }
  );
}
function RegisterForm() {
  const [name, setName] = reactExports.useState("");
  const [baseUrl, setBaseUrl] = reactExports.useState("");
  const [appCode, setAppCode] = reactExports.useState("");
  const [codeError, setCodeError] = reactExports.useState(null);
  const register = useRegisterLinkedApp();
  function handleCodeChange(val) {
    const upper = val.toUpperCase();
    setAppCode(upper);
    if (codeError) setCodeError(validateAppCode(upper));
  }
  function handleCodeBlur() {
    setCodeError(validateAppCode(appCode));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateAppCode(appCode);
    if (err) {
      setCodeError(err);
      return;
    }
    if (!name.trim() || !baseUrl.trim()) return;
    try {
      await register.mutateAsync({
        name: name.trim(),
        baseUrl: baseUrl.trim(),
        appCode
      });
      ue.success(`"${name.trim()}" linked to VYAN Netra`);
      setName("");
      setBaseUrl("");
      setAppCode("");
      setCodeError(null);
    } catch {
      ue.error("Failed to register linked app");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.35 },
      className: "rounded-xl p-5",
      style: {
        background: "rgba(10,20,45,0.7)",
        border: "1px solid rgba(91,157,255,0.18)",
        backdropFilter: "blur(14px)"
      },
      "data-ocid": "linked-apps.register.card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 text-blue-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest", children: "Register New Application" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "app-name",
                  className: "text-xs font-mono text-[rgba(232,232,255,0.5)]",
                  children: "Application Name"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "app-name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  placeholder: "e.g. VYAN Ṛtam",
                  required: true,
                  "data-ocid": "linked-apps.name.input",
                  className: "bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50 focus:ring-blue-500/20"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "app-code",
                  className: "text-xs font-mono text-[rgba(232,232,255,0.5)]",
                  children: "6-Digit App Code"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "app-code",
                  value: appCode,
                  onChange: (e) => handleCodeChange(e.target.value),
                  onBlur: handleCodeBlur,
                  placeholder: "e.g. RTAM6X",
                  maxLength: 6,
                  required: true,
                  "data-ocid": "linked-apps.code.input",
                  className: cn(
                    "bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm tracking-widest uppercase",
                    codeError ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/20" : "focus:border-blue-500/50 focus:ring-blue-500/20"
                  )
                }
              ),
              codeError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: "text-[10px] font-mono text-red-400 flex items-center gap-1 mt-1",
                  "data-ocid": "linked-apps.code.field_error",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3 h-3 flex-shrink-0" }),
                    codeError
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "base-url",
                className: "text-xs font-mono text-[rgba(232,232,255,0.5)]",
                children: "Base API URL"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "base-url",
                value: baseUrl,
                onChange: (e) => setBaseUrl(e.target.value),
                placeholder: "https://your-app.vercel.app/api",
                required: true,
                type: "url",
                "data-ocid": "linked-apps.url.input",
                className: "bg-[rgba(255,255,255,0.04)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] font-mono text-sm focus:border-blue-500/50 focus:ring-blue-500/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: register.isPending,
              "data-ocid": "linked-apps.register.submit_button",
              className: "w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white border-0 font-mono text-sm tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(91,157,255,0.25)]",
              children: register.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
                " Registering…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4 mr-2" }),
                " Register Application"
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function AppCard({ app, index, isActive, onSetActive }) {
  const { connectionStatusMap, setConnectionStatus } = useLinkedAppContext();
  const updateStatus = useUpdateLinkedAppStatus();
  const removeApp = useRemoveLinkedApp();
  const testDebounceRef = reactExports.useRef(null);
  const lastTestRef = reactExports.useRef(0);
  const [isTesting, setIsTesting] = reactExports.useState(false);
  const derivedStatus = connectionStatusMap[app.id] ?? (app.status === "connected" ? "connected" : app.status === "refused" ? "refused" : app.status === "disconnected" ? "disconnected" : "unknown");
  const handleTestConnection = reactExports.useCallback(async () => {
    const now = Date.now();
    if (isTesting || now - lastTestRef.current < 2e3) return;
    if (testDebounceRef.current) clearTimeout(testDebounceRef.current);
    testDebounceRef.current = setTimeout(async () => {
      lastTestRef.current = Date.now();
      setIsTesting(true);
      const url = `${app.baseUrl.replace(/\/$/, "")}/health`;
      try {
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "X-App-Code": app.appCode
          },
          signal: AbortSignal.timeout(8e3)
        });
        if (res.status === 401 || res.status === 403) {
          setConnectionStatus(app.id, "refused");
          await updateStatus.mutateAsync({ id: app.id, status: "refused" });
          ue.error("Connection Refused: Invalid 6-Digit VYAN App Code.");
        } else if (res.ok) {
          setConnectionStatus(app.id, "connected");
          await updateStatus.mutateAsync({ id: app.id, status: "connected" });
          ue.success(`${app.name} is reachable`);
        } else {
          setConnectionStatus(app.id, "disconnected");
          await updateStatus.mutateAsync({
            id: app.id,
            status: "disconnected"
          });
          ue.warning(`${app.name} returned HTTP ${res.status}`);
        }
      } catch {
        setConnectionStatus(app.id, "disconnected");
        await updateStatus.mutateAsync({ id: app.id, status: "disconnected" });
        ue.warning(`${app.name} is unreachable`);
      } finally {
        setIsTesting(false);
      }
    }, 50);
  }, [app, isTesting, setConnectionStatus, updateStatus]);
  async function handleRemove() {
    try {
      await removeApp.mutateAsync(app.id);
      ue.success(`${app.name} removed from VYAN Netra`);
    } catch {
      ue.error("Failed to remove application");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.08 },
      className: cn(
        "rounded-xl p-5 cursor-pointer transition-all duration-200",
        isActive ? "ring-1 ring-blue-500/50 shadow-[0_0_20px_rgba(91,157,255,0.15)]" : "hover:ring-1 hover:ring-[rgba(91,157,255,0.2)]"
      ),
      style: {
        background: isActive ? "rgba(11,30,70,0.8)" : "rgba(10,20,45,0.6)",
        border: isActive ? "1px solid rgba(91,157,255,0.3)" : "1px solid rgba(91,157,255,0.12)",
        backdropFilter: "blur(14px)"
      },
      onClick: onSetActive,
      "data-ocid": `linked-apps.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-display font-semibold text-[#E8E8FF] truncate", children: app.name }),
              isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[9px] font-mono px-1.5 py-0 border-blue-500/40 text-blue-400 bg-blue-500/10",
                  children: "ACTIVE"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5 truncate", children: app.baseUrl })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: derivedStatus })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-lg tracking-widest",
              style: {
                background: "rgba(147,89,255,0.12)",
                border: "1px solid rgba(147,89,255,0.25)",
                color: "rgba(196,160,255,0.9)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                app.appCode
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.25)]", children: [
            "ID: ",
            app.id.slice(0, 20),
            "…"
          ] })
        ] }),
        derivedStatus === "refused" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-[10px] font-mono text-red-400",
            style: {
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)"
            },
            "data-ocid": `linked-apps.refused.error_state.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 flex-shrink-0" }),
              "Connection Refused: Invalid 6-Digit VYAN App Code."
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: handleTestConnection,
                  disabled: isTesting,
                  "data-ocid": `linked-apps.test.button.${index + 1}`,
                  className: "flex-1 text-[11px] font-mono h-8 bg-[rgba(91,157,255,0.1)] hover:bg-[rgba(91,157,255,0.18)] text-blue-300 border border-[rgba(91,157,255,0.25)] hover:border-[rgba(91,157,255,0.4)] transition-all duration-200",
                  children: isTesting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 mr-1.5 animate-spin" }),
                    " Testing…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RadioTower, { className: "w-3 h-3 mr-1.5" }),
                    " Test Connection"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: handleRemove,
                  disabled: removeApp.isPending,
                  "data-ocid": `linked-apps.delete_button.${index + 1}`,
                  className: "h-8 w-8 p-0 text-[rgba(232,232,255,0.35)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
                  "aria-label": `Remove ${app.name}`,
                  children: removeApp.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function LinkedAppsPage() {
  const { data: apps = [], isLoading } = useLinkedApps();
  const { selectedApp, setSelectedApp } = useLinkedAppContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-4xl", "data-ocid": "linked-apps.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        className: "mb-7",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-5 h-5 text-blue-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-[#E8E8FF]", children: "Linked Applications" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1", children: [
            "Connect VYAN ecosystem apps using their unique 6-digit App Code. All management queries are routed with",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-violet-300 bg-[rgba(147,89,255,0.1)] px-1 rounded", children: "X-App-Code" }),
            " ",
            "authorization."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4, delay: 0.05 },
        className: "rounded-xl px-4 py-3 mb-6 flex items-center gap-3",
        style: {
          background: "linear-gradient(135deg, rgba(11,46,92,0.35), rgba(74,26,107,0.25))",
          border: "1px solid rgba(91,157,255,0.15)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RadioTower, { className: "w-4 h-4 text-blue-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.55)] leading-relaxed", children: [
            "Clicking a card marks it as the",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: "active app" }),
            ". All bridge requests will be routed to the active app's registered URL. Requests returning 401/403 are automatically flagged as",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: "refused" }),
            "."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterForm, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-3", children: [
        "Registered Applications · ",
        apps.length
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex items-center justify-center py-12",
          "data-ocid": "linked-apps.list.loading_state",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-blue-400" })
        }
      ) : apps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          className: "rounded-xl p-10 flex flex-col items-center justify-center gap-3",
          style: {
            background: "rgba(10,20,45,0.4)",
            border: "1px dashed rgba(91,157,255,0.18)"
          },
          "data-ocid": "linked-apps.list.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-8 h-8 text-[rgba(91,157,255,0.35)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display text-[rgba(232,232,255,0.4)]", children: "No applications linked yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-mono text-[rgba(232,232,255,0.25)] text-center max-w-xs", children: "Register your first VYAN ecosystem app above using its 6-digit App Code." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: apps.map((app, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        AppCard,
        {
          app,
          index: i,
          isActive: (selectedApp == null ? void 0 : selectedApp.id) === app.id,
          onSetActive: () => setSelectedApp((selectedApp == null ? void 0 : selectedApp.id) === app.id ? null : app)
        },
        app.id
      )) })
    ] })
  ] });
}
export {
  LinkedAppsPage as default
};
