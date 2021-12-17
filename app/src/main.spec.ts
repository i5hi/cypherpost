/*
cypherpost.io
Developed @ Stackmate India
*/
// IMPORTS
import chai from "chai";
import chaiHttp from "chai-http";
import * as crypto from "crypto";
import "mocha";
import { CypherpostBitcoinOps } from "./lib/bitcoin/bitcoin";
import { ExtendedKeys } from "./lib/bitcoin/interface";
import { S5Crypto } from "./lib/crypto/crypto";
import { handleError } from "./lib/errors/e";
import { logger } from "./lib/logger/winston";
import * as express from "./lib/server/express";
import { DbConnection } from "./lib/storage/interface";
import { MongoDatabase } from "./lib/storage/mongo";
import { CypherpostBadges } from "./services/badges/badges";
import { BadgeType } from "./services/badges/interface";
import { CypherpostIdentity } from "./services/identity/identity";
import { CypherpostProfileKeys } from "./services/profile/keys/profile_keys";
import { CypherpostProfile } from "./services/profile/profile";

const sinon = require('sinon');
const bitcoin = new CypherpostBitcoinOps();
const s5crypto = new S5Crypto();
const identity = new CypherpostIdentity();
const badges = new CypherpostBadges();
const profile = new CypherpostProfile();
const profile_keys = new CypherpostProfileKeys();
const db = new MongoDatabase();

let server;
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
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
  identity_xpub: string;
  identity_private: string;
  identity_public: string;
};

interface ProfileType {
  nickname: string,
  status: string,
  contact: string
};
interface TestProfileSet {
  plain: ProfileType,
  cypher: string,
  encryption_key: string
};



let a_key_set: TestKeySet;
let b_key_set: TestKeySet;
let c_key_set: TestKeySet;

let a_profile_set: TestProfileSet;
let b_profile_set: TestProfileSet;
let c_profile_set: TestProfileSet;

const init_identity_ds = "m/0h/0h/0h";
const init_profile_ds = "m/1h/0h/0h";
const init_posts_ds = "m/2h/0h/0h";

let endpoint;
let body;
let nonce = Date.now();
let request_signature;

let all_identities;
let all_badges;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// ------------------ INITIALIZERS ------------------
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

    const set: TestKeySet = {
      mnemonic,
      root_xprv,
      cypherpost_parent,
      identity_xpub: identity_parent.xpub,
      identity_private: identity_ecdsa.private_key,
      identity_public: identity_ecdsa.public_key
    };
    return set;
  }
  catch (e) {
    handleError(e);
  }
}

