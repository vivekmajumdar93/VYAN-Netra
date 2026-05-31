import { useCallback, useRef, useState } from "react";

export type ConnectionStatus =
  | "idle"
  | "connected"
  | "disconnected"
  | "refused";

interface AppBridgeOptions {
  baseUrl: string;
  appCode: string;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  connectionStatus: ConnectionStatus;
}

export function useAppBridge({ baseUrl, appCode }: AppBridgeOptions) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallRef = useRef<number>(0);

  const fetchFromApp = useCallback(
    async <T>(
      endpoint: string,
      options?: RequestInit,
    ): Promise<FetchResult<T>> => {
      const now = Date.now();
      const minGap = 500;

      // Cancel any pending debounced call
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }

      // Throttle: reject if called within minGap ms of the last settled call
      if (now - lastCallRef.current < minGap) {
        return {
          data: null,
          error: null,
          isLoading: false,
          connectionStatus: status,
        };
      }

      return new Promise((resolve) => {
        debounceRef.current = setTimeout(async () => {
          lastCallRef.current = Date.now();
          setStatus("idle");

          const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

          try {
            const res = await fetch(url, {
              ...options,
              headers: {
                "Content-Type": "application/json",
                "X-App-Code": appCode,
                ...(options?.headers ?? {}),
              },
            });

            if (res.status === 401 || res.status === 403) {
              setStatus("refused");
              resolve({
                data: null,
                error: "Connection Refused: Invalid 6-Digit VYAN App Code.",
                isLoading: false,
                connectionStatus: "refused",
              });
              return;
            }

            if (!res.ok) {
              setStatus("disconnected");
              resolve({
                data: null,
                error: `Request failed with status ${res.status}`,
                isLoading: false,
                connectionStatus: "disconnected",
              });
              return;
            }

            const data = (await res.json()) as T;
            setStatus("connected");
            resolve({
              data,
              error: null,
              isLoading: false,
              connectionStatus: "connected",
            });
          } catch {
            setStatus("disconnected");
            resolve({
              data: null,
              error: "Unable to reach the application. Check the Base URL.",
              isLoading: false,
              connectionStatus: "disconnected",
            });
          }
        }, minGap);
      });
    },
    [baseUrl, appCode, status],
  );

  return { fetchFromApp, connectionStatus: status };
}
