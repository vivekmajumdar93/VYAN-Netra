import Common "common";

module {
  public type UserId = Common.Id;
  public type UserRole = { #admin; #manager; #viewer };
  public type UserStatus = { #active; #suspended };

  public type User = {
    id : UserId;
    productId : Nat;
    name : Text;
    email : Text;
    var role : UserRole;
    var status : UserStatus;
    var lastActivity : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type UserView = {
    id : UserId;
    productId : Nat;
    name : Text;
    email : Text;
    role : UserRole;
    status : UserStatus;
    lastActivity : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type ActivityEventType = { #login; #permissionChange; #action };

  public type UserActivity = {
    id : Common.Id;
    userId : UserId;
    productId : Nat;
    eventType : ActivityEventType;
    description : Text;
    timestamp : Common.Timestamp;
  };
};
