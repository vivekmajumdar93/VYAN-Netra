import { HttpsError, onCall } from "firebase-functions/v2/https";
import { db, nextId, nowMs } from "../shared/admin.js";
import { findAppIdByCode } from "../shared/appLookup.js";
import { isKillSwitchEnabled } from "./settings.js";

// What a linked app can do is declared BY THE APP, not by Netra. The app
// publishes a manifest of its own admin controls (registerCapabilities) and
// its own live figures (reportAppStats); Netra stores them and renders that
// app's dedicated console from them. Netra never invents a control — adding
// one means adding it to the app, and it appears in Netra on the app's next
// registration.

export type ParamType = "number" | "text" | "boolean" | "select";

export interface ControlParam {
  name: string;
  label: string;
  type: ParamType;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface ControlSpec {
  id: string;
  label: string;
  description?: string;
  group?: string;
  danger?: boolean;
  confirm?: string;
  params?: ControlParam[];
}

export interface Capabilities {
  controls: ControlSpec[];
  updatedAt: number;
}

export interface StatItem {
  key: string;
  label: string;
  value: number | string | boolean;
  unit?: string;
  group?: string;
  tone?: "good" | "warn" | "bad" | "neutral";
}

export interface AppStats {
  stats: StatItem[];
  updatedAt: number;
}

export type ErrorSeverity = "critical" | "warning" | "info";

export interface AppErrorView {
  id: number;
  appId: string;
  severity: ErrorSeverity;
  source: string;
  message: string;
  timestamp: number;
}

const MAX_CONTROLS = 60;
const MAX_PARAMS = 12;
const MAX_STATS = 60;
const MAX_OPTIONS = 40;
const ID_RE = /^[A-Za-z][A-Za-z0-9_.-]{0,63}$/;

function bad(message: string): never {
  throw new HttpsError("invalid-argument", message);
}

function str(value: unknown, field: string, max: number, required = true): string {
  if (value === undefined || value === null || value === "") {
    if (required) bad(`${field} is required.`);
    return "";
  }
  if (typeof value !== "string") bad(`${field} must be text.`);
  const trimmed = value.trim();
  if (required && !trimmed) bad(`${field} is required.`);
  if (trimmed.length > max) bad(`${field} is too long (max ${max}).`);
  return trimmed;
}

function cleanParam(raw: ControlParam, controlId: string): ControlParam {
  const where = `Control "${controlId}" param`;
  if (typeof raw !== "object" || raw === null) bad(`${where} is invalid.`);
  const name = str(raw.name, `${where} name`, 64);
  if (!ID_RE.test(name)) bad(`${where} "${name}" has an invalid name.`);
  if (!["number", "text", "boolean", "select"].includes(raw.type)) {
    bad(`${where} "${name}" has an unknown type.`);
  }
  const param: ControlParam = {
    name,
    label: str(raw.label, `${where} "${name}" label`, 80),
    type: raw.type,
  };
  if (raw.required) param.required = true;
  if (raw.placeholder) param.placeholder = str(raw.placeholder, "placeholder", 120, false);
  if (raw.type === "number") {
    if (raw.min !== undefined) {
      if (typeof raw.min !== "number" || !Number.isFinite(raw.min)) bad(`${where} "${name}" min must be a number.`);
      param.min = raw.min;
    }
    if (raw.max !== undefined) {
      if (typeof raw.max !== "number" || !Number.isFinite(raw.max)) bad(`${where} "${name}" max must be a number.`);
      param.max = raw.max;
    }
  }
  if (raw.type === "select") {
    if (!Array.isArray(raw.options) || raw.options.length === 0) {
      bad(`${where} "${name}" needs options.`);
    }
    if (raw.options.length > MAX_OPTIONS) bad(`${where} "${name}" has too many options.`);
    param.options = raw.options.map((o) => ({
      value: str(o?.value, `${where} "${name}" option value`, 80),
      label: str(o?.label, `${where} "${name}" option label`, 80),
    }));
  }
  return param;
}

function cleanControl(raw: ControlSpec): ControlSpec {
  if (typeof raw !== "object" || raw === null) bad("A control is invalid.");
  const id = str(raw.id, "Control id", 64);
  if (!ID_RE.test(id)) bad(`Control id "${id}" is invalid (letters, digits, _ . -).`);
  const control: ControlSpec = { id, label: str(raw.label, `Control "${id}" label`, 80) };
  if (raw.description) control.description = str(raw.description, "description", 240, false);
  if (raw.group) control.group = str(raw.group, "group", 60, false);
  if (raw.danger) control.danger = true;
  if (raw.confirm) control.confirm = str(raw.confirm, "confirm", 240, false);
  if (raw.params !== undefined) {
    if (!Array.isArray(raw.params)) bad(`Control "${id}" params must be a list.`);
    if (raw.params.length > MAX_PARAMS) bad(`Control "${id}" has too many params.`);
    const params = raw.params.map((p) => cleanParam(p, id));
    if (new Set(params.map((p) => p.name)).size !== params.length) {
      bad(`Control "${id}" has duplicate param names.`);
    }
    if (params.length > 0) control.params = params;
  }
  return control;
}

export function cleanControls(rawControls: unknown): ControlSpec[] {
  if (!Array.isArray(rawControls)) bad("controls must be a list.");
  if (rawControls.length > MAX_CONTROLS) bad("Too many controls.");
  const controls = rawControls.map((c) => cleanControl(c as ControlSpec));
  if (new Set(controls.map((c) => c.id)).size !== controls.length) {
    bad("Control ids must be unique.");
  }
  return controls;
}

function cleanStat(raw: StatItem): StatItem {
  if (typeof raw !== "object" || raw === null) bad("A stat is invalid.");
  const key = str(raw.key, "Stat key", 64);
  if (!ID_RE.test(key)) bad(`Stat key "${key}" is invalid.`);
  const value = raw.value;
  if (
    typeof value !== "string" &&
    typeof value !== "boolean" &&
    !(typeof value === "number" && Number.isFinite(value))
  ) {
    bad(`Stat "${key}" needs a text, true/false or finite number value.`);
  }
  const stat: StatItem = {
    key,
    label: str(raw.label, `Stat "${key}" label`, 80),
    value: typeof value === "string" ? value.slice(0, 200) : value,
  };
  if (raw.unit) stat.unit = str(raw.unit, "unit", 24, false);
  if (raw.group) stat.group = str(raw.group, "group", 60, false);
  if (raw.tone) {
    if (!["good", "warn", "bad", "neutral"].includes(raw.tone)) bad(`Stat "${key}" has an unknown tone.`);
    stat.tone = raw.tone;
  }
  return stat;
}

// Declares (replaces) the app's whole control manifest. Called by the app on
// startup and whenever its controls change. Returns false — without detail —
// for an unknown code or while Netra's kill switch is off, like the other
// inbound bridge calls.
export const registerCapabilities = onCall<
  { appCode: string; controls: ControlSpec[] },
  Promise<boolean>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return false;
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  const doc: Capabilities = {
    controls: cleanControls(request.data.controls),
    updatedAt: nowMs(),
  };
  await db.collection("appCapabilities").doc(appId).set(doc);
  return true;
});

