import List "mo:core/List";
import UsersLib "../lib/users";
import Types "../types/users";

mixin (
  users : List.List<Types.User>,
  activities : List.List<Types.UserActivity>,
  userState : { var nextId : Nat },
  activityState : { var nextId : Nat },
) {

  public func createUser(
    productId : Nat,
    name : Text,
    email : Text,
    role : Types.UserRole,
  ) : async Types.UserView {
    UsersLib.create(users, userState, productId, name, email, role);
  };

  public func updateUserRole(id : Nat, role : Types.UserRole) : async () {
    UsersLib.updateRole(users, id, role);
  };

  public func suspendUser(id : Nat) : async () {
    UsersLib.setStatus(users, id, #suspended);
  };

  public func restoreUser(id : Nat) : async () {
    UsersLib.setStatus(users, id, #active);
  };

  public func removeUser(id : Nat) : async () {
    UsersLib.remove(users, id);
  };

  public query func listUsers() : async [Types.UserView] {
    UsersLib.listAll(users);
  };

  public query func listUsersByProduct(productId : Nat) : async [Types.UserView] {
    UsersLib.listByProduct(users, productId);
  };

  public func logUserActivity(
    userId : Nat,
    productId : Nat,
    eventType : Types.ActivityEventType,
    description : Text,
  ) : async () {
    UsersLib.recordActivity(activities, activityState, userId, productId, eventType, description);
  };

  public query func listUserActivities(productId : Nat) : async [Types.UserActivity] {
    UsersLib.listActivities(activities, productId);
  };

};
