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
let username = "ishi";
let id0 = "someid1";
let id1 = "someid1";
let id2 = "someid1";

let ds0 = "2h/0h/0h";
let ds1 = "2h/1h/0h";
let ds2 = "2h/2h/0h";

const cipher_json_0 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
const cipher_json_1 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
const cipher_json_2 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";

const user1 = "ravi";
const user2 = "mj";
// assuming trusting 2
// client sends username as id
// server replaces id with post id
let decryption_keys = [{
    id: user1,
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
      name: 'lionbit',
      auth: 'lb:secret',
    };

    await db.connect(connection);

    const stub0 = sinon.stub(S5UID.prototype, "createPostCode");
    stub0.onCall(0).returns(id0);
 
    await keys.init(user1, "recipient_xpub1");
    await keys.init(user2, "recipient_xpub2");

    
  });

  after(async function () {
    await keys.remove(user1);
    await keys.remove(user2);
    await posts.remove(id0);
    await posts.remove(id1);
    await posts.remove(id2);
  });

  describe("PROFILE CONTROLLER OPERATIONS:", async function () {
    it("should CREATE a NEW POST", async function () {
      const response = await posts.create(username,Date.now()+10000, cipher_json_0,ds0,decryption_keys);
      if (response instanceof Error) throw response;
      expect(response.username).to.equal(username);
      const key_response = await keys.findMany([user1,user2]);
      if (key_response instanceof Error) throw key_response;
      expect(key_response.length).to.equal(2);
      expect(key_response[0].post_keys.length).to.equal(1);
    });
    it("should FIND a POST", async function () {
      const response = await posts.find(username);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(1);
    });
    it("should FIND MANY POSTS", async function () {
      const response = await posts.findMany([id0,id1,id2]);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(1);
    });
    
  });

});
