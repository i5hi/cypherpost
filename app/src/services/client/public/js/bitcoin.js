const secp256k1 = require('@noble/secp256k1');
const hdkey = require("hdkey");
const bip32 = require("bip32");
const bip39 = require("bip39");

const crypto = require("crypto");

function generateMnemonic() {
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
  const parent_key = master_key.derivePath("m/128'/0'/0'");
  const extended_keys = {
    xpub: parent_key.neutered().toBase58(),
    xprv: parent_key.toBase58(),
  };
  return extended_keys;
}
// usecase:0 (recipient)
// usecase:1 (profile)
// usecase:2 (posts)

function derive_identity_parent(parent_128_xprv) {
  const parent_key = bip32.fromBase58(parent_128_xprv);
  const child_key = parent_key.deriveHardened(0);
  const extended_keys = {
    xpub: child_key.neutered().toBase58(),
    xprv: child_key.toBase58(),
  };
  return extended_keys;
}

function derive_hardened_str(parent, derivation_scheme){
  try {
    if (!derivation_scheme.endsWith("/"))
    derivation_scheme+="/";

    derivation_scheme = derivation_scheme.replace("'",  "h").replace("'",  "h").replace("'",  "h");
    derivation_scheme = derivation_scheme.replace("m/",  "");
    // (derivation_scheme);
    const parent_key = bip32.fromBase58(parent);
    if ( derivation_scheme.split("h/").length < 3 ) return new Error({
      code: 400,
      message: "Derivation scheme must contain 3 sub paths."
    });
    
    // (derivation_scheme.split("h/"),derivation_scheme.split("h/").length);
    const use_case = parseInt(derivation_scheme.split("h/")[0]);
    const index = parseInt(derivation_scheme.split("h/")[1]);
    const revoke = parseInt(derivation_scheme.split("h/")[2]);
    const child_key = parent_key.deriveHardened(use_case).deriveHardened(index).deriveHardened(revoke);
    const extended_keys = {
      xpub: child_key.neutered().toBase58(),
      xprv: child_key.toBase58(),
    };
    return extended_keys;
  } catch (error) {
    
    return new Error(error);
  }
}

const buf2Hex = buf => {
  return Array.from(new Uint8Array(buf))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('')
}

function extract_ecdsa_pair(extended_keys) {
  try {
    const parent_key = bip32.fromBase58(extended_keys.xprv);
    const pubkey = secp256k1.schnorr.getPublicKey(parent_key.privateKey.toString("hex"));
    const ecdsa_keys = {
      privkey: parent_key.privateKey.toString("hex"),
      pubkey: Buffer.from(pubkey).toString('hex')
    };
    return ecdsa_keys;
  } catch (error) {
    return new Error(error);
  }
}


function calculate_shared_secret(ecdsa_keys) {
  ecdsa_keys.pubkey = (ecdsa_keys.pubkey.length===64)
    ? "02" + ecdsa_keys.pubkey
    : ecdsa_keys.pubkey;
  const type = "secp256k1";
  let curve = crypto.createECDH(type);
  // ({ecdsa_keys});
  curve.setPrivateKey(ecdsa_keys.privkey, "hex");
 
  const shared_secret = curve.computeSecret(ecdsa_keys.pubkey, "hex");
  return shared_secret.toString("hex");
}

async function sign(message, privkey) {
  try {
    ({privkey})
    const signature = await secp256k1.schnorr.sign(
      crypto.createHash('sha256').update(message).digest('hex'), 
      privkey
    );
    return Buffer.from(signature).toString('hex');
  }
  catch (e) {
    return new Error(e);
  }
}

async function verify(message,signature, pubkey){
  try {
    const status = await secp256k1.schnorr.verify(signature, crypto.createHash('sha256').update(message).digest('hex'), pubkey);
    return status;
  }
  catch (e) {
    return new Error(e);
  }
}

module.exports = {
  generateMnemonic,
  seed_root,
  derive_parent_128,
  derive_identity_parent,
  derive_hardened_str,
  extract_ecdsa_pair,
  calculate_shared_secret,
  sign,
  verify
}
