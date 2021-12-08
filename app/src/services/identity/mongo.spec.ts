/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { IdentityIndex, UserIdentity } from "./interface";
import { MongoIdentityStore } from "./mongo";


const store = new MongoIdentityStore();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
// let message = "POST identity/registration";
let pubkey = "xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH";
/*
{
  "xprv": "[8f8bb5c0/128'/0'/0']xprv9yAszH4rMvLc8X6wygxQWPJ1qA9jPmpPgU3gpB3NkAV4KRycXYaWxAd1mPo9yzybuhANVb7WmnjjLWyWjt5tq772RKPpcRF2FAN2nRTBMMC/*",
  "xpub": "[8f8bb5c0/128'/0'/0']xpub6CAEPnbkCHtuM1BR5iVQsXEkPBzDoEYF3gyHcZSzJW23CEJm55tmVxwVcdSX6FJFTrwccY8YG4ur3Wjyg2SoxVjGhpJpwUcMd3eBrC4wHdH/*"
}
*/
let userIdentity: UserIdentity = {
  username,
  genesis: Date.now(),
  pubkey,
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Identity Storage", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
  });
  describe("IDENTITY STORAGE OPERATIONS:", async function () {
    it("should CREATE a new user identity in mongo AND verify via READ", async function () {
      const response = await store.create(userIdentity);
      expect(response).to.equal(true);
      const identity = await store.read(username, IdentityIndex.Username);
      expect(identity['username']).to.equal(username);
      expect(identity['pubkey']).to.equal(pubkey);
    });
    it("should NOT ALLOW CREATE of DUPLICATE entry", async function () {
      const response = await store.create(userIdentity);
      console.log({response});
      expect(response["name"]).to.equal("409");
    });
    it("should REMOVE a user identity in mongo and verify via READ", async function () {
      const status = await store.remove(username);
      expect(status).to.equal(true);
      const response = await store.read(username, IdentityIndex.Username);
      expect(response['name']).to.equal("404");
    });
  });
});
