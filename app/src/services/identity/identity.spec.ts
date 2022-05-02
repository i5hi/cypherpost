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
import { RegistrationType, UserIdentity, VerificationStatus } from "./interface";

const bitcoin = new CypherpostBitcoinOps();
const crypto = new S5Crypto();
const identity = new CypherpostIdentity();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
const username2 = "r21";
let message = "POST identity/registration";
let xpub = "xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH";
let xprv = "xprv9yAszH4rMvLc8X6wygxQWPJ1qA9jPmpPgU3gpB3NkAV4KRycXYaWxAd1mPo9yzybuhANVb7WmnjjLWyWjt5tq772RKPpcRF2FAN2nRTBMMC";
let ecdsa_keys;
let signature;
const invite_code = "d8e8fca2dc0f896fd7cb4cb0031ba249";
/*
{
  "xprv": "[8f8bb5c0/128'/0'/0']xprv9yAszH4rMvLc8X6wygxQWPJ1qA9jPmpPgU3gpB3NkAV4KRycXYaWxAd1mPo9yzybuhANVb7WmnjjLWyWjt5tq772RKPpcRF2FAN2nRTBMMC/*",
  "xpub": "[8f8bb5c0/128'/0'/0']xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH/*"
}
*/
let userIdentity: UserIdentity = {
  username,
  genesis: Date.now(),
  pubkey:xpub,
  status: VerificationStatus.Pending
};

let genesis_filter = 0;
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
    signature = await bitcoin.sign(message,ecdsa_keys.privkey);
  });
  describe("IDENTITY SERVICE OPERATIONS:", async function () {
    it("should REGISTER a new user identity", async function () {
      const response = await identity.register(username, ecdsa_keys.pubkey, RegistrationType.Invite);
      expect(response).to.equal(true);
    });
    it("should NOT ALLOW REGISTER of DUPLICATE User", async function () {
      const response = await identity.register(username2, ecdsa_keys.pubkey, RegistrationType.Invite);
      expect(response["name"]).to.equal("409");
    });
    it("should AUTHENTICATE a user signature", async function () {
      const response = await identity.authenticate(ecdsa_keys.pubkey,message,signature);
      expect(response).to.equal(true);
    });
    it("should VERIFY a user", async function () {
      const response = await identity.updateStatus(ecdsa_keys.pubkey, VerificationStatus.Verified);
      expect(response).to.equal(true);
    });
    it("should GET ALL identities and CONFIRM that only user is verified", async function () {
      const response = await identity.all(genesis_filter);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(1);
      expect(response[0].status).to.equal(VerificationStatus.Verified.toString());
    });
    it("should GET ALL identities with upto date genesis filter", async function () {
      const response = await identity.all(Date.now());
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(0);
    });
    it("should REMOVE a user identity", async function () {
      const response = await identity.remove(ecdsa_keys.pubkey);
      expect(response).to.equal(true);
      const response_all = await identity.all(genesis_filter);
      if (response_all instanceof Error) throw response;
      expect(response_all.length).to.equal(0);
    });
  });
});
