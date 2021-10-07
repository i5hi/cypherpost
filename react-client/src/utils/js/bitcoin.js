const bip32 = require("bip32");
const bip39 = require("bip39");
const { createECDH, ECDH } = require("crypto");

function generate_mnemonic() {
  return bip39.generateMnemonic();
}

async function seed_root(mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const master_key = bip32.fromSeed(seed);
  return master_key.toBase58();
}

// Store result encrypted in localStorage with sha256(uname:pass)
function derive_parent_128(root_xprv) {
  const master_key = bip32.fromBase58(root_xprv);
  const parent_key = master_key.derivePath("m/128'/0'");
  const extended_keys = {
    xpub: parent_key.neutered().toBase58(),
    xprv: parent_key.toBase58(),
  };
  return extended_keys;
}

// usecase:0 (recipient)
// usecase:1 (profile)
// usecase:2 (posts)

// Store result on login in sessionStorage as plaintext
function derive_parent_usecase(parent_128_xprv, use_case) {
  const parent_key = bip32.fromBase58(parent_128_xprv);
  const child_key = parent_key.deriveHardened(use_case);
  const extended_keys = {
    xpub: child_key.neutered().toBase58(),
    xprv: child_key.toBase58(),
  };
  return extended_keys;
}

function derive_child_indexes(use_case_parent, index, revoke) {
  const parent_key = bip32.fromBase58(use_case_parent);

  const child_key = parent_key.deriveHardened(index).deriveHardened(revoke);
  const extended_keys = {
    xpub: child_key.neutered().toBase58(),
    xprv: child_key.toBase58(),
  };
  return extended_keys;
}

function derive_child(parent, index) {

  const parent_key = bip32.fromBase58(parent);

  const child_key = parent_key.derive(index);
  const extended_keys = {
    xpub: child_key.neutered().toBase58(),
    xprv: child_key.toBase58(),
  };
  return extended_keys;

}
/*
{
  xprv,
  xpub
}
*/

function extract_ecdsa_pair(extended_keys) {
  // const parent_key = bip32.fromBase58(extended_keys.xprv);

  return {
    private_key: bip32.fromBase58(extended_keys.xprv).privateKey.toString("hex"),
    public_key: bip32.fromBase58(extended_keys.xpub).publicKey.toString("hex")
  };
  // return ecdsa_keys;
}

function calculate_shared_secret(local_private_key, remote_public_key) {

  const type = "secp256k1";

  let curve = createECDH(type);

  curve.setPrivateKey(local_private_key, "hex");
  // let cpub = curve.getPublicKey("hex","compressed");

  const shared_secret = curve.computeSecret(remote_public_key, "hex");

  return shared_secret.toString("hex");

}

function deriveSecretKey(privateKey, publicKey) {
  const imported_pub = window.crypto.subtle.importKey(
    'raw',
    hex2Arr(publicKey),
    {
      name: 'ECDH',
      namedCurve: 'P-256'
    },
    true,
    []);

    const imported_priv = window.crypto.subtle.importKey(
      'raw',
      hex2Arr(privateKey),
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      []);

      const type = "secp256k1";

  let curve = createECDH(type);

  curve.setPrivateKey(privateKey, "hex");
  const shared_secret = curve.computeSecret(publicKey, "hex");

  return shared_secret.toString("hex");
}

const hex2Arr = str => {
  if (!str) {
    return new Uint8Array()
  }
  const arr = []
  for (let i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substr(i, 2), 16))
  }
  return new Uint8Array(arr)
}

const buf2Hex = buf => {
  return Array.from(new Uint8Array(buf))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('')
}
module.exports = {
  generate_mnemonic,
  seed_root,
  derive_parent_128,
  derive_parent_usecase,
  derive_child_indexes,
  extract_ecdsa_pair,
  calculate_shared_secret,
  deriveSecretKey
}
