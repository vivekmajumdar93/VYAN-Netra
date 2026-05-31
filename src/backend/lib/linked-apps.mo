import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Char "mo:core/Char";
import Types "../types/linked-apps";

module {

  // Convert internal type to shared view
  public func toView(app : Types.LinkedApp) : Types.LinkedAppView = {
    id = app.id;
    name = app.name;
    baseUrl = app.baseUrl;
    appCode = app.appCode;
    status = app.status;
    addedAt = app.addedAt;
  };

  // Validate appCode: must be exactly 6 uppercase alphanumeric characters
  func isAlphanumericUpper(c : Char) : Bool {
    (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9');
  };

  func validateAppCode(code : Text) {
    if (code.size() != 6) Runtime.trap("App code must be exactly 6 characters");
    for (c in code.chars()) {
      if (not isAlphanumericUpper(c)) {
        Runtime.trap("App code must contain only uppercase alphanumeric characters (A-Z, 0-9)");
      };
    };
  };

  // Generate a deterministic id from name + appCode + counter
  func makeId(name : Text, appCode : Text, counter : Nat) : Text {
    appCode # "-" # name # "-" # debug_show(counter);
  };

  public func register(
    apps : List.List<Types.LinkedApp>,
    state : { var nextId : Nat },
    name : Text,
    baseUrl : Text,
    rawAppCode : Text,
  ) : Types.LinkedAppView {
    // Normalize to uppercase
    let appCode = rawAppCode.toUpper();
    validateAppCode(appCode);
    // Ensure appCode is unique
    switch (apps.find(func(a) { a.appCode == appCode })) {
      case (?_) Runtime.trap("App code already registered");
      case null {};
    };
    let now = Time.now();
    let id = makeId(name, appCode, state.nextId);
    state.nextId += 1;
    let app : Types.LinkedApp = {
      id;
      name;
      baseUrl;
      appCode;
      var status = "connected";
      addedAt = now;
    };
    apps.add(app);
    toView(app);
  };

  public func listAll(apps : List.List<Types.LinkedApp>) : [Types.LinkedAppView] {
    apps.map<Types.LinkedApp, Types.LinkedAppView>(toView).toArray();
  };

  public func updateStatus(
    apps : List.List<Types.LinkedApp>,
    id : Text,
    status : Text,
  ) : ?Types.LinkedAppView {
    if (status != "connected" and status != "disconnected") {
      Runtime.trap("Status must be 'connected' or 'disconnected'");
    };
    switch (apps.find(func(a) { a.id == id })) {
      case (?app) {
        app.status := status;
        ?toView(app);
      };
      case null null;
    };
  };

  public func remove(
    apps : List.List<Types.LinkedApp>,
    id : Text,
  ) : Bool {
    let sizeBefore = apps.size();
    apps.retain(func(a) { a.id != id });
    apps.size() < sizeBefore;
  };

};
