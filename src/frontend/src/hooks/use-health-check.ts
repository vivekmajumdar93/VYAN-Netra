import { AppStatus } from "@/backend";
import type { ConnectionState } from "@/components/common/StatusPill";
import { useAppRegistryContext } from "@/context/app-context";
import { type AppViewUI, useSetAppManualStatus } from "@/hooks/use-backend";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// Netra's browser probes the app's own /health directly (GET, X-App-Code
// header) — not routed through Netra's backend, so it also proves the app
// allows this console's origin via CORS.
async function probe(
  baseUrl: string,
  appCode: string,
): Promise<"connected" | "disconnected" | "refused"> {
  const url = `${baseUrl.replace(/\/$/, "")}/health`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", "X-App-Code": appCode },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 401 || res.status === 403) return "refused";
    return res.ok ? "connected" : "disconnected";
  } catch {
    return "disconnected";
  }
}

const PROBE_FRESH_MS = 60_000;

// What the console should show for an app right now: a fresh browser probe
// result wins over the stored status, which is derived from heartbeats.
export function useConnectionState(app: AppViewUI): ConnectionState {
  const { connectionStatusMap } = useAppRegistryContext();
  const entry = connectionStatusMap[app.id];
  const observed =
    entry && Date.now() - entry.at < PROBE_FRESH_MS ? entry.status : undefined;
  if (app.status === AppStatus.pending && !observed) return "pending";
  return (observed ?? app.status) as ConnectionState;
}

export function useHealthCheck(app: AppViewUI, enabled: boolean) {
  const { setConnectionStatus } = useAppRegistryContext();
  const setManualStatus = useSetAppManualStatus();
  const [isTesting, setIsTesting] = useState(false);
  const lastRun = useRef(0);

  const run = useCallback(async () => {
    if (isTesting || !app.baseUrl || !enabled) return;
    if (Date.now() - lastRun.current < 2000) return;
    lastRun.current = Date.now();
    setIsTesting(true);
    const result = await probe(app.baseUrl, app.appCode);
    setConnectionStatus(app.id, result);
    try {
      await setManualStatus.mutateAsync({
        id: app.id,
        status:
          result === "connected" ? AppStatus.connected : AppStatus.disconnected,
      });
    } catch {
      // The on-screen result already reflects the probe.
    }
    if (result === "connected") toast.success(`${app.name} is reachable`);
    else if (result === "refused")
      toast.error("Connection refused: the app rejected this pairing code");
    else toast.warning(`${app.name} is unreachable`);
    setIsTesting(false);
  }, [app, enabled, isTesting, setConnectionStatus, setManualStatus]);

  return { run, isTesting };
}
