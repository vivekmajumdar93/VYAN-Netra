import { useQuery } from "@tanstack/react-query";

export interface VersionHistoryEntry {
  hash: string;
  short: string;
  date: string;
  message: string;
}

export interface VersionHistoryData {
  generatedAt: string;
  branch: string;
  commits: VersionHistoryEntry[];
}

// Reads the static public/version-history.json snapshot generated at build
// time (scripts/generate-version.mjs) — not a backend call, so it costs
// nothing and works even before the Firebase backend is deployed.
export function useVersionHistory() {
  return useQuery<VersionHistoryData>({
    queryKey: ["version-history"],
    queryFn: async () => {
      const res = await fetch("/version-history.json");
      if (!res.ok) throw new Error("version-history.json not found");
      return res.json();
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}
