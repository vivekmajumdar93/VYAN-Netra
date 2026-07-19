import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Random "mo:core/Random";
import Types "../types/apps";

module {

  let CODE_ALPHABET : [Char] = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ];

  // A heartbeat older than this reads as disconnected, even if nothing
  // ever explicitly flipped the stored status.
  let HEARTBEAT_STALE_NS : Int = 180_000_000_000; // 3 minutes

  public func liveStatus(a : Types.App) : Types.AppStatus {
    if (a.status == #pending) return #pending;
    switch (a.lastHeartbeat) {
      case null { a.status };
      case (?last) {
        if (Time.now() - last > HEARTBEAT_STALE_NS) #disconnected else #connected;
      };
    };
  };

  public func toView(a : Types.App) : Types.AppView = {
    id = a.id;
    name = a.name;
    baseUrl = a.baseUrl;
    appCode = a.appCode;
    status = liveStatus(a);
    lastHeartbeat = a.lastHeartbeat;
    addedAt = a.addedAt;
  };

  // Cryptographically random 6-char code (36^6 ≈ 2.18B combinations),
  // drawn from the IC management canister's entropy via mo:core/Random,
  // retried on the (extremely unlikely) chance of a collision.
  func generateCode(apps : List.List<Types.App>) : async Text {
    var attempts = 0;
    loop {
      attempts += 1;
      if (attempts > 20) Runtime.trap("Failed to generate a unique app code");
      let random = Random.crypto();
      var code = "";
      var i = 0;
      while (i < 6) {
        let idx = await* random.natRange(0, CODE_ALPHABET.size());
        code #= Text.fromChar(CODE_ALPHABET[idx]);
        i += 1;
      };
      switch (apps.find(func(a) { a.appCode == code })) {
        case null { return code };
        case (?_) {};
      };
    };
    Runtime.trap("unreachable");
  };

  public func createApp(
    apps : List.List<Types.App>,
    name : Text,
  ) : async Types.AppView {
    let code = await generateCode(apps);
    let app : Types.App = {
      id = code;
      var name;
      var baseUrl = null;
      var appCode = code;
      var status = #pending;
      var lastHeartbeat = null;
      addedAt = Time.now();
    };
    apps.add(app);
    toView(app);
  };

  public func setBaseUrl(apps : List.List<Types.App>, id : Types.AppId, baseUrl : Text) : Types.AppView {
    switch (apps.find(func(a) { a.id == id })) {
      case (?a) { a.baseUrl := ?baseUrl; toView(a) };
      case null Runtime.trap("App not found");
    };
  };

  public func rename(apps : List.List<Types.App>, id : Types.AppId, name : Text) : Types.AppView {
    switch (apps.find(func(a) { a.id == id })) {
      case (?a) { a.name := name; toView(a) };
      case null Runtime.trap("App not found");
    };
  };

  // Called by a linked app on its own heartbeat interval. Returns false
  // (without revealing why) if the code doesn't match any app.
  public func recordHeartbeat(apps : List.List<Types.App>, appCode : Text) : Bool {
    switch (apps.find(func(a) { a.appCode == appCode })) {
      case (?a) {
        a.lastHeartbeat := ?Time.now();
        a.status := #connected;
        true;
      };
      case null false;
    };
  };

  // Used by the browser-driven manual "test connection" check, which
  // observes reachability itself (via direct fetch) and reports the result.
  public func setManualStatus(apps : List.List<Types.App>, id : Types.AppId, status : Types.AppStatus) : Types.AppView {
    switch (apps.find(func(a) { a.id == id })) {
      case (?a) {
        a.status := status;
        if (status == #connected) { a.lastHeartbeat := ?Time.now() };
        toView(a);
      };
      case null Runtime.trap("App not found");
    };
  };

  // Rotates the embedded pairing credential without disturbing the app's
  // stable id (and therefore without breaking Users/Email/etc. foreign keys).
  public func regenerateCode(apps : List.List<Types.App>, id : Types.AppId) : async Types.AppView {
    switch (apps.find(func(a) { a.id == id })) {
      case (?_) {};
      case null Runtime.trap("App not found");
    };
    let code = await generateCode(apps);
    switch (apps.find(func(a) { a.id == id })) {
      case (?a) {
        a.appCode := code;
        a.status := #pending;
        a.lastHeartbeat := null;
        toView(a);
      };
      case null Runtime.trap("App not found");
    };
  };

  public func remove(apps : List.List<Types.App>, id : Types.AppId) : Bool {
    let before = apps.size();
    let filtered = apps.filter(func(a) { a.id != id });
    apps.clear();
    apps.append(filtered);
    apps.size() != before;
  };

  public func listAll(apps : List.List<Types.App>) : [Types.AppView] {
    apps.map<Types.App, Types.AppView>(toView).toArray();
  };

  public func getById(apps : List.List<Types.App>, id : Types.AppId) : ?Types.AppView {
    switch (apps.find(func(a) { a.id == id })) {
      case (?a) ?toView(a);
      case null null;
    };
  };

};
