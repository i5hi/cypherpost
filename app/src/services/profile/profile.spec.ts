/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import crypto from "crypto";
import "mocha";
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { UserProfile } from "./interface";
import { CypherpostProfile } from "./profile";

const bitcoin = new CypherpostBitcoinOps();
const s5crypto = new S5Crypto();
const profile = new CypherpostProfile();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
/*
ROOT
{
  "fingerprint": "fcf5c473",
  "mnemonic": "want text option cargo region apology elegant easy uniform bird consider wedding sport spy romance scrap produce pluck cement thank country person ecology weird",
  "xprv": "xprv9s21ZrQH143K2C33LtYYTeVM187n1L1iKq1nyUJMsvxJJQNRxpkZzZfDxAv2iyds3E3Y5r3LeF3MBcasGGgvKfA2KmAqx61TFU46UZY8S9F"
}
PARENT e2ee'/cypherpost'
{
  "xprv": "[fcf5c473/128'/0']xprv9xH9iSYwh8N2h7QipVnhvE5tfw714grVJZBFuoX1EMqBGsjoCqs7N7Mn6whrJtTTpGyXVX2KSzZ5uWPfCax9J6Lp9oKAteavTp9aA5VGTGW/*",
  "xpub": "[fcf5c473/128'/0']xpub6BGW7x5qXVvKubVBvXKiHN2dDxwVU9aLfn6riBvcnhNA9g4wkPBMuugFxDtCYLu51gFKabc49y6Ssvv3axE57pDk4hem63LjCa4Qq2eAFpZ/*"
}
*/
let username = "ishi";
let message = "GET profile/";
let xpub = "xpub6BGW7x5qXVvKubVBvXKiHN2dDxwVU9aLfn6riBvcnhNA9g4wkPBMuugFxDtCYLu51gFKabc49y6Ssvv3axE57pDk4hem63LjCa4Qq2eAFpZ";
let xprv = "xprv9xH9iSYwh8N2h7QipVnhvE5tfw714grVJZBFuoX1EMqBGsjoCqs7N7Mn6whrJtTTpGyXVX2KSzZ5uWPfCax9J6Lp9oKAteavTp9aA5VGTGW";
let encryption_key;
const derivation_scheme = "m/0'/0'/0'";
/**
 * 
 * UPdate bitcoin ops to use derivation path string
 * 
 */
const plain_json_profile={
  status: "Sound Money, Sound World.",
  contact: "@i5hi on Telegram"
};

let user_profile: UserProfile = {
  derivation_scheme
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Profile Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
    encryption_key = bitcoin.derive_hardened(xprv,0,0,0);
    if (encryption_key instanceof Error) throw encryption_key;
    encryption_key = crypto.createHash('sha256').update(encryption_key.xprv).digest('hex');
    const cypher_json = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_json_profile),encryption_key);
    if (cypher_json instanceof Error) throw cypher_json;
    user_profile['cypher_json'] = cypher_json;

  });

  describe("PROFILE SERVICE OPERATIONS:", async function () {
    it("INITIALIZE a profile with an owner", async function () {
      const response = await profile.initialize(xpub);
      expect(response).to.equal(true);
    });
    it("409 on INITIALIZE DUPLICATE", async function () {
      const response = await profile.initialize(xpub);
      expect(response['name']).to.equal("409");
    });
    it("FIND initialized profile", async function () {
      const response = await profile.findOne(xpub);
      expect(response).has.property("genesis");
      expect(response).has.property("owner");
    });
    it("UPDATE initialized profile", async function () {
      const response = await profile.update(xpub,user_profile);
      expect(response).to.equal(true);
    });
    it("FIND SINGLE UPDATED profile with findMany", async function () {
      const response = await profile.findMany([xpub,xprv]);
      if (response instanceof Error) throw response;
      expect(response.length === 1).to.equal(true);
      expect(response[0]).has.property("derivation_scheme");
      expect(response[0]['cypher_json']).to.equal(user_profile.cypher_json);
    });
    it("REMOVE profile", async function () {
      const response = await profile.remove(xpub);
      expect(response).to.equal(true);
    });
    it("404 on FIND DELETED profile", async function () {
      const response = await profile.findOne(xpub);
      expect(response['name']).to.equal("404");
    });
  });
});
