/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { Key, UseCase, UserKeys } from "./interface";
import { MongoKeyStore } from "./mongo";

const store = new MongoKeyStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------

let user_keys: UserKeys =  {
  username: "i5hi",
  recipient_xpub: "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5",
  profile_keys: [{
    key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
    id: "s5id8oiu23fsljh"
  }],
  post_keys: [{
    key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
    id: "s5id08uoijlk897u8u"
  }]
};

let new_profile_key: Key={
  key: "96b1002e877db2ce71f136e969a1c6c1:P63HbYuLIWSw9Zv2poRYEoJI8p9OQDamEhs06G3neDm5D33xHp++ve3RsB85inQflrx+RKr8KNf+Q3wu9ZGXQo/SCYURaodClIolHaF2/dqYVx8x2/OzutKDiZizvkwUa8SJqdV++rCXz63Q5haCOA==",
  id: "s5id9021i3k128uhjsd"
};

let new_post_key: Key={
  key: "96b1002e877db2ce71f136e969a1c6c1:YL898JviLIWSw9Zv2poRYEoJI8p9OQDamEhs06G3neDm5D33xHp++ve3RsB85inQflrx+RKr8KNf+Q3wu9ZGXQo/SCYURaodClIolHaF2/dqYVx8x2/OzutKDiZizvkwUa8SJqdV++rCXz63Q5haCOA==",
  id: "s5id9021i3k128uhjsd"
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Key Storage", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };

    await db.connect(connection);

  });

  after(async function () {
    await store.remove(user_keys.username);
    // await store.remove({username: "ravi"});

  });

  describe("KEY STORAGE OPERATIONS:", async function () {
    it("should CREATE a new key store entry in mongo AND READ key store from mongo", async function () {
      const response = await store.create(user_keys);
      expect(response).to.equal(true);
      const user = await store.read(user_keys.username);
      if(user instanceof Error) throw user;
      expect(user['recipient_xpub']).to.equal(user_keys.recipient_xpub);

      const users = await store.readMany([user_keys.username]);
      if(users instanceof Error) throw users;
      expect(users.length).to.equal(1);
    });

    it("should PUSH & PULL a profile key set and post key set", async function () {
      const push_response = await store.update_push(user_keys.username, UseCase.Profile, new_profile_key);
      expect(push_response).to.equal(true);
      let user = await store.read(user_keys.username);
      expect(user['profile_keys'].length).to.equal(2);
      const pull_response = await store.update_pull(user_keys.username, UseCase.Profile, new_profile_key);
      expect(pull_response).to.equal(true);
      user = await store.read(user_keys.username);
      expect(user['profile_keys'].length).to.equal(1);
    });
  });

});
