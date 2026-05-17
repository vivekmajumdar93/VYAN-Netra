import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/updates";

module {

  public func toView(u : Types.Update) : Types.UpdateView = {
    id = u.id;
    productId = u.productId;
    version = u.version;
    releaseNotes = u.releaseNotes;
    size = u.size;
    status = u.status;
    scheduledAt = u.scheduledAt;
    deployedAt = u.deployedAt;
    createdAt = u.createdAt;
  };

  public func create(
    updates : List.List<Types.Update>,
    state : { var nextId : Nat },
    productId : Nat,
    version : Text,
    releaseNotes : Text,
    size : Nat,
  ) : Types.UpdateView {
    let id = state.nextId;
    state.nextId += 1;
    let upd : Types.Update = {
      id;
      productId;
      version;
      releaseNotes;
      size;
      var status = #pending;
      scheduledAt = null;
      var deployedAt = null;
      createdAt = Time.now();
    };
    updates.add(upd);
    toView(upd);
  };

  public func schedule(updates : List.List<Types.Update>, id : Nat, scheduledAt : Time.Time) {
    switch (updates.find(func(u) { u.id == id })) {
      case (?u) {
        u.status := #scheduled;
        updates.mapInPlace(func(item) {
          if (item.id == id) {
            {
              id = item.id;
              productId = item.productId;
              version = item.version;
              releaseNotes = item.releaseNotes;
              size = item.size;
              var status = item.status;
              scheduledAt = ?scheduledAt;
              var deployedAt = item.deployedAt;
              createdAt = item.createdAt;
            }
          } else { item };
        });
      };
      case null Runtime.trap("Update not found");
    };
  };

  public func markDeployed(updates : List.List<Types.Update>, id : Nat) {
    switch (updates.find(func(u) { u.id == id })) {
      case (?u) {
        u.status := #deployed;
        u.deployedAt := ?Time.now();
      };
      case null Runtime.trap("Update not found");
    };
  };

  public func listByProduct(updates : List.List<Types.Update>, productId : Nat) : [Types.UpdateView] {
    updates.filter(func(u) { u.productId == productId })
      .map<Types.Update, Types.UpdateView>(toView)
      .toArray();
  };

  public func listAll(updates : List.List<Types.Update>) : [Types.UpdateView] {
    updates.map<Types.Update, Types.UpdateView>(toView).toArray();
  };

};
