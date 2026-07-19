import { IssueStatus } from "@/backend";
import { useNotifications } from "@/hooks/use-backend";
import { useActiveAlerts } from "@/hooks/use-backend";
import { useIssues } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Bell,
  Layers,
  LayoutDashboard,
  Mail,
  RefreshCw,
  Settings,
  Users,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function Sidebar() {
  const location = useLocation();
  const { data: notifications } = useNotifications(null, null, false);
  const { data: alerts } = useActiveAlerts();
  const { data: issues } = useIssues(null, IssueStatus.open);

  const unreadNotifs = notifications?.filter((n) => !n.isRead).length ?? 0;
  const activeAlerts = alerts?.length ?? 0;
  const openIssues = issues?.length ?? 0;

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
    { id: "apps", label: "Apps", path: "/apps", icon: Layers },
    { id: "users", label: "Users", path: "/users", icon: Users },
    {
      id: "monitoring",
      label: "Monitoring",
      path: "/monitoring",
      icon: Activity,
      badge: activeAlerts > 0 ? activeAlerts : undefined,
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/notifications",
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
    {
      id: "issues",
      label: "Issues",
      path: "/issues",
      icon: AlertTriangle,
      badge: openIssues > 0 ? openIssues : undefined,
    },
    { id: "updates", label: "Updates", path: "/updates", icon: RefreshCw },
    { id: "email", label: "Email", path: "/email", icon: Mail },
    { id: "settings", label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col h-full border-r border-[rgba(91,157,255,0.15)] bg-[rgba(5,10,25,0.85)] backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[rgba(91,157,255,0.12)]">
        <img
          src="https://raw.githubusercontent.com/vivekmajumdar93/VYAN-Technologies-Logo/main/IMG_9695.png"
          alt="VYAN"
          className="flex-shrink-0"
          style={{ maxHeight: 40, width: "auto", objectFit: "contain" }}
        />
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-base font-bold tracking-wide text-[#E8E8FF]">
              VYAN
            </span>
            <span className="font-display text-base font-light text-[rgba(232,232,255,0.7)]">
              Netra
            </span>
          </div>
          <p className="text-[10px] text-[rgba(232,232,255,0.4)] font-mono uppercase tracking-widest leading-none mt-0.5">
            VYAN
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              data-ocid={`sidebar.${item.id}.link`}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative",
                isActive
                  ? "bg-[rgba(91,157,255,0.15)] text-[#E8E8FF] shadow-[0_0_12px_rgba(91,157,255,0.2)]"
                  : "text-[rgba(232,232,255,0.55)] hover:bg-[rgba(91,157,255,0.08)] hover:text-[rgba(232,232,255,0.85)]",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-violet-500" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-[rgba(232,232,255,0.4)] group-hover:text-blue-400",
                )}
              />
              <span className="font-body flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-mono font-semibold bg-[rgba(147,89,255,0.3)] text-violet-300 border border-[rgba(147,89,255,0.4)] px-1">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[rgba(91,157,255,0.12)]">
        <p className="text-[10px] text-[rgba(232,232,255,0.25)] font-mono text-center leading-relaxed">
          © {new Date().getFullYear()} VYAN
        </p>
        <p className="text-[9px] text-[rgba(232,232,255,0.18)] font-mono text-center tracking-widest uppercase mt-0.5">
          VYAN Netra · VYAN Ecosystem
        </p>
      </div>
    </aside>
  );
}
