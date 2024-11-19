# tests/integration/post-fragments-unauthenticated.hurl
# POST without authentication
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`This is an unauthenticated request!`

# Expect a 401 Unauthorized response
HTTP/1.1 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"
