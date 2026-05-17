import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import CommonTypes "../types/common";
import Types "../types/notifications";

module {

  public func toView(n : Types.Notification) : Types.NotificationView = {
    id = n.id;
    title = n.title;
    body = n.body;
    severity = n.severity;
    notifType = n.notifType;
    productId = n.productId;
    isRead = n.isRead;
    snoozed = n.snoozed;
    snoozedUntil = n.snoozedUntil;
    createdAt = n.createdAt;
  };

  public func create(
    notifications : List.List<Types.Notification>,
    state : { var nextId : Nat },
    title : Text,
    body : Text,
    severity : Types.NotificationSeverity,
    notifType : Types.NotificationType,
    productId : ?Nat,
  ) : Types.NotificationView {
    let id = state.nextId;
    state.nextId += 1;
    let notif : Types.Notification = {
      id;
      title;
      body;
      severity;
      notifType;
      productId;
      var isRead = false;
      var snoozed = false;
      var snoozedUntil = null;
      createdAt = Time.now();
    };
    notifications.add(notif);
    toView(notif);
  };

  public func markRead(notifications : List.List<Types.Notification>, id : Nat) {
    switch (notifications.find(func(n) { n.id == id })) {
      case (?n) { n.isRead := true };
      case null Runtime.trap("Notification not found");
    };
  };

  public func markAllRead(notifications : List.List<Types.Notification>) {
    notifications.forEach(func(n) { n.isRead := true });
  };

  public func dismiss(notifications : List.List<Types.Notification>, id : Nat) {
    let filtered = notifications.filter(func(n) { n.id != id });
    notifications.clear();
    notifications.append(filtered);
  };

  public func snooze(notifications : List.List<Types.Notification>, id : Nat, until : CommonTypes.Timestamp) {
    switch (notifications.find(func(n) { n.id == id })) {
      case (?n) {
        n.snoozed := true;
        n.snoozedUntil := ?until;
      };
      case null Runtime.trap("Notification not found");
    };
  };

  public func listFiltered(
    notifications : List.List<Types.Notification>,
    notifType : ?Types.NotificationType,
    productId : ?Nat,
    isRead : ?Bool,
  ) : [Types.NotificationView] {
    notifications.filter(func(n) {
      let typeMatch = switch (notifType) {
        case (?t) { n.notifType == t };
        case null { true };
      };
      let productMatch = switch (productId) {
        case (?pid) { n.productId == ?pid };
        case null { true };
      };
      let readMatch = switch (isRead) {
        case (?r) { n.isRead == r };
        case null { true };
      };
      typeMatch and productMatch and readMatch;
    })
    .map<Types.Notification, Types.NotificationView>(toView)
    .toArray();
  };

};