function createProfileSet(plain_profile, cypherpost_parent, derivation_scheme: string): TestProfileSet {
  const profile_xkey = bitcoin.derive_hardened_str(cypherpost_parent['xprv'], derivation_scheme) as ExtendedKeys;
  const encryption_key = crypto.createHash('sha256').update(profile_xkey['xprv']).digest('hex');
  const cypher = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_profile), encryption_key) as string;
  return {
    plain: plain_profile,
    cypher,
    encryption_key
  }
}
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

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
    a_key_set = await createTestKeySet() as TestKeySet;
    b_key_set = await createTestKeySet() as TestKeySet;
    c_key_set = await createTestKeySet() as TestKeySet;
    // ------------------ (◣_◢) ------------------
    a_profile_set = createProfileSet({
      nickname: "Alice Articulates",
      status: "Sound Money, Sound World.",
      contact: "@alice3us on Telegram"
    }, a_key_set.cypherpost_parent, init_profile_ds);

    b_profile_set = createProfileSet({
      nickname: "Bobby Breeds",
      status: "Making Babies.",
      contact: "@bob3us on Telegram"
    }, a_key_set.cypherpost_parent, init_profile_ds);

    c_profile_set = createProfileSet({
      nickname: "Carol Cares",
      status: "Trying Hard Not To Cry.",
      contact: "@carol3us on Telegram"
    }, a_key_set.cypherpost_parent, init_profile_ds);
    // ------------------ (◣_◢) ------------------
  });

  after(async function () {
    await identity.remove(a_key_set.identity_xpub);
    await identity.remove(b_key_set.identity_xpub);
    await identity.remove(c_key_set.identity_xpub);
    await badges.removeAllOfUser(a_key_set.identity_xpub);
    await badges.removeAllOfUser(b_key_set.identity_xpub);
    await badges.removeAllOfUser(c_key_set.identity_xpub);
    await profile.remove(a_key_set.identity_xpub);
    await profile.remove(b_key_set.identity_xpub);
    await profile.remove(c_key_set.identity_xpub);
    await profile_keys.removeProfileDecryptionKeyByGiver(a_key_set.identity_xpub);
    await profile_keys.removeProfileDecryptionKeyByGiver(b_key_set.identity_xpub);
    await profile_keys.removeProfileDecryptionKeyByGiver(c_key_set.identity_xpub);
  });

  describe("REGISTER IDENTITIES for A B C and VERIFY REGISTRATION via GET ALL", function () {
    it("REGISTERS IDENTITIES", function (done) {
      endpoint = "/api/v2/identity";
      body = {
        username: "alice",
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      body = {
        "username": "bob"
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
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
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature
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
      body = {};
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['identities'].length).to.equal(3);
          all_identities = res.body['identities'];
          done();
        })
    })
  });

  const trusted_badge = BadgeType.Trusted;
  describe("ISSUE TRUST BADGE A->B->C and VERIFY via GET ALL", function () {
    it("ISSUES TRUST BADGES A->B->C", function (done) {
      nonce = Date.now();
      endpoint = "/api/v2/badges/trust";
      body = {
        trusting: b_key_set.identity_xpub,
        nonce,
        signature: bitcoin.sign(`${a_key_set.identity_xpub}:${b_key_set.identity_xpub}:${trusted_badge.toString()}:${nonce}`, a_key_set.identity_private)
      };
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      nonce = Date.now();
      body = {
        trusting: c_key_set.identity_xpub,
        nonce,
        signature: bitcoin.sign(`${b_key_set.identity_xpub}:${c_key_set.identity_xpub}:${trusted_badge.toString()}:${nonce}`, b_key_set.identity_private)
      };
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      nonce = Date.now();
      body = {
        trusting: a_key_set.identity_xpub,
        nonce,
        signature: bitcoin.sign(`${c_key_set.identity_xpub}:${a_key_set.identity_xpub}:${trusted_badge.toString()}:${nonce}`, c_key_set.identity_private)
      };
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS SELF BADGES as C", function (done) {
      endpoint = "/api/v2/badges/self";
      body = {};
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['given'].length).to.equal(1);
          expect(res.body['recieved'].length).to.equal(1);
          done();
        })
    });
    it("GETS ALL BADGES as C", function (done) {
      endpoint = "/api/v2/badges/all";
      body = {};
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['badges'].length).to.equal(3);
          all_badges = res.body['badges'];
          done();
        })
    });
    it("VERIFIES ALL BADGES ISSUED", function (done) {
      all_badges.map((badge) => {
        const pubkey = bitcoin.extract_ecdsa_pub(badge.giver);
        const message = `${badge.giver}:${badge.reciever}:${badge.type}:${badge.nonce}`;
        const verify = bitcoin.verify(message, badge.signature, pubkey as string);
        if (!verify) throw "Badge Signature failed.";
      });
      done();
    });
  });

  describe("UPDATE PROFILES for A, B & C and VERIFY via GET SELF", function () {
    it("UPDATES PROFILES", function (done) {
      endpoint = "/api/v2/profile";
      body = {
        cypher_json: a_profile_set.cypher,
        derivation_scheme: init_profile_ds
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      body = {
        cypher_json: b_profile_set.cypher,
        derivation_scheme: init_profile_ds
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      body = {
        cypher_json: c_profile_set.cypher,
        derivation_scheme: init_profile_ds
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS EACH SELF PROFILE", function (done) {
      endpoint = "/api/v2/profile/self";
      body = {};
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profile'].cypher_json).to.equal(a_profile_set.cypher);
        })
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profile'].cypher_json).to.equal(b_profile_set.cypher);
        })
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profile'].cypher_json).to.equal(c_profile_set.cypher);
          done();
        })
    })
  });

  describe("UPDATE PROFILE KEYS based on Trust Badges and VERIFY via GET OTHERS", function () {
    it("UPDATES PROFILE DECRYPTION KEYS of TRUSTED", function (done) {
      endpoint = "/api/v2/profile/keys";
      // client must first parse through all_badges and find who trusts them
      // here we assume knowledge of trust givers
      let shared_sercret = bitcoin.calculate_shared_secret({
        private_key: a_key_set.identity_private,
        public_key: b_key_set.identity_public
      }) as string;

      const b_decryption_key = s5crypto.encryptAESMessageWithIV(a_profile_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: b_decryption_key, reciever: b_key_set.identity_xpub }],
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });

      shared_sercret = bitcoin.calculate_shared_secret({
        private_key: b_key_set.identity_private,
        public_key: c_key_set.identity_public
      }) as string;

      const c_decryption_key = s5crypto.encryptAESMessageWithIV(b_profile_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: c_decryption_key, reciever: c_key_set.identity_xpub }],
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
        });
      shared_sercret = bitcoin.calculate_shared_secret({
        private_key: c_key_set.identity_private,
        public_key: a_key_set.identity_public
      }) as string;

      const a_decryption_key = s5crypto.encryptAESMessageWithIV(c_profile_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: a_decryption_key, reciever: a_key_set.identity_xpub }],
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS OTHERS PROFILES and VERIFY via ABILITY TO DECRYPT", function (done) {
      endpoint = "/api/v2/profile/others";
      body = {};
      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profiles'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: a_key_set.identity_private,
            public_key: c_key_set.identity_public
          }) as string;

          const c_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const c_decrypted_profile = s5crypto.decryptAESMessageWithIV(res.body['profiles'][0].cypher_json, c_decryption_key) as string;
          expect(JSON.parse(c_decrypted_profile)['contact']).to.equal(c_profile_set.plain.contact);
        });

      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profiles'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: b_key_set.identity_private,
            public_key: a_key_set.identity_public
          }) as string;

          const a_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const a_decrypted_profile = s5crypto.decryptAESMessageWithIV(res.body['profiles'][0].cypher_json, a_decryption_key) as string;
          expect(JSON.parse(a_decrypted_profile)['contact']).to.equal(a_profile_set.plain.contact);
        });

      nonce = Date.now();
      request_signature = bitcoin.sign(`GET ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .get(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['profiles'].length).to.equal(1);
          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: c_key_set.identity_private,
            public_key: b_key_set.identity_public
          }) as string;

          const b_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const b_decrypted_profile = s5crypto.decryptAESMessageWithIV(res.body['profiles'][0].cypher_json, b_decryption_key) as string;
          expect(JSON.parse(b_decrypted_profile)['contact']).to.equal(b_profile_set.plain.contact);
          done();
        });
    })
  })

  describe.skip("CREATES POSTS for A, B & C and VERIFY via GET SELF", function(){
    it("CREATES POSTS", function(done){

    });
    it("GETS EACH SELF POSTS", function(done){
      
    });
  });

  describe.skip("UPDATE POST KEYS based on Trust Badges and VERIFY via GET OTHERS", function(){
    it("UPDATES POST DECRYPTION KEYS of TRUSTED", function(done){

    });
    it("GETS OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function(done){
      
    });
  });
  
  describe("E: 409's", function () {
    it("PREVENTS DUPLICATE IDENTITY", function (done) {
      endpoint = "/api/v2/identity";
      body = {
        username: "alice",
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(409);
        });
      body = {
        username: "alex",
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
    it("PREVENTS DUPLICATE TRUST BADGE", function (done) {
      nonce = Date.now();
      endpoint = "/api/v2/badges/trust";
      body = {
        trusting: b_key_set.identity_xpub,
        nonce,
        signature: bitcoin.sign(`${a_key_set.identity_xpub}:${b_key_set.identity_xpub}:${trusted_badge.toString()}:${nonce}`, a_key_set.identity_private)
      };
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
    it("PREVENTS DUPLICATE PROFILE DECRYPTION KEY ENTRY", function(done){
      endpoint = "/api/v2/profile/keys";
      // client must first parse through all_badges and find who trusts them
      // here we assume knowledge of trust givers
      let shared_sercret = bitcoin.calculate_shared_secret({
        private_key: a_key_set.identity_private,
        public_key: b_key_set.identity_public
      }) as string;

      const b_decryption_key = s5crypto.encryptAESMessageWithIV(a_profile_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: b_decryption_key, reciever: b_key_set.identity_xpub }],
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .post(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });

    })
  });
});




