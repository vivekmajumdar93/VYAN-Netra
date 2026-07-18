import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LinkedAppProvider } from "./context/linked-app-context";
import {
  RECOGNIZED_ADMINS,
  VyanAuthContext,
  type VyanUser,
  clearStoredUser,
  loadStoredUser,
  storeUser,
} from "./hooks/use-vyan-auth";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

const DEFAULT_USER: VyanUser = {
  email: "admin@vyan.com",
  name: "VYAN Admin",
  role: "Super Admin",
};

function VyanAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<VyanUser>(
    () => loadStoredUser() ?? DEFAULT_USER,
  );

  function login(email: string) {
    const normalized = email.trim().toLowerCase();
    const known =
      RECOGNIZED_ADMINS[normalized] ?? RECOGNIZED_ADMINS[email.trim()];
    const user: VyanUser = known ?? {
      email: email.trim(),
      name: email.split("@")[0] ?? email.trim(),
      role: "Admin",
    };
    storeUser(user);
    setCurrentUser(user);
  }

  function logout() {
    clearStoredUser();
    setCurrentUser(DEFAULT_USER);
  }

  return (
    <VyanAuthContext.Provider
      value={{ isAuthenticated: true, currentUser, login, logout }}
    >
      {children}
    </VyanAuthContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <VyanAuthProvider>
      <LinkedAppProvider>
        <App />
      </LinkedAppProvider>
    </VyanAuthProvider>
  </QueryClientProvider>,
);
