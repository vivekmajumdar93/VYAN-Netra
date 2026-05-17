import List "mo:core/List";
import ProductsLib "../lib/products";
import Types "../types/products";

mixin (
  products : List.List<Types.Product>,
  productState : { var nextId : Nat },
) {

  public func registerProduct(name : Text, description : Text, code : Text) : async Types.ProductView {
    ProductsLib.register(products, productState, name, description, code);
  };

  public query func listProducts() : async [Types.ProductView] {
    ProductsLib.list(products);
  };

  public query func getProduct(id : Nat) : async ?Types.ProductView {
    ProductsLib.getById(products, id);
  };

  public func disconnectProduct(id : Nat) : async () {
    ProductsLib.setStatus(products, id, #disconnected);
  };

  public func reconnectProduct(id : Nat) : async () {
    ProductsLib.setStatus(products, id, #connected);
  };

  public func updateProductMeta(id : Nat, name : Text, description : Text) : async () {
    ProductsLib.updateMeta(products, id, name, description);
  };

  public func syncProduct(id : Nat) : async () {
    ProductsLib.syncNow(products, id);
  };

};
