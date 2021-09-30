/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { TrustDirection, UserProfile, UserSet } from "./interface";
import { MongoProfileStore } from "./mongo";

const store = new MongoProfileStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
let nickname = "Bitcoin Watchdog";
let status = "Sound Money, Sound World.";
let contact_info = "Contact me on telegram @i5hi_ or Signal: +97283782733";
let updated_contact_info = "Contact me on telegram @i5hi_ ONLY";

let user_profile: UserProfile =  {
  username,
  nickname,
  status,
  cipher_info: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
  derivation_scheme:"m/0h/0h",
  trusted_by:[],
  trusting:[],
};

let update :UserProfile  = {
  nickname: "UV Bitcoin Watchdog"
};

let trusted_by: UserSet={
  username: "ravi",
  mute: false
};

let trusting: UserSet={
  username: "mj"
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Profile Storage", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: 'lionbit',
      auth: 'lb:secret',
    };

    await db.connect(connection);

  });

  after(async function () {
    await store.remove(user_profile.username);
    // await store.remove({username: "ravi"});

  });

  describe("PROFILE STORAGE OPERATIONS:", async function () {
    it("should CREATE a NEW PROFILE in mongo AND READ PROFILE from mongo", async function () {
      const response = await store.create(user_profile);
      expect(response).to.equal(true);
      const user = await store.read(user_profile.username);
      if(user instanceof Error) throw user;
      expect(user['nickname']).to.equal(user_profile.nickname);
      expect(user['status']).to.equal(user_profile.status);
      expect(user['cipher_info']).to.equal(user_profile.cipher_info);

      const users = await store.readMany([user_profile.username]);
      if(users instanceof Error) throw users;
      expect(users.length).to.equal(1);

    });

    it("should UPDATE a PROFILE in mongo AND READ UPDATED PROFILE from mongo", async function () {
      const response = await store.update(username, update);
      if(response instanceof Error) throw response;
      
      expect(response['nickname']).to.equal(update.nickname);

    });

    it("should PUSH & PULL a USER SET to TRUSTING ARRAY", async function () {
      const push_response = await store.update_push(user_profile.username, TrustDirection.Trusting, trusting);
      expect(push_response).to.equal(true);
      let user = await store.read(user_profile.username);
      expect(user['trusting'].length).to.equal(1);
      const pull_response = await store.update_pull(user_profile.username, TrustDirection.Trusting, trusting);
      expect(pull_response).to.equal(true);
      user = await store.read(user_profile.username);
      expect(user['trusting'].length).to.equal(0);
    });

    it("should PUSH & PULL a USER SET to TRUSTED_BY ARRAY", async function () {
      const push_response = await store.update_push(user_profile.username, TrustDirection.TrustedBy, trusted_by);
      expect(push_response).to.equal(true);
      let user = await store.read(user_profile.username);
      expect(user['trusted_by'].length).to.equal(1);
      const pull_response = await store.update_pull(user_profile.username, TrustDirection.TrustedBy, trusted_by);
      expect(pull_response).to.equal(true);
      user = await store.read(user_profile.username);
      expect(user['trusted_by'].length).to.equal(0);
    });
  });

});
