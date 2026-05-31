import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AlertView {
    id: Id;
    resolved: boolean;
    value: bigint;
    threshold: bigint;
    productId: bigint;
    timestamp: Timestamp;
    severity: MetricSeverity;
    metricType: string;
    resolvedAt?: Timestamp;
}
export type Timestamp = bigint;
export type Time = bigint;
export interface IssueComment {
    id: Id;
    content: string;
    authorId: bigint;
    issueId: IssueId;
    timestamp: Timestamp;
}
export interface UserView {
    id: UserId;
    status: UserStatus;
    lastActivity: Timestamp;
    name: string;
    createdAt: Timestamp;
    role: UserRole;
    productId: bigint;
    email: string;
}
export interface EmailLog {
    id: Id;
    status: EmailStatus;
    subject: string;
    recipient: string;
    productId: bigint;
    timestamp: Timestamp;
}
export type EmailConfigId = bigint;
export type UpdateId = bigint;
export interface NotificationView {
    id: Id;
    title: string;
    notifType: NotificationType;
    body: string;
    createdAt: Timestamp;
    productId?: bigint;
    isRead: boolean;
    snoozedUntil?: Timestamp;
    severity: NotificationSeverity;
    snoozed: boolean;
}
export interface LinkedAppView {
    id: LinkedAppId;
    status: string;
    baseUrl: string;
    appCode: string;
    name: string;
    addedAt: Timestamp;
}
export interface EmailTemplateView {
    id: Id;
    subject: string;
    body: string;
    name: string;
    productId: bigint;
    lastModified: Timestamp;
}
export interface IssueView {
    id: IssueId;
    status: IssueStatus;
    title: string;
    assignedTo?: bigint;
    createdAt: Timestamp;
    description: string;
    productId: bigint;
    updatedAt: Timestamp;
    severity: IssueSeverity;
}
export type IssueId = bigint;
export interface EmailConfigView {
    id: EmailConfigId;
    bounceEmail: string;
    createdAt: Timestamp;
    productId: bigint;
    isActive: boolean;
    senderName: string;
    senderEmail: string;
}
export interface SystemMetrics {
    id: Id;
    cpu: bigint;
    memory: bigint;
    disk: bigint;
    productId: bigint;
    connectionStatus: string;
    timestamp: Timestamp;
    networkUptime: bigint;
    apiLatency: bigint;
}
export type LinkedAppId = string;
export type UserId = bigint;
export interface ProductView {
    id: ProductId;
    status: ProductStatus;
    code: string;
    name: string;
    description: string;
    registeredAt: Timestamp;
    lastSync: Timestamp;
}
export type Id = bigint;
export type ProductId = bigint;
export interface UserActivity {
    id: Id;
    userId: UserId;
    description: string;
    productId: bigint;
    timestamp: Timestamp;
    eventType: ActivityEventType;
}
export interface UpdateView {
    id: UpdateId;
    status: UpdateStatus;
    deployedAt?: Timestamp;
    createdAt: Timestamp;
    size: bigint;
    productId: bigint;
    releaseNotes: string;
    version: string;
    scheduledAt?: Timestamp;
}
export enum ActivityEventType {
    action = "action",
    login = "login",
    permissionChange = "permissionChange"
}
export enum EmailStatus {
    sent = "sent",
    failed = "failed",
    bounced = "bounced"
}
export enum IssueSeverity {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum IssueStatus {
    resolved = "resolved",
    in_progress = "in_progress",
    open = "open"
}
export enum NotificationSeverity {
    warning = "warning",
    info = "info",
    critical = "critical"
}
export enum NotificationType {
    systemAlert = "systemAlert",
    user = "user",
    update = "update",
    issue = "issue"
}
export enum ProductStatus {
    disconnected = "disconnected",
    connected = "connected"
}
export enum UpdateStatus {
    deployed = "deployed",
    scheduled = "scheduled",
    pending = "pending",
    failed = "failed"
}
export enum UserRole {
    manager = "manager",
    admin = "admin",
    viewer = "viewer"
}
export enum UserStatus {
    active = "active",
    suspended = "suspended"
}
export interface backendInterface {
    addEmailLog(productId: bigint, recipient: string, subject: string, status: EmailStatus): Promise<EmailLog>;
    addIssueComment(issueId: bigint, content: string, authorId: bigint): Promise<IssueComment>;
    createAlert(productId: bigint, metricType: string, severity: MetricSeverity, value: bigint, threshold: bigint): Promise<AlertView>;
    createEmailConfig(productId: bigint, senderName: string, senderEmail: string, bounceEmail: string): Promise<EmailConfigView>;
    createEmailTemplate(productId: bigint, name: string, subject: string, body: string): Promise<EmailTemplateView>;
    createIssue(title: string, description: string, severity: IssueSeverity, productId: bigint, assignedTo: bigint | null): Promise<IssueView>;
    createNotification(title: string, body: string, severity: NotificationSeverity, notifType: NotificationType, productId: bigint | null): Promise<NotificationView>;
    createUpdate(productId: bigint, version: string, releaseNotes: string, size: bigint): Promise<UpdateView>;
    createUser(productId: bigint, name: string, email: string, role: UserRole): Promise<UserView>;
    deleteEmailConfig(id: bigint): Promise<void>;
    deleteEmailTemplate(id: bigint): Promise<void>;
    disconnectProduct(id: bigint): Promise<void>;
    dismissNotification(id: bigint): Promise<void>;
    getLatestMetrics(productId: bigint): Promise<SystemMetrics | null>;
    getMetricsHistory(productId: bigint): Promise<Array<SystemMetrics>>;
    getProduct(id: bigint): Promise<ProductView | null>;
    listActiveAlerts(): Promise<Array<AlertView>>;
    listAlertHistory(productId: bigint): Promise<Array<AlertView>>;
    listAllUpdates(): Promise<Array<UpdateView>>;
    listEmailConfigs(productId: bigint): Promise<Array<EmailConfigView>>;
    listEmailLogs(productId: bigint): Promise<Array<EmailLog>>;
    listEmailTemplates(productId: bigint): Promise<Array<EmailTemplateView>>;
    listIssueComments(issueId: bigint): Promise<Array<IssueComment>>;
    listIssues(productId: bigint | null, status: IssueStatus | null, severity: IssueSeverity | null): Promise<Array<IssueView>>;
    listLinkedApps(): Promise<Array<LinkedAppView>>;
    listNotifications(notifType: NotificationType | null, productId: bigint | null, isRead: boolean | null): Promise<Array<NotificationView>>;
    listProductUpdates(productId: bigint): Promise<Array<UpdateView>>;
    listProducts(): Promise<Array<ProductView>>;
    listUserActivities(productId: bigint): Promise<Array<UserActivity>>;
    listUsers(): Promise<Array<UserView>>;
    listUsersByProduct(productId: bigint): Promise<Array<UserView>>;
    logUserActivity(userId: bigint, productId: bigint, eventType: ActivityEventType, description: string): Promise<void>;
    markAllNotificationsRead(): Promise<void>;
    markNotificationRead(id: bigint): Promise<void>;
    markUpdateDeployed(id: bigint): Promise<void>;
    reconnectProduct(id: bigint): Promise<void>;
    registerLinkedApp(name: string, baseUrl: string, appCode: string): Promise<LinkedAppView>;
    registerProduct(name: string, description: string, code: string): Promise<ProductView>;
    removeLinkedApp(id: string): Promise<boolean>;
    removeUser(id: bigint): Promise<void>;
    resolveAlert(id: bigint): Promise<void>;
    resolveIssue(id: bigint): Promise<void>;
    restoreUser(id: bigint): Promise<void>;
    scheduleUpdate(id: bigint, scheduledAt: Time): Promise<void>;
    snoozeNotification(id: bigint, until: Time): Promise<void>;
    submitMetrics(productId: bigint, cpu: bigint, memory: bigint, disk: bigint, apiLatency: bigint, networkUptime: bigint, connectionStatus: string): Promise<SystemMetrics>;
    suspendUser(id: bigint): Promise<void>;
    syncProduct(id: bigint): Promise<void>;
    updateEmailConfig(id: bigint, senderName: string, senderEmail: string, bounceEmail: string, isActive: boolean): Promise<void>;
    updateEmailTemplate(id: bigint, subject: string, body: string): Promise<void>;
    updateIssue(id: bigint, title: string, description: string, severity: IssueSeverity, status: IssueStatus, assignedTo: bigint | null): Promise<void>;
    updateLinkedAppStatus(id: string, status: string): Promise<LinkedAppView | null>;
    updateProductMeta(id: bigint, name: string, description: string): Promise<void>;
    updateUserRole(id: bigint, role: UserRole): Promise<void>;
}
