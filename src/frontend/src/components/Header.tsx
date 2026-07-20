import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-backend";
import { useVyanAuth } from "@/hooks/use-vyan-auth";
import { Bell, ChevronDown, LogOut, Shield } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { currentUser, logout } = useVyanAuth();
  const { data: notifications } = useNotifications(null, null, false);
  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;

  const initials = (currentUser?.name ?? "VA")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[rgba(91,157,255,0.12)] bg-[rgba(5,10,25,0.7)] backdrop-blur-xl flex-shrink-0">
      {/* Left: logo + title */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/assets/images/vyan-logo.png"
          alt="VYAN"
          className="flex-shrink-0"
          style={{ maxHeight: 32, width: "auto", objectFit: "contain" }}
        />
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-[#E8E8FF] tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[rgba(232,232,255,0.4)] font-mono mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Notification bell */}
        <button
          type="button"
          className="relative p-2 rounded-lg transition-all duration-200 text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] hover:bg-[rgba(91,157,255,0.1)]"
          aria-label="Notifications"
          data-ocid="header.notifications.button"
        >
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && (
            <Badge
              className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-[9px] font-mono bg-violet-600 hover:bg-violet-600 border-0 rounded-full flex items-center justify-center"
              data-ocid="header.notifications.badge"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[rgba(91,157,255,0.2)]" />

        {/* VYAN Auth user pill */}
        <div
          className="flex items-center gap-2"
          data-ocid="header.profile.dropdown"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(91,157,255,0.08)] border border-[rgba(91,157,255,0.15)] cursor-default">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <span className="text-[8px] font-bold text-white">
                {initials}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-mono text-[rgba(232,232,255,0.85)] max-w-[120px] truncate">
                {currentUser?.name ?? "VYAN Admin"}
              </span>
              <span className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] max-w-[120px] truncate">
                {currentUser?.role ?? "Super Admin"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-[rgba(232,232,255,0.4)]" />
          </div>

          {/* VYAN Security badge */}
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md"
            style={{
              background: "rgba(91,157,255,0.06)",
              border: "1px solid rgba(91,157,255,0.12)",
            }}
          >
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-mono text-[rgba(232,232,255,0.35)] tracking-widest uppercase">
              VYAN Security
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-[rgba(232,232,255,0.4)] hover:text-[#E8E8FF] hover:bg-[rgba(91,157,255,0.1)] px-2 h-8"
            data-ocid="header.logout.button"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
