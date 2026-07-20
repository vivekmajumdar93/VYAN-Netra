import Common "common";

module {
  // A single global switch that gates every outbound / cross-app action the
  // console can take (email sends, heartbeat processing, and — client-side
  // — health checks). Starts disabled so nothing that could contact another
  // app or an external API runs until an admin explicitly turns it on.
  public type KillSwitch = {
    var enabled : Bool;
    var updatedAt : Common.Timestamp;
  };

  public type KillSwitchView = {
    enabled : Bool;
    updatedAt : Common.Timestamp;
  };
};
