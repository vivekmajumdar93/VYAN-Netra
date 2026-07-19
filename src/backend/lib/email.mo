import List "mo:core/List";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Error "mo:core/Error";
import Types "../types/email";
import HttpTypes "../types/http";

module {

  public func configToView(c : Types.EmailConfig) : Types.EmailConfigView = {
    id = c.id;
    appId = c.appId;
    senderName = c.senderName;
    senderEmail = c.senderEmail;
    bounceEmail = c.bounceEmail;
    isActive = c.isActive;
    createdAt = c.createdAt;
  };

  public func templateToView(t : Types.EmailTemplate) : Types.EmailTemplateView = {
    id = t.id;
    appId = t.appId;
    name = t.name;
    subject = t.subject;
    body = t.body;
    lastModified = t.lastModified;
  };

  public func createConfig(
    configs : List.List<Types.EmailConfig>,
    state : { var nextId : Nat },
    appId : Text,
    senderName : Text,
    senderEmail : Text,
    bounceEmail : Text,
  ) : Types.EmailConfigView {
    let id = state.nextId;
    state.nextId += 1;
    let config : Types.EmailConfig = {
      id;
      appId;
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
          appId = item.appId;
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

  public func listConfigs(configs : List.List<Types.EmailConfig>, appId : Text) : [Types.EmailConfigView] {
    configs.filter(func(c) { c.appId == appId })
      .map<Types.EmailConfig, Types.EmailConfigView>(configToView)
      .toArray();
  };

  public func createTemplate(
    templates : List.List<Types.EmailTemplate>,
    state : { var nextId : Nat },
    appId : Text,
    name : Text,
    subject : Text,
    body : Text,
  ) : Types.EmailTemplateView {
    let id = state.nextId;
    state.nextId += 1;
    let now = Time.now();
    let tmpl : Types.EmailTemplate = {
      id;
      appId;
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
          appId = item.appId;
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

  public func listTemplates(templates : List.List<Types.EmailTemplate>, appId : Text) : [Types.EmailTemplateView] {
    templates.filter(func(t) { t.appId == appId })
      .map<Types.EmailTemplate, Types.EmailTemplateView>(templateToView)
      .toArray();
  };

  public func addEmailLog(
    logs : List.List<Types.EmailLog>,
    state : { var nextId : Nat },
    appId : Text,
    recipient : Text,
    subject : Text,
    status : Types.EmailStatus,
    detail : Text,
  ) : Types.EmailLog {
    let id = state.nextId;
    state.nextId += 1;
    let entry : Types.EmailLog = {
      id;
      appId;
      recipient;
      subject;
      status;
      detail;
      timestamp = Time.now();
    };
    logs.add(entry);
    entry;
  };

  public func listEmailLogs(logs : List.List<Types.EmailLog>, appId : Text) : [Types.EmailLog] {
    logs.filter(func(l) { l.appId == appId }).toArray();
  };

  // ── Zoho Mail API sending ────────────────────────────────────────────────
  // NOTE: sends real HTTPS outcalls. Not exercisable/testable in a sandbox
  // without live cycles and real Zoho credentials — review carefully and
  // test against a real deployment before relying on it.

  func jsonEscape(t : Text) : Text {
    var out = "";
    for (c in t.chars()) {
      switch c {
        case '"' { out #= "\\\"" };
        case '\\' { out #= "\\\\" };
        case '\n' { out #= "\\n" };
        case '\r' { out #= "\\r" };
        case '\t' { out #= "\\t" };
        case _ { out #= Text.fromChar(c) };
      };
    };
    out;
  };

  public func sendViaZoho(
    transformFn : shared query HttpTypes.TransformArgs -> async HttpTypes.HttpResponse,
    accountId : Text,
    accessToken : Text,
    fromAddress : Text,
    toAddress : Text,
    subject : Text,
    content : Text,
  ) : async (Bool, Text) {
    let ic : actor { http_request : HttpTypes.HttpRequestArgs -> async HttpTypes.HttpResponse } = actor "aaaaa-aa";
    let url = "https://mail.zoho.com/api/accounts/" # accountId # "/messages";
    let jsonBody = "{\"fromAddress\":\"" # jsonEscape(fromAddress)
      # "\",\"toAddress\":\"" # jsonEscape(toAddress)
      # "\",\"subject\":\"" # jsonEscape(subject)
      # "\",\"content\":\"" # jsonEscape(content) # "\"}";
    let request : HttpTypes.HttpRequestArgs = {
      url;
      max_response_bytes = ?(10_000 : Nat64);
      method = #post;
      headers = [
        { name = "Authorization"; value = "Zoho-oauthtoken " # accessToken },
        { name = "Content-Type"; value = "application/json" },
      ];
      body = ?Text.encodeUtf8(jsonBody);
      transform = ?{ function = transformFn; context = Blob.fromArray([]) };
      is_replicated = ?true;
    };
    try {
      let response = await (with cycles = 50_000_000_000) ic.http_request(request);
      if (response.status >= 200 and response.status < 300) {
        (true, "OK");
      } else {
        (false, "Zoho responded with HTTP " # debug_show (response.status));
      };
    } catch (e) {
      (false, "Outcall failed: " # Error.message(e));
    };
  };

};
