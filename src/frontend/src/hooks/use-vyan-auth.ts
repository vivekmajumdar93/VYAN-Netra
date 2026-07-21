import { getFirebaseAuth, getFirebaseFunctions } from "@/firebase";
import {
  type User as FirebaseUser,
  signOut as firebaseSignOut,
  getIdTokenResult,
  signInWithCustomToken,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { createContext, useContext } from "react";

export interface VyanUser {
  email: string;
  name: string;
  role: string;
}

// Client-side convenience list for the Login page's "Quick access" chips
// only — NOT the security boundary. The real allowlist check happens
// server-side, in the requestAdminToken Cloud Function, against the
// `admins` collection in Firestore (which the client can't read directly —
// see firestore.rules). This just saves a round trip for the people who
// use this console daily and saves them retyping their email.
export const RECOGNIZED_ADMINS: Record<string, VyanUser> = {
  "admin@vyan.com": {
    email: "admin@vyan.com",
    name: "VYAN Admin",
    role: "Super Admin",
  },
  "vivek.majumdar93@gmail.com": {
    email: "vivek.majumdar93@gmail.com",
    name: "Vivek Majumdar",
    role: "Super Admin",
  },
};

// Custom claims (name, role, email) are set on the Auth user record by the
// requestAdminToken Cloud Function, so they're present on every ID token —
// including ones minted by a later silent refresh, not just the token from
// the initial sign-in exchange.
export async function userFromFirebaseUser(
  user: FirebaseUser,
): Promise<VyanUser | null> {
  const tokenResult = await getIdTokenResult(user);
  const claims = tokenResult.claims as {
    email?: string;
    name?: string;
    role?: string;
  };
  if (!claims.email || !claims.name || !claims.role) return null;
  return { email: claims.email, name: claims.name, role: claims.role };
}

// Preserves the exact one-click "type your email, get in" UX the console
// always had, while genuinely authenticating through Firebase: this checks
// the typed email against the admin allowlist server-side and, if it's
// recognized, signs in with a real Firebase Auth custom token.
export async function requestAdminTokenAndSignIn(
  email: string,
): Promise<boolean> {
  const request = httpsCallable<
    { email: string },
    { token: string; name: string; role: string }
  >(getFirebaseFunctions(), "requestAdminToken");
  try {
    const { data } = await request({ email });
    await signInWithCustomToken(getFirebaseAuth(), data.token);
    return true;
  } catch {
    return false;
  }
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}

export interface VyanAuthContextValue {
  isAuthenticated: boolean;
  /** True until the initial Firebase Auth session check resolves. */
  isLoading: boolean;
  currentUser: VyanUser | null;
  /** Resolves false (and does not authenticate) for any email not on the admin allowlist. */
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

export const VyanAuthContext = createContext<VyanAuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  login: async () => false,
  logout: () => {},
});

export function useVyanAuth(): VyanAuthContextValue {
  return useContext(VyanAuthContext);
}
