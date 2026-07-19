// Firebase integration will be linked here by VYAN
import { createContext, useContext } from "react";

export interface VyanUser {
  email: string;
  name: string;
  role: string;
}

const RECOGNIZED_ADMINS: Record<string, VyanUser> = {
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

export { RECOGNIZED_ADMINS };

export function findRecognizedAdmin(email: string): VyanUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    RECOGNIZED_ADMINS[normalized] ?? RECOGNIZED_ADMINS[email.trim()] ?? null
  );
}

const STORAGE_KEY = "vyan_netra_user";

export function loadStoredUser(): VyanUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VyanUser;
    // Re-verify against the allowlist on every load — a tampered or stale
    // localStorage entry should never grant access on its own.
    return findRecognizedAdmin(parsed.email);
  } catch {
    return null;
  }
}

export function storeUser(user: VyanUser) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // silently fail
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently fail
  }
}

export interface VyanAuthContextValue {
  isAuthenticated: boolean;
  currentUser: VyanUser | null;
  /** Returns false (and does not authenticate) for any email not on the admin allowlist. */
  login: (email: string) => boolean;
  logout: () => void;
}

export const VyanAuthContext = createContext<VyanAuthContextValue>({
  isAuthenticated: false,
  currentUser: null,
  login: () => false,
  logout: () => {},
});

export function useVyanAuth(): VyanAuthContextValue {
  return useContext(VyanAuthContext);
}
