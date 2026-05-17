import List "mo:core/List";
import Time "mo:core/Time";
import UpdatesLib "../lib/updates";
import Types "../types/updates";

mixin (
  updates : List.List<Types.Update>,
  updateState : { var nextId : Nat },
) {

  public func createUpdate(
    productId : Nat,
    version : Text,
    releaseNotes : Text,
    size : Nat,
  ) : async Types.UpdateView {
    UpdatesLib.create(updates, updateState, productId, version, releaseNotes, size);
  };

  public func scheduleUpdate(id : Nat, scheduledAt : Time.Time) : async () {
    UpdatesLib.schedule(updates, id, scheduledAt);
  };

  public func markUpdateDeployed(id : Nat) : async () {
    UpdatesLib.markDeployed(updates, id);
  };

  public query func listProductUpdates(productId : Nat) : async [Types.UpdateView] {
    UpdatesLib.listByProduct(updates, productId);
  };

  public query func listAllUpdates() : async [Types.UpdateView] {
    UpdatesLib.listAll(updates);
  };

};
