import List "mo:core/List";
import EmailLib "../lib/email";
import Types "../types/email";

mixin (
  emailConfigs : List.List<Types.EmailConfig>,
  emailLogs : List.List<Types.EmailLog>,
  emailTemplates : List.List<Types.EmailTemplate>,
  emailConfigState : { var nextId : Nat },
  emailLogState : { var nextId : Nat },
  emailTemplateState : { var nextId : Nat },
) {

  public func createEmailConfig(
    productId : Nat,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
  ) : async Types.EmailConfigView {
    EmailLib.createConfig(emailConfigs, emailConfigState, productId, senderName, senderEmail, bounceEmail);
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

  public query func listEmailConfigs(productId : Nat) : async [Types.EmailConfigView] {
    EmailLib.listConfigs(emailConfigs, productId);
  };

  public func createEmailTemplate(
    productId : Nat,
    name : Text,
    subject : Text,
    body : Text,
  ) : async Types.EmailTemplateView {
    EmailLib.createTemplate(emailTemplates, emailTemplateState, productId, name, subject, body);
  };

  public func updateEmailTemplate(id : Nat, subject : Text, body : Text) : async () {
    EmailLib.updateTemplate(emailTemplates, id, subject, body);
  };

  public func deleteEmailTemplate(id : Nat) : async () {
    EmailLib.deleteTemplate(emailTemplates, id);
  };

  public query func listEmailTemplates(productId : Nat) : async [Types.EmailTemplateView] {
    EmailLib.listTemplates(emailTemplates, productId);
  };

  public func addEmailLog(
    productId : Nat,
    recipient : Text,
    subject : Text,
    status : Types.EmailStatus,
  ) : async Types.EmailLog {
    EmailLib.addEmailLog(emailLogs, emailLogState, productId, recipient, subject, status);
  };

  public query func listEmailLogs(productId : Nat) : async [Types.EmailLog] {
    EmailLib.listEmailLogs(emailLogs, productId);
  };

};
