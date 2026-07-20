import Types "../types/settings";
import SettingsLib "../lib/settings";

mixin (
  killSwitch : Types.KillSwitch,
) {

  public query func getKillSwitch() : async Types.KillSwitchView {
    SettingsLib.toView(killSwitch);
  };

  // Gates every outbound/cross-app action the console can take (email
  // sends, heartbeat processing). Starts disabled — see main.mo.
  public func setKillSwitch(enabled : Bool) : async Types.KillSwitchView {
    SettingsLib.setEnabled(killSwitch, enabled);
  };

};
