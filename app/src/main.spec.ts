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

const sinon = require('sinon');
const bitcoin = new CypherpostBitcoinOps();
const s5crypto = new S5Crypto();
const identity = new CypherpostIdentity();
const badges = new CypherpostBadges();
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

enum PostType {
  Profile = "Profile",
  Ad = "Ad",
  Preferences = "Preferences"
}

interface Profile {
  type: PostType,
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
  type: PostType,
  order: OrderType,
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

interface TestKeySet {
  mnemonic: string,
  root_xprv: string,
  cypherpost_parent: ExtendedKeys,
  identity_xpub: string;
  identity_private: string;
  identity_pubkey: string;
};

const init_identity_ds = "m/0h/0h/0h";
const init_profile_ds = "m/1h/0h/0h";
const init_preferences_ds = "m/2h/0h/0h"
const init_posts_ds = "m/3h/0h/0h";
const trusted_badge = BadgeType.Trusted;

let a_key_set: TestKeySet;
let b_key_set: TestKeySet;
let c_key_set: TestKeySet;

let a_profile_set: TestProfileSet;
let b_profile_set: TestProfileSet;
let c_profile_set: TestProfileSet;

let a_post_set: TestPostSet;
let b_post_set: TestPostSet;
let c_post_set: TestPostSet;

let endpoint;
let body;
let nonce = Date.now();
let request_signature;

let all_identities;
let all_badges;

let a_trust = [];
let b_trust = [];
let c_trust = [];

let a_preferences = {
  muted: [],
};
let cypher_preference;
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
    const identity_parent = await bitcoin.derive_hardened_str(cypherpost_parent.xprv, init_identity_ds);
    if (identity_parent instanceof Error) throw identity_parent;
    const identity_ecdsa = await bitcoin.extract_ecdsa_pair(identity_parent);
    if (identity_ecdsa instanceof Error) throw identity_ecdsa;

