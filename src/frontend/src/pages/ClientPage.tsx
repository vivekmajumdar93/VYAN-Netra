import AppCard from "@/components/apps/AppCard";
import NewAppDialog from "@/components/apps/NewAppDialog";
import ClientDialog from "@/components/clients/ClientDialog";
import {
  EmptyState,
  SectionHeader,
  StatTile,
} from "@/components/common/Section";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApps,
  useClients,
  useRemoveClient,
  useUsers,
} from "@/hooks/use-backend";
import { formatDateTime } from "@/lib/format";
import { AppStatus } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Layers,
  Mail,
  Pencil,
  Plus,
  SearchX,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ClientPage() {
  const { clientId } = useParams({ strict: false }) as { clientId: string };
  const navigate = useNavigate();
  const { data: clients, isLoading } = useClients();
  const { data: apps } = useApps();
  const { data: users } = useUsers();
  const removeClient = useRemoveClient();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const client = (clients ?? []).find((c) => c.id === clientId) ?? null;
  const owned = (apps ?? []).filter((a) => a.clientId === clientId);
  const ownedIds = new Set(owned.map((a) => a.id));
  const userCount = (users ?? []).filter((u) => ownedIds.has(u.appId)).length;
  const connected = owned.filter(
    (a) => a.status === AppStatus.connected,
  ).length;
  const websites = owned.filter((a) => a.kind === "website").length;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <EmptyState
          icon={SearchX}
          title="This client doesn't exist"
          body="It may have been removed."
          action={
            <Button asChild size="sm" className="mt-1 font-mono text-xs">
              <Link to="/">Back to clients</Link>
            </Button>
          }
        />
      </div>
    );
  }

  async function doDelete() {
    try {
      await removeClient.mutateAsync(clientId);
      toast.success("Client removed");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not remove client",
      );
    }
  }

  return (
    <div
      className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto"
      data-ocid="client.page"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[rgba(232,232,255,0.5)] hover:text-[#E8E8FF] transition-colors"
        data-ocid="client.back_link"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All clients
      </Link>

      <div className="glass-card rounded-2xl p-5 flex flex-wrap items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(147,89,255,0.12)",
            border: "1px solid rgba(147,89,255,0.3)",
          }}
        >
          <Building2 className="w-6 h-6 text-violet-300" />
        </div>
        <div className="min-w-0 flex-1 basis-64 space-y-2">
          <h2 className="text-xl font-display font-bold text-[#E8E8FF] truncate">
            {client.name}
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-mono text-[rgba(232,232,255,0.5)]">
            {client.contactName ? (
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3 h-3" /> {client.contactName}
              </span>
            ) : null}
            {client.contactEmail ? (
              <a
                href={`mailto:${client.contactEmail}`}
                className="inline-flex items-center gap-1.5 hover:text-[#E8E8FF]"
              >
                <Mail className="w-3 h-3" /> {client.contactEmail}
              </a>
            ) : null}
            <span>Client since {formatDateTime(client.createdAt)}</span>
          </div>
          {client.notes ? (
            <p className="text-xs font-body text-[rgba(232,232,255,0.6)] leading-relaxed whitespace-pre-line">
              {client.notes}
            </p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="h-9 font-mono text-xs text-[rgba(232,232,255,0.6)] border border-[rgba(91,157,255,0.2)]"
            data-ocid="client.edit_button"
          >
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            disabled={owned.length > 0}
            title={
              owned.length > 0
                ? "Move or remove this client's apps and websites first"
                : undefined
            }
            className="h-9 font-mono text-xs text-red-300 hover:bg-red-500/10 border border-red-500/25 disabled:opacity-40"
            data-ocid="client.delete_button"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile
          label="Apps & websites"
          value={owned.length}
          sub={`${websites} website${websites === 1 ? "" : "s"}`}
          color="#A855F7"
        />
        <StatTile
          label="Connected"
          value={`${connected}/${owned.length}`}
          sub={
            owned.length === 0
              ? "Nothing registered"
              : connected === owned.length
                ? "All online"
                : `${owned.length - connected} not connected`
          }
          color={
            owned.length > 0 && connected === owned.length
              ? "#34D399"
              : "#F59E0B"
          }
        />
        <StatTile label="Users" value={userCount} sub="across their apps" />
      </div>

      <section>
        <SectionHeader
          title="Apps & websites"
          action={
            <Button
              size="sm"
              onClick={() => setAdding(true)}
              className="h-8 text-xs font-mono bg-[rgba(91,157,255,0.12)] hover:bg-[rgba(91,157,255,0.22)] text-blue-200 border border-[rgba(91,157,255,0.28)]"
              data-ocid="client.register_app_button"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Register app or website
            </Button>
          }
        />
        {owned.length === 0 ? (
          <EmptyState
            icon={Layers}
            title={`Nothing registered for ${client.name} yet`}
            body="Register the apps and websites you build for this client. Each gets its own pairing code and its own console."
            action={
              <Button
                size="sm"
                onClick={() => setAdding(true)}
                className="mt-1 font-mono text-xs"
              >
                Register the first one
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {owned.map((app, i) => (
              <AppCard key={app.id} app={app} index={i} />
            ))}
          </div>
        )}
      </section>

      <ClientDialog open={editing} onOpenChange={setEditing} client={client} />
      <NewAppDialog
        open={adding}
        onOpenChange={setAdding}
        defaultClientId={client.id}
      />
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          style={{
            background: "rgba(8,14,35,0.97)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-[#E8E8FF]">
              Remove {client.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.6)]">
              This removes the client record only. It has no apps or websites
              registered, so nothing else is affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void doDelete()}
              className="font-mono text-xs bg-red-600 hover:bg-red-500 text-white"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
