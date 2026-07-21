import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppRegistryProvider } from "./context/app-context";
import { getFirebaseAuth } from "./firebase";
import {
  VyanAuthContext,
  type VyanUser,
  requestAdminTokenAndSignIn,
  signOut,
  userFromFirebaseUser,
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

// Caller-based authorization: every request the console makes now carries
// a real Firebase ID token from the signed-in admin (Cloud Functions can
// check request.auth), not just a client-side localStorage flag. Session
// persistence is handled by the Firebase Auth SDK itself — no manual
// storage code needed here.
function VyanAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<VyanUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (user) => {
      setCurrentUser(user ? await userFromFirebaseUser(user) : null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string): Promise<boolean> {
    return requestAdminTokenAndSignIn(email);
  }

  function logout() {
    void signOut();
  }

  return (
    <VyanAuthContext.Provider
      value={{
        isAuthenticated: currentUser !== null,
        isLoading,
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
    <VyanAuthProvider>
      <AppRegistryProvider>
        <App />
      </AppRegistryProvider>
    </VyanAuthProvider>
  </QueryClientProvider>,
);
