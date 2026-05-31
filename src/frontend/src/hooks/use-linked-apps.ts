import { createActor } from "@/backend";
import type { LinkedAppView } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useLinkedAppsActor() {
  return useActor(createActor);
}

export function useLinkedApps() {
  const { actor, isFetching } = useLinkedAppsActor();
  return useQuery<LinkedAppView[]>({
    queryKey: ["linked-apps"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listLinkedApps();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterLinkedApp() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      baseUrl: string;
      appCode: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerLinkedApp(args.name, args.baseUrl, args.appCode);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] }),
  });
}

export function useUpdateLinkedAppStatus() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: string; status: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateLinkedAppStatus(args.id, args.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] }),
  });
}

export function useRemoveLinkedApp() {
  const { actor } = useLinkedAppsActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeLinkedApp(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["linked-apps"] }),
  });
}
