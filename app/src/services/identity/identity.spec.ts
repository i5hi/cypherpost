/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { CypherpostIdentity } from "./identity";
import { UserIdentity } from "./interface";

const bitcoin = new CypherpostBitcoinOps();
const crypto = new S5Crypto();
const identity = new CypherpostIdentity();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
let message = "POST identity/registration";
let xpub = "xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH";
let xprv = "xprv9yAszH4rMvLc8X6wygxQWPJ1qA9jPmpPgU3gpB3NkAV4KRycXYaWxAd1mPo9yzybuhANVb7WmnjjLWyWjt5tq772RKPpcRF2FAN2nRTBMMC";
let ecdsa_keys;
let signature;
/*
{
  "xprv": "[8f8bb5c0/128'/0'/0']xprv9yAszH4rMvLc8X6wygxQWPJ1qA9jPmpPgU3gpB3NkAV4KRycXYaWxAd1mPo9yzybuhANVb7WmnjjLWyWjt5tq772RKPpcRF2FAN2nRTBMMC/*",
  "xpub": "[8f8bb5c0/128'/0'/0']xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH/*"
}
*/
let userIdentity: UserIdentity = {
  username,
  genesis: Date.now(),
  xpub:xpub,
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Identity Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
    ecdsa_keys =await bitcoin.extract_ecdsa_pair({
      xpub,xprv
    });
    if (ecdsa_keys instanceof Error) throw ecdsa_keys;
    signature = bitcoin.sign(message,ecdsa_keys.private_key);
  });
  describe("IDENTITY SERVICE OPERATIONS:", async function () {
    it("should REGISTER a new user identity", async function () {
      const response = await identity.register(username, xpub);
      expect(response).to.equal(true);
    });
    it("should VERIFY a user signature", async function () {
      const response = await identity.verify(xpub,message,signature);
      expect(response).to.equal(true);
    });
    it("should NOT ALLOW REGISTER of DUPLICATE User", async function () {
      const response = await identity.register(username, xpub);
      expect(response["name"]).to.equal("409");
    });
    it("should GET ALL identities", async function () {
      const response = await identity.all();
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(1);
    });
    it("should REMOVE a user identity and verify", async function () {
      const response = await identity.remove(xpub);
      expect(response).to.equal(true);
    });
  });
});
