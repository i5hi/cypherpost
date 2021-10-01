/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { S5UID } from "../../lib/uid/uid";
import { LionBitKeys } from "../keys/keys";
import { LionBitPosts } from "./posts";
const sinon = require("sinon");

const posts = new LionBitPosts();
const keys = new LionBitKeys();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const username = "ishi";
let id0 = "someid0";
let id1 = "someid1";
let id2 = "someid2";

let ds0 = "2h/0h/0h";
let ds1 = "2h/1h/0h";
let ds2 = "2h/2h/0h";

const cipher_json_0 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
const cipher_json_1 = "oid2j3fid3kjwqfoilj:199893eijd2o9k34q0os";
const cipher_json_2 = "oid2j786yuyuqfoilj:1093eijd2o9k34q0o999";

const user1 = "ravi";
const user2 = "mj";
// assuming trusting 2
// client sends username as id
// server replaces id with post id
const decryption_keys_for_ishi = [{
  id: user1,
  key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
},
{
  id: user2,
  key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
}];

const decryption_keys_for_ravi = [{
  id: username,
  key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
},
{
  id: user2,
  key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
}];

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Posts Controller", function () {
  const sandbox = sinon.createSandbox();

  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };

    await db.connect(connection);

    const stub0 = sinon.stub(S5UID.prototype, "createPostCode");
    stub0.onCall(0).returns(id0);
    stub0.onCall(1).returns(id1);

    await keys.init(username, "recipient_xpub0");
    await keys.init(user1, "recipient_xpub1");
    await keys.init(user2, "recipient_xpub2");

  });

  after(async function () {
    await keys.remove(user1);
    await keys.remove(user2);
    await posts.removeByUser(user1);
  });

  describe("PROFILE CONTROLLER OPERATIONS:", async function () {
    it("should CREATE a NEW POST (to be removedById)", async function () {
      const response = await posts.create(username, Date.now() + 10000, cipher_json_0, ds0, decryption_keys_for_ishi);
      if (response instanceof Error) throw response;
      expect(response.username).to.equal(username);
      const key_response = await keys.findMany([user1, user2]);
      if (key_response instanceof Error) throw key_response;
      expect(key_response.length).to.equal(2);
      expect(key_response[0].post_keys.length).to.equal(1);
    });
    it("should CREATE a NEW POST for different user(to be removedByUser)", async function () {
      let response = await posts.create(user1, Date.now() + 10000, cipher_json_0, ds0, decryption_keys_for_ravi);
      if (response instanceof Error) throw response;
      expect(response.username).to.equal(user1);
    });
    it("should FIND a POST", async function () {
      const response = await posts.find(username);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(1);
    });
    it("should FIND MANY POSTS", async function () {
      const response = await posts.findMany([id0, id1, id2]);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(2);
    });


    it("should delete By ID", async function () {
      let response: any = await posts.removeById(id0);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);
      response = await posts.find(username);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(0);
    });

    it("should delete By USER", async function () {
      let response: any = await posts.removeByUser(user1);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);
      response = await posts.find(user1);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(0);
    });
  });

});
