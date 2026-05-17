import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/products";

module {

  public func toView(p : Types.Product) : Types.ProductView = {
    id = p.id;
    name = p.name;
    description = p.description;
    code = p.code;
    status = p.status;
    registeredAt = p.registeredAt;
    lastSync = p.lastSync;
  };

  public func register(
    products : List.List<Types.Product>,
    state : { var nextId : Nat },
    name : Text,
    description : Text,
    code : Text,
  ) : Types.ProductView {
    // Validate code length = 6
    if (code.size() != 6) Runtime.trap("Code must be exactly 6 alphanumeric characters");
    // Check duplicate code
    switch (products.find(func(p) { p.code == code })) {
      case (?_) Runtime.trap("Product code already registered");
      case null {};
    };
    let now = Time.now();
    let id = state.nextId;
    state.nextId += 1;
    let product : Types.Product = {
      id;
      name;
      description;
      code;
      var status = #connected;
      registeredAt = now;
      var lastSync = now;
    };
    products.add(product);
    toView(product);
  };

  public func list(products : List.List<Types.Product>) : [Types.ProductView] {
    products.map<Types.Product, Types.ProductView>(toView).toArray();
  };

  public func getById(products : List.List<Types.Product>, id : Nat) : ?Types.ProductView {
    switch (products.find(func(p) { p.id == id })) {
      case (?p) ?toView(p);
      case null null;
    };
  };

  public func setStatus(products : List.List<Types.Product>, id : Nat, status : Types.ProductStatus) {
    switch (products.find(func(p) { p.id == id })) {
      case (?p) { p.status := status };
      case null Runtime.trap("Product not found");
    };
  };

  public func updateMeta(
    products : List.List<Types.Product>,
    id : Nat,
    name : Text,
    description : Text,
  ) {
    switch (products.find(func(p) { p.id == id })) {
      case (?_) {
        products.mapInPlace(func(p) {
          if (p.id == id) {
            {
              id = p.id;
              name;
              description;
              code = p.code;
              var status = p.status;
              registeredAt = p.registeredAt;
              var lastSync = p.lastSync;
            };
          } else { p };
        });
      };
      case null Runtime.trap("Product not found");
    };
  };

  public func syncNow(products : List.List<Types.Product>, id : Nat) {
    switch (products.find(func(p) { p.id == id })) {
      case (?p) { p.lastSync := Time.now() };
      case null Runtime.trap("Product not found");
    };
  };

};
