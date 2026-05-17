import Common "common";

module {
  public type UpdateId = Common.Id;
  public type UpdateStatus = { #pending; #scheduled; #deployed; #failed };

  public type Update = {
    id : UpdateId;
    productId : Nat;
    version : Text;
    releaseNotes : Text;
    size : Nat;
    var status : UpdateStatus;
    scheduledAt : ?Common.Timestamp;
    var deployedAt : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type UpdateView = {
    id : UpdateId;
    productId : Nat;
    version : Text;
    releaseNotes : Text;
    size : Nat;
    status : UpdateStatus;
    scheduledAt : ?Common.Timestamp;
    deployedAt : ?Common.Timestamp;
    createdAt : Common.Timestamp;
  };
};
