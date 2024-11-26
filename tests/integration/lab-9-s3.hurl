# Integration Test for AWS S3 Integration in Fragments Server

# 1. Authenticated POST to /v1/fragments
# We are sending a plain text fragment with the body "Hello S3!"

POST http://localhost:8080/v1/fragments

Content-Type: text/plain

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1


`Hello S3!`

# Assertions: Ensure we get a 201 Created response
HTTP/1.1 201
[Asserts]
status == 201

# Capture the Location URL from the response header into a variable named `url`
[Captures]
url: header "Location"

# 2. GET the fragment we just created using the captured URL
# This step ensures that the fragment was successfully created and stored in S3
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1


# Assertions: Ensure the fragment exists and matches expectations
HTTP/1.1 200
[Asserts]
status == 200
header "Content-Type" == "text/plain"
body == "Hello S3!"

# 3. DELETE the fragment using the captured URL
# This ensures that the server can delete the fragment from S3
DELETE {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1


# Assertions: Ensure the fragment was deleted successfully
HTTP/1.1 200
[Asserts]
status == 200

# 4. Attempt to GET the fragment again after deletion
# This ensures that the fragment no longer exists in S3
GET {{url}}

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1


# Assertions: Ensure we get a 404 Not Found response
HTTP/1.1 404
[Asserts]
status == 404
