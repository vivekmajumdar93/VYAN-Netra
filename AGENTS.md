# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`
- **local config**: copy `.env.example` to `.env` and fill in your Firebase
  project's web app config (or set `VITE_USE_FIREBASE_EMULATORS=true` to
  point at the local emulators instead)

**Backend** (run from `functions/`):

- **install**: `npm install`
- **typecheck**: `npm run typecheck`
- **build**: `npm run build`
- **run locally**: `npm run serve` (builds, then starts the Functions +
  Firestore + Auth emulators)
- **seed the admin allowlist** (emulator or real project): `npm run
  seed:admins`
- **deploy**: `npm run deploy` (or `firebase deploy` from the repo root
  for functions + Firestore rules/indexes + hosting together)

**Whole stack, root of the repo**:

- **local dev loop**: `firebase emulators:start` (Functions/Firestore/Auth
  emulators) in one terminal, `pnpm --filter @vyan/netra-frontend dev`
  (with `VITE_USE_FIREBASE_EMULATORS=true` in `.env`) in another.
- The frontend talks to the backend purely through
  `src/frontend/src/backend.ts`, which implements the `_SERVICE`
  interface (`src/frontend/src/declarations/backend.did.d.ts`) against
  Firebase Cloud Functions. No bindgen/codegen step exists anymore —
  that interface is hand-maintained and must be kept in sync with
  `functions/src/domains/*.ts` by hand when either side changes.

## Learnings

[No learnings yet]
