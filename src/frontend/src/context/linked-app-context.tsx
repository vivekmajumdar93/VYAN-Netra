import type { LinkedAppView } from "@/backend";
import { createContext, useContext, useState } from "react";

export type ConnectionStatusMap = Record<
  string,
  "connected" | "disconnected" | "refused"
>;

interface LinkedAppContextValue {
  selectedApp: LinkedAppView | null;
  setSelectedApp: (app: LinkedAppView | null) => void;
  connectionStatusMap: ConnectionStatusMap;
  setConnectionStatus: (
    id: string,
    status: "connected" | "disconnected" | "refused",
  ) => void;
}

export const LinkedAppContext = createContext<LinkedAppContextValue | null>(
  null,
);

export function LinkedAppProvider({ children }: { children: React.ReactNode }) {
  const [selectedApp, setSelectedApp] = useState<LinkedAppView | null>(null);
  const [connectionStatusMap, setConnectionStatusMap] =
    useState<ConnectionStatusMap>({});

  function setConnectionStatus(
    id: string,
    status: "connected" | "disconnected" | "refused",
  ) {
    setConnectionStatusMap((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <LinkedAppContext.Provider
      value={{
        selectedApp,
        setSelectedApp,
        connectionStatusMap,
        setConnectionStatus,
      }}
    >
      {children}
    </LinkedAppContext.Provider>
  );
}

export function useLinkedAppContext() {
  const ctx = useContext(LinkedAppContext);
  if (!ctx)
    throw new Error(
      "useLinkedAppContext must be used inside LinkedAppProvider",
    );
  return ctx;
}
