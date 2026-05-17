import Common "common";

module {
  public type EmailConfigId = Common.Id;
  public type EmailStatus = { #sent; #failed; #bounced };

  public type EmailConfig = {
    id : EmailConfigId;
    productId : Nat;
    senderName : Text;
    senderEmail : Text;
    bounceEmail : Text;
    var isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type EmailConfigView = {
    id : EmailConfigId;
    productId : Nat;
    senderName : Text;
    senderEmail : Text;
    bounceEmail : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type EmailLog = {
    id : Common.Id;
    productId : Nat;
    recipient : Text;
    subject : Text;
    status : EmailStatus;
    timestamp : Common.Timestamp;
  };

  public type EmailTemplate = {
    id : Common.Id;
    productId : Nat;
    name : Text;
    subject : Text;
    var body : Text;
    var lastModified : Common.Timestamp;
  };

  public type EmailTemplateView = {
    id : Common.Id;
    productId : Nat;
    name : Text;
    subject : Text;
    body : Text;
    lastModified : Common.Timestamp;
  };
};
