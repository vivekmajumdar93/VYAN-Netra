# VYAN Netra — Progress & Lock File

**Read this before starting work on any new prompt.** It tracks what's done
and verified (🔒 locked — don't change without an explicit request) vs.
what's actively in progress (🚧). Update this file after every change:
move items between sections as they complete, and add a line to the change
log at the bottom.

## 🔒 Locked (done, verified — do not change without explicit request)

- **Branding**: "VYAN Labs" → "VYAN" everywhere, VYAN Shunyalekh typeface
  applied, VYAN logo (local asset, `src/frontend/public/assets/images/vyan-logo.png`)
  in Sidebar + Login only (removed from the per-page Header on request).
- **Shunyalekh font licensing**: proprietary EULA, public repo, no
  modification/redistribution without a license.
- **Admin console feature set** (all built, wired to hooks, UI-verified):
  - Apps registry: register app → server-generated 6-char pairing code,
    base URL, rename, regenerate code, remove, browser-driven health
    check + "Check All".
  - Connection status per app (pending/connected/disconnected), computed
    from heartbeat staleness (3 min threshold).
  - Users: cross-app list, accept/reject/hold, role, activity log.
  - Monitoring: metrics submission/history, alerts.
  - Notifications, Issues, Updates: full CRUD + filtering.
  - Email: Zoho Mail API sending (HTTPS), configs, templates, logs,
    compose-and-send-to-selected-users flow.
  - **Kill switch** (Settings): console-wide gate on email sends, inbound
    heartbeat processing, and (client-side) health checks. Defaults OFF
    — nothing outbound-costing runs until an admin turns it on.
  - **Version history** (Settings, bottom section): reads a build-time git
    log snapshot (`scripts/generate-version.mjs` → `public/version-history.json`)
    and shows recent commits with a rollback note. Verified rendering real
    commit data against the local dev server.
  - Auth: Firebase Authentication. `requestAdminToken` Cloud Function
    checks a typed email against Firestore's `admins` allowlist and mints
    a real Firebase custom token — one-click login UX preserved, backed by
    a genuine Firebase Auth session (not a client-side flag).
- **Backend platform migration (ICP/Motoko → Firebase)**: complete.
  - `functions/src/domains/*.ts` — one Cloud Function per operation, 1:1
    with the old Motoko actor methods (see `_SERVICE` in
    `src/frontend/src/declarations/backend.did.d.ts`, kept byte-for-byte
    identical on purpose).
  - Firestore collections match; `firestore.rules` denies all direct
    client access — only the Cloud Functions (Admin SDK) touch data.
  - `src/frontend/src/backend.ts` implements `_SERVICE` via
    `httpsCallable` instead of an ICP actor. **Zero changes** to
    `hooks/use-backend.ts` or any page as a result — that was the point.
  - All ICP/Motoko artifacts removed: `src/backend/` (Motoko),
    `caffeine.toml`, `mops.toml`/`mops.lock`, `@dfinity/*`,
    `@icp-sdk/core`, `@caffeineai/core-infrastructure`.
  - **Verified live** against the real Firebase Emulator Suite (Functions
    + Firestore + Auth): login, app registration, kill-switch toggle, and
    heartbeat gating all exercised through the actual browser UI, zero
    console errors. Not just typecheck/build — this actually ran.
  - Docs updated: `README.md` (new), `AGENTS.md`, `BRIDGE-PROTOCOL.md`.
- **Zero-cost-by-default posture**: no real Firebase project has been
  created or billed against by me. All verification above ran against
  `demo-*` project IDs in the local emulator (fully offline, no GCP
  project, no billing, no login required).

## 🚧 In Progress

**Connecting this repo to the user's existing (already Blaze-plan)
Firebase project, then deploying for real.**

Steps (check off as completed):

- [ ] Get the real project ID from the user.
- [ ] Authenticate the CLI in this sandbox (interactive device-code login
      — user opens a URL, pastes back a code).
- [ ] `firebase use <project-id>` — point `.firebaserc` at the real
      project (currently a `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`
      placeholder).
- [ ] Ensure a Web App is registered in that project (create one if not),
      pull its SDK config into `src/frontend/.env` (not committed).
- [ ] Seed the `admins` Firestore collection on the real project
      (`functions/scripts/seed-admins.mjs`) so login actually works.
- [ ] `firebase deploy --only functions,firestore` — deploy Cloud
      Functions + Firestore rules/indexes.
- [ ] Confirm live: sign in against the real project, confirm kill switch
      defaults to off, confirm an app can be registered.
- [ ] Frontend hosting: confirm whether Vercel (mentioned earlier) or
      Firebase Hosting is the target, deploy accordingly.

Nothing above requires enabling billing again — the user has already
upgraded their project to Blaze. This step is purely about pointing the
existing repo config at that existing project and pushing the code live.

## Change Log (most recent first)

- 2026-07-22: Created this file. Starting real-project alignment + deploy
  at the user's request (screenshot instruction: baby steps, device-code
  login, progress file must be read-before/updated-after every change).
