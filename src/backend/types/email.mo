import Common "common";

module {
  public type EmailConfigId = Common.Id;
  public type EmailStatus = { #sent; #failed; #bounced };

  public type EmailConfig = {
    id : EmailConfigId;
    appId : Text;
    senderName : Text;
    senderEmail : Text;
    bounceEmail : Text;
    var isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type EmailConfigView = {
    id : EmailConfigId;
    appId : Text;
    senderName : Text;
    senderEmail : Text;
    bounceEmail : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type EmailLog = {
    id : Common.Id;
    appId : Text;
    recipient : Text;
    subject : Text;
    status : EmailStatus;
    detail : Text; // HTTP status / error text, for debugging failed sends
    timestamp : Common.Timestamp;
  };

  public type EmailTemplate = {
    id : Common.Id;
    appId : Text;
    name : Text;
    subject : Text;
    var body : Text;
    var lastModified : Common.Timestamp;
  };

  public type EmailTemplateView = {
    id : Common.Id;
    appId : Text;
    name : Text;
    subject : Text;
    body : Text;
    lastModified : Common.Timestamp;
  };

  // Zoho Mail API credentials, set once via Settings. The access token is
  // write-only from the outside — no query method ever returns it.
  public type ZohoConfig = {
    var accountId : Text;
    var accessToken : Text;
    var fromAddress : Text;
  };

  public type ZohoStatusView = {
    configured : Bool;
    accountId : Text;
    fromAddress : Text;
  };
};
