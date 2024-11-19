# tests/integration/post-fragments-charset.hurl
# POST with Content-Type including charset
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is a fragment with charset!`

# Expect a 201 Created response
HTTP/1.1 201

[Asserts]
jsonpath "$.status" == "ok"

jsonpath "$.fragment.type" == "text/plain; charset=utf-8"

# size of `This is a fragment with charset!` is 32
jsonpath "$.fragment.size" == 32

[Captures]
url: header "Location"

# GET the fragment by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Ensure the returned type matches the POSTed type
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This is a fragment with charset!"
