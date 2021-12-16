/*
cypherpost.io
Developed @ Stackmate India
*/
// IMPORTS
import chai from "chai";
import chaiHttp from "chai-http";
import "mocha";
import { CypherpostBitcoinOps } from "./lib/bitcoin/bitcoin";
import { ExtendedKeys } from "./lib/bitcoin/interface";
import { S5Crypto } from "./lib/crypto/crypto";
import { handleError } from "./lib/errors/e";
import { logger } from "./lib/logger/winston";
import * as express from "./lib/server/express";
import { DbConnection } from "./lib/storage/interface";
import { MongoDatabase } from "./lib/storage/mongo";
import { CypherpostIdentity } from "./services/identity/identity";

const sinon = require('sinon');

const bitcoin = new CypherpostBitcoinOps();
const s5crypto = new S5Crypto();
const identity = new CypherpostIdentity();

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS

const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
const db = new MongoDatabase();

let server;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

/**
 * Create identities A B C
 * -t> represents trusted badge
 * A -t> B -t> C
 * A allows entire trusted chain (B & C) to view profile and posts
 * A also trusts C
 * A revokes trust in B => A's profile and posts are only visible to C
 * C trusts A => A can view C's profile and posts
 * A deletes their identity
 */

interface TestKeySet {
  mnemonic: string,
  root_xprv: string,
  cypherpost_parent: ExtendedKeys,
  identity_parent: ExtendedKeys,
  identity_signer: string;
  profile_parent: ExtendedKeys,
  posts_parent: ExtendedKeys
};

let a_set;
let b_set;
let c_set;


const init_identity_ds = "m/0h/0h/0h";
const init_profile_ds = "m/1h/0h/0h";
const init_posts_ds = "m/2h/0h/0h";

let endpoint;
let body;
let nonce = Date.now();
let signature;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

async function createTestKeySet(): Promise<TestKeySet | Error> {
  try {
    const mnemonic = bitcoin.generate_mnemonic();
    if (mnemonic instanceof Error) throw mnemonic;
    const root_xprv = await bitcoin.seed_root(mnemonic);
    if (root_xprv instanceof Error) throw root_xprv;
    const cypherpost_parent = bitcoin.derive_parent_128(root_xprv);
    if (cypherpost_parent instanceof Error) throw cypherpost_parent;
    const identity_parent = bitcoin.derive_hardened_str(cypherpost_parent.xprv, init_identity_ds);
    if (identity_parent instanceof Error) throw identity_parent;
    const identity_ecdsa = bitcoin.extract_ecdsa_pair(identity_parent);
    if (identity_ecdsa instanceof Error) throw identity_ecdsa;
    const profile_parent = bitcoin.derive_hardened_str(cypherpost_parent.xprv, init_profile_ds);
    if (profile_parent instanceof Error) throw profile_parent;
    const posts_parent = bitcoin.derive_hardened_str(cypherpost_parent.xprv, init_posts_ds);
    if (posts_parent instanceof Error) throw posts_parent;

    const set: TestKeySet = {
      mnemonic,
      root_xprv,
      cypherpost_parent,
      identity_parent,
      identity_signer: identity_ecdsa.private_key,
      profile_parent,
      posts_parent,
    };
    return set;
  }
  catch (e) {
    handleError(e);
  }
}

describe("CYPHERPOST: API BEHAVIOUR SIMULATION", async function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    sinon.stub(logger, "debug");
    await db.connect(connection);
    server = await express.start(process.env.TEST_PORT);
    // ------------------ (◣_◢) ------------------
    a_set = await createTestKeySet();
    b_set = await createTestKeySet();
    c_set = await createTestKeySet();
    // ------------------ (◣_◢) ------------------
  });

  after(async function () {
    identity.remove(a_set.identity_parent.xpub);
    identity.remove(b_set.identity_parent.xpub);
    identity.remove(c_set.identity_parent.xpub);
  });

  describe("CREATE IDENTITIES for A B C", function () {
    it("REGISTERS IDENTITIES", function (done) {
      endpoint = "/api/v2/identity";
      body = {
        username: "alice",
      };
      nonce = Date.now();
      signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_set.identity_signer);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_set.identity_parent.xpub,
          "x-nonce": nonce,
          "x-client-signature": signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      body = {
        "username": "bob"
      };
      nonce =  Date.now();
      signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_set.identity_signer);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": b_set.identity_parent.xpub,
          "x-nonce": nonce,
          "x-client-signature": signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      body = {
        "username": "carol"
      };
      nonce = Date.now();
      signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_set.identity_signer);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": c_set.identity_parent.xpub,
          "x-nonce": nonce,
          "x-client-signature": signature
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS ALL IDENTITIES as C", function (done) {
      endpoint = "/api/v2/identity/all";
      body = {
        "username": "carol"
      };
      nonce = Date.now();
      signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_set.identity_signer);
      chai
        .request(server)
        .get("/api/v2/identity/all")
        .set({
          "x-client-xpub": c_set.identity_parent.xpub,
          "x-nonce": nonce,
          "x-client-signature": signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['identities'].length).to.equal(3);
          done();
        })
    })

  })
});




