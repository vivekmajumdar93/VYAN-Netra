import { type WorkspaceMode, useWorkspace } from "@/context/workspace-context";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Layers } from "lucide-react";

const OPTIONS: {
  mode: WorkspaceMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { mode: "vyan", label: "VYAN", icon: Layers },
  { mode: "clients", label: "Clients", icon: Briefcase },
];

// Switches the whole console between VYAN's own products and the work VYAN
// builds for clients. Always lands on the workspace home so the two never
// show each other's apps.
export default function WorkspaceSwitch({
  onSwitch,
}: { onSwitch?: () => void }) {
  const { mode, setMode } = useWorkspace();
  const navigate = useNavigate();

  return (
    <div
      role="tablist"
      aria-label="Workspace"
      className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[rgba(91,157,255,0.06)] border border-[rgba(91,157,255,0.14)]"
      data-ocid="sidebar.workspace.switch"
    >
      {OPTIONS.map(({ mode: value, label, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              setMode(value);
              navigate({ to: "/" });
              onSwitch?.();
            }}
            data-ocid={`sidebar.workspace.${value}`}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-body font-semibold transition-all duration-200",
              active
                ? "bg-gradient-to-r from-blue-600/80 to-violet-600/80 text-white shadow-[0_0_14px_rgba(91,157,255,0.3)]"
                : "text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] hover:bg-[rgba(91,157,255,0.08)]",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
