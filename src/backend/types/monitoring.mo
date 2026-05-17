import Common "common";

module {
  public type MetricSeverity = { #critical; #warning; #info };

  public type SystemMetrics = {
    id : Common.Id;
    productId : Nat;
    cpu : Nat;
    memory : Nat;
    disk : Nat;
    apiLatency : Nat;
    networkUptime : Nat;
    connectionStatus : Text;
    timestamp : Common.Timestamp;
  };

  public type Alert = {
    id : Common.Id;
    productId : Nat;
    metricType : Text;
    severity : MetricSeverity;
    value : Nat;
    threshold : Nat;
    timestamp : Common.Timestamp;
    var resolved : Bool;
    var resolvedAt : ?Common.Timestamp;
  };

  public type AlertView = {
    id : Common.Id;
    productId : Nat;
    metricType : Text;
    severity : MetricSeverity;
    value : Nat;
    threshold : Nat;
    timestamp : Common.Timestamp;
    resolved : Bool;
    resolvedAt : ?Common.Timestamp;
  };
};
