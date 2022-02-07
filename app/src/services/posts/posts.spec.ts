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
import { UserPost } from "./interface";
import { CypherpostPosts } from "./posts";
const sinon = require("sinon");

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const bitcoin = new CypherpostBitcoinOps();
const posts = new CypherpostPosts();
const s5crypto = new S5Crypto();
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
let message = "GET /posts";
let xpub = "xpub6BGW7x5qXVvKubVBvXKiHN2dDxwVU9aLfn6riBvcnhNA9g4wkPBMuugFxDtCYLu51gFKabc49y6Ssvv3axE57pDk4hem63LjCa4Qq2eAFpZ";
let xprv = "xprv9xH9iSYwh8N2h7QipVnhvE5tfw714grVJZBFuoX1EMqBGsjoCqs7N7Mn6whrJtTTpGyXVX2KSzZ5uWPfCax9J6Lp9oKAteavTp9aA5VGTGW";
let encryption_key;
const derivation_scheme = "m/0'/0'/0'";
let cypher_json;
let post1_id;
let post2_id;
let post3_id;

/**
 * 
 * UPdate bitcoin ops to use derivation path string
 * 
 */
const plain_json_post = {
  message: "**URGENT**",
  network: "OnChain",
  type: "Sell",
  minimum: 1000,
  maximum: 10000,
  fiat_currency: "INR",
  payment_method: "UPI",
  rate_type: "Variable",
  reference_exchange: "LocalBitcoins",
  reference_percent: "-2.0"
};

let user_post: UserPost = {
  expiry: Date.now() + 100,
  derivation_scheme,
  cypher_json
};
let genesis_filter = 0;

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
    cypher_json = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_json_post),encryption_key);
    if (cypher_json instanceof Error) throw cypher_json;
    user_post['cypher_json'] = cypher_json;

  });

  describe("POST SERVICE OPERATIONS:", async function () {
    it("CREATE a new post (expired)", async function () {
      const response = await posts.create(xpub,user_post.expiry,cypher_json,derivation_scheme);
      expect(response).to.be.a("string");
      post1_id = response;
    });
    it("CREATE a new post (expired)", async function () {
      const response = await posts.create(xpub,user_post.expiry,cypher_json,derivation_scheme);
      expect(response).to.be.a("string");
      post2_id = response;

    });
    it("CREATE a new post (not-expired)", async function () {
      const response = await posts.create(xpub,user_post.expiry + 100000,cypher_json,derivation_scheme);
      expect(response).to.be.a("string");
      post3_id = response;
    });
    it("FIND new posts BY ID", async function () {
      const response = await posts.findManyById([post1_id,post2_id,post3_id], genesis_filter);
      if(response instanceof Error) throw response;
      expect(response.length ===3).to.equal(true);
    });
    it("FIND new posts BY OWNER", async function () {
      const response = await posts.findAllByOwner(xpub, genesis_filter);
      if(response instanceof Error) throw response;
      expect(response.length ===3).to.equal(true);
    });
    it("FIND new posts BY ID w/ upto date genesis_filter", async function () {
      const response = await posts.findManyById([post1_id,post2_id,post3_id], Date.now());
      if(response instanceof Error) throw response;
      expect(response.length === 0).to.equal(true);
    });
    it("FIND new posts BY OWNER w/ upto date genesis_filter", async function () {
      const response = await posts.findAllByOwner(xpub, Date.now());
      if(response instanceof Error) throw response;
      expect(response.length === 0).to.equal(true);
    });
    it("REMOVE posts by ID", async function () {
      const response = await posts.removeOneById(post1_id, xpub);
      expect(response).to.equal(true);
    });
    it("REMOVE EXPIRED posts", async function () {
      const response = await posts.removeAllExpired();
      if(response instanceof Error) throw response;
      expect(response[0]).to.equal(post2_id);
    });
    it("REMOVE posts BY OWNER", async function () {
      const response = await posts.removeAllByOwner(xpub);
      if(response instanceof Error) throw response;
      expect(response[0]).to.equal(post3_id);
    });
    it("FIND 0 posts BY OWNER", async function () {
      const response = await posts.findAllByOwner(xpub, genesis_filter);
      if(response instanceof Error) throw response;
      expect(response.length === 0).to.equal(true);
    });
  });
});
