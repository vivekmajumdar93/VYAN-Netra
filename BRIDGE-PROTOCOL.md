# VYAN Bridge Protocol

How any VYAN app or website (current or future, VYAN's own or a client's)
connects to VYAN Netra so it appears as a controllable app in the console:
health, live figures, user moderation, and the app's own admin controls.

**The one rule: Netra defines nothing app-specific.** Each app declares its
own controls and reports its own live figures. Netra stores what the app sent
and renders that app's dedicated console from it. To add a control to an app,
add it in the app; it appears in Netra on the app's next registration.

Netra's backend is a set of Firebase Cloud Functions (`functions/src/domains/`).
Every function below is a Firebase callable: a POST of `{"data": ...}` that
answers `{"result": ...}`. Apps identify themselves by their pairing code
(`appCode`) only; see "Known limits".

## 1. Getting paired

1. In Netra, switch to the VYAN or Clients workspace, choose **Register app**,
   set its name, type (app or website) and owner, and Netra generates a
   cryptographically random 6-character `appCode`.
2. Give the app three environment variables, never committed to source:
   `VYAN_APP_CODE`, `NETRA_FIREBASE_PROJECT_ID`, `NETRA_CONSOLE_ORIGIN` (the
   exact origin the Netra console is served from).
3. In the app's console page (Connection tab), set the Base URL to the path
   that serves the app's `/health` (without `/health`).
4. The app shows "Awaiting connection" until it passes a health check or sends
   a heartbeat.

The code can be regenerated; the app's stable id (the Firestore document id)
does not change. Because of that, inbound calls always resolve the app **from
the code**, never by treating the code and the id as the same thing.

## 2. Health check (Netra's browser to the app)

Netra's browser calls `GET {baseUrl}/health` directly with header
`X-App-Code: <appCode>`. The app must answer `200` for the right code, `401` or
`403` for a missing or wrong one (shown as "Refused"), reply within 8 seconds,
and allow CORS from `NETRA_CONSOLE_ORIGIN` for `X-App-Code` and
`Content-Type`, including the `OPTIONS` preflight. Scope the CORS headers to
that one path only.

## 3. What the app calls (app to Netra)

All except where noted return `false` (or an empty list) without detail for an
unknown code, and while Netra's console-wide kill switch is off.

| Function | Request | Returns | Cadence |
| --- | --- | --- | --- |
| `recordHeartbeat` | `{appCode}` | boolean | every 60 s |
| `registerCapabilities` | `{appCode, controls: ControlSpec[]}` | boolean | on start, every 15 min, after an outage |
| `reportAppStats` | `{appCode, stats: StatItem[]}` | boolean | every 60 s |
| `reportMetrics` | `{appCode, cpu, memory, disk, apiLatency, networkUptime, connectionStatus}` | boolean | every 60 s |
| `reportAppError` | `{appCode, severity, source, message}` | boolean | on failure, rate-limited |
| `syncAppUsers` | `{appCode, incoming: [externalId, name, email][]}` | boolean | on signup, every 60 s |
| `getUserStatusForApp` | `{appCode, externalId}` | `pending`, `active`, `held`, `rejected` or `null` | at login |
| `getPendingCommands` | `{appCode}` | `CommandView[]` | every 60 s |
| `acknowledgeCommand` | `{appCode, id, success, result}` | boolean | after each command |

`syncAppUsers`, `getUserStatusForApp` and `acknowledgeCommand` are not gated
by the kill switch. Metrics are stored as whole numbers.

### Declaring controls (`ControlSpec`)

```ts
{
  id: string;            // unique, letters/digits/_ . -
  label: string;
  description?: string;
  group?: string;        // sections in the app's console
  danger?: boolean;      // styled as dangerous
  confirm?: string;      // if set, the admin must confirm with this text
  params?: {
    name: string; label: string;
    type: "number" | "text" | "boolean" | "select";
    required?: boolean; min?: number; max?: number;
    options?: { value: string; label: string }[];   // select
    placeholder?: string;
  }[];
}
```

Netra validates every command against this spec before queuing it, and
refuses any control the app has not declared.

### Reporting live figures (`StatItem`)

```ts
{ key: string; label: string; value: number | string | boolean;
  unit?: string; group?: string; tone?: "good" | "warn" | "bad" | "neutral" }
```

A full snapshot each time, never a delta. Every figure must be measured from
real state. Netra shows when it was reported and flags it stale after 3
minutes.

## 4. Commands

An admin runs a declared control from the app's console. Netra queues
`{id, appId, type, label, params, status, result, issuedAt, expiresAt,
completedAt}` with status `pending`. The app pulls it with `getPendingCommands`,
runs it, and calls `acknowledgeCommand` with `success` and a short `result`.

Status values: `pending`, `acknowledged`, `failed`, `expired`, `cancelled`.

- A command not picked up within **10 minutes** becomes `expired` and is never
  run: a stale safety command is worse than one reported as not run.
- An admin can cancel a command while it is `pending`.
- An app **must** acknowledge an unknown `type` as failed, and a handler that
  throws as failed with its message. Never drop a command silently.

## 5. Failure reporting

- A failed or expired command is shown with the reason in the app's Activity
  tab.
- `reportAppError` lets the app tell Netra about its own failures; they are
  listed under "Errors reported by the app".
- An app that stops sending heartbeats shows as disconnected after 3 minutes,
  with a banner explaining that commands wait up to 10 minutes.

## 6. Login enforcement

Netra records an admin's accept, reject or hold decision; it cannot block a
user inside the app. The app checks `getUserStatusForApp` at login and denies
access unless the status is `active`. Fail open on `null` (Netra
unconfigured, unreachable, or the user not yet synced), and always exempt the
app's own admin account so pairing can never lock the owner out.

## 7. Workspaces

Apps belong either to VYAN (`ownerType: "vyan"`) or to a client
(`ownerType: "client"` with a `clientId`). The console's VYAN workspace lists
VYAN's own products; the Clients workspace lists clients, and each client's
page lists the apps and websites built for them. Ownership can be changed from
an app's Connection tab.

## Known limits

- **No caller authorization.** Functions are identified only by `appCode`, and
  admin-facing functions do not check who is calling. Add a check for the
  signed-in admin (the `role` claim `requestAdminToken` sets) before linking an
  app that can move money or data.
- Commands never carry secrets. Do not declare controls that accept API keys
  or credentials.
