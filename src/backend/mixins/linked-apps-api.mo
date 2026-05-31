import List "mo:core/List";
import LinkedAppsLib "../lib/linked-apps";
import Types "../types/linked-apps";

mixin (
  linkedApps : List.List<Types.LinkedApp>,
  linkedAppState : { var nextId : Nat },
) {

  public func registerLinkedApp(
    name : Text,
    baseUrl : Text,
    appCode : Text,
  ) : async Types.LinkedAppView {
    LinkedAppsLib.register(linkedApps, linkedAppState, name, baseUrl, appCode);
  };

  public query func listLinkedApps() : async [Types.LinkedAppView] {
    LinkedAppsLib.listAll(linkedApps);
  };

  public func updateLinkedAppStatus(id : Text, status : Text) : async ?Types.LinkedAppView {
    LinkedAppsLib.updateStatus(linkedApps, id, status);
  };

  public func removeLinkedApp(id : Text) : async Bool {
    LinkedAppsLib.remove(linkedApps, id);
  };

};
