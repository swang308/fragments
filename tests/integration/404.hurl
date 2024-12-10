# Health Check Test
GET http://localhost:8080/random

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "error"
# We expect to get back a JSON response with { "code": 404}
jsonpath "$.error.code" == 404
# We expect to get back a JSON response with { "message": "not found"} which is a string
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "not found"
