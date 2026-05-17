import Time "mo:core/Time";

module {
  public type Timestamp = Time.Time;
  public type Id = Nat;

  public type Severity = { #critical; #high; #medium; #low; #warning; #info };
  public type StatusActive = { #active; #suspended };
};
