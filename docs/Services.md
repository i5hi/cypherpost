# Services

Cypherpost currently supports 4 services:

## Identity
This is where users register a platform specific identity as 

```
username,
xpub 
```

#### The following services store data as cypher_json.

All services except identity, store encrypted data in the form of `cypher_json`.

This allows clients to support their own data models for different use cases.

The cypherpost reference client supports the data models defined in design/all.wsd as:

- ProfileDetail
- PreferenceDetail
- PostDetail


*Client's are free to chose the contents of their cypher_json and clients should be able to handle different types over a string interface.*

## Profile

Profile data is only re-enrypted when visibility changes. 

The standard derivation_scheme update is to increment the `revoke` path only.

`index` path stays the same at 0'.

The reference client uses the following JSON
```
{
  nickname: string,
  status: string,
  contact: string
}
```


## Preferences

Preference keys do not require indexing or revoking, since they are entirely personal.

Preferences store any data the client would require to customize their client application as well as filter data recieved from the server.

The reference client uses the following JSON
```
{
  mute_list: string,
  last_preference_path: string,
  last_profile_path: string,
  last_posts_path: string
}
```
## Posts

The standard derivation_scheme update is to increment the `index` path only.

*Posts can only be created and destroyed. They cannot be updated.*

The `revoke` path stays the same at 0'. 

Visiility must be set per post and cannot be updated.

The reference client uses the following JSON
```
{
  message : string,
  network : string,
  type : string,
  minimum : string,
  maximum : string,
  fiat_currency : string,
  payment_method : string,
  rate_type : string,
  fixed_rate : string,
  reference_exchange : string,
  reference_percent : string
}
```

Refer to ./KeyManagement.md for how to manage keys for each service.




