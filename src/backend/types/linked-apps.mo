import Common "common";

module {
  public type LinkedAppId = Text; // uuid-style: name+appCode combo

  public type LinkedApp = {
    id : LinkedAppId;
    name : Text;
    baseUrl : Text;
    appCode : Text; // exactly 6 uppercase alphanumeric chars
    var status : Text; // "connected" or "disconnected"
    addedAt : Common.Timestamp;
  };

  public type LinkedAppView = {
    id : LinkedAppId;
    name : Text;
    baseUrl : Text;
    appCode : Text;
    status : Text;
    addedAt : Common.Timestamp;
  };
};
