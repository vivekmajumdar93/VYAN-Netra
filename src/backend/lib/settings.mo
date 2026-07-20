import Time "mo:core/Time";
import Types "../types/settings";

module {
  public func toView(k : Types.KillSwitch) : Types.KillSwitchView = {
    enabled = k.enabled;
    updatedAt = k.updatedAt;
  };

  public func setEnabled(k : Types.KillSwitch, enabled : Bool) : Types.KillSwitchView {
    k.enabled := enabled;
    k.updatedAt := Time.now();
    toView(k);
  };
};
