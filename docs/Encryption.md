# Encryption

Cypherpost uses `AES-256-CBC` with a 16-byte iv.

Clients must always use a hash of their extended private keys as their primary encryption key for posts.

Clients must also post the derivation_scheme used to the server so they can easily locally decrypt their posts.

Clients are expected to keep track of their last used derivation_scheme. This can be done by creating a preference post.

The encryption key is shared with selected recipients via symmetric encryption using ECDSA Shared Secret.

The primary encryption key is encrypted per recipient with a ECDSA Shared Secret calculated with the owners identity_xprv -> ecdsa_privkey and each recipient's identity_xpub -> ecdsa_pubkey. These secondary encrypted keys are named decryption_keys on the servers key store.

Clients must seprately create posts and update the visibility key store.
