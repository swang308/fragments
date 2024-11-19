# tests/integration/post-fragments-charset.hurl

# POST with Content-Type including charset
POST http://localhost:8080/v1/fragments

# Sedning a `text/plain; charset=utf-8` fragment
Content-Type: text/plain; charset=utf-8

# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1

# Body of the request goes in ```...``` when it's a string
`This is a fragment with charset!`

# 1. Expect a 201 Created response
HTTP/1.1 201

# Assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "ok"

jsonpath "$.fragment.type" == "text/plain; charset=utf-8"

# size of `This is a fragment with charset!` is 32
jsonpath "$.fragment.size" == 32

# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# 2. GET the fragment by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Ensure the returned type matches the POSTed type
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This is a fragment with charset!"
