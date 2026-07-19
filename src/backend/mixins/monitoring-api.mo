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
    appId : Text,
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
      appId,
      cpu,
      memory,
      disk,
      apiLatency,
      networkUptime,
      connectionStatus,
    );
  };

  public query func getLatestMetrics(appId : Text) : async ?Types.SystemMetrics {
    MonitoringLib.getLatest(metrics, appId);
  };

  public query func getMetricsHistory(appId : Text) : async [Types.SystemMetrics] {
    MonitoringLib.getHistory(metrics, appId);
  };

  public func createAlert(
    appId : Text,
    metricType : Text,
    severity : Types.MetricSeverity,
    value : Nat,
    threshold : Nat,
  ) : async Types.AlertView {
    MonitoringLib.createAlert(alerts, alertsState, appId, metricType, severity, value, threshold);
  };

  public func resolveAlert(id : Nat) : async () {
    MonitoringLib.resolveAlert(alerts, id);
  };

  public query func listActiveAlerts() : async [Types.AlertView] {
    MonitoringLib.listActiveAlerts(alerts);
  };

  public query func listAlertHistory(appId : Text) : async [Types.AlertView] {
    MonitoringLib.listAlertHistory(alerts, appId);
  };

};
