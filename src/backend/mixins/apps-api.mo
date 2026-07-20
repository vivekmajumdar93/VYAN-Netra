import List "mo:core/List";
import AppsLib "../lib/apps";
import Types "../types/apps";
import SettingsTypes "../types/settings";

mixin (
  apps : List.List<Types.App>,
  killSwitch : SettingsTypes.KillSwitch,
) {

  // Generates a fresh 6-char pairing code server-side and creates a
  // #pending app entry. The admin embeds the returned appCode in the new
  // app's own code; the app then calls recordHeartbeat (or is health-
  // checked) with that code to complete the connection.
  public func createApp(name : Text) : async Types.AppView {
    AppsLib.createApp(apps, name);
  };

  public func setAppBaseUrl(id : Text, baseUrl : Text) : async Types.AppView {
    AppsLib.setBaseUrl(apps, id, baseUrl);
  };

  public func renameApp(id : Text, name : Text) : async Types.AppView {
    AppsLib.rename(apps, id, name);
  };

  // Called by a linked app itself on a periodic interval (see the VYAN
  // Bridge protocol doc). Not gated by admin auth — the appCode IS the
  // credential. Returns false if the code isn't recognized, or if the
  // console's kill switch is off (Settings) — no cross-app activity is
  // processed while it's disabled.
  public func recordHeartbeat(appCode : Text) : async Bool {
    if (not killSwitch.enabled) return false;
    AppsLib.recordHeartbeat(apps, appCode);
  };

  // Reported by the console after it directly probes the app's own
  // /health endpoint from the browser (see use-app-bridge.ts).
  public func setAppManualStatus(id : Text, status : Types.AppStatus) : async Types.AppView {
    AppsLib.setManualStatus(apps, id, status);
  };

  public func regenerateAppCode(id : Text) : async Types.AppView {
    AppsLib.regenerateCode(apps, id);
  };

  public func removeApp(id : Text) : async Bool {
    AppsLib.remove(apps, id);
  };

  public query func listApps() : async [Types.AppView] {
    AppsLib.listAll(apps);
  };

  public query func getApp(id : Text) : async ?Types.AppView {
    AppsLib.getById(apps, id);
  };

};
