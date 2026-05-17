import Common "common";

module {
  public type IssueId = Common.Id;
  public type IssueSeverity = { #critical; #high; #medium; #low };
  public type IssueStatus = { #open; #in_progress; #resolved };

  public type Issue = {
    id : IssueId;
    title : Text;
    description : Text;
    severity : IssueSeverity;
    var status : IssueStatus;
    productId : Nat;
    var assignedTo : ?Nat;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type IssueView = {
    id : IssueId;
    title : Text;
    description : Text;
    severity : IssueSeverity;
    status : IssueStatus;
    productId : Nat;
    assignedTo : ?Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type IssueComment = {
    id : Common.Id;
    issueId : IssueId;
    content : Text;
    authorId : Nat;
    timestamp : Common.Timestamp;
  };
};
