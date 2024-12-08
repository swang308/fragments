# tests/integration/404.hurl

# Test: No page found
# Description: Ensure that a request to a non-existent route returns a 404 response with the expected JSON error structure.

GET http://localhost:8080/no-such-route

# Expected HTTP status
HTTP/1.1 404

# Response assertions
[Asserts]
# Assert the response has a status of "error"
jsonpath "$.status" == "error"

# Assert the error code is 404
jsonpath "$.error.code" == 404

# Assert the error message is a string and matches "not found"
jsonpath "$.error.message" isString
jsonpath "$.error.message" == "not found"
