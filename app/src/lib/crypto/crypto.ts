/*
cypherpost.io
Developed @ Stackmate India
*/

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
import crypto from "crypto";
import fs from "fs";
import path from "path";
import util from "util";
import { handleError } from "../errors/e";
// import { S5ReponseHeaders } from "./handlers";
// import { logger } from "../aux/logger";
import { CryptoInterface, ECDHPair } from "./interface";

const key_path = process.env.KEY_PATH;

export class S5Crypto implements CryptoInterface {
  async readECDHPairFromFile(): Promise<ECDHPair | Error> {
    try {
      const string = fs.readFileSync(path.join(key_path,"cypherpost"), "utf8");
      if (string) {
        const json = JSON.parse(string);
        return {
          pubkey: json.pubkey,
          privkey: json.privkey
        }
      }
      else return handleError({code: 404, message:"No Keys found"});
    }
    catch (e) {
      return handleError(e);
    }
  }
  signS256Message(message: string, private_key: string): string | Error {
    try {
      const signer = crypto.createSign('SHA256');
      signer.write(message);
      signer.end();

      return signer.sign(private_key, 'base64')

    }
    catch (e) {
      return handleError(e);
    }
  }
  verifyS256Signature(message: string, sig: string, public_key: string): boolean | Error {
    try {
      const verifier = crypto.createVerify('SHA256');
      verifier.write(message);
      verifier.end();

      return verifier.verify(public_key, sig, 'base64');
    } catch (e) {
      return handleError(e);
    }
  }
  async createRSAPairFile(filename: string): Promise<string | Error> {
    try {
      const generate_key_pair = util.promisify(crypto.generateKeyPair);
      const result = await generate_key_pair("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem"
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem"
        }
      });
      // return { result };
      const message = "check";
      const sign = crypto.createSign("SHA256");
      sign.update(message);
      sign.end();

      const verify = crypto.createVerify("SHA256");
      verify.write(message);
      verify.end();

      console.log({ verify: verify.verify(result.privateKey.toString(), sign.sign(result.privateKey.toString(), "base64"), "base64") })

      fs.writeFileSync(
        `${key_path}/${filename}.pem`,
        result.privateKey.toString(),
        "utf8"
      );
      fs.writeFileSync(
        `${key_path}/${filename}.pub`,
        result.publicKey.toString(),
        "utf8"
      );

      return `${key_path}/${filename}`;
    } catch (e) {
      return handleError(e);
    }
  }
  getECDHPair(): ECDHPair | Error {
    try {
      const ecdh = crypto.createECDH("secp256k1");
      ecdh.generateKeys("hex");
      const private_key = ecdh.getPrivateKey("hex");
      const public_key = ecdh.getPublicKey("hex");

      return {
        privkey: private_key,
        pubkey: public_key
      };
    }
    catch (e) {
      return handleError(e);
    }
  }
  encryptAESMessageWithIV(text: string, key_hex: string): string | Error {
    try {
      const algorithm = "aes-256-cbc";
      const key = Buffer.from(key_hex, "hex");
      const IV_LENGTH = 16;
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);

      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      const encrypted_text =
        iv.toString("hex") + ":" + encrypted.toString("hex");

      return encrypted_text;
    }
    catch (e) {
      return handleError(e);
    }
  }
  decryptAESMessageWithIV(iv_text_crypt: string, key_hex: string): string | Error {
    try {
      const algorithm = "aes-256-cbc";
      const key = Buffer.from(key_hex, "hex");

      const IV_LENGTH = 16; // For AES, this is always 16
      const text_parts = iv_text_crypt.split(":");
      const iv = Buffer.from(text_parts.shift(), "hex");
      const encrypted_text = Buffer.from(text_parts.join(":"), "hex");
      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

      let decrypted = decipher.update(encrypted_text);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    }
    catch (e) {
      return handleError(e);
    }
  }

}
// ------------------ '(◣ ◢)' ----------------------



// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
