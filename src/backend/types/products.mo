import Common "common";

module {
  public type ProductId = Common.Id;
  public type ProductStatus = { #connected; #disconnected };

  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    code : Text; // 6-digit alphanumeric
    var status : ProductStatus;
    registeredAt : Common.Timestamp;
    var lastSync : Common.Timestamp;
  };

  public type ProductView = {
    id : ProductId;
    name : Text;
    description : Text;
    code : Text;
    status : ProductStatus;
    registeredAt : Common.Timestamp;
    lastSync : Common.Timestamp;
  };
};
