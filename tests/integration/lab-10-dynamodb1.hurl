# tests/integration/lab-10-dynamodb.hurl

# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
Content-Type: application/json

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Request body
{ "service": "DynamoDB" }

# 2. Expect HTTP 201 Created
HTTP/1.1 201

[Asserts]
# Validate Location header
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Validate fragment metadata
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# Capture variables
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. GET the fragment info by URL
GET {{fragment1_url}}/info

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.id" == {{fragment1_id}}
jsonpath "$.type" == "application/json"
jsonpath "$.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.created" isString
jsonpath "$.updated" isString

# 4. Authenticated POST with Markdown fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

# Request body
`DynamoDB is **great**.`

# 5. Expect HTTP 201 Created
HTTP/1.1 201

[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# Capture variables
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. GET the second fragment info by URL
GET {{fragment2_url}}/info

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.id" == {{fragment2_id}}
jsonpath "$.type" == "text/markdown"
jsonpath "$.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.created" isString
jsonpath "$.updated" isString

# 7. GET list of fragments
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragments[*]" includes {{fragment1_id}}
jsonpath "$.fragments[*]" includes {{fragment2_id}}

# 8. DELETE the first fragment
DELETE {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

# 9. Expect HTTP 200 OK
HTTP/1.1 200

# 10. GET the deleted fragment by URL
GET {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

# 11. Expect HTTP 404 Not Found
HTTP/1.1 404

# 12. Verify remaining fragments
#GET http://localhost:8080/v1/fragments

#[BasicAuth]
#user1@email.com:password1

#HTTP/1.1 200

#[Asserts]
#jsonpath "$.fragments[*]" != {{fragment1_id}}
#jsonpath "$.fragments[*]" includes {{fragment2_id}}
