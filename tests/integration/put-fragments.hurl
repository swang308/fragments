# tests/integration/put-fragments.hurl

# Test: Update a fragment with PUT
# Description: Verifies creating a fragment, retrieving it, updating it, and ensuring the updates are reflected.

# 1. POST a new fragment
POST http://localhost:8080/v1/fragments

# Headers
Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Fragment content
`This is a fragment!`

# Expected HTTP response
HTTP/1.1 201

# Assertions for the response
[Asserts]
# Verify the Location header contains the fragment URL
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"

# Check the response status is "ok"
jsonpath "$.status" == "ok"

# Validate the fragment ID is a valid UUID
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

# Ensure the ownerId is a valid hex-encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

# Verify created and updated fields are strings
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# Check that the type is "text/plain"
jsonpath "$.fragment.type" == "text/plain"

# Verify the fragment size matches the length of the content
jsonpath "$.fragment.size" == 19

# Capture the Location URL for future requests
[Captures]
url: header "Location"

# 2. GET the fragment by its URL
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Expected HTTP response
HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19

# Assertions for the GET response
[Asserts]
# Verify the fragment content matches the original content
body == "This is a fragment!"

# 3. PUT to update the fragment by its URL
PUT {{url}}

# Headers
Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Updated fragment content
`This is the updated fragment body!`

# Expected HTTP response
HTTP/1.1 200

# Assertions for the updated fragment
[Asserts]
# Verify the updated fragment size
jsonpath "$.fragment.size" == 32
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.updated" != jsonpath "$.fragment.created"
