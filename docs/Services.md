# Services

Cypherpost provides 4 core services:

## Identity

Issues pubkeys a human readable alias to build a network.

## Badges

Facilitates issuance of specific reputational tokens between users.

The value of badges are subjective. 

## Posts

Allows posting arbitraty encrypted JSON Strings to support any client-side application data storage requirements.

Example custom use cases of cypher_json (with possible Visibility options):

- App Preferences (Only owner)
- Profile Bio (Trusted users)
- Advertisements (Selected audience)
- Wallet Descriptor Backups (Only owner)
- Multi-Sig Public-Only Descriptor Backups (Multi-sig participants)
- Any other sensitive data backup (Only owner/Co-owners)

## Keys (Visibility)

Stores encrypted decryption keys for each selected reciepient per post. This allows selective visibility over posts.

<b> By default, posts are only visible to the owner</b>. Keys to decrypt posts must be shared with the server separately.
