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

Netra's browser calls `GET {baseUrl}/health` directly (client-side
`fetch`, not a canister outcall — so this only works if your endpoint
allows CORS from wherever the Netra console is hosted) with:

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
nobody watching — your app should call Netra's `recordHeartbeat` update
method on an interval (every 1–2 minutes is reasonable; Netra treats a
heartbeat older than 3 minutes as stale/disconnected).

This is a real Motoko canister update call, not a plain HTTP request —
your app needs an IC agent library to make it. Using
[`@icp-sdk/core`](https://www.npmjs.com/package/@icp-sdk/core) (the
current, non-deprecated successor to `@dfinity/agent`):

```ts
import { HttpAgent, Actor } from "@icp-sdk/core/agent";
// idlFactory: copy the relevant Candid interface from
// VYAN-Netra/src/frontend/src/declarations/backend.did.js, or generate
// your own client against the deployed canister's public .did file.
import { idlFactory } from "./netra.did.js";

const NETRA_CANISTER_ID = "<Netra's canister id once deployed>";
const APP_CODE = process.env.VYAN_APP_CODE!;

const agent = HttpAgent.createSync({ host: "https://icp-api.io" });
const netra = Actor.createActor(idlFactory, {
  agent,
  canisterId: NETRA_CANISTER_ID,
});

async function heartbeat() {
  const ok = await netra.recordHeartbeat(APP_CODE);
  if (!ok) console.error("VYAN heartbeat rejected — check APP_CODE");
}

setInterval(heartbeat, 60_000);
heartbeat();
```

The call is anonymous (no Internet Identity needed) — `appCode` alone is
the credential. `recordHeartbeat` returns `false` without detail if the
code isn't recognized, so you don't leak whether a *similar* code
exists.

## 4. User sync and moderation

For Netra's Users page (and the accept/reject/hold workflow) to reflect
your app's real users rather than nothing, push your user list in:

```ts
// incoming: array of (externalId, name, email) tuples.
// externalId = your app's own stable user id (not email — use whatever
// survives a user renaming/re-emailing on your side).
await netra.syncAppUsers(APP_CODE, [
  ["usr_123", "Jane Doe", "jane@example.com"],
  ["usr_456", "John Smith", "john@example.com"],
]);
```

Call this whenever it's convenient — on user signup, on a periodic
sync, or both. Existing users (matched by `externalId`) get their
name/email refreshed and keep whatever moderation status an admin has
already set; new ones land as `#pending` for review.

To actually **enforce** an admin's accept/reject/hold decision, your
app needs to check it — Netra only records the decision, it doesn't
have any way to reach into your app and block a user itself:

```ts
const status = await netra.getUserStatusForApp(APP_CODE, "usr_123");
// status: [] | [{ pending: null } | { active: null } | { held: null } | { rejected: null }]
// Treat missing (never synced) the same as #pending — block by default.
```

Call this at login (or cache it with a short TTL) and deny access
unless the status is `#active`.

## 5. What Netra does *not* do yet

- **No caller authorization on the backend.** Every method above is
  reachable by anyone who knows (or brute-forces) the right `appCode` —
  there's no canister-level check tying calls to a specific identity
  beyond the code itself. Don't treat `appCode` as more than a shared
  secret; it's not a cryptographic proof of identity.
- **No per-app command/control channel beyond what's listed here** —
  no remote restart, no config push, no feature flags. If you need
  that, it's a real protocol extension (a new `AppsMixin` method plus a
  corresponding client-side handler in your app), not something already
  wired up.
