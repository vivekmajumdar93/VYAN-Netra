import List "mo:core/List";
import Time "mo:core/Time";
import NotificationsLib "../lib/notifications";
import Types "../types/notifications";

mixin (
  notifications : List.List<Types.Notification>,
  notifState : { var nextId : Nat },
) {

  public func createNotification(
    title : Text,
    body : Text,
    severity : Types.NotificationSeverity,
    notifType : Types.NotificationType,
    appId : ?Text,
  ) : async Types.NotificationView {
    NotificationsLib.create(notifications, notifState, title, body, severity, notifType, appId);
  };

  public func markNotificationRead(id : Nat) : async () {
    NotificationsLib.markRead(notifications, id);
  };

  public func markAllNotificationsRead() : async () {
    NotificationsLib.markAllRead(notifications);
  };

  public func dismissNotification(id : Nat) : async () {
    NotificationsLib.dismiss(notifications, id);
  };

  public func snoozeNotification(id : Nat, until : Time.Time) : async () {
    NotificationsLib.snooze(notifications, id, until);
  };

  public query func listNotifications(
    notifType : ?Types.NotificationType,
    appId : ?Text,
    isRead : ?Bool,
  ) : async [Types.NotificationView] {
    NotificationsLib.listFiltered(notifications, notifType, appId, isRead);
  };

};
