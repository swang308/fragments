# tests/integration/post-fragments-unauthenticated.hurl
# POST without authentication
POST http://localhost:8080/v1/fragments

# Sending a plain text fragment
Content-Type: text/plain

# Body of the request goes in ```...``` when it's a string
`This is an unauthenticated request!`

# Expect a 401 Unauthorized response
HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
