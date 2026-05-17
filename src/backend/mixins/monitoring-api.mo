import List "mo:core/List";
import MonitoringLib "../lib/monitoring";
import Types "../types/monitoring";

mixin (
  metrics : List.List<Types.SystemMetrics>,
  alerts : List.List<Types.Alert>,
  metricsState : { var nextId : Nat },
  alertsState : { var nextId : Nat },
) {

  public func submitMetrics(
    productId : Nat,
    cpu : Nat,
    memory : Nat,
    disk : Nat,
    apiLatency : Nat,
    networkUptime : Nat,
    connectionStatus : Text,
  ) : async Types.SystemMetrics {
    MonitoringLib.submitMetrics(
      metrics,
      metricsState,
      productId,
      cpu,
      memory,
      disk,
      apiLatency,
      networkUptime,
      connectionStatus,
    );
  };

  public query func getLatestMetrics(productId : Nat) : async ?Types.SystemMetrics {
    MonitoringLib.getLatest(metrics, productId);
  };

  public query func getMetricsHistory(productId : Nat) : async [Types.SystemMetrics] {
    MonitoringLib.getHistory(metrics, productId);
  };

  public func createAlert(
    productId : Nat,
    metricType : Text,
    severity : Types.MetricSeverity,
    value : Nat,
    threshold : Nat,
  ) : async Types.AlertView {
    MonitoringLib.createAlert(alerts, alertsState, productId, metricType, severity, value, threshold);
  };

  public func resolveAlert(id : Nat) : async () {
    MonitoringLib.resolveAlert(alerts, id);
  };

  public query func listActiveAlerts() : async [Types.AlertView] {
    MonitoringLib.listActiveAlerts(alerts);
  };

  public query func listAlertHistory(productId : Nat) : async [Types.AlertView] {
    MonitoringLib.listAlertHistory(alerts, productId);
  };

};
