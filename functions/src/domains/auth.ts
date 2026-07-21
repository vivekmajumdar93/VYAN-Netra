import { onCall, HttpsError } from "firebase-functions/v2/https";
import { auth, db } from "../shared/admin.js";

export interface AdminTokenView {
  token: string;
  name: string;
  role: string;
}

// Preserves the exact one-click "type your email, get in" UX the console
// always had, while genuinely authenticating through Firebase: the client
// posts the typed email here, we check it against the `admins` allowlist
// (was a hardcoded RECOGNIZED_ADMINS record in the old Motoko-era
// frontend), and mint a real Firebase Auth custom token for it. The client
// then calls signInWithCustomToken — from that point on it's a real
// Firebase-authenticated session, not just a client-side localStorage flag.
export const requestAdminToken = onCall<
  { email: string },
  Promise<AdminTokenView>
>(async (request) => {
  const email = request.data.email.trim().toLowerCase();
  if (!email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  const snap = await db.collection("admins").doc(email).get();
  if (!snap.exists) {
    throw new HttpsError(
      "permission-denied",
      "That email isn't on the VYAN admin allowlist.",
    );
  }

  const data = snap.data() as { name: string; role: string };
  const uid = `admin:${email}`;
  const claims = { email, name: data.name, role: data.role };

  // setCustomUserClaims persists the claims on the Auth user record itself,
  // so name/role survive later silent ID-token refreshes — the claims
  // passed to createCustomToken below only cover this one sign-in exchange.
  // The user record has to exist first for setCustomUserClaims to work.
  try {
    await auth.getUser(uid);
  } catch {
    await auth.createUser({ uid, email });
  }
  await auth.setCustomUserClaims(uid, claims);

  const token = await auth.createCustomToken(uid, claims);
  return { token, name: data.name, role: data.role };
});
