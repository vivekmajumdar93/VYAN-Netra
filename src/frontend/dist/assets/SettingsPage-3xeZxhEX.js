import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, F as cn, ak as useVyanAuth, k as Button, al as LogOut, A as Activity, S as Shield, L as Link2, n as ue } from "./index-B0U-vI18.js";
import { P as Primitive } from "./index-CLpxXFLZ.js";
import { S as Switch } from "./switch-B28J_Qjl.js";
import { m as motion } from "./proxy-DrXJd9GG.js";
import { U as User } from "./user-CiGUKWHK.js";
import { E as ExternalLink } from "./external-link-3a6po7Lb.js";
import { I as Info } from "./info-BXEIKKY1.js";
import "./index-xf975W9k.js";
import "./index-CdREqOPf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
];
const AtSign = createLucideIcon("at-sign", __iconNode$2);
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
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$1);
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
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function loadBool(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "true";
  } catch {
    return fallback;
  }
}
function saveBool(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
  }
}
const GLASS_SECTION = {
  background: "rgba(10,20,45,0.6)",
  border: "1px solid rgba(91,157,255,0.12)",
  backdropFilter: "blur(12px)"
};
function Section({ icon, title, ocid, children, index = 0 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.section,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay: index * 0.07 },
      className: "rounded-xl overflow-hidden",
      style: GLASS_SECTION,
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-[rgba(91,157,255,0.1)] flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.45)] uppercase tracking-widest", children: title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5", children })
      ]
    }
  );
}
function SettingRow({
  label,
  description,
  children,
  divider = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-[#E8E8FF]", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.4)] mt-0.5 leading-relaxed", children: description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children })
    ] }),
    divider && /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-[rgba(91,157,255,0.07)]" })
  ] });
}
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-[#E8E8FF]", children: value })
  ] });
}
function SettingsPage() {
  const { currentUser, logout: vyanLogout } = useVyanAuth();
  const adminEmail = (currentUser == null ? void 0 : currentUser.email) ?? "Not connected";
  const [autoRefresh, setAutoRefresh] = reactExports.useState(
    () => loadBool("netra_auto_refresh", true)
  );
  const [nanoParticles, setNanoParticles] = reactExports.useState(
    () => loadBool("netra_nano_particles", true)
  );
  const [alertNotifications, setAlertNotifications] = reactExports.useState(
    () => loadBool("netra_alert_notifications", true)
  );
  const [sidebarCollapsed, setSidebarCollapsed] = reactExports.useState(
    () => loadBool("netra_sidebar_collapsed", false)
  );
  function toggle(key, value, setter) {
    setter(value);
    saveBool(key, value);
  }
  function handleSignOut() {
    vyanLogout();
    ue.success("Signed out from VYAN Netra");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl", "data-ocid": "settings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        className: "mb-7",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-[#E8E8FF]", children: "Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] mt-1", children: "Manage your console preferences and account" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5" }),
          title: "Account",
          ocid: "settings.account.section",
          index: 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                label: "VYAN Identity",
                description: "Your VYAN Security admin identity for this console",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    onClick: handleSignOut,
                    className: "text-xs gap-1.5",
                    "data-ocid": "settings.signout.button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3 h-3" }),
                      " Sign Out"
                    ]
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-2", children: "Admin Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded-lg px-3 py-2.5 flex items-start gap-2",
                  style: {
                    background: "rgba(91,157,255,0.06)",
                    border: "1px solid rgba(91,157,255,0.14)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { className: "w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-mono text-[#E8E8FF] break-all select-all leading-relaxed",
                        "data-ocid": "settings.principal.display",
                        children: adminEmail
                      }
                    )
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" }),
          title: "Monitoring",
          ocid: "settings.monitoring.section",
          index: 1,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                label: "Auto-Refresh Metrics",
                description: "Automatically poll for new system metrics every 30 s. Disabling this reduces background requests.",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: autoRefresh,
                    onCheckedChange: (v) => toggle("netra_auto_refresh", v, setAutoRefresh),
                    "data-ocid": "settings.autorefresh.switch"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                label: "Alert Notifications",
                description: "Show badge counts for active alerts in the sidebar navigation",
                divider: false,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: alertNotifications,
                    onCheckedChange: (v) => toggle("netra_alert_notifications", v, setAlertNotifications),
                    "data-ocid": "settings.alerts.switch"
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-3.5 h-3.5" }),
          title: "Display",
          ocid: "settings.display.section",
          index: 2,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                label: "Nano-Particle Animation",
                description: "Show the animated cosmic particle orbs in the hero area. Disable for reduced motion or better performance.",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: nanoParticles,
                    onCheckedChange: (v) => toggle("netra_nano_particles", v, setNanoParticles),
                    "data-ocid": "settings.particles.switch"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SettingRow,
              {
                label: "Sidebar Collapsed by Default",
                description: "Start with the sidebar minimized to give more room to the main content area",
                divider: false,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Switch,
                  {
                    checked: sidebarCollapsed,
                    onCheckedChange: (v) => toggle("netra_sidebar_collapsed", v, setSidebarCollapsed),
                    "data-ocid": "settings.sidebar_collapsed.switch"
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }),
          title: "VYAN Security",
          ocid: "settings.security.section",
          index: 3,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4 flex items-center gap-3",
              style: {
                background: "linear-gradient(135deg, rgba(11,46,92,0.4), rgba(74,26,107,0.3))",
                border: "1px solid rgba(91,157,255,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-blue-400 flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.7)]", children: "VYAN Security · Direct Admin Access" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5", children: "Firebase auth integration pending — open access mode active" })
                ] })
              ]
            }
          ) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3.5 h-3.5" }),
          title: "Linked Applications",
          ocid: "settings.linked_apps.section",
          index: 4,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl p-4 flex items-center justify-between gap-4",
              style: {
                background: "linear-gradient(135deg, rgba(11,46,92,0.4), rgba(74,26,107,0.3))",
                border: "1px solid rgba(91,157,255,0.15)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.7)]", children: "Connect VYAN ecosystem apps via 6-digit App Code" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] mt-0.5", children: "Register, monitor and route admin queries to linked apps" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: "/linked-apps",
                    className: "flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-[rgba(91,157,255,0.12)]",
                    style: {
                      background: "rgba(91,157,255,0.08)",
                      border: "1px solid rgba(91,157,255,0.25)",
                      color: "rgba(91,157,255,0.9)"
                    },
                    "data-ocid": "settings.linked_apps.link",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                      " Manage"
                    ]
                  }
                )
              ]
            }
          ) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Section,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3.5 h-3.5" }),
          title: "About",
          ocid: "settings.about.section",
          index: 5,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl p-4 mb-4 mt-3 flex items-center gap-4",
                style: {
                  background: "linear-gradient(135deg, rgba(11,46,92,0.5), rgba(74,26,107,0.4))",
                  border: "1px solid rgba(91,157,255,0.15)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      style: {
                        background: "rgba(91,157,255,0.12)",
                        border: "1px solid rgba(91,157,255,0.25)"
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-blue-400" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-display font-bold text-[#E8E8FF]", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: "VYAN" }),
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-300", children: "Netra" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5", children: "Unified admin control for the VYAN ecosystem" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0",
                      style: {
                        background: "rgba(52,211,153,0.1)",
                        color: "#34D399",
                        border: "1px solid rgba(52,211,153,0.2)"
                      },
                      children: "v1.0.0"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 divide-y divide-[rgba(91,157,255,0.07)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Product", value: "VYAN Netra" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Company", value: "VYAN Labs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Ecosystem", value: "VYAN Ecosystem" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Version", value: "v1.0.0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Security", value: "VYAN Security" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.2)] text-center mt-4 pb-3", children: "All your products, users, systems and emails — controlled from one void." })
          ] })
        }
      )
    ] })
  ] });
}
export {
  SettingsPage as default
};
