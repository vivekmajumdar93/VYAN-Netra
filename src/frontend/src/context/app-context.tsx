import type { AppViewUI } from "@/hooks/use-backend";
import { createContext, useContext, useState } from "react";

export type ConnectionStatusMap = Record<
  string,
  "connected" | "disconnected" | "refused"
>;

interface AppContextValue {
  selectedApp: AppViewUI | null;
  setSelectedApp: (app: AppViewUI | null) => void;
  connectionStatusMap: ConnectionStatusMap;
  setConnectionStatus: (
    id: string,
    status: "connected" | "disconnected" | "refused",
  ) => void;
}

export const AppRegistryContext = createContext<AppContextValue | null>(null);

export function AppRegistryProvider({
  children,
}: { children: React.ReactNode }) {
  const [selectedApp, setSelectedApp] = useState<AppViewUI | null>(null);
  const [connectionStatusMap, setConnectionStatusMap] =
    useState<ConnectionStatusMap>({});

  function setConnectionStatus(
    id: string,
    status: "connected" | "disconnected" | "refused",
  ) {
    setConnectionStatusMap((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <AppRegistryContext.Provider
      value={{
        selectedApp,
        setSelectedApp,
        connectionStatusMap,
        setConnectionStatus,
      }}
    >
      {children}
    </AppRegistryContext.Provider>
  );
}

export function useAppRegistryContext() {
  const ctx = useContext(AppRegistryContext);
  if (!ctx)
    throw new Error(
      "useAppRegistryContext must be used inside AppRegistryProvider",
    );
  return ctx;
}
