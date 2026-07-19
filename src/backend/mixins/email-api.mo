import List "mo:core/List";
import EmailLib "../lib/email";
import Types "../types/email";
import HttpTypes "../types/http";

mixin (
  emailConfigs : List.List<Types.EmailConfig>,
  emailLogs : List.List<Types.EmailLog>,
  emailTemplates : List.List<Types.EmailTemplate>,
  emailConfigState : { var nextId : Nat },
  emailLogState : { var nextId : Nat },
  emailTemplateState : { var nextId : Nat },
  zoho : Types.ZohoConfig,
) {

  public func createEmailConfig(
    appId : Text,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
  ) : async Types.EmailConfigView {
    EmailLib.createConfig(emailConfigs, emailConfigState, appId, senderName, senderEmail, bounceEmail);
  };

  public func updateEmailConfig(
    id : Nat,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
    isActive : Bool,
  ) : async () {
    EmailLib.updateConfig(emailConfigs, id, senderName, senderEmail, bounceEmail, isActive);
  };

  public func deleteEmailConfig(id : Nat) : async () {
    EmailLib.deleteConfig(emailConfigs, id);
  };

  public query func listEmailConfigs(appId : Text) : async [Types.EmailConfigView] {
    EmailLib.listConfigs(emailConfigs, appId);
  };

  public func createEmailTemplate(
    appId : Text,
    name : Text,
    subject : Text,
    body : Text,
  ) : async Types.EmailTemplateView {
    EmailLib.createTemplate(emailTemplates, emailTemplateState, appId, name, subject, body);
  };

  public func updateEmailTemplate(id : Nat, subject : Text, body : Text) : async () {
    EmailLib.updateTemplate(emailTemplates, id, subject, body);
  };

  public func deleteEmailTemplate(id : Nat) : async () {
    EmailLib.deleteTemplate(emailTemplates, id);
  };

  public query func listEmailTemplates(appId : Text) : async [Types.EmailTemplateView] {
    EmailLib.listTemplates(emailTemplates, appId);
  };

  public query func listEmailLogs(appId : Text) : async [Types.EmailLog] {
    EmailLib.listEmailLogs(emailLogs, appId);
  };

  // ── Zoho credentials (write-only — never returned by a query) ──────────
  public func setZohoConfig(accountId : Text, accessToken : Text, fromAddress : Text) : async () {
    zoho.accountId := accountId;
    zoho.accessToken := accessToken;
    zoho.fromAddress := fromAddress;
  };

  public query func getZohoStatus() : async Types.ZohoStatusView {
    {
      configured = zoho.accountId != "" and zoho.accessToken != "";
      accountId = zoho.accountId;
      fromAddress = zoho.fromAddress;
    };
  };

  // Required by the IC http_request API: a query method reference the
  // boundary layer uses to normalize/certify the outcall response.
  public query func transformHttpResponse(args : HttpTypes.TransformArgs) : async HttpTypes.HttpResponse {
    { status = args.response.status; headers = []; body = args.response.body };
  };

  // Sends one email now via Zoho and logs the real result. Recipient
  // targeting (which app/users/combination) is resolved by the caller
  // (frontend) into a list of addresses; this sends to one address at a
  // time so a partial failure doesn't lose the rest of the batch.
  public func sendEmailNow(appId : Text, recipient : Text, subject : Text, body : Text) : async Types.EmailLog {
    if (zoho.accountId == "" or zoho.accessToken == "") {
      return EmailLib.addEmailLog(emailLogs, emailLogState, appId, recipient, subject, #failed, "Zoho is not configured in Settings");
    };
    let (ok, detail) = await EmailLib.sendViaZoho(
      transformHttpResponse,
      zoho.accountId,
      zoho.accessToken,
      zoho.fromAddress,
      recipient,
      subject,
      body,
    );
    let status = if (ok) #sent else #failed;
    EmailLib.addEmailLog(emailLogs, emailLogState, appId, recipient, subject, status, detail);
  };

  public func sendEmailBatch(appId : Text, recipients : [Text], subject : Text, body : Text) : async [Types.EmailLog] {
    var results : [Types.EmailLog] = [];
    for (recipient in recipients.vals()) {
      let log = await sendEmailNow(appId, recipient, subject, body);
      results := results # [log];
    };
    results;
  };

};
