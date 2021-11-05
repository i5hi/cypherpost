### BIP32InCypherPost

```
m/purpose'/service'/usecase'/index'/revoke'
``` 

## Overview

Since we are dealing with a social network where messages are viewed by more than one person, we use a e2ee technique similar to that used in Signal Group Chat but with symmetric encrytion via ECDSA shared secrets. Generating RSA keys for asymmetric encryption from ECDSA key sources are extremely expensive. To get around this, we go through a single additional step of encrypting with a shared_secret rather than a public key. With ECDSA, given two parties Alice and Bob, each are able to compute the same shared secret by using their own private key with the other's public key. This shared secret is used to encrypt rather than public keys. Additionally, since we require more than one person to view the message, rather than creating multiple copies of the message per viewer, we encrypt the message with a single `key` and encrypt this `key` for user with their respective shared_secret. 

For each message, the sender creates a new encryption key (primary) with which they encrypt their message. They then use the recievers recipient_public_key with their own recipient_private_key to generate a shared_secret (secondary); with which they encrypt the primary message encryption key. This encrypted primary key can then be shared with the reciever via the server. The receiver can then use their recipient_private_key and the senders recipient_public_key to generate the secondary encryption key i.e. shared_secert on their client and decrypt the primary encryption key, with which they can subsequently decrypt the message. 

This allows the sender to encrypt their message with a single primary key and keep adding more recievers who can view this message by encrypting the primary key with each new receiver's recipient_public_key and sharing it with them to view the message. 

In case the user wishes to revoke a previously trusted users visibility of the message, they must :

- generate a new primary key 
- re-encrypt the message with the new primary 
- update all encrypted primary keys shared with the remaining trusted users so they can view the new message


## Use-Cases

### Recipient Keys: m/128'/0'/0' (Secondary)

*Name of this key is up for change. Maybe unlocking keys? or shared secret keys? Something to imply that these keys are used to generate the shared_secret keys*

The usecase 0' is to maintain a single recipient key pair which is used to compute a shared_secret that will encrypt a specific message encrypting secret i.e. the secondary encryption key.

We use index 0' and revoke 0' as a fixed default and avoid rotation/revocation for convenience.

The xpub is shared with the server for all users to have access too and the xprv is used by each user on the client side to compute the shared_secret. 

```
m/128'/0'/0'/0'/0' will create a keypair used to generate shared_secrets

xpubs will be shared with the server, and xprvs will be used on the client side to compute the shared_secret.
```


### Profile Keys: m/128'/0'/1' (Primary)

The usercase 1' is used to encrypt profile data. 

The xprv (primary) is used to encrypt profile data and the xprv is then encrypted with a shared_secret computed per trustee by using the trustee's recipient_xpub and the trusters recipient_xprv.

We use index 0' for contact information and start with revoke 0'. If a user revokes trust in a user, we reencrypt contact data the xprv at m/0'/1' and reencrypt it with only remaining trusted users in the same manner as previously done. 

Other indexes can be used for encrypting other bio data such as address etc, if required by the application.

```
m/128'/0'/1'/0'/0' will lock the users contact info

m/128'/0'/1'/0'/1' will lock the users contact info if during its lifetime, the user chose to revoke visibility for a certain recipient.

```

### Post Keys: m/128'/0'/2' (Primary)

The usecase 2' is used to encrypt post data.

Similar to profile data we encrypt each post with a new xprv generated at new indexes starting at 0' and reencrypt at new revokation paths if we decide to revoke trust in a user. 

```
m/128'/0'/2'/0'/0' will lock the users first post

m/128'/0'/2'/1'/0' will lock the users second post

m/128'/0'/2'/1'/1' will lock the users second post if during its lifetime, the user chose to revoke visibility for a certain recipient.
```
m/84
m/44
m/49

seed->master key pair (priv,pub)

derive_parent(seed)->(priv,pub)

m/128->(priv,pub)

PROFILE
m/128/0->(priv,pub)
m/128/0/n->(priv,pub)

POSTS
m/128/1->(priv,pub)
m/128/1/1->(priv,pub)

0/2
derivation_scheme: m/0/66
derive_child(0,66)->(priv,pub)

decrypt(cipher_text,priv)
encrypt(plain_text,pub)