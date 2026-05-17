import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/users";

module {

  public func toView(u : Types.User) : Types.UserView = {
    id = u.id;
    productId = u.productId;
    name = u.name;
    email = u.email;
    role = u.role;
    status = u.status;
    lastActivity = u.lastActivity;
    createdAt = u.createdAt;
  };

  public func create(
    users : List.List<Types.User>,
    state : { var nextId : Nat },
    productId : Nat,
    name : Text,
    email : Text,
    role : Types.UserRole,
  ) : Types.UserView {
    let now = Time.now();
    let id = state.nextId;
    state.nextId += 1;
    let user : Types.User = {
      id;
      productId;
      name;
      email;
      var role;
      var status = #active;
      var lastActivity = now;
      createdAt = now;
    };
    users.add(user);
    toView(user);
  };

  public func updateRole(users : List.List<Types.User>, id : Nat, role : Types.UserRole) {
    switch (users.find(func(u) { u.id == id })) {
      case (?u) { u.role := role };
      case null Runtime.trap("User not found");
    };
  };

  public func setStatus(users : List.List<Types.User>, id : Nat, status : Types.UserStatus) {
    switch (users.find(func(u) { u.id == id })) {
      case (?u) { u.status := status };
      case null Runtime.trap("User not found");
    };
  };

  public func remove(users : List.List<Types.User>, id : Nat) {
    let filtered = users.filter(func(u) { u.id != id });
    users.clear();
    users.append(filtered);
  };

  public func listAll(users : List.List<Types.User>) : [Types.UserView] {
    users.map<Types.User, Types.UserView>(toView).toArray();
  };

  public func listByProduct(users : List.List<Types.User>, productId : Nat) : [Types.UserView] {
    users.filter(func(u) { u.productId == productId })
      .map<Types.User, Types.UserView>(toView)
      .toArray();
  };

  public func recordActivity(
    activities : List.List<Types.UserActivity>,
    state : { var nextId : Nat },
    userId : Nat,
    productId : Nat,
    eventType : Types.ActivityEventType,
    description : Text,
  ) {
    let id = state.nextId;
    state.nextId += 1;
    activities.add({
      id;
      userId;
      productId;
      eventType;
      description;
      timestamp = Time.now();
    });
  };

  public func listActivities(activities : List.List<Types.UserActivity>, productId : Nat) : [Types.UserActivity] {
    activities.filter(func(a) { a.productId == productId }).toArray();
  };

};