    const set: TestKeySet = {
      mnemonic,
      root_xprv,
      cypherpost_parent,
      identity_xpub: identity_parent.xpub,
      identity_private: identity_ecdsa.privkey,
      identity_pubkey: identity_ecdsa.pubkey
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
function createDefaultTestPost(type: PostType, order: OrderType, message: string, fixed: boolean): Post {
  return {
    message,
    type,
    order,
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
async function createIdentityRegistrationRequest(username, key_set: TestKeySet) {
  const endpoint = "/api/v2/identity";
  const body = {
    username,
  };
  const nonce = Date.now();
  const message = `POST ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
async function createIdentityGetRequest(key_set: TestKeySet) {
  const endpoint = "/api/v2/identity/all";
  const nonce = Date.now();
  const body = {};
  const message = `GET ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
async function createBadgeIssueRequest(badge: BadgeType, to_pubkey: string, key_set: TestKeySet) {
  const endpoint = "/api/v2/badges/trust";
  const nonce = Date.now();

  const badge_signature = await bitcoin.sign(`${key_set.identity_pubkey}:${to_pubkey}:${badge.toString()}:${nonce}`, key_set.identity_private) as string;

  const body = {
    trusting: to_pubkey,
    nonce,
    signature: badge_signature
  };

  const message = `POST ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}

async function createBadgesGetAllRequest(key_set: TestKeySet) {
  const endpoint = "/api/v2/badges/all";
  const nonce = Date.now();
  const body = {};
  const message = `GET ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
async function createPostRequest(expiry: number, post_set: TestPostSet, key_set: TestKeySet) {
  const endpoint = "/api/v2/posts";
  const nonce = Date.now();
  const body = {
    expiry,
    cypher_json: post_set.cypher,
    derivation_scheme: init_posts_ds
  };

  const message = `PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
async function createPostsGetSelfRequest(key_set: TestKeySet) {
  const endpoint = "/api/v2/posts/self";
  const nonce = Date.now();
  const body = {};

  const message = `GET ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
async function createPostsGetOthersRequest(key_set: TestKeySet) {
  const endpoint = "/api/v2/posts/others";
  const nonce = Date.now();
  const body = {};

  const message = `GET ${endpoint} ${JSON.stringify(body)} ${nonce}`;
  const signature = await bitcoin.sign(message, key_set.identity_private) as string;

  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}

async function createKeyStoreUpdate(post_set: TestPostSet, trusted_list: string[], key_set: TestKeySet) {
  const endpoint = "/api/v2/posts/keys";
  const nonce = Date.now();

  const body = {
    decryption_keys: [],
    post_id: post_set.post_id
  };

  trusted_list.map(async (trusted_pubkey) => {

    const shared_sercret = bitcoin.calculate_shared_secret({
      privkey: key_set.identity_private,
      pubkey: trusted_pubkey
    }) as string;

    const decryption_key = s5crypto.encryptAESMessageWithIV(post_set.encryption_key, shared_sercret);
    const dk_entry = {
      decryption_key,
      reciever: trusted_pubkey
    };
    body.decryption_keys.push(dk_entry);
  });

  const signature = await bitcoin.sign(`PUT ${endpoint} ${JSON.stringify(body)} ${nonce}`, key_set.identity_private);

  // console.log( JSON.stringify({body},null,2))
  return {
    nonce,
    endpoint,
    body,
    signature,
    pubkey: key_set.identity_pubkey
  }
}


async function createRevokeTrustRequest(revoke: string, key_set: TestKeySet) {
  const endpoint = "/api/v2/badges/trust/revoke";
  const body = {
    revoking: revoke,
  };
  const nonce = Date.now();
  const signature = await bitcoin.sign(`POST ${endpoint} ${JSON.stringify(body)} ${nonce}`, key_set.identity_private);
  return {
    nonce,
    endpoint,
    body,
    signature: signature,
    pubkey: key_set.identity_pubkey
  }
}
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

describe("CYPHERPOST: API BEHAVIOUR SIMULATION", function () {
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
      type: PostType.Profile,
      nickname: "Alice Articulates",
      status: "Sound Money, Sound World.",
      contact: "@alice3us on Telegram"
    }, a_key_set.cypherpost_parent, init_profile_ds);

    b_profile_set = createProfileSet({
      type: PostType.Profile,
      nickname: "Bobby Breeds",
      status: "Making Babies.",
      contact: "@bob3us on Telegram"
    }, b_key_set.cypherpost_parent, init_profile_ds);

    c_profile_set = createProfileSet({
      type: PostType.Profile,
      nickname: "Carol Cares",
      status: "Trying Hard Not To Cry.",
      contact: "@carol3us on Telegram"
    }, c_key_set.cypherpost_parent, init_profile_ds);
    // ------------------ (◣_◢) ------------------
    a_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Sell, "Urgent", true), a_key_set.cypherpost_parent, init_posts_ds);

    b_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Buy, "Stacking", false), b_key_set.cypherpost_parent, init_posts_ds);

    c_post_set = createPostSet(createDefaultTestPost(PostType.Ad, OrderType.Sell, "Contact me on Signal.", false), c_key_set.cypherpost_parent, init_posts_ds);
    // ------------------ (◣_◢) ------------------    
  });

  after(async function () {
    await identity.remove(a_key_set.identity_pubkey);
    await identity.remove(b_key_set.identity_pubkey);
    await identity.remove(c_key_set.identity_pubkey);
    await badges.removeAllOfUser(a_key_set.identity_pubkey);
    await badges.removeAllOfUser(b_key_set.identity_pubkey);
    await badges.removeAllOfUser(c_key_set.identity_pubkey);
    await posts.removeAllByOwner(a_key_set.identity_pubkey);
    await posts.removeAllByOwner(b_key_set.identity_pubkey);
    await posts.removeAllByOwner(c_key_set.identity_pubkey);
    await post_keys.removePostDecryptionKeyByGiver(a_key_set.identity_pubkey);
    await post_keys.removePostDecryptionKeyByGiver(b_key_set.identity_pubkey);
    await post_keys.removePostDecryptionKeyByGiver(c_key_set.identity_pubkey);
  });

