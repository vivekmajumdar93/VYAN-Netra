import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppRegistryProvider } from "./context/app-context";
import {
  VyanAuthContext,
  type VyanUser,
  clearStoredUser,
  findRecognizedAdmin,
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

// NOTE: this only gates the console's own UI, client-side — there is no
// backend session/identity check yet, so canister update calls made after
// login are not themselves authenticated. Real caller-based authorization
// (Internet Identity + a checked admin Principal allowlist on the backend)
// is a separate, larger piece of work; this just stops the front door from
// accepting an arbitrary typed email the way it used to.
function VyanAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<VyanUser | null>(() =>
    loadStoredUser(),
  );

  function login(email: string): boolean {
    const known = findRecognizedAdmin(email);
    if (!known) return false;
    storeUser(known);
    setCurrentUser(known);
    return true;
  }

  function logout() {
    clearStoredUser();
    setCurrentUser(null);
  }

  return (
    <VyanAuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        currentUser,
        login,
        logout,
      }}
    >
      {children}
    </VyanAuthContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <VyanAuthProvider>
        <AppRegistryProvider>
          <App />
        </AppRegistryProvider>
      </VyanAuthProvider>
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
