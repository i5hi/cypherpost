/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { UserAuth } from "./interface";
import { MongoAuthStore, test_create_admin } from "./mongo";
const sinon = require("sinon");

const rsa_filename = "sats_sig";

const store = new MongoAuthStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
let password = "mysecret";
let pass256 = "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0";
let new_password = "mynewsecret";
let new_pass256 = "6ccabd5d1defd8e78f7c0b768a27cc7ae4caab5f8e62ec3b35ab48b1f8f69908";
let seed = "eye busy fence satisfy garage senior traffic city ivory joy tent napkin supreme diamond ring cloud utility knock satisfy broom add canvas swim naive";
let seed256 = "a7238fdd7584a8612f8a494dcdeb525af77813a47dead83a73318a4ae2fc28e6";

let invite_code = "uyu7i8bhs";

let user_auth: UserAuth = {
  username,
  genesis: Date.now(),
  uid: "s5idSOMEID",
  pass256,
  seed256,
  invited_by: "ravi",
  inviter_code: invite_code
};
let user_auth_update: UserAuth = {
  username,
  pass256: new_pass256,
  seed256
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Auth Storage", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: 'lionbit',
      auth: 'lb:secret',
    };

    await db.connect(connection);

    await test_create_admin();
  });

  after(async function () {
    await store.remove(user_auth);
    await store.remove({username: "ravi"});

  });

  describe("AUTH STORAGE OPERATIONS:", async function () {
    it("should CREATE a new user entry in mongo AND READ user from mongo", async function () {
      const response = await store.create(user_auth);
      expect(response).to.have.property("uid");
      const user = await store.read(user_auth);
      expect(user['username']).to.equal(response['username']);
    });
    it("should UPDATE a user pass256 entry in mongo using seed256", async function () {
      const response = await store.update(user_auth,  user_auth_update);
      expect(response['pass256']).to.equal(new_pass256);
    });
    it("should PUSH & PULL a user invite_code array with an invite_code", async function () {
      const push_response = await store.update_push(user_auth, invite_code);
      expect(push_response).to.equal(true);
      const user = await store.read(user_auth);
      expect(user['invite_codes'].includes(invite_code)).to.equal(true);
      const pull_response = await store.update_pull(user_auth, invite_code);
      expect(pull_response).to.equal(true);
      const _user = await store.read(user_auth);
      expect(_user['invite_codes'].includes(invite_code)).to.equal(false);
    });
  });

});
