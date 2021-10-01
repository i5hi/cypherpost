/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { LionBitAuth } from "./auth";
import { MongoAuthStore, test_create_admin } from "./mongo";

const sinon = require("sinon");

const rsa_filename = "sats_sig";

const auth = new LionBitAuth();
const store = new MongoAuthStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let invited_by = "ravi";
let invite_code = "t780opsd";

let username = "ishi";
let password = "mysecret";
let pass256 = "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0";
let new_password = "mynewsecret";
let new_pass256 = "6ccabd5d1defd8e78f7c0b768a27cc7ae4caab5f8e62ec3b35ab48b1f8f69908";
let seed = "eye busy fence satisfy garage senior traffic city ivory joy tent napkin supreme diamond ring cloud utility knock satisfy broom add canvas swim naive";
let seed256 = "a7238fdd7584a8612f8a494dcdeb525af77813a47dead83a73318a4ae2fc28e6";

let admin_password = "supersecret";
let admin_seed = "awesome scene embark enough rely antique honey imitate jelly illness muffin retreat";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Auth Controller", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };

    await db.connect(connection);
    await test_create_admin();
  });

  after(async function () {
    await store.remove({username: invited_by});
    await store.remove({username});

  });

  describe("AUTH CONTROLLER OPERATIONS:", async function () {

    it("should INVITE a user by generating a new invite code", async function () {
      const response = await auth.invite(invited_by);
      if(response instanceof Error) throw response;
      invite_code = response;
      expect(response.length).to.equal(12);
    });

    it("should CHECK AN INVITATION", async function () {
      const response = await auth.check_invite(invited_by, invite_code);
      if(response instanceof Error) throw response;
      expect(response).to.equal(true);
    });
    
    it("should REGISTER a new user", async function () {
      const response = await auth.register(username, pass256, seed256, invited_by, invite_code);
      if(response instanceof Error) throw response;
      
      expect(response.startsWith("e")).to.equal(true);
    });

    it("should CHECK if a provided seed256 matches", async function () {
      const response = await auth.check_seed256(username,seed256);
      if(response instanceof Error) throw response;
      
      expect(response).to.equal(true);
    });
    
    it("should LOGIN a user", async function () {
      const response = await auth.login(username,pass256);
      if(response instanceof Error) throw response;

      expect(response.startsWith("e")).to.equal(true);
    });
    
    it("should RESET a user password", async function () {
      const response = await auth.reset(seed256,new_pass256);
      if(response instanceof Error) throw response;

      expect(response.startsWith("e")).to.equal(true);
    });

    it("should LOGIN a user with new password", async function () {
      const response = await auth.login(username,new_pass256);
      if(response instanceof Error) throw response;

      expect(response.startsWith("e")).to.equal(true);
    });
    
    it("should REMOVE a user", async function () {
      const response = await auth.remove(username);
      if(response instanceof Error) throw response;
      
      expect(response).to.equal(true);
    });

  });

});
