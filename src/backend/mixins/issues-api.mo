import List "mo:core/List";
import IssuesLib "../lib/issues";
import Types "../types/issues";

mixin (
  issues : List.List<Types.Issue>,
  comments : List.List<Types.IssueComment>,
  issueState : { var nextId : Nat },
  commentState : { var nextId : Nat },
) {

  public func createIssue(
    title : Text,
    description : Text,
    severity : Types.IssueSeverity,
    appId : Text,
    assignedTo : ?Nat,
  ) : async Types.IssueView {
    IssuesLib.create(issues, issueState, title, description, severity, appId, assignedTo);
  };

  public func updateIssue(
    id : Nat,
    title : Text,
    description : Text,
    severity : Types.IssueSeverity,
    status : Types.IssueStatus,
    assignedTo : ?Nat,
  ) : async () {
    IssuesLib.update(issues, id, title, description, severity, status, assignedTo);
  };

  public func resolveIssue(id : Nat) : async () {
    IssuesLib.resolve(issues, id);
  };

  public func addIssueComment(
    issueId : Nat,
    content : Text,
    authorId : Nat,
  ) : async Types.IssueComment {
    IssuesLib.addComment(comments, commentState, issueId, content, authorId);
  };

  public query func listIssues(
    appId : ?Text,
    status : ?Types.IssueStatus,
    severity : ?Types.IssueSeverity,
  ) : async [Types.IssueView] {
    IssuesLib.listFiltered(issues, appId, status, severity);
  };

  public query func listIssueComments(issueId : Nat) : async [Types.IssueComment] {
    IssuesLib.listComments(comments, issueId);
  };

};
