import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/users";

module {

  public func toView(u : Types.User) : Types.UserView = {
    id = u.id;
    appId = u.appId;
    externalId = u.externalId;
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
    appId : Text,
    name : Text,
    email : Text,
    role : Types.UserRole,
  ) : Types.UserView {
    let now = Time.now();
    let id = state.nextId;
    state.nextId += 1;
    let user : Types.User = {
      id;
      appId;
      externalId = "manual-" # debug_show (id);
      var name;
      var email;
      var role;
      var status = #active;
      var lastActivity = now;
      createdAt = now;
    };
    users.add(user);
    toView(user);
  };

  // Upserts users pushed in by a linked app. Existing users (matched by
  // externalId within that app) keep their current moderation status and
  // just refresh name/email/activity; new ones land as #pending for review.
  public func syncFromApp(
    users : List.List<Types.User>,
    state : { var nextId : Nat },
    appId : Text,
    incoming : [(Text, Text, Text)], // (externalId, name, email)
  ) {
    for ((externalId, name, email) in incoming.vals()) {
      switch (users.find(func(u) { u.appId == appId and u.externalId == externalId })) {
        case (?u) {
          u.name := name;
          u.email := email;
          u.lastActivity := Time.now();
        };
        case null {
          let id = state.nextId;
          state.nextId += 1;
          let now = Time.now();
          users.add({
            id;
            appId;
            externalId;
            var name;
            var email;
            var role = #viewer;
            var status = #pending;
            var lastActivity = now;
            createdAt = now;
          });
        };
      };
    };
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

  public func getStatusForApp(users : List.List<Types.User>, appId : Text, externalId : Text) : ?Types.UserStatus {
    switch (users.find(func(u) { u.appId == appId and u.externalId == externalId })) {
      case (?u) ?u.status;
      case null null;
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

  public func listByApp(users : List.List<Types.User>, appId : Text) : [Types.UserView] {
    users.filter(func(u) { u.appId == appId })
      .map<Types.User, Types.UserView>(toView)
      .toArray();
  };

  public func listPending(users : List.List<Types.User>) : [Types.UserView] {
    users.filter(func(u) { u.status == #pending })
      .map<Types.User, Types.UserView>(toView)
      .toArray();
  };

  public func recordActivity(
    activities : List.List<Types.UserActivity>,
    state : { var nextId : Nat },
    userId : Nat,
    appId : Text,
    eventType : Types.ActivityEventType,
    description : Text,
  ) {
    let id = state.nextId;
    state.nextId += 1;
    activities.add({
      id;
      userId;
      appId;
      eventType;
      description;
      timestamp = Time.now();
    });
  };

  public func listActivities(activities : List.List<Types.UserActivity>, appId : Text) : [Types.UserActivity] {
    activities.filter(func(a) { a.appId == appId }).toArray();
  };

};
