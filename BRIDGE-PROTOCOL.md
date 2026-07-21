# VYAN Bridge Protocol

How a VYAN app (current or future — including the website) connects to
VYAN Netra so it shows up as a controllable app in the console: health
checks, user moderation, and app control from one place.

No other VYAN app existed in the session this was written in, so none of
this has been exercised end-to-end against a real second app yet. Treat it
as a solid, carefully-reasoned starting contract — verify it against your
actual app once you wire the first one up, and update this doc if reality
disagrees with it.

## 1. Getting paired

1. In VYAN Netra → **Apps**, click **Generate Pairing Code**. Netra
   creates a `#pending` app record and shows you a cryptographically
   random 6-character `appCode` (A–Z, 0–9) — copy it once; it won't be
   shown again in that raw form (you can always fetch it again from the
   Apps list itself, but treat this initial reveal as the "first copy").
2. Embed that code in your app's own config as a secret, e.g.
   `VYAN_APP_CODE` in your environment variables. **Never commit it to
   source control** — treat it exactly like an API key. It's the only
   credential your app and Netra share.
3. In Netra, set the app's **Base URL** to wherever your app's admin API
   is reachable (e.g. `https://your-app.vercel.app/api`). This is
   required for the browser-driven health check (§2) but not for the
   heartbeat/user-sync calls (§3–4), which go the other direction.
4. The app shows **"Awaiting connection"** in Netra until it either
   passes a health check or calls `recordHeartbeat` — whichever happens
   first.

If the code ever leaks, regenerate it from the Apps page. The app's
stable identity in Netra doesn't change — only the credential your app
needs to re-embed.

## 2. Health checks (Netra → your app)

Netra's browser calls `GET {baseUrl}/health` directly (a client-side
`fetch`, not routed through Netra's own backend — so this only works if
your endpoint allows CORS from wherever the Netra console is hosted)
with:

```
X-App-Code: <your appCode>
```

Your endpoint should:
- Return `200` if healthy.
- Return `401` or `403` if the `X-App-Code` header is missing or wrong —
  Netra shows this distinctly as "Refused" rather than "Disconnected",
  which matters for debugging (refused = code mismatch, disconnected =
  network/server problem).
- Respond within a few seconds — Netra times the request out at 8s.

This is what powers the single "Health Check" button and the "Check
All" bulk action in the console.

## 3. Heartbeat (your app → Netra) — for passive/automatic detection

Health checks only run when an admin is looking at the console. To be
flagged as disconnected automatically — e.g. an outage at 3am, with
nobody watching — your app should call Netra's `recordHeartbeat` Cloud
Function on an interval (every 1–2 minutes is reasonable; Netra treats a
heartbeat older than 3 minutes as stale/disconnected). It's also gated
by Netra's console-wide kill switch (Settings → Kill Switch) — while
that's off, every heartbeat is rejected (`false`) regardless of whether
the code is valid, by design.

Netra's backend is a set of Firebase Cloud Functions now (see
`functions/src/domains/apps.ts`), reachable as plain HTTPS callable
functions. Two ways to call one, depending on whether your app already
has the Firebase SDK as a dependency:

**Option A — Firebase client SDK (recommended for JS/TS apps):**

```ts
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const app = initializeApp({ projectId: "<Netra's Firebase project id>" });
const functions = getFunctions(app);
const recordHeartbeat = httpsCallable<{ appCode: string }, boolean>(
  functions,
  "recordHeartbeat",
);

const APP_CODE = process.env.VYAN_APP_CODE!;

async function heartbeat() {
  const { data: ok } = await recordHeartbeat({ appCode: APP_CODE });
  if (!ok) console.error("VYAN heartbeat rejected — check APP_CODE, or the kill switch may be off");
}

setInterval(heartbeat, 60_000);
heartbeat();
```

**Option B — raw HTTPS POST (any language, no Firebase dependency):**
Callable functions accept a plain POST with a `{"data": ...}` envelope
and reply with `{"result": ...}` (or `{"error": ...}`). Find the
deployed URL from `firebase deploy` output or the Firebase console
(Cloud Functions v2 URLs are per-function Cloud Run URLs, not a fixed
pattern — copy the real one after deploying):

```bash
curl -X POST "https://<recordheartbeat-deployed-url>" \
  -H "Content-Type: application/json" \
  -d '{"data":{"appCode":"'"$VYAN_APP_CODE"'"}}'
```

Either way, the call is unauthenticated (no Firebase Auth sign-in
needed) — `appCode` alone is the credential. `recordHeartbeat` returns
`false` without detail if the code isn't recognized, so you don't leak
whether a *similar* code exists.

## 4. User sync and moderation

For Netra's Users page (and the accept/reject/hold workflow) to reflect
your app's real users rather than nothing, push your user list in
(using the same `httpsCallable` setup as §3):

```ts
const syncAppUsers = httpsCallable<
  { appCode: string; incoming: [string, string, string][] },
  boolean
>(functions, "syncAppUsers");

// incoming: array of [externalId, name, email] tuples.
// externalId = your app's own stable user id (not email — use whatever
// survives a user renaming/re-emailing on your side).
await syncAppUsers({
  appCode: APP_CODE,
  incoming: [
    ["usr_123", "Jane Doe", "jane@example.com"],
    ["usr_456", "John Smith", "john@example.com"],
  ],
});
```

Call this whenever it's convenient — on user signup, on a periodic
sync, or both. Existing users (matched by `externalId`) get their
name/email refreshed and keep whatever moderation status an admin has
already set; new ones land as `pending` for review.

To actually **enforce** an admin's accept/reject/hold decision, your
app needs to check it — Netra only records the decision, it doesn't
have any way to reach into your app and block a user itself:

```ts
const getUserStatusForApp = httpsCallable<
  { appCode: string; externalId: string },
  "pending" | "active" | "held" | "rejected" | null
>(functions, "getUserStatusForApp");

const { data: status } = await getUserStatusForApp({
  appCode: APP_CODE,
  externalId: "usr_123",
});
// null means never synced — treat the same as "pending" and block by default.
```

Call this at login (or cache it with a short TTL) and deny access
unless the status is `"active"`.

## 5. What Netra does *not* do yet

- **No caller authorization on these functions.** Every method above is
  reachable by anyone who knows (or brute-forces) the right `appCode` —
  there's no check tying calls to a specific identity beyond the code
  itself. Don't treat `appCode` as more than a shared secret; it's not a
  cryptographic proof of identity.
- **No per-app command/control channel beyond what's listed here** —
  no remote restart, no config push, no feature flags. If you need
  that, it's a real protocol extension (a new function in
  `functions/src/domains/apps.ts` plus a corresponding client-side
  handler in your app), not something already wired up.
