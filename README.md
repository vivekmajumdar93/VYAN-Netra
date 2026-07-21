# VYAN Netra

The global admin console for the VYAN ecosystem — one place to register
and control every VYAN app, moderate users across all of them, run health
checks, and send email campaigns via a VYAN template.

## Architecture

- **Frontend** (`src/frontend/`): React + Vite + TanStack Router/Query,
  deployed as a static site (e.g. to Vercel or Firebase Hosting).
- **Backend** (`functions/`): Firebase Cloud Functions (TypeScript,
  Firebase Admin SDK) — one callable function per operation (`createApp`,
  `listUsers`, `sendEmailNow`, …). See `functions/src/domains/*.ts`.
- **Data** (Firestore): every collection is keyed to match the Cloud
  Function that owns it (`apps`, `users`, `issues`, `updates`,
  `emailLogs`, `settings`, `admins`, …). `firestore.rules` denies all
  direct client access — the Cloud Functions (using the Admin SDK) are
  the only way in or out, deliberately mirroring how the console's
  previous ICP-canister backend worked (nothing bypasses the exposed
  methods).
- **Auth**: Firebase Authentication. The admin allowlist lives in
  Firestore's `admins` collection; the `requestAdminToken` Cloud Function
  checks a typed email against it and mints a real Firebase custom token
  — the login UX is still "type your email, one click," but it's backed
  by genuine Firebase Auth sessions now, not a client-side flag.
- **Data-access contract**: `src/frontend/src/declarations/backend.did.d.ts`
  defines the `_SERVICE` interface every hook in
  `src/frontend/src/hooks/use-backend.ts` calls through
  `src/frontend/src/backend.ts`. Swapping the backend again later only
  means writing a new implementation of `_SERVICE` — nothing in
  `hooks/` or `pages/` needs to change, same as this Firebase migration
  didn't touch either.

## Local setup

**Prerequisites**: Node 20+, pnpm, and the Firebase CLI
(`npm install -g firebase-tools`).

```bash
pnpm install                          # frontend deps (repo root)
cd functions && npm install && cd ..  # backend deps
```

### Run against the local emulators (no real Firebase project needed)

```bash
# Terminal 1 — Functions + Firestore + Auth emulators
firebase emulators:start --project demo-vyan-netra

# Seed the admin allowlist once (any email not in here can't sign in)
cd functions && FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed:admins

# Terminal 2 — frontend
cd src/frontend
cp .env.example .env   # then set VITE_USE_FIREBASE_EMULATORS=true
pnpm dev
```

Any project id starting with `demo-` runs the emulators fully offline —
no `firebase login`, no billing, no real Google Cloud project required.
This is the zero-cost default: nothing here talks to a real cloud
service until you deploy for real.

### Run against a real Firebase project

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore**, **Authentication** (any sign-in provider is
   fine — the console only uses custom tokens), and **Functions**
   (Blaze/pay-as-you-go plan — Cloud Functions require it, even if usage
   stays within the free tier).
3. `firebase login`, then set your project id in `.firebaserc`
   (replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`).
4. Copy your web app's Firebase config (Project settings → General →
   Your apps) into `src/frontend/.env` (from `.env.example`), and leave
   `VITE_USE_FIREBASE_EMULATORS=false`.
5. Seed the admin allowlist against the real project:
   `cd functions && npm run seed:admins` (uses Application Default
   Credentials — run `gcloud auth application-default login` first, or
   set `GOOGLE_APPLICATION_CREDENTIALS` to a service account key).

## Deployment

```bash
firebase deploy --only functions,firestore
```

deploys the Cloud Functions and Firestore rules/indexes. For the
frontend, `pnpm --filter @vyan/netra-frontend build` produces
`src/frontend/dist/` — host it wherever (Vercel, Firebase Hosting via
`firebase deploy --only hosting`, etc.), pointed at your real Firebase
project's `.env` config.

## The kill switch

Settings → Kill Switch is a console-wide flag, **off by default**, that
gates every outbound/cross-app action the backend can take — email
sends, inbound heartbeat processing from connected apps, and (client
side) health checks. Nothing that could incur cost or contact another
app runs until an admin explicitly turns it on. See
`functions/src/domains/settings.ts`.

## Further reading

- [`BRIDGE-PROTOCOL.md`](./BRIDGE-PROTOCOL.md) — how another VYAN app
  connects to Netra (pairing codes, health checks, heartbeats, user
  sync).
- [`AGENTS.md`](./AGENTS.md) — verified commands for agents/contributors
  working in this repo.
- [`DESIGN.md`](./DESIGN.md) — visual design brief.
