import type { ClientView } from "@/backend";
import {
  DIALOG_STYLE,
  FIELD_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "@/components/common/dialog-style";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClient, useUpdateClient } from "@/hooks/use-backend";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When given, edits that client; otherwise creates a new one.
  client?: ClientView | null;
  onSaved?: (client: ClientView) => void;
}

export default function ClientDialog({
  open,
  onOpenChange,
  client = null,
  onSaved,
}: ClientDialogProps) {
  const create = useCreateClient();
  const update = useUpdateClient();
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");
  const pending = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setName(client?.name ?? "");
      setContactName(client?.contactName ?? "");
      setContactEmail(client?.contactEmail ?? "");
      setNotes(client?.notes ?? "");
    }
  }, [open, client]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const fields = {
      name: name.trim(),
      contactName: contactName.trim() || null,
      contactEmail: contactEmail.trim() || null,
      notes: notes.trim() || null,
    };
    try {
      const saved = client
        ? await update.mutateAsync({ id: client.id, ...fields })
        : await create.mutateAsync(fields);
      toast.success(client ? "Client updated" : `${saved.name} added`);
      onOpenChange(false);
      onSaved?.(saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save client");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        style={DIALOG_STYLE}
        data-ocid="client.dialog"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="font-display text-[#E8E8FF]">
              {client ? "Edit client" : "Add a client"}
            </DialogTitle>
            <DialogDescription className="text-xs font-mono text-[rgba(232,232,255,0.5)]">
              A client owns the apps and websites VYAN builds for them. Register
              each one under the client afterwards.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="client-name" className={LABEL_CLASS}>
              Client name
            </Label>
            <Input
              id="client-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Retail"
              required
              autoFocus
              className={FIELD_CLASS}
              data-ocid="client.name.input"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="client-contact" className={LABEL_CLASS}>
                Contact person
              </Label>
              <Input
                id="client-contact"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={FIELD_CLASS}
                data-ocid="client.contact_name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-email" className={LABEL_CLASS}>
                Contact email
              </Label>
              <Input
                id="client-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={FIELD_CLASS}
                data-ocid="client.contact_email.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client-notes" className={LABEL_CLASS}>
              Notes
            </Label>
            <Textarea
              id="client-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Scope, agreements, anything worth remembering"
              className={FIELD_CLASS}
              data-ocid="client.notes.input"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="font-mono text-xs text-[rgba(232,232,255,0.6)]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending || !name.trim()}
              className={PRIMARY_BUTTON_CLASS}
              data-ocid="client.submit_button"
            >
              {pending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : client ? (
                "Save changes"
              ) : (
                "Add client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
