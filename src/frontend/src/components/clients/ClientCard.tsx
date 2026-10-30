import type { ClientView } from "@/backend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Globe, LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

export default function ClientCard({
  client,
  connected,
  websites,
  index = 0,
}: {
  client: ClientView;
  // Real counts derived from the client's registered apps.
  connected: number;
  websites: number;
  index?: number;
}) {
  const apps = client.appCount - websites;
  const allUp = client.appCount > 0 && connected === client.appCount;
  const dot = client.appCount === 0 ? "#6B7280" : allUp ? "#34D399" : "#F59E0B";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        to="/clients/$clientId"
        params={{ clientId: client.id }}
        className="group glass-card rounded-xl p-5 flex flex-col gap-4 h-full transition-smooth hover:border-[rgba(147,89,255,0.45)] hover:shadow-[0_0_28px_rgba(147,89,255,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(147,89,255,0.6)]"
        data-ocid={`client.card.${index + 1}`}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(147,89,255,0.12)",
              border: "1px solid rgba(147,89,255,0.28)",
            }}
          >
            <Building2 className="w-5 h-5 text-violet-300" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-display font-semibold text-[#E8E8FF] truncate">
              {client.name}
            </h3>
            <p className="text-[10px] font-mono text-[rgba(232,232,255,0.4)] mt-0.5 truncate">
              {client.contactName ??
                client.contactEmail ??
                "No contact on file"}
            </p>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: dot }}
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Apps", value: apps, icon: LayoutGrid },
            { label: "Websites", value: websites, icon: Globe },
            { label: "Online", value: connected, icon: null },
          ].map((cell) => (
            <div
              key={cell.label}
              className="rounded-lg px-3 py-2 bg-[rgba(147,89,255,0.05)] border border-[rgba(147,89,255,0.12)]"
            >
              <p className="text-[9px] font-mono text-[rgba(232,232,255,0.4)] uppercase tracking-wider">
                {cell.label}
              </p>
              <p
                className={cn(
                  "text-base font-display font-bold metric-value mt-0.5",
                  cell.label === "Online" && connected > 0
                    ? "text-emerald-400"
                    : "text-[#E8E8FF]",
                )}
              >
                {cell.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end mt-auto pt-3 border-t border-[rgba(147,89,255,0.12)]">
          <span className="flex items-center gap-1 text-[11px] font-mono text-violet-300/80 group-hover:text-violet-200">
            Open client
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
