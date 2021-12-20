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
import { CypherpostPostKeys } from "./services/posts/keys/post_keys";
import { CypherpostPosts } from "./services/posts/posts";
import { CypherpostProfileKeys } from "./services/profile/keys/profile_keys";
import { CypherpostProfile } from "./services/profile/profile";

const sinon = require('sinon');
const bitcoin = new CypherpostBitcoinOps();
const s5crypto = new S5Crypto();
const identity = new CypherpostIdentity();
const badges = new CypherpostBadges();
const profile = new CypherpostProfile();
const profile_keys = new CypherpostProfileKeys();
const posts = new CypherpostPosts();
const post_keys = new CypherpostPostKeys();
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

interface Profile {
  nickname: string,
  status: string,
  contact: string
};
interface TestProfileSet {
  plain: Profile,
  cypher: string,
  encryption_key: string
};

enum OrderType {
  Buy = "Buy",
  Sell = "Sell"
}
enum BitcoinNetwork {
  OnChain = "OnChain",
  Lightning = "Lightning",
  Liquid = "Liquid"
}
enum FiatCurrency {
  INR = "INR",
  CAD = "CAD",
  AUD = "AUD",
  USD = "USD",
  EUR = "EUR"
}

enum PaymentMethod {
  UPI = "UPI",
  IMPS = "IMPS",
  Cash = "Cash",
  Aangadiya = "Aangadiya",
  Cheque = "Cheque",
  Paypal = "Paypal"
}

enum RateType {
  Fixed = "Fixed",
  Variable = "Variable"
}

enum ReferenceExchange {
  LocalBicoins = "LocalBitcoins",
  BullBitcoin = "BullBitcoin",
  WazirX = "WazirX",
  Kraken = "Kraken",
  BitFinex = "Bitfinex",
  None = "None"
}

interface Post {
  type: OrderType,
  message: string,
  network: BitcoinNetwork,
  minimum: number,
  maximum: number,
  fiat_currency: FiatCurrency,
  payment_method: PaymentMethod,
  rate_type: RateType,
  fixed_rate: number,
  reference_exchange: ReferenceExchange,
  reference_percent: number
}

interface TestPostSet {
  plain: Post,
  cypher: string,
  encryption_key: string,
  post_id: string;
}

let a_key_set: TestKeySet;
let b_key_set: TestKeySet;
let c_key_set: TestKeySet;

let a_profile_set: TestProfileSet;
let b_profile_set: TestProfileSet;
let c_profile_set: TestProfileSet;

let a_post_set: TestPostSet;
let b_post_set: TestPostSet;
let c_post_set: TestPostSet;

const init_identity_ds = "m/0h/0h/0h";
const init_profile_ds = "m/1h/0h/0h";
const init_posts_ds = "m/2h/0h/0h";

let endpoint;
let body;
let nonce = Date.now();
let request_signature;

let all_identities;
let all_badges;

let a_trust = [];
let b_trust = [];
let c_trust = [];
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

