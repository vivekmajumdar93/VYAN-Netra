import { createContext, useCallback, useContext, useState } from "react";

export type WorkspaceMode = "vyan" | "clients";

interface WorkspaceContextValue {
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
}

const STORAGE_KEY = "vyan-netra:workspace";
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function readStoredMode(): WorkspaceMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "clients" ? "clients" : "vyan";
  } catch {
    return "vyan";
  }
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<WorkspaceMode>(readStoredMode);

  const setMode = useCallback((next: WorkspaceMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Remembering the choice is a convenience; the switch works without it.
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ mode, setMode }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
