import { EmptyState, SectionHeader } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import {
  type AppViewUI,
  useAcceptUser,
  useHoldUser,
  useRejectUser,
  useUsersByApp,
} from "@/hooks/use-backend";
import { nsToMs, timeAgo } from "@/lib/format";
import { UserStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { Check, Pause, Users, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLOR: Record<string, string> = {
  active: "#34D399",
  pending: "#F59E0B",
  held: "#60A5FA",
  rejected: "#EF4444",
};

export default function UsersPanel({ app }: { app: AppViewUI }) {
  const { data: users, isLoading } = useUsersByApp(app.id);
  const accept = useAcceptUser();
  const hold = useHoldUser();
  const reject = useRejectUser();

  const list = users ?? [];
  const counts = {
    active: list.filter((u) => u.status === UserStatus.active).length,
    pending: list.filter((u) => u.status === UserStatus.pending).length,
  };

  async function act(
    fn: { mutateAsync: (id: bigint) => Promise<unknown> },
    id: bigint,
    done: string,
  ) {
    try {
      await fn.mutateAsync(id);
      toast.success(done);
    } catch {
      toast.error("That didn't go through");
    }
  }

  if (isLoading) return null;

  return (
    <section data-ocid="console.users">
      <SectionHeader
        title={`${list.length} user${list.length === 1 ? "" : "s"} · ${counts.active} active · ${counts.pending} pending`}
        action={
          <Link
            to="/users"
            className="text-[11px] font-mono text-[rgba(91,157,255,0.7)] hover:text-[#5B9DFF]"
          >
            Full user management →
          </Link>
        }
      />
      {list.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users synced from this app yet"
          body="The app sends its user list to Netra every minute once it is connected. New users arrive as pending until you accept them."
        />
      ) : (
        <div className="glass-card rounded-xl divide-y divide-[rgba(91,157,255,0.1)]">
          {list.map((u) => {
            const color = STATUS_COLOR[u.status] ?? "#9CA3AF";
            return (
              <div
                key={u.id.toString()}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1 basis-48">
                  <p className="text-sm font-body text-[#E8E8FF] truncate">
                    {u.name}
                  </p>
                  <p className="text-[11px] font-mono text-[rgba(232,232,255,0.4)] truncate">
                    {u.email} · active {timeAgo(nsToMs(u.lastActivity))}
                  </p>
                </div>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border capitalize"
                  style={{
                    color,
                    borderColor: `${color}40`,
                    background: `${color}14`,
                  }}
                >
                  {u.status}
                </span>
                <div className="flex items-center gap-1">
                  {u.status !== UserStatus.active ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] font-mono text-emerald-300 hover:bg-emerald-500/10"
                      onClick={() => act(accept, u.id, `${u.name} accepted`)}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept
                    </Button>
                  ) : null}
                  {u.status !== UserStatus.held ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] font-mono text-blue-300 hover:bg-blue-500/10"
                      onClick={() => act(hold, u.id, `${u.name} put on hold`)}
                    >
                      <Pause className="w-3.5 h-3.5 mr-1" /> Hold
                    </Button>
                  ) : null}
                  {u.status !== UserStatus.rejected ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] font-mono text-red-300 hover:bg-red-500/10"
                      onClick={() => act(reject, u.id, `${u.name} rejected`)}
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
