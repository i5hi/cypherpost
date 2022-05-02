# Key Management

Cypherpost uses a standard similar to BIP32 for client side key management.


### m/purpose'/service'/service'/index'/revoke'


## Overview

Since we are dealing with a private social network; messages are default only visible to the owner. To begin selectively disclosing your post, we use a e2ee with symmetric encrytion via ECDSA Shared Secrets. Generating RSA keys for asymmetric encryption from ECDSA key sources are extremely expensive. With ECDSA, given two parties Alice and Bob, each are able to compute the same shared secret by using their own private key with the other's public key. This shared secret is used per recipient, to encrypt a posts decryption key.

For each post, the owner creates a new encryption key (primary) with which they encrypt their post. They then use their first reciepients identity_pubkey with their own identity_privkey to generate a shared_secret (secondary). The secondary key is used to encrypt the primary. This encrypted primary key can then be shared with the recipient via the server. The receipient can then use their identity_privkey and the senders identity_pubkey to generate the secondary encryption key i.e. shared_secert on their client and decrypt the primary encryption key, with which they can subsequently decrypt the post. 

This allows the sender to encrypt their message with a single primary key and keep adding more recievers who can view this message by encrypting the primary key with each new receiver's identity_pubkey based shared_secret and sharing it with them to view the message. 

## NOTE ON REVOKE
It must be assumed that once a post is seen, it cannot verifiably be unseen.

In case the user wishes to revoke a previously trusted users visibility of a post, they must :

- copy & delete old post into a new post
- generate a new primary key for copied post
- re-encrypt the copied post with the new primary 
- update all secondary keys shared with the remaining trusted users so they can view the new post


## Service Path ()

### Identity Keys: m/128'/0'/0'

The service 0 is to maintain a single identity key pair which is used to compute a shared_secret that will encrypt a specific message encrypting secret i.e. the secondary encryption key.

The pubkey is shared with the server for all users to have access to while the xprv is never shared and only used on the client side to compute the shared_secret and sign messages.

Since no rotation is required here, we do not use index and revoke.

```
m/128'/0'/0' will create a keypair which the pubkey will be used as identity and xprv used to locally to generate shared_secrets and sign

```

### Profile Keys: m/128'/0'/1'

The usercase 1 is used to encrypt profile data. 

The xprv (primary) is used to encrypt profile data and the xprv is then encrypted with a shared_secret computed per trustee by using the trustee's identity_xpub and the trusters identity_xprv.

We use index 0' for bio which stays fixed and rotate keys at the revoke path starting with 0'. If a user revokes trust in a user, we reencrypt contact data the xprv at revoke 1' and reencrypt it with only remaining trusted users in the same manner as previously done. 

Other indexes can be used for encrypting other bio data such as address etc, if required by the application.

```
m/128'/0'/1'/0'/0' will lock the users contact info

m/128'/0'/1'/0'/1' will lock the users contact info if during its lifetime, the user chose to revoke visibility for a certain recipient.

```

### Preference Keys: m/128'/0'/2'

The service 2 is used to encrypt preference data.

This is only for the owner's visibility and is not shared and therefore does not require and index and revoke derivation.

```
m/128'/0'/2' will lock the users preference

```

### Trade Keys: m/128'/0'/3'

The service 3 is used to encrypt trade data.

Similar to profile data we encrypt each trade with a new xprv generated at new indexes starting at 0' and reencrypt at new revokation paths if we decide to revoke trust in a user. 

```
m/128'/0'/3'/0'/0' will lock the users first trade post

m/128'/0'/3'/1'/0' will lock the users second trade post

m/128'/0'/3'/1'/1' will lock the users second trade post if during its lifetime, the user chose to revoke visibility for a certain recipient.
```


