import Common "common";

module {
  public type AppId = Text; // == the app's original appCode, stable for its lifetime

  public type AppStatus = { #pending; #connected; #disconnected };

  public type App = {
    id : AppId;
    var name : Text;
    var baseUrl : ?Text;
    var appCode : Text; // rotatable pairing credential embedded in the app
    var status : AppStatus;
    var lastHeartbeat : ?Common.Timestamp;
    addedAt : Common.Timestamp;
  };

  public type AppView = {
    id : AppId;
    name : Text;
    baseUrl : ?Text;
    appCode : Text;
    status : AppStatus;
    lastHeartbeat : ?Common.Timestamp;
    addedAt : Common.Timestamp;
  };
};
