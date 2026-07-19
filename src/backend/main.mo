import List "mo:core/List";
import AppTypes "types/apps";
import UserTypes "types/users";
import MonitoringTypes "types/monitoring";
import NotifTypes "types/notifications";
import IssueTypes "types/issues";
import UpdateTypes "types/updates";
import EmailTypes "types/email";
import AppsMixin "mixins/apps-api";
import UsersMixin "mixins/users-api";
import MonitoringMixin "mixins/monitoring-api";
import NotifsMixin "mixins/notifications-api";
import IssuesMixin "mixins/issues-api";
import UpdatesMixin "mixins/updates-api";
import EmailMixin "mixins/email-api";

actor {
  // Apps — the single registry of every VYAN app connected to this console
  // (replaces the old, separate Products and LinkedApps registries).
  let apps = List.empty<AppTypes.App>();

  // Users
  let users = List.empty<UserTypes.User>();
  let activities = List.empty<UserTypes.UserActivity>();
  let userState = { var nextId : Nat = 0 };
  let activityState = { var nextId : Nat = 0 };

  // Monitoring
  let metrics = List.empty<MonitoringTypes.SystemMetrics>();
  let alerts = List.empty<MonitoringTypes.Alert>();
  let metricsState = { var nextId : Nat = 0 };
  let alertsState = { var nextId : Nat = 0 };

  // Notifications
  let notifications = List.empty<NotifTypes.Notification>();
  let notifState = { var nextId : Nat = 0 };

  // Issues
  let issues = List.empty<IssueTypes.Issue>();
  let comments = List.empty<IssueTypes.IssueComment>();
  let issueState = { var nextId : Nat = 0 };
  let commentState = { var nextId : Nat = 0 };

  // Updates
  let updates = List.empty<UpdateTypes.Update>();
  let updateState = { var nextId : Nat = 0 };

  // Email
  let emailConfigs = List.empty<EmailTypes.EmailConfig>();
  let emailLogs = List.empty<EmailTypes.EmailLog>();
  let emailTemplates = List.empty<EmailTypes.EmailTemplate>();
  let emailConfigState = { var nextId : Nat = 0 };
  let emailLogState = { var nextId : Nat = 0 };
  let emailTemplateState = { var nextId : Nat = 0 };
  let zohoConfig : EmailTypes.ZohoConfig = {
    var accountId = "";
    var accessToken = "";
    var fromAddress = "";
  };

  include AppsMixin(apps);
  include UsersMixin(users, activities, userState, activityState, apps);
  include MonitoringMixin(metrics, alerts, metricsState, alertsState);
  include NotifsMixin(notifications, notifState);
  include IssuesMixin(issues, comments, issueState, commentState);
  include UpdatesMixin(updates, updateState);
  include EmailMixin(emailConfigs, emailLogs, emailTemplates, emailConfigState, emailLogState, emailTemplateState, zohoConfig);
};
