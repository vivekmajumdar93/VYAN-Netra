import Common "common";

module {
  public type UserId = Common.Id;
  public type UserRole = { #admin; #manager; #viewer };
  public type UserStatus = { #pending; #active; #held; #rejected };

  public type User = {
    id : UserId;
    appId : Text;
    externalId : Text; // the user's own id within their app
    var name : Text;
    var email : Text;
    var role : UserRole;
    var status : UserStatus;
    var lastActivity : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type UserView = {
    id : UserId;
    appId : Text;
    externalId : Text;
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
    appId : Text;
    eventType : ActivityEventType;
    description : Text;
    timestamp : Common.Timestamp;
  };
};
