# Encryption

Cypherpost uses `AES-256-CBC` with a 16-byte IV.

Clients must always use a hash of their extended private keys as their primary encryption key for profile data and posts.

These are shared with selected recipients via symmetric encryption using ECDSA Shared Secret.

The primary encryption key is encrypted per recipient with a ECDSA Shared Secret calculated with the owners identity_xprv -> ecdsa_privkey and each recipient's identity_xpub -> ecdsa_pubkey. These secondary encrypted keys are named decryption_keys on the servers key store.
