# tests/integration/post-fragments-image.hurl

# Test: Authenticated POST to /v1/fragments
# Description: Verifies uploading an image fragment, retrieving it, deleting it, and confirming deletion.

# 1. POST an image fragment
POST http://localhost:8080/v1/fragments

# Headers
Content-Type: image/png

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Specify the location of the image file to POST
file, test.png;

# Expected HTTP response
HTTP/1.1 201

# Assertions for the response
[Asserts]
# Verify the Location header contains the fragment URL
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"

# Check that the status is "ok"
jsonpath "$.status" == "ok"

# Validate the fragment ID is a valid UUID
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"

# Ensure the ownerId is a valid hex-encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"

# Verify created and updated fields are strings
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString

# Verify the type matches the uploaded image type
jsonpath "$.fragment.type" == "image/png"

# Capture the Location URL into a variable for future requests
[Captures]
url: header "Location"

# 2. GET the fragment by its URL
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Expected HTTP response
HTTP/1.1 200
Content-Type: image/png
Content-Length: 3533941

# 3. DELETE the fragment by its URL
DELETE {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Expected HTTP response
HTTP/1.1 200

# 4. Confirm the fragment is deleted by attempting to GET it again
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Expected HTTP response
HTTP/1.1 404
