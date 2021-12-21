# Services

Cypherpost currently supports 4 services:

- Identity
- Profile
- Preferences
- Posts

All services except identity, store encrypted data in the form of `cypher_json`.

This allows clients to support their own data models for these use cases.

The cypherpost reference client supports the data models defined in design/all.wsd as:

- ProfileDetail
- PreferenceDetail
- PostDetail

Refer to ./KeyManagement.md for how to manage keys for each service.




