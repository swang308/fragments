# tests/integration/lab-10-dynamodb.hurl

# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a application json fragment
Content-Type: application/json

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
{ "service": "DynamoDB" }

# 2. We expect to get back an HTTP 201
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# Capture the Location URL into variables
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# 3. Try to GET the fragment we just posted by its URL
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

# 4. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments

# We're sending a application json fragment
Content-Type: text/markdown

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
`DynamoDB is **great**.`

# 5. We expect to get back an HTTP 201
HTTP/1.1 201

# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"

# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 6. Try to GET the fragment we just posted by its URL
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

# 7. Get list of fragments by Authenticated GET to /v1/fragments
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Assert that the fragments array contains the two ids we captured earlier
[Asserts]
jsonpath "$.fragments[*]" includes {{fragment1_id}}
jsonpath "$.fragments[*]" includes {{fragment2_id}}

# 8. DELETE the first fragment
DELETE {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

# 9. We expect to get back an HTTP 200
HTTP/1.1 200

# 10. GET the first fragment again using url captured above
GET {{fragment1_url}}

[BasicAuth]
user1@email.com:password1

# 11. We expect to get back an HTTP 500
HTTP/1.1 500

# 12. Get all of the fragments for the same authorized user
GET http://localhost:8080/v1/fragments

[BasicAuth]
user1@email.com:password1

# We expect to get back an HTTP 200
HTTP/1.1 200

# Assert that the fragments array contains the two ids we captured earlier
[Asserts]
jsonpath "$.fragments[*]" != {{fragment1_id}}
jsonpath "$.fragments[*]" includes {{fragment2_id}} 
