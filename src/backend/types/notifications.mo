import Common "common";

module {
  public type NotificationSeverity = { #critical; #warning; #info };
  public type NotificationType = { #systemAlert; #user; #issue; #update };

  public type Notification = {
    id : Common.Id;
    title : Text;
    body : Text;
    severity : NotificationSeverity;
    notifType : NotificationType;
    productId : ?Nat;
    var isRead : Bool;
    var snoozed : Bool;
    var snoozedUntil : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type NotificationView = {
    id : Common.Id;
    title : Text;
    body : Text;
    severity : NotificationSeverity;
    notifType : NotificationType;
    productId : ?Nat;
    isRead : Bool;
    snoozed : Bool;
    snoozedUntil : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };
};
