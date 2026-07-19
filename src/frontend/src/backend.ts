/* eslint-disable */

// Hand-written to match the current Motoko backend interface — see
// declarations/backend.did.d.ts for why this isn't tool-generated in this
// session. Unlike the original bindgen output, this skips the blob-upload
// wrapper class entirely (nothing here uses ExternalBlob) and returns the
// raw actor directly; conversion between candid's wire encoding (variants
// as single-key objects, `?T` as `[] | [T]`) and plain JS values happens
// via the fromVariant/toVariant/fromOpt/toOpt helpers below, applied in
// hooks/use-backend.ts.

import {
  Actor,
  HttpAgent,
  type ActorConfig,
  type ActorSubclass,
  type Agent,
  type HttpAgentOptions,
} from "@icp-sdk/core/agent";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";

export type {
  AppId,
  AppView,
  AlertView,
  EmailConfigId,
  EmailConfigView,
  EmailLog,
  EmailTemplateView,
  Id,
  IssueComment,
  IssueId,
  IssueView,
  NotificationView,
  SystemMetrics,
  Time,
  Timestamp,
  UpdateId,
  UpdateView,
  UserActivity,
  UserId,
  UserView,
  ZohoStatusView,
  _SERVICE,
} from "./declarations/backend.did";

export enum ActivityEventType {
  action = "action",
  login = "login",
  permissionChange = "permissionChange",
}
export enum AppStatus {
  pending = "pending",
  connected = "connected",
  disconnected = "disconnected",
}
export enum EmailStatus {
  sent = "sent",
  failed = "failed",
  bounced = "bounced",
}
export enum IssueSeverity {
  low = "low",
  high = "high",
  critical = "critical",
  medium = "medium",
}
export enum IssueStatus {
  resolved = "resolved",
  in_progress = "in_progress",
  open = "open",
}
export enum NotificationSeverity {
  warning = "warning",
  info = "info",
  critical = "critical",
}
export enum NotificationType {
  systemAlert = "systemAlert",
  user = "user",
  update = "update",
  issue = "issue",
}
export enum UpdateStatus {
  deployed = "deployed",
  scheduled = "scheduled",
  pending = "pending",
  failed = "failed",
}
export enum UserRole {
  manager = "manager",
  admin = "admin",
  viewer = "viewer",
}
export enum UserStatus {
  pending = "pending",
  active = "active",
  held = "held",
  rejected = "rejected",
}

/** Candid variant (`{ critical: null }`) -> plain string tag (`"critical"`). */
export function fromVariant<T extends string>(v: Record<string, null>): T {
  return Object.keys(v)[0] as T;
}
/** Plain string tag -> candid variant. */
export function toVariant(key: string): Record<string, null> {
  return { [key]: null };
}
/** Candid `?T` (`[] | [T]`) -> `T | null`. */
export function fromOpt<T>(opt: [] | [T]): T | null {
  return opt.length === 0 ? null : opt[0];
}
/** `T | null | undefined` -> candid `?T`. */
export function toOpt<T>(val: T | null | undefined): [] | [T] {
  return val === null || val === undefined ? [] : [val];
}

export interface CreateActorOptions {
  agent?: Agent;
  agentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  processError?: (error: unknown) => never;
}

export function createActor(
  canisterId: string,
  _uploadFile?: unknown,
  _downloadFile?: unknown,
  options: CreateActorOptions = {},
): ActorSubclass<_SERVICE> {
  const agent =
    options.agent || HttpAgent.createSync({ ...options.agentOptions });
  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.",
    );
  }
  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
}
