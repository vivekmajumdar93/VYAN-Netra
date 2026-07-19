import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/monitoring";

module {

  public func toAlertView(a : Types.Alert) : Types.AlertView = {
    id = a.id;
    appId = a.appId;
    metricType = a.metricType;
    severity = a.severity;
    value = a.value;
    threshold = a.threshold;
    timestamp = a.timestamp;
    resolved = a.resolved;
    resolvedAt = a.resolvedAt;
  };

  public func submitMetrics(
    metrics : List.List<Types.SystemMetrics>,
    state : { var nextId : Nat },
    appId : Text,
    cpu : Nat,
    memory : Nat,
    disk : Nat,
    apiLatency : Nat,
    networkUptime : Nat,
    connectionStatus : Text,
  ) : Types.SystemMetrics {
    let id = state.nextId;
    state.nextId += 1;
    let snap : Types.SystemMetrics = {
      id;
      appId;
      cpu;
      memory;
      disk;
      apiLatency;
      networkUptime;
      connectionStatus;
      timestamp = Time.now();
    };
    metrics.add(snap);
    snap;
  };

  public func getLatest(metrics : List.List<Types.SystemMetrics>, appId : Text) : ?Types.SystemMetrics {
    let filtered = metrics.filter(func(m) { m.appId == appId });
    filtered.last();
  };

  public func getHistory(metrics : List.List<Types.SystemMetrics>, appId : Text) : [Types.SystemMetrics] {
    let filtered = metrics.filter(func(m) { m.appId == appId });
    let size = filtered.size();
    let start : Int = if (size > 24) { size - 24 } else { 0 };
    filtered.sliceToArray(start, size);
  };

  public func createAlert(
    alerts : List.List<Types.Alert>,
    state : { var nextId : Nat },
    appId : Text,
    metricType : Text,
    severity : Types.MetricSeverity,
    value : Nat,
    threshold : Nat,
  ) : Types.AlertView {
    let id = state.nextId;
    state.nextId += 1;
    let alert : Types.Alert = {
      id;
      appId;
      metricType;
      severity;
      value;
      threshold;
      timestamp = Time.now();
      var resolved = false;
      var resolvedAt = null;
    };
    alerts.add(alert);
    toAlertView(alert);
  };

  public func resolveAlert(alerts : List.List<Types.Alert>, id : Nat) {
    switch (alerts.find(func(a) { a.id == id })) {
      case (?a) {
        a.resolved := true;
        a.resolvedAt := ?Time.now();
      };
      case null Runtime.trap("Alert not found");
    };
  };

  public func listActiveAlerts(alerts : List.List<Types.Alert>) : [Types.AlertView] {
    alerts.filter(func(a) { not a.resolved })
      .map<Types.Alert, Types.AlertView>(toAlertView)
      .toArray();
  };

  public func listAlertHistory(alerts : List.List<Types.Alert>, appId : Text) : [Types.AlertView] {
    alerts.filter(func(a) { a.appId == appId })
      .map<Types.Alert, Types.AlertView>(toAlertView)
      .toArray();
  };

};
