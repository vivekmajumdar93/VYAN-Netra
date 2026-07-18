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

const STORAGE_KEY = "vyan_netra_user";

export function loadStoredUser(): VyanUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VyanUser;
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
  /** Always true — direct admin access. Firebase auth will replace this. */
  isAuthenticated: boolean;
  currentUser: VyanUser | null;
  login: (email: string) => void;
  logout: () => void;
}

const DEFAULT_USER: VyanUser = {
  email: "admin@vyan.com",
  name: "VYAN Admin",
  role: "Super Admin",
};

export const VyanAuthContext = createContext<VyanAuthContextValue>({
  isAuthenticated: true,
  currentUser: DEFAULT_USER,
  login: () => {},
  logout: () => {},
});

export function useVyanAuth(): VyanAuthContextValue {
  return useContext(VyanAuthContext);
}
