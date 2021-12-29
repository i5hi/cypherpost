# cypherpost-client

## a portable e2ee protocol specification

`End-2-End-Encryption` requires storage of a key by each client on their local device which is used to encrypt/decrypt all communication between other users; usually being transmitted through a server. `Encryption` ensures that only the chosen recipient can view the message i.e. maintaining integrity of messages, and `End-2-End` further ensures that only the required recipients are ever in control of the keys i.e. maintaining integrity of identity.

</b>Keys are difficult to store and port in a safe manner.</b> They are usually represented as large byte arrays, or long strings; which are not easy to remember. Additionally,  their storage on digital devices must be handled with several considerations to ensure integrity. `BIP39` uses mnemonic words to address this issue. 12 or 24 mnemonic words from a dictionary provides sufficient entropy such that keys are strong as well as portable. `BIP32` uses key derivation schemes to allow generation of an infinite number of child keys, given a parent key.

`BIP32` lays out a standard for key derivation path as follows: `m/purpose'/network'/account'/change/index`.

Bitcoin uses keys for the purpose of payments at m/44', m/49' and m/84'. 
Alternative purposes outside those of payments can also be used within the same standard by using a different `purpose` path; as has been done by lnurl-auth, which uses the path `m/138'` for the purpose of authentication.

## Format 

```
We propose the use of a new purpose path `m/128'` for the purpose of portable end-to-end encryption.
```

Subsequent paths can be used as per a service requirement, however we further recommend a path standard as follows:

```
m/purpose'/service'/usecase'/index'/revoke'
``` 

All paths are hardened since we are primarily deriving private keys for the purpose of encryption.


## Notes

Implementation of known e2ee protocols need not change, this proposal only suggests an alternative key generation scheme; one that is easy to port and recover accounts on multiple devices without the need to always have the root key stored on a `master` device; like a mobile phone, and subsequent scanning of QR codes on every new device, using the `master` device to recover accounts and so on.

Servers can hold derivation schemes that are relavant to a users account to support account recovery. Menmonics and their subsequent seed/root key is never stored on any device; only the derived child at m/128' is stored on the device (either browser of mobile) and ideally encrypted with local PIN or password to protect from compromised devices. This new parent key can then be used to further derive keys for various other use-cases within the application.


