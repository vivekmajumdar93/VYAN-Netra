import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (getApps().length === 0) {
  initializeApp();
}

export const db = getFirestore();
export const auth = getAuth();

// All Nat-typed ids (users, issues, updates, ...) are drawn from a simple
// per-collection sequence, matching the old Motoko `{ var nextId : Nat }`
// counters exactly — starts at 0, increments by 1 per create.
export async function nextId(counterName: string): Promise<number> {
  const ref = db.collection("counters").doc(counterName);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = (snap.data()?.next as number | undefined) ?? 0;
    tx.set(ref, { next: current + 1 }, { merge: true });
    return current;
  });
}

// Timestamps travel over the wire as milliseconds (JSON/Firestore-safe).
// The frontend adapter (src/frontend/src/backend.ts) rescales to the
// nanosecond bigint `Timestamp` type the rest of the app already expects,
// so this is purely a wire-format detail — not a behavior change.
export function nowMs(): number {
  return Date.now();
}
