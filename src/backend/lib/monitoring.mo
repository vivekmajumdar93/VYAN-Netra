import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/monitoring";

module {

  public func toAlertView(a : Types.Alert) : Types.AlertView = {
    id = a.id;
    productId = a.productId;
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
    productId : Nat,
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
      productId;
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

  public func getLatest(metrics : List.List<Types.SystemMetrics>, productId : Nat) : ?Types.SystemMetrics {
    let filtered = metrics.filter(func(m) { m.productId == productId });
    filtered.last();
  };

  public func getHistory(metrics : List.List<Types.SystemMetrics>, productId : Nat) : [Types.SystemMetrics] {
    let filtered = metrics.filter(func(m) { m.productId == productId });
    let size = filtered.size();
    let start : Int = if (size > 24) { size - 24 } else { 0 };
    filtered.sliceToArray(start, size);
  };

  public func createAlert(
    alerts : List.List<Types.Alert>,
    state : { var nextId : Nat },
    productId : Nat,
    metricType : Text,
    severity : Types.MetricSeverity,
    value : Nat,
    threshold : Nat,
  ) : Types.AlertView {
    let id = state.nextId;
    state.nextId += 1;
    let alert : Types.Alert = {
      id;
      productId;
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

  public func listAlertHistory(alerts : List.List<Types.Alert>, productId : Nat) : [Types.AlertView] {
    alerts.filter(func(a) { a.productId == productId })
      .map<Types.Alert, Types.AlertView>(toAlertView)
      .toArray();
  };

};
