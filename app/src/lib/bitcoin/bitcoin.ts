/*
cypherpost.io
Developed @ Stackmate India
*/

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
import * as secp256k1 from '@noble/secp256k1';
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as crypto from "crypto";
import * as hdkey from "hdkey";
import { handleError } from "../errors/e";
import { BitcoinKeyOperations, ECDSAKeys, ExtendedKeys } from "./interface";


const key_path = process.env.KEY_PATH;

export class CypherpostBitcoinOps implements BitcoinKeyOperations {

  generate_mnemonic(): string | Error {
    try {
      const mnemonic = bip39.generateMnemonic();
      return mnemonic;
    } catch (error) {
      return handleError(error);
    }
  }
  async seed_root(mnemonic: string): Promise<string | Error> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const master_key = bip32.fromSeed(seed);
    return master_key.toBase58();
  }
  derive_parent_128(root_xprv: string): ExtendedKeys | Error {
    try {
      const master_key = bip32.fromBase58(root_xprv);
      const parent_key = master_key.derivePath("m/128'/0'");
      const extended_keys: ExtendedKeys = {
        xpub: parent_key.neutered().toBase58(),
        xprv: parent_key.toBase58(),
      };
      return extended_keys;
    } catch (error) {
      return handleError(error);
    }
  }
  derive_hardened_str(parent: string, derivation_scheme: string): ExtendedKeys | Error {
    try {
      if (!derivation_scheme.endsWith("/"))
        derivation_scheme += "/";
      derivation_scheme = derivation_scheme.replace("'", "h").replace("'", "h").replace("'", "h");
      derivation_scheme = derivation_scheme.replace("m/", "");

      // console.log(derivation_scheme);
      const parent_key = bip32.fromBase58(parent);
      if (derivation_scheme.split("h/").length < 3) return handleError({
        code: 400,
        message: "Derivation scheme must contain 3 sub paths."
      });

      // console.log(derivation_scheme.split("h/"),derivation_scheme.split("h/").length);
      const use_case = parseInt(derivation_scheme.split("h/")[0]);
      const index = parseInt(derivation_scheme.split("h/")[1]);
      const revoke = parseInt(derivation_scheme.split("h/")[2]);
      const child_key = parent_key.deriveHardened(use_case).deriveHardened(index).deriveHardened(revoke);
      const extended_keys: ExtendedKeys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
      };
      return extended_keys;
    } catch (error) {
      return handleError(error);
    }
  }
  derive_hardened(parent: string, use_case: number, index: number, revoke: number): Error | ExtendedKeys {
    try {
      const parent_key = bip32.fromBase58(parent);

      const child_key = parent_key.deriveHardened(use_case).deriveHardened(index).deriveHardened(revoke);
      const extended_keys: ExtendedKeys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
      };
      return extended_keys;
    } catch (error) {
      return handleError(error);
    }
  }
  derive_child(parent: string, index: number): Error | ExtendedKeys {
    try {
      const parent_key = bip32.fromBase58(parent);

      const child_key = parent_key.derive(index);
      const extended_keys: ExtendedKeys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
      };
      return extended_keys;
    } catch (error) {
      return handleError(error);
    }
  }
  async extract_ecdsa_pair(extended_keys: ExtendedKeys): Promise<Error | ECDSAKeys> {
    try {
      const parent_key = bip32.fromBase58(extended_keys.xprv);

      const pubkey = await secp256k1.schnorr.getPublicKey(parent_key.privateKey.toString("hex"));
      const ecdsa_keys: ECDSAKeys = {
        privkey: parent_key.privateKey.toString("hex"),
        pubkey: Buffer.from(pubkey).toString('hex')
      };
      return ecdsa_keys;

    } catch (error) {
      return handleError(error);
    }
  }
  async extract_ecdsa_pub(xpub: string): Promise<Error | string> {
    try {
      const parent_key = hdkey.fromExtendedKey(xpub);
      // const parent_key = bip32.fromBase58(xpub);
      // const pubkey = await secp256k1.schnorr.getPublicKey(parent_key.privateKey.toString("hex")).toString();
      // return Buffer.from(pubkey).toString('hex');
      return parent_key.publicKey.toString('hex')

    } catch (error) {
      return handleError(error);
    }
  }

  calculate_shared_secret(ecdsa_keys: ECDSAKeys): string | Error {

    ecdsa_keys.pubkey= (ecdsa_keys.pubkey.startsWith("02" || "03"))?ecdsa_keys.pubkey: "02" + ecdsa_keys.pubkey;
    const type = "secp256k1";

    let curve = crypto.createECDH(type);

    // console.log({ecdsa_keys});

    curve.setPrivateKey(ecdsa_keys.privkey, "hex");
    // let cpub = curve.getPublicKey("hex","compressed");

    const shared_secret = curve.computeSecret(crypto.ECDH.convertKey(
      ecdsa_keys.pubkey,
      type,
      "hex",
      "hex",
      "uncompressed").toString("hex"), "hex");

    return shared_secret.toString("hex");

  }

  async sign(message: string, private_key: string): Promise<string | Error> {
    try {

      const signature = await secp256k1.schnorr.sign(crypto.createHash('sha256').update(message).digest('hex'), private_key);
      return Buffer.from(signature).toString('hex');
    }
    catch (e) {
      return handleError(e);
    }
  }

  async verify(message: string, signature: string, public_key: string): Promise<boolean | Error> {
    try {
      const status = await secp256k1.schnorr.verify(signature, crypto.createHash('sha256').update(message).digest('hex'), public_key);
      return status;
    }
    catch (e) {
      console.error({e});
      return handleError({
        code: 401,
        message: "Invalid signature"
      });
    }
  }
}