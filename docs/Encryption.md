# Encryption

Cypherpost uses `AES-256-CBC` with a 16-byte iv.

Clients must always use a hash of their extended private keys as their primary encryption key for profile data and posts.

Clients must also post the derivation_scheme used to the server so they can easily locally decrypt their profile.

*Since posts expire, clients must keep updating the server with their last_used_post_key_path to POST preference.

*THIS IS CRITICAL, to ensure that new posts arent being encrypted with old keys, compromising on forward secrecy.

These are shared with selected recipients via symmetric encryption using ECDSA Shared Secret.

The primary encryption key is encrypted per recipient with a ECDSA Shared Secret calculated with the owners identity_xprv -> ecdsa_privkey and each recipient's identity_xpub -> ecdsa_pubkey. These secondary encrypted keys are named decryption_keys on the servers key store.

Clients must seprately update data and keys per service.

Generally, profile updates can be made without rotating the primary key (ensuring everyone with decryption_keys can continue to view the post) while every new post should be encrypted with a new key, allowing multiple posts with different visibility.