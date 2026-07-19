import List "mo:core/List";
import UsersLib "../lib/users";
import Types "../types/users";
import AppsTypes "../types/apps";

mixin (
  users : List.List<Types.User>,
  activities : List.List<Types.UserActivity>,
  userState : { var nextId : Nat },
  activityState : { var nextId : Nat },
  apps : List.List<AppsTypes.App>,
) {

  public func createUser(
    appId : Text,
    name : Text,
    email : Text,
    role : Types.UserRole,
  ) : async Types.UserView {
    UsersLib.create(users, userState, appId, name, email, role);
  };

  // Called by a linked app (identified by its current appCode) to push its
  // user list into Netra for moderation. New users land as #pending.
  public func syncAppUsers(appCode : Text, incoming : [(Text, Text, Text)]) : async Bool {
    switch (apps.find(func(a) { a.appCode == appCode })) {
      case (?a) { UsersLib.syncFromApp(users, userState, a.id, incoming); true };
      case null false;
    };
  };

  // Lets a linked app check whether one of its own users is currently
  // allowed in, per the admin's accept/reject/hold decision.
  public query func getUserStatusForApp(appCode : Text, externalId : Text) : async ?Types.UserStatus {
    switch (apps.find(func(a) { a.appCode == appCode })) {
      case (?a) UsersLib.getStatusForApp(users, a.id, externalId);
      case null null;
    };
  };

  public func updateUserRole(id : Nat, role : Types.UserRole) : async () {
    UsersLib.updateRole(users, id, role);
  };

  public func acceptUser(id : Nat) : async () {
    UsersLib.setStatus(users, id, #active);
  };

  public func rejectUser(id : Nat) : async () {
    UsersLib.setStatus(users, id, #rejected);
  };

  public func holdUser(id : Nat) : async () {
    UsersLib.setStatus(users, id, #held);
  };

  public func removeUser(id : Nat) : async () {
    UsersLib.remove(users, id);
  };

  public query func listUsers() : async [Types.UserView] {
    UsersLib.listAll(users);
  };

  public query func listUsersByApp(appId : Text) : async [Types.UserView] {
    UsersLib.listByApp(users, appId);
  };

  public query func listPendingUsers() : async [Types.UserView] {
    UsersLib.listPending(users);
  };

  public func logUserActivity(
    userId : Nat,
    appId : Text,
    eventType : Types.ActivityEventType,
    description : Text,
  ) : async () {
    UsersLib.recordActivity(activities, activityState, userId, appId, eventType, description);
  };

  public query func listUserActivities(appId : Text) : async [Types.UserActivity] {
    UsersLib.listActivities(activities, appId);
  };

};
