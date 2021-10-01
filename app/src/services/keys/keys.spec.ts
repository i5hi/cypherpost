/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { UserKeys } from "./interface";
import { LionBitKeys } from "./keys";
import { MongoKeyStore } from "./mongo";

const sinon = require("sinon");

const rsa_filename = "sats_sig";

const keys = new LionBitKeys();
const store = new MongoKeyStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const username = "i5hi";
let recipient_xpub = "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5";

const recipient_key = {
  key: "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5",
  id: "s5id8jkdu9oij",
  signature: "+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/"
};

const profile_key = {
  key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
  id: "s5id8oiu23fsljh"
};

const post_key = {
  key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
  id: "s5id08uoijlk897u8u"
};

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Keys Controller", function () {
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
    await keys.remove(username);
  });

  describe("KEYS CONTROLLER OPERATIONS:", async function () {
    it("should INITIALIZE a key collection", async function () {
      const response = await keys.init(username,recipient_xpub);
      if (response instanceof Error) throw response;
      expect(response).equals(true);
    });

    it("should FIND a key collection", async function () {
      const response = await keys.find(username);
      if (response instanceof Error) throw response;
      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(0);
      expect(response['profile_keys'].length).equals(0);
      expect(response['post_keys'].length).equals(0);
    });

    it("should FIND MANY key collections", async function () {
      const response = await keys.findMany([username]);
      if (response instanceof Error) throw response;
      expect(response.length).equals(1);
    });

    it("should ADD a PROFILE KEY to the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.add_recipient_key(username,recipient_key);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(1);
      expect(response['profile_keys'].length).equals(0);
      expect(response['post_keys'].length).equals(0);
    });

    it("should ADD a PROFILE KEY to the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.add_profile_key(username,profile_key);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(1);
      expect(response['profile_keys'].length).equals(1);
      expect(response['post_keys'].length).equals(0);
    });

    it("should ADD a POST KEY to the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.add_post_key(username,post_key);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(1);
      expect(response['profile_keys'].length).equals(1);
      expect(response['post_keys'].length).equals(1);
    });

    it("should REMOVE a RECIPIENT KEY from the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.remove_recipient_key(username,recipient_key.id);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(0);
      expect(response['profile_keys'].length).equals(1);
      expect(response['post_keys'].length).equals(1);
    });

    it("should REMOVE a PROFILE KEY to the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.remove_profile_key(username,profile_key.id);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['recipient_keys'].length).equals(0);
      expect(response['profile_keys'].length).equals(0);
      expect(response['post_keys'].length).equals(1);
    });

    it("should REMOVE a POST KEY to the collection", async function () {
      let response: boolean | UserKeys | Error = await keys.remove_post_key(username,post_key.id);
      if (response instanceof Error) throw response;
      expect(response).equals(true);

      response = await keys.find(username);
      if (response instanceof Error) throw response;

      expect(response['username']).equals(username);
      expect(response['recipient_xpub']).equals(recipient_xpub);
      expect(response['profile_keys'].length).equals(0);
      expect(response['post_keys'].length).equals(0);
    });

  });
});
