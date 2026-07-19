import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/issues";

module {

  public func toView(i : Types.Issue) : Types.IssueView = {
    id = i.id;
    title = i.title;
    description = i.description;
    severity = i.severity;
    status = i.status;
    appId = i.appId;
    assignedTo = i.assignedTo;
    createdAt = i.createdAt;
    updatedAt = i.updatedAt;
  };

  public func create(
    issues : List.List<Types.Issue>,
    state : { var nextId : Nat },
    title : Text,
    description : Text,
    severity : Types.IssueSeverity,
    appId : Text,
    assignedTo : ?Nat,
  ) : Types.IssueView {
    let now = Time.now();
    let id = state.nextId;
    state.nextId += 1;
    let issue : Types.Issue = {
      id;
      title;
      description;
      severity;
      var status = #open;
      appId;
      var assignedTo;
      createdAt = now;
      var updatedAt = now;
    };
    issues.add(issue);
    toView(issue);
  };

  public func update(
    issues : List.List<Types.Issue>,
    id : Nat,
    title : Text,
    description : Text,
    severity : Types.IssueSeverity,
    status : Types.IssueStatus,
    assignedTo : ?Nat,
  ) {
    let now = Time.now();
    issues.mapInPlace(func(item) {
      if (item.id == id) {
        {
          id = item.id;
          title;
          description;
          severity;
          var status;
          appId = item.appId;
          var assignedTo;
          createdAt = item.createdAt;
          var updatedAt = now;
        };
      } else { item };
    });
    switch (issues.find(func(i) { i.id == id })) {
      case (?_) {};
      case null Runtime.trap("Issue not found");
    };
  };

  public func resolve(issues : List.List<Types.Issue>, id : Nat) {
    switch (issues.find(func(i) { i.id == id })) {
      case (?i) {
        i.status := #resolved;
        i.updatedAt := Time.now();
      };
      case null Runtime.trap("Issue not found");
    };
  };

  public func addComment(
    comments : List.List<Types.IssueComment>,
    state : { var nextId : Nat },
    issueId : Nat,
    content : Text,
    authorId : Nat,
  ) : Types.IssueComment {
    let id = state.nextId;
    state.nextId += 1;
    let comment : Types.IssueComment = {
      id;
      issueId;
      content;
      authorId;
      timestamp = Time.now();
    };
    comments.add(comment);
    comment;
  };

  public func listFiltered(
    issues : List.List<Types.Issue>,
    appId : ?Text,
    status : ?Types.IssueStatus,
    severity : ?Types.IssueSeverity,
  ) : [Types.IssueView] {
    issues.filter(func(i) {
      let aMatch = switch (appId) {
        case (?aid) { i.appId == aid };
        case null { true };
      };
      let sMatch = switch (status) {
        case (?st) { i.status == st };
        case null { true };
      };
      let sevMatch = switch (severity) {
        case (?sev) { i.severity == sev };
        case null { true };
      };
      aMatch and sMatch and sevMatch;
    })
    .map<Types.Issue, Types.IssueView>(toView)
    .toArray();
  };

  public func listComments(comments : List.List<Types.IssueComment>, issueId : Nat) : [Types.IssueComment] {
    comments.filter(func(c) { c.issueId == issueId }).toArray();
  };

};
