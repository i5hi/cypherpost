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
import { CypherpostPreferences } from "./preferences";
const sinon = require("sinon");

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const bitcoin = new CypherpostBitcoinOps();
const preferences = new CypherpostPreferences();
const s5crypto = new S5Crypto();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

let xpub = "xpub6DAo87N8pGxhyNo8uWWVwsTRHwozpSp2Scy1BiCjM2rN9R3vRnysqXr2ymokbVYGPzih9Ze1iW4GiKjnL7Eqdec4Gj2fcpvoScN1rfdVKjK";
let cypher_json = "TRHwozpSp2Scy1BiC:TRHwozpSp2Scy1BiCTRHwozpSp2Scy1BiCTRHwozpSp2Scy1BiC";
let cypher_json_update = "jnL7Eqdec4Gj2fcp:jnL7Eqdec4Gj2fcpjnL7Eqdec4Gj2fcp";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Profile Key Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
    // exmaple encryption key - not correct for real use

  });

  describe("PREFERENCES KEY SERVICE OPERATIONS:", async function () {
    it("SET new preferences", async function () {
      const response = await preferences.create(xpub,cypher_json);
      expect(response).to.equal(true);
    });
    it("FIND preferences", async function () {
      const response = await preferences.find(xpub);
      expect(response['cypher_json']).to.equal(cypher_json);
    });
    it("UPDATE preferences", async function () {
      const response = await preferences.update(xpub,cypher_json_update);      
      expect(response).to.equal(true);
    });
    it("FIND preferences to Validate Update", async function () {
      const response = await preferences.find(xpub);
      expect(response['cypher_json']).to.equal(cypher_json_update);
    });
    it("REMOVE preferences", async function () {
      const response = await preferences.remove(xpub);
      expect(response).to.equal(true);
    });
    it("404:FIND preferences to Validate Update", async function () {
      const response = await preferences.find(xpub);
      expect(response['name']).to.equal("404");
    });

  });
});
