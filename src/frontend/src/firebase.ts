// Firebase client SDK setup — replaces the old ICP HttpAgent/Actor
// bootstrap. Config comes from Vite env vars (see .env.example); set
// VITE_USE_FIREBASE_EMULATORS=true locally to talk to the Firebase
// Emulator Suite instead of a real project.

import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  type Functions,
  connectFunctionsEmulator,
  getFunctions,
} from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let functionsInstance: Functions | undefined;
let initialized = false;

function ensureInitialized(): void {
  if (initialized) return;
  initialized = true;

  if (!firebaseConfig.projectId) {
    console.error(
      "Firebase config is missing — copy src/frontend/.env.example to .env and fill in your Firebase project's web app config (VITE_FIREBASE_*).",
    );
  }

  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(app);
  functionsInstance = getFunctions(app);

  if (import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
    connectAuthEmulator(authInstance, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFunctionsEmulator(functionsInstance, "127.0.0.1", 5001);
  }
}

export function getFirebaseAuth(): Auth {
  ensureInitialized();
  return authInstance as Auth;
}

export function getFirebaseFunctions(): Functions {
  ensureInitialized();
  return functionsInstance as Functions;
}