  describe("REGISTER IDENTITIES for A B C and VERIFY REGISTRATION via GET ALL", function () {
    let request_a;
    let request_b;
    let request_c;
    let request_c_get;

    it("CREATES REQUEST OBJECTS", async function () {
      request_a = await createIdentityRegistrationRequest("alice", a_key_set);
      request_b = await createIdentityRegistrationRequest("bob", b_key_set);
      request_c = await createIdentityRegistrationRequest("carol", c_key_set);
      request_c_get = await createIdentityGetRequest(c_key_set);
    });

    it("REGISTERS IDENTITY A", function (done) {
      // console.log({ request_a })
      chai
        .request(server)
        .post(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("REGISTERS IDENTITY B", function (done) {
      // console.log({ request_b })

      chai
        .request(server)
        .post(request_b.endpoint)
        .set({
          "x-client-pubkey": request_b.pubkey,
          "x-nonce": request_b.nonce,
          "x-client-signature": request_b.signature,
        })
        .send(request_b.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("REGISTERS IDENTITY C", function (done) {
      // console.log({ request_c })

      chai
        .request(server)
        .post(request_c.endpoint)
        .set({
          "x-client-pubkey": request_c.pubkey,
          "x-nonce": request_c.nonce,
          "x-client-signature": request_c.signature,
        })
        .send(request_c.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS ALL IDENTITIES as C", function (done) {
      chai
        .request(server)
        .get(request_c_get.endpoint)
        .set({
          "x-client-pubkey": request_c_get.pubkey,
          "x-nonce": request_c_get.nonce,
          "x-client-signature": request_c_get.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          all_identities = res.body['identities'];
          let counter = 0;
          // console.log({ all_identities });
          all_identities.map((identity) => {
            if (identity.pubkey === a_key_set.identity_pubkey ||
              identity.pubkey === b_key_set.identity_pubkey ||
              identity.pubkey === c_key_set.identity_pubkey)
              counter++;
          })
          expect(counter).to.equal(3);
          done();
        })
    });
  });

  describe("ISSUE TRUST BADGE A->B->C and VERIFY via GET ALL", function () {
    let request_a;
    let request_b;
    let request_c;
    // let request_c_get_self;
    let request_c_get_all;

    it("CREATES REQUEST OBJECTS", async function () {
      request_a = await createBadgeIssueRequest(BadgeType.Trusted, b_key_set.identity_pubkey, a_key_set);
      request_b = await createBadgeIssueRequest(BadgeType.Trusted, c_key_set.identity_pubkey, b_key_set);
      request_c = await createBadgeIssueRequest(BadgeType.Trusted, a_key_set.identity_pubkey, c_key_set);
      request_c_get_all = await createBadgesGetAllRequest(c_key_set);
    });

    it("ISSUES TRUST BADGE A->B", function (done) {
      chai
        .request(server)
        .post(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("ISSUES TRUST BADGE B->C", function (done) {
      chai
        .request(server)
        .post(request_b.endpoint)
        .set({
          "x-client-pubkey": request_b.pubkey,
          "x-nonce": request_b.nonce,
          "x-client-signature": request_b.signature,
        })
        .send(request_b.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("ISSUES TRUST BADGE C->A", function (done) {
      chai
        .request(server)
        .post(request_c.endpoint)
        .set({
          "x-client-pubkey": request_c.pubkey,
          "x-nonce": request_c.nonce,
          "x-client-signature": request_c.signature
        })
        .send(request_c.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS ALL BADGES as C", function (done) {
      chai
        .request(server)
        .get(request_c_get_all.endpoint)
        .set({
          "x-client-pubkey": request_c_get_all.pubkey,
          "x-nonce": request_c_get_all.nonce,
          "x-client-signature": request_c_get_all.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['badges'].length).to.equal(3);
          all_badges = res.body['badges'];
          done();
        })
    });
    it("VERIFIES ALL BADGES ISSUED and POPULATES EACH USER's TRUSTED", function (done) {
      all_badges.map(async (badge) => {
        const message = `${badge.giver}:${badge.reciever}:${badge.type}:${badge.nonce}`;
        const verify = await bitcoin.verify(message, badge.signature, badge.giver);
        if (!verify) throw "Badge Signature failed.";
        if (badge.giver === a_key_set.identity_pubkey) a_trust.push(badge.reciever);
        if (badge.giver === b_key_set.identity_pubkey) b_trust.push(badge.reciever);
        if (badge.giver === c_key_set.identity_pubkey) c_trust.push(badge.reciever);
      });
      done();
    });
  });

  describe("CREATES POSTS for A, B & C and VERIFY via GET SELF", function () {
    let request_a;
    let request_a0;
    let request_a_get_self;
    let request_b;
    let request_b_get_self;
    let request_c;
    let request_c_get_self;
    let request_c_get_others;

    it("CREATES REQUEST OBJECTS", async function () {
      request_a = await createPostRequest(Date.now() + 10, a_post_set, a_key_set);
      request_a0 = await createPostRequest(Date.now() + 10000, a_post_set, a_key_set);
      request_b = await createPostRequest(Date.now() + 10000, b_post_set, b_key_set);
      request_c = await createPostRequest(Date.now() + 10000, c_post_set, c_key_set);
      request_a_get_self = await createPostsGetSelfRequest(a_key_set);
      request_b_get_self = await createPostsGetSelfRequest(b_key_set);
      request_c_get_self = await createPostsGetSelfRequest(c_key_set);

      request_c_get_others = await createPostsGetOthersRequest(c_key_set);
    });

    it("CREATES POSTS: A - 1 expires", function (done) {
      chai
        .request(server)
        .put(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['id'].startsWith('s5')).to.equal(true);
          done();
        });
    });
    it("CREATES POSTS: A - 1 persists", function (done) {
      chai
        .request(server)
        .put(request_a0.endpoint)
        .set({
          "x-client-pubkey": request_a0.pubkey,
          "x-nonce": request_a0.nonce,
          "x-client-signature": request_a0.signature,
        })
        .send(request_a0.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['id'].startsWith('s5')).to.equal(true);
          a_post_set.post_id = res.body['id'];
          done();
        });
    });
    it("CREATES POSTS: B - 1 persists", function (done) {
      chai
        .request(server)
        .put(request_b.endpoint)
        .set({
          "x-client-pubkey": request_b.pubkey,
          "x-nonce": request_b.nonce,
          "x-client-signature": request_b.signature,
        })
        .send(request_b.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['id'].startsWith('s5')).to.equal(true);
          b_post_set.post_id = res.body['id'];
          done();
        });
    });
    it("CREATES POSTS: C - 1 persists", function (done) {
      chai
        .request(server)
        .put(request_c.endpoint)
        .set({
          "x-client-pubkey": request_c.pubkey,
          "x-nonce": request_c.nonce,
          "x-client-signature": request_c.signature
        })
        .send(request_c.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['id'].startsWith('s5')).to.equal(true);
          c_post_set.post_id = res.body['id'];
          done();
        });
    });
    it("GETS A SELF POSTS", function (done) {
      chai
        .request(server)
        .get(request_a_get_self.endpoint)
        .set({
          "x-client-pubkey": request_a_get_self.pubkey,
          "x-nonce": request_a_get_self.nonce,
          "x-client-signature": request_a_get_self.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          // 1 EXPIRED, 1 PERSISTED
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(a_post_set.cypher);
          done();
        })
    });
    it("GETS B SELF POSTS", function (done) {
      chai
        .request(server)
        .get(request_b_get_self.endpoint)
        .set({
          "x-client-pubkey": request_b_get_self.pubkey,
          "x-nonce": request_b_get_self.nonce,
          "x-client-signature": request_b_get_self.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(b_post_set.cypher);
          done();
        });
    });
    it("GETS C SELF POSTS", function (done) {
      chai
        .request(server)
        .get(request_c_get_self.endpoint)
        .set({
          "x-client-pubkey": request_c_get_self.pubkey,
          "x-nonce": request_c_get_self.nonce,
          "x-client-signature": request_c_get_self.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length === 1).to.equal(true);
          expect(res.body['posts'][0].cypher_json).to.equal(c_post_set.cypher);
          done();
        });
    });
    it("GETS C OTHERS POSTS -> None as B has not shared keys", function (done) {
      chai
        .request(server)
        .get(request_c_get_others.endpoint)
        .set({
          "x-client-pubkey": request_c_get_others.pubkey,
          "x-nonce": request_c_get_others.nonce,
          "x-client-signature": request_c_get_others.signature,
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length === 0).to.equal(true);
          // expect(res.body['posts'][0].cypher_json).to.equal(b_post_set.cypher);
          done();
        });
    });
  });

  describe("UPDATE POST KEYS based on Trust Badges and VERIFY via GET OTHERS", function () {
    let request_a;
    let request_b;
    let request_c;
    let request_a_get_others;
    let request_b_get_others;
    let request_c_get_others;

    it("CREATES POST KEY REQUESTS", async function () {
      request_a = await createKeyStoreUpdate(a_post_set, a_trust, a_key_set);
      request_b = await createKeyStoreUpdate(b_post_set, b_trust, b_key_set);
      request_c = await createKeyStoreUpdate(c_post_set, c_trust, c_key_set);
      request_a_get_others = await createPostsGetOthersRequest(a_key_set);
      request_b_get_others = await createPostsGetOthersRequest(b_key_set);
      request_c_get_others = await createPostsGetOthersRequest(c_key_set);
    });

    it("UPDATES POST DECRYPTION KEYS of A TRUSTED", function (done) {
      chai
        .request(server)
        .put(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("UPDATES POST DECRYPTION KEYS of B TRUSTED", function (done) {
      chai
        .request(server)
        .put(request_b.endpoint)
        .set({
          "x-client-pubkey": request_b.pubkey,
          "x-nonce": request_b.nonce,
          "x-client-signature": request_b.signature,
        })
        .send(request_b.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("UPDATES POST DECRYPTION KEYS of C TRUSTED", function (done) {
      chai
        .request(server)
        .put(request_c.endpoint)
        .set({
          "x-client-pubkey": request_c.pubkey,
          "x-nonce": request_c.nonce,
          "x-client-signature": request_c.signature,
        })
        .send(request_c.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
    it("GETS A OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
      chai
        .request(server)
        .get(request_a_get_others.endpoint)
        .set({
          "x-client-pubkey": request_a_get_others.pubkey,
          "x-nonce": request_a_get_others.nonce,
          "x-client-signature": request_a_get_others.signature,
        })
        .send(request_a_get_others.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            privkey: a_key_set.identity_private,
            pubkey: c_key_set.identity_pubkey
          }) as string;

          const c_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret) as string;
          const c_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, c_decryption_key) as string;
          expect(JSON.parse(c_decrypted_post)['type']).to.equal(c_post_set.plain.type);
          done();
        });
    });
    it("GETS B OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
      chai
        .request(server)
        .get(request_b_get_others.endpoint)
        .set({
          "x-client-pubkey": request_b_get_others.pubkey,
          "x-nonce": request_b_get_others.nonce,
          "x-client-signature": request_b_get_others.signature,
        })
        .send(request_b_get_others.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length).to.equal(1);

          const shared_sercret = bitcoin.calculate_shared_secret({
            privkey: b_key_set.identity_private,
            pubkey: a_key_set.identity_pubkey
          }) as string;

          const a_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret) as string;
          const a_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, a_decryption_key) as string;
          expect(JSON.parse(a_decrypted_post)['type']).to.equal(a_post_set.plain.type);
          done();
        });
    });
    it("GETS C OTHERS POSTS and VERIFY via ABILITY TO DECRYPT", function (done) {
      chai
        .request(server)
        .get(request_c_get_others.endpoint)
        .set({
          "x-client-pubkey": request_c_get_others.pubkey,
          "x-nonce": request_c_get_others.nonce,
          "x-client-signature": request_c_get_others.signature,
        })
        .send(request_c_get_others.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['posts'].length).to.equal(1);
          const shared_sercret = bitcoin.calculate_shared_secret({
            privkey: c_key_set.identity_private,
            pubkey: b_key_set.identity_pubkey
          }) as string;

          const b_decryption_key = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].decryption_key, shared_sercret) as string;
          const b_decrypted_post = s5crypto.decryptAESMessageWithIV(res.body['posts'][0].cypher_json, b_decryption_key) as string;
          expect(JSON.parse(b_decrypted_post)['type']).to.equal(b_post_set.plain.type);
          done();
        });
    });
  });

  describe("REVOKE A->B TRUST", function () {
    let request_a;
    it("CREATES REVOKE REQUEST", async function () {
      request_a = await createRevokeTrustRequest(b_key_set.identity_pubkey, a_key_set);
    });
    it("REVOKES TRUST FROM A->B", function (done) {
      chai
        .request(server)
        .post(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body['status']).to.equal(true);
          done();
        });
    });
  });

  describe("E: 409's", function () {
    let request_a;
    let request_b;
    let request_c;

    it("CREATES REQUEST OBJECTS", async function () {
      request_a = await createIdentityRegistrationRequest("alivf", a_key_set);
      // console.log({ request_a })
      request_b = await createBadgeIssueRequest(BadgeType.Trusted, c_key_set.identity_pubkey, b_key_set);
      request_c = await createKeyStoreUpdate(c_post_set, c_trust, c_key_set);
    });
    it("PREVENTS DUPLICATE IDENTITY", function (done) {
      // console.log({request_a})
      chai
        .request(server)
        .post(request_a.endpoint)
        .set({
          "x-client-pubkey": request_a.pubkey,
          "x-nonce": request_a.nonce,
          "x-client-signature": request_a.signature,
        })
        .send(request_a.body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
    it("PREVENTS DUPLICATE TRUST BADGE", function (done) {
      chai
        .request(server)
        .post(request_b.endpoint)
        .set({
          "x-client-pubkey": request_b.pubkey,
          "x-nonce": request_b.nonce,
          "x-client-signature": request_b.signature,
        })
        .send(request_b.body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    });
    it("PREVENTS DUPLICATE POSTS DECRYPTION KEY ENTRY", function (done) {
      chai
        .request(server)
        .put(request_c.endpoint)
        .set({
          "x-client-pubkey": request_c.pubkey,
          "x-nonce": request_c.nonce,
          "x-client-signature": request_c.signature,
        })
        .send(request_c.body)
        .end((err, res) => {
          res.should.have.status(409);
          done();
        });
    })
  });

  describe.skip("GLOBAL", function () {
    it("DELETES ALL CREATED IDENTITIES AND ALL ASSOCIATIONS", async function (done) {
      endpoint = "/api/v2/identity";
      body = {};
      nonce = Date.now();
      request_signature = await bitcoin.sign(`DELETE ${endpoint} ${JSON.stringify(body)} ${nonce}`, a_key_set.identity_private);
      chai
        .request(server)
        .delete(endpoint)
        .set({
          "x-client-pubkey": a_key_set.identity_pubkey,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
        });

      nonce = Date.now();
      request_signature = await bitcoin.sign(`DELETE ${endpoint} ${JSON.stringify(body)} ${nonce}`, b_key_set.identity_private);
      chai
        .request(server)
        .delete(endpoint)
        .set({
          "x-client-pubkey": b_key_set.identity_pubkey,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
        });

      nonce = Date.now();
      request_signature = await bitcoin.sign(`DELETE ${endpoint} ${JSON.stringify(body)} ${nonce}`, c_key_set.identity_private);
      chai
        .request(server)
        .delete(endpoint)
        .set({
          "x-client-pubkey": c_key_set.identity_pubkey,
          "x-nonce": nonce,
          "x-client-signature": request_signature,
        })
        .send(body)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });

    });
    it.skip("DUMPS ENTIRE DATABASE", function (done) {
      done();
    });
  });

});


