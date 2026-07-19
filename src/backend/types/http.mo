module {
  public type HttpHeader = { name : Text; value : Text };

  public type HttpMethod = { #get; #head; #post };

  public type HttpResponse = {
    status : Nat;
    headers : [HttpHeader];
    body : Blob;
  };

  public type TransformArgs = {
    response : HttpResponse;
    context : Blob;
  };

  public type HttpRequestArgs = {
    url : Text;
    max_response_bytes : ?Nat64;
    method : HttpMethod;
    headers : [HttpHeader];
    body : ?Blob;
    transform : ?{
      function : shared query TransformArgs -> async HttpResponse;
      context : Blob;
    };
    is_replicated : ?Bool;
  };
};