export const getCapabilities = onCall<
  { appId: string },
  Promise<Capabilities | null>
>(async (request) => {
  const snap = await db.collection("appCapabilities").doc(request.data.appId).get();
  return snap.exists ? (snap.data() as Capabilities) : null;
});

// The app's current real figures (active users, request counts, and so on) —
// a full snapshot each time, never a delta, so Netra always shows exactly
// what the app last reported and how long ago.
export const reportAppStats = onCall<
  { appCode: string; stats: StatItem[] },
  Promise<boolean>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return false;
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  if (!Array.isArray(request.data.stats)) bad("stats must be a list.");
  if (request.data.stats.length > MAX_STATS) bad("Too many stats.");
  const stats = request.data.stats.map(cleanStat);
  if (new Set(stats.map((s) => s.key)).size !== stats.length) bad("Stat keys must be unique.");
  const doc: AppStats = { stats, updatedAt: nowMs() };
  await db.collection("appStats").doc(appId).set(doc);
  return true;
});

export const getAppStats = onCall<{ appId: string }, Promise<AppStats | null>>(
  async (request) => {
    const snap = await db.collection("appStats").doc(request.data.appId).get();
    return snap.exists ? (snap.data() as AppStats) : null;
  },
);

// Lets an app tell Netra about its own failures (a bridge call erroring, a
// handler throwing) instead of them only living in the app's own logs.
export const reportAppError = onCall<
  { appCode: string; severity: ErrorSeverity; source: string; message: string },
  Promise<boolean>
>(async (request) => {
  if (!(await isKillSwitchEnabled())) return false;
  const appId = await findAppIdByCode(request.data.appCode);
  if (appId === null) return false;
  const severity = request.data.severity;
  if (!["critical", "warning", "info"].includes(severity)) bad("Unknown severity.");
  const id = await nextId("appErrors");
  const doc: Omit<AppErrorView, "id"> = {
    appId,
    severity,
    source: str(request.data.source, "source", 80),
    message: str(request.data.message, "message", 500),
    timestamp: nowMs(),
  };
  await db.collection("appErrors").doc(String(id)).set(doc);
  return true;
});

export const listAppErrors = onCall<{ appId: string }, Promise<AppErrorView[]>>(
  async (request) => {
    const snap = await db
      .collection("appErrors")
      .where("appId", "==", request.data.appId)
      .get();
    return snap.docs
      .map((d) => ({ id: Number(d.id), ...(d.data() as Omit<AppErrorView, "id">) }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);
  },
);
