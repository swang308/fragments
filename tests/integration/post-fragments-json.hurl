# tests/integration/post-fragments-json.hurl
# POST a JSON fragment
POST http://localhost:8080/v1/fragments

# Content-Type of the request body as application/json
Content-Type: application/json

[BasicAuth]
user1@email.com:password1
{
  "name": "example",
  "type": "json",
  "value": 42
}

# Expect a 201 Created response
HTTP/1.1 201

# Assertions to validate the response JSON
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 56

# Captures the Location header from the response and stores it in the variable url.
[Captures]
url: header "Location"

# GET the JSON fragment by its URL
GET {{url}}

[BasicAuth]
user1@email.com:password1

# Ensure the response matches the POSTed JSON
HTTP/1.1 200
Content-Type: application/json

[Asserts]
jsonpath "$.name" == "example"
jsonpath "$.type" == "json"
jsonpath "$.value" == 42