function createProfileSet(plain_profile: Profile, cypherpost_parent: ExtendedKeys, derivation_scheme: string): TestProfileSet {
  const profile_xkey = bitcoin.derive_hardened_str(cypherpost_parent['xprv'], derivation_scheme) as ExtendedKeys;
  const encryption_key = crypto.createHash('sha256').update(profile_xkey['xprv']).digest('hex');
  const cypher = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_profile), encryption_key) as string;
  return {
    plain: plain_profile,
    cypher,
    encryption_key
  }
}
function createPostSet(plain_post: Post, cypherpost_parent: ExtendedKeys, derivation_scheme: string): TestPostSet {
  const ppost_xkey = bitcoin.derive_hardened_str(cypherpost_parent['xprv'], derivation_scheme) as ExtendedKeys;
  const encryption_key = crypto.createHash('sha256').update(ppost_xkey['xprv']).digest('hex');
  const cypher = s5crypto.encryptAESMessageWithIV(JSON.stringify(plain_post), encryption_key) as string;
  return {
    plain: plain_post,
    cypher,
    encryption_key,
    post_id: "unset"
  }
}
function createDefaultTestPost(type: OrderType, message: string, fixed: boolean): Post {
  return {
    message,
    type,
    network: BitcoinNetwork.OnChain,
    minimum: 1000,
    maximum: 100000,
    fiat_currency: FiatCurrency.INR,
    payment_method: PaymentMethod.UPI,
    rate_type: RateType.Variable,
    fixed_rate: (fixed) ? 50000000 : 0,
    reference_exchange: (fixed) ? ReferenceExchange.None : ReferenceExchange.WazirX,
    reference_percent: (fixed) ? 0 : 5
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
    }, b_key_set.cypherpost_parent, init_profile_ds);

    c_profile_set = createProfileSet({
      nickname: "Carol Cares",
      status: "Trying Hard Not To Cry.",
      contact: "@carol3us on Telegram"
    }, c_key_set.cypherpost_parent, init_profile_ds);
    // ------------------ (◣_◢) ------------------
    a_post_set = createPostSet(createDefaultTestPost(OrderType.Sell, "Urgent", true), a_key_set.cypherpost_parent, init_posts_ds);

    b_post_set = createPostSet(createDefaultTestPost(OrderType.Buy, "Stacking", false), b_key_set.cypherpost_parent, init_posts_ds);

    c_post_set = createPostSet(createDefaultTestPost(OrderType.Sell, "GM", false), c_key_set.cypherpost_parent, init_posts_ds);

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
    await posts.removeAllByOwner(a_key_set.identity_xpub);
    await posts.removeAllByOwner(b_key_set.identity_xpub);
    await posts.removeAllByOwner(c_key_set.identity_xpub);
    await post_keys.removePostDecryptionKeyByGiver(a_key_set.identity_xpub);
    await post_keys.removePostDecryptionKeyByGiver(b_key_set.identity_xpub);
    await post_keys.removePostDecryptionKeyByGiver(c_key_set.identity_xpub);
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
    it("VERIFIES ALL BADGES ISSUED and POPULATES EACH USER's TRUSTED", function (done) {
      all_badges.map((badge) => {
        const pubkey = bitcoin.extract_ecdsa_pub(badge.giver);
        const message = `${badge.giver}:${badge.reciever}:${badge.type}:${badge.nonce}`;
        const verify = bitcoin.verify(message, badge.signature, pubkey as string);
        if (!verify) throw "Badge Signature failed.";
        if (badge.giver === a_key_set.identity_xpub) a_trust.push(badge.reciever);
        if (badge.giver === b_key_set.identity_xpub) b_trust.push(badge.reciever);
        if (badge.giver === c_key_set.identity_xpub) c_trust.push(badge.reciever);
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

  describe("ADD PROFILE KEYS based on Trust Badges and VERIFY via GET OTHERS", function () {
    it("ADDS PROFILE DECRYPTION KEYS of TRUSTED", function (done) {

      endpoint = "/api/v2/profile/keys";
      body = {
        decryption_keys: [],
      };
      a_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: a_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(a_profile_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
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
        decryption_keys: [],
      };
      b_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: b_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(b_profile_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
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
        decryption_keys: [],
      };
      c_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: c_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(c_profile_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
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

  describe("CREATES POSTS for A, B & C and VERIFY via GET SELF", function () {
    it("CREATES POSTS: A - 1 expires, 1 persists, B - 1 persists, C - 1 persists", function (done) {
      endpoint = "/api/v2/posts";
      body = {
        cypher_json: a_post_set.cypher,
        derivation_scheme: init_posts_ds,
        expiry: Date.now() + 10,
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['post_id'].startsWith('s5')).to.equal(true);
        });
      body = {
        cypher_json: a_post_set.cypher,
        derivation_scheme: init_posts_ds,
        expiry: Date.now() + 100000,
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": a_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['post_id'].startsWith('s5')).to.equal(true);
          a_post_set.post_id = res.body['post_id'];
        });
      body = {
        cypher_json: b_post_set.cypher,
        derivation_scheme: init_posts_ds,
        expiry: Date.now() + 10000,
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['post_id'].startsWith('s5')).to.equal(true);
          b_post_set.post_id = res.body['post_id'];
        });
      body = {
        cypher_json: c_post_set.cypher,
        derivation_scheme: init_posts_ds,
        expiry: Date.now() + 100000,
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['post_id'].startsWith('s5')).to.equal(true);
          c_post_set.post_id = res.body['post_id'];
          done();
        });
    });
    it("GETS EACH SELF POSTS", function (done) {
      endpoint = "/api/v2/posts/self";
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
          // 1 EXPIRED, 1 PERSISTED
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(a_post_set.cypher);
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
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(b_post_set.cypher);
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
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(c_post_set.cypher);
          done();
        })
    });
  });

  describe("UPDATE POST KEYS based on Trust Badges and VERIFY via GET OTHERS", function () {
    it("UPDATES POST DECRYPTION KEYS of TRUSTED", function (done) {
      endpoint = "/api/v2/posts/keys";
      body = {
        decryption_keys: [],
        id: a_post_set.post_id
      };
      a_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: a_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(a_post_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
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
        decryption_keys: [],
        id: b_post_set.post_id
      };
      b_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: b_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(b_post_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
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
        decryption_keys: [],
        id: c_post_set.post_id
      };
      c_trust.map((recipient_xpub) => {
        const recipient_public = bitcoin.extract_ecdsa_pub(recipient_xpub);
        if (recipient_public instanceof Error) throw recipient_public;

        const shared_sercret = bitcoin.calculate_shared_secret({
          private_key: c_key_set.identity_private,
          public_key: recipient_public
        }) as string;

        const decryption_key = s5crypto.encryptAESMessageWithIV(c_post_set.encryption_key, shared_sercret);
        const dk_entry = {
          decryption_key,
          reciever: recipient_xpub
        };
        body.decryption_keys.push(dk_entry);
      });
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": c_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
      endpoint = "/api/v2/posts/others";
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
          expect(res.body['posts'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: a_key_set.identity_private,
            public_key: c_key_set.identity_public
          }) as string;

          const c_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const c_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, c_decryption_key) as string;
          expect(JSON.parse(c_decrypted_post)['type']).to.equal(c_post_set.plain.type);
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
          expect(res.body['posts'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: b_key_set.identity_private,
            public_key: a_key_set.identity_public
          }) as string;

          const a_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const a_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, a_decryption_key) as string;
          expect(JSON.parse(a_decrypted_post)['type']).to.equal(a_post_set.plain.type);
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
          expect(res.body['posts'].length).to.equal(1);
          const shared_sercret = bitcoin.calculate_shared_secret({
            private_key: c_key_set.identity_private,
            public_key: b_key_set.identity_public
          }) as string;

          const b_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['keys'][0].decryption_key, shared_sercret) as string;
          const b_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, b_decryption_key) as string;
          expect(JSON.parse(b_decrypted_post)['type']).to.equal(b_post_set.plain.type);
          done();
        });
    });
  });

  describe("REVOKE A->B TRUST",function(){
    it("REVOKES TRUST FROM A->B",function(){
      endpoint = "/api/v2/badges/trust/revoke";
      body = {
        revoking: b_key_set.identity_xpub,
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
    });
    // A must update their profile and decryption keys 
    // ALTHOUGH B will no longer recieve A's keys in GET profile/others
  })
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
          res.should.have.status(409);
          done();
        });
    });
    it("PREVENTS DUPLICATE PROFILE DECRYPTION KEY ENTRY", function (done) {
      endpoint = "/api/v2/profile/keys";
      // client must first parse through all_badges and find who trusts them
      // here we assume knowledge of trust givers
      let shared_sercret = bitcoin.calculate_shared_secret({
        private_key: b_key_set.identity_private,
        public_key: c_key_set.identity_public
      }) as string;

      const b_decryption_key = s5crypto.encryptAESMessageWithIV(b_profile_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: b_decryption_key, reciever: c_key_set.identity_xpub }],
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });

    })
    it("PREVENTS DUPLICATE POSTS DECRYPTION KEY ENTRY", function (done) {
      endpoint = "/api/v2/posts/keys";
      // client must first parse through all_badges and find who trusts them
      // here we assume knowledge of trust givers
      let shared_sercret = bitcoin.calculate_shared_secret({
        private_key: b_key_set.identity_private,
        public_key: c_key_set.identity_public
      }) as string;

      const b_decryption_key = s5crypto.encryptAESMessageWithIV(b_post_set.encryption_key, shared_sercret);
      body = {
        decryption_keys: [{ decryption_key: b_decryption_key, reciever: c_key_set.identity_xpub }],
        id: b_post_set.post_id
      };
      nonce = Date.now();
      request_signature = bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .put(endpoint)
        .set({
          "x-client-xpub": b_key_set.identity_xpub,
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
  describe.skip("GLOBAL", function(){
    it("DELETES AN IDENTITY AND ALL ASSOCIATIONS", function(){

    });
  });
});




