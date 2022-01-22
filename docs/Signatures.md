# Signatures

Cypherpost uses schnorr pubkeys and signatures.

## Request

Requests must be signed with the identity public key as authentication for all requests.

The message being signed must follow the following format: (values separated by white space)

```
"$method $resource $json_stringified_body $nonce"

Example:
"POST /api/v2/profile {"cypher_json":"c5275754b234d923b3e3f249a4de4cb6:1kyab9UbHNtO96Z6p0DsPj/Lb5MsdnyTzaWSf8dl/K4EwNG7YF7rhK5OL0kchxcaQhhOyly7nqiAzlmhTyBIaGeLaiFlOjyttrJF9RjrLebz0Kox0Wn55BwA08DLgHuhUuMMA0K+35aqFqLECBxnSw==","derivation_scheme":"m/1h/0h/0h"} 1640016727757"
```

The nonce used can be any random string just to create enough entropy to prevent reusing signatures.

The following headers must be included in every request:

```
x-client-xpub: string
x-nonce
x-client-signature: string
```
## Badges

Assigning badges requires the client to provide an additional signature as part of the request body along with a different nonce used.

This allows all users to verify the issuance of badges among each other with the GET badges resource (which will include necessary values to verify the signature).

These signatures must follow the following format: (values separated by colon)

```
"$from:$to:$badge_type:$nonce"

Example: 
"xpub6GgUfU6vTzJ39kYofmA8EmkboBNxsET8YNEpUBkQeZSSeWjricbVQGr1nguh1bkkVrMkPySn292QksZeNjMVS4oZYPrSFj6GDppV1hB5Dpk:xpub6FdGhaAVAtckACFK6rSSoHrJSbnoCaazDYnYU8xo8LM6LUxK3sqous5Lbo1wRpyinn7VjVE8euRTW5tzYqrZ53PGDKbYPHw3SdrFcJQREzF:Trusted:1640016946571"
```

## Identities

When a user choses an identity, the server signs the following message to confirm their identity on cypherpost.

The preimage to the hashed message which is signed by the server is as follows:

```
"cypherpost:$username:$pubkey:$timestamp"

```

Cypherpost's pubkey to verify identities can be found on the cypherpost.io website or by using the API GET global/pubkey resource.