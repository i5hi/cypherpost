/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { CyphernodePayments } from "./cyphernode";
import { MongoPaymentStore } from "./mongo";

const bitcoin = new CypherpostBitcoinOps();
const cyphernode = new CyphernodePayments();
const store = new MongoPaymentStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

let message = "GET payments/address";
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
let genesis_filter = 0;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Payment Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
    ecdsa_keys = await bitcoin.extract_ecdsa_pair({
      xpub, xprv
    });
    if (ecdsa_keys instanceof Error) throw ecdsa_keys;
    signature = await bitcoin.sign(message, ecdsa_keys.privkey);
  });
  after(async function () {
  //  await store.removeAll();
  });
  describe("Roots", async function () {
    it("test get invoice", async function () {
      const result = await cyphernode.createInvoice(xpub,128) as string;
      console.log({invoice: result});
      expect(result.startsWith('lntb1')).to.equal(true);
    });
    it("test status of node", async function () {
      const result = await cyphernode.getInfo();
      console.log({result});
      expect(result).to.have.property("info");
    });
    it("sync wallet", async function () {
      const result = await cyphernode.syncWallet();
      expect(result).to.equal(true);
    });
  });
});
