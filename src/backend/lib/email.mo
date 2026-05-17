import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/email";

module {

  public func configToView(c : Types.EmailConfig) : Types.EmailConfigView = {
    id = c.id;
    productId = c.productId;
    senderName = c.senderName;
    senderEmail = c.senderEmail;
    bounceEmail = c.bounceEmail;
    isActive = c.isActive;
    createdAt = c.createdAt;
  };

  public func templateToView(t : Types.EmailTemplate) : Types.EmailTemplateView = {
    id = t.id;
    productId = t.productId;
    name = t.name;
    subject = t.subject;
    body = t.body;
    lastModified = t.lastModified;
  };

  public func createConfig(
    configs : List.List<Types.EmailConfig>,
    state : { var nextId : Nat },
    productId : Nat,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
  ) : Types.EmailConfigView {
    let id = state.nextId;
    state.nextId += 1;
    let config : Types.EmailConfig = {
      id;
      productId;
      senderName;
      senderEmail;
      bounceEmail;
      var isActive = true;
      createdAt = Time.now();
    };
    configs.add(config);
    configToView(config);
  };

  public func updateConfig(
    configs : List.List<Types.EmailConfig>,
    id : Nat,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
    isActive : Bool,
  ) {
    configs.mapInPlace(func(item) {
      if (item.id == id) {
        {
          id = item.id;
          productId = item.productId;
          senderName;
          senderEmail;
          bounceEmail;
          var isActive;
          createdAt = item.createdAt;
        };
      } else { item };
    });
  };

  public func deleteConfig(configs : List.List<Types.EmailConfig>, id : Nat) {
    let filtered = configs.filter(func(c) { c.id != id });
    configs.clear();
    configs.append(filtered);
  };

  public func listConfigs(configs : List.List<Types.EmailConfig>, productId : Nat) : [Types.EmailConfigView] {
    configs.filter(func(c) { c.productId == productId })
      .map<Types.EmailConfig, Types.EmailConfigView>(configToView)
      .toArray();
  };

  public func createTemplate(
    templates : List.List<Types.EmailTemplate>,
    state : { var nextId : Nat },
    productId : Nat,
    name : Text,
    subject : Text,
    body : Text,
  ) : Types.EmailTemplateView {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let tmpl : Types.EmailTemplate = {
      id;
      productId;
      name;
      subject;
      var body;
      var lastModified = now;
    };
    templates.add(tmpl);
    templateToView(tmpl);
  };

  public func updateTemplate(
    templates : List.List<Types.EmailTemplate>,
    id : Nat,
    subject : Text,
    body : Text,
  ) {
    let now = Time.now();
    templates.mapInPlace(func(item) {
      if (item.id == id) {
        {
          id = item.id;
          productId = item.productId;
          name = item.name;
          subject;
          var body;
          var lastModified = now;
        };
      } else { item };
    });
  };

  public func deleteTemplate(templates : List.List<Types.EmailTemplate>, id : Nat) {
    let filtered = templates.filter(func(t) { t.id != id });
    templates.clear();
    templates.append(filtered);
  };

  public func listTemplates(templates : List.List<Types.EmailTemplate>, productId : Nat) : [Types.EmailTemplateView] {
    templates.filter(func(t) { t.productId == productId })
      .map<Types.EmailTemplate, Types.EmailTemplateView>(templateToView)
      .toArray();
  };

  public func addEmailLog(
    logs : List.List<Types.EmailLog>,
    state : { var nextId : Nat },
    productId : Nat,
    recipient : Text,
    subject : Text,
    status : Types.EmailStatus,
  ) : Types.EmailLog {
    let id = state.nextId;
    state.nextId += 1;
    let entry : Types.EmailLog = {
      id;
      productId;
      recipient;
      subject;
      status;
      timestamp = Time.now();
    };
    logs.add(entry);
    entry;
  };

  public func listEmailLogs(logs : List.List<Types.EmailLog>, productId : Nat) : [Types.EmailLog] {
    logs.filter(func(l) { l.productId == productId }).toArray();
  };

};
