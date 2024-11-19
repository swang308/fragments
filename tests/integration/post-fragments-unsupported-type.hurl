# tests/integration/post-fragments-unsupported-type.hurl
# POST with unsupported Content-Type
POST http://localhost:8080/v1/fragments

Content-Type: application/xml

[BasicAuth]
user1@email.com:password1
`<unsupported>This is an unsupported fragment!</unsupported>`

# Expect a 415 Unsupported Media Type response
HTTP/1.1 415

# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" contains "Unsupported Content-Type"
