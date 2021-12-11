/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { UserPost } from "./interface";
import { MongoPostStore } from "./mongo";

const store = new MongoPostStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
let username = "ishi";
let id0 = "someid1";
let id1 = "someid1";
let id2 = "someid1";

let ds0 = "2h/0h/0h";
let ds1 = "2h/1h/0h";
let ds2 = "2h/2h/0h";

const post0: UserPost =  {
  username,
  id: id0,
  genesis: Date.now(),
  expiry: Date.now() + 1000 * 60 * 60 * 2,
  cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
  derivation_scheme:ds0,

};

const post1: UserPost =  {
  username,
  id: id1,
  genesis: Date.now(),
  expiry: Date.now() + 1000 * 60 * 60 * 2,
  cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
  derivation_scheme:ds1,

};

const post2: UserPost =  {
  username,
  id: id2,
  genesis: Date.now(),
  expiry: Date.now() + 1000 * 60 * 60 * 2,
  cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
  derivation_scheme:ds2,

};




// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Posts Storage", function () {
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

  });

  describe("PROFILE STORAGE OPERATIONS:", async function () {
    it("should CREATE a NEW PROFILE in mongo AND READ PROFILE from mongo", async function () {
      const response = await store.create(post0);
      expect(response['id']).to.equal(id0);
      let post = await store.read({id: post0.id});
      if(post instanceof Error) throw post;
      expect(post[0]['genesis']).to.equal(post0.genesis);
      
      await store.create(post1);
      await store.create(post2);
      let posts = await store.readMany([post0.id, post1.id, post2.id]);
      if(posts instanceof Error) throw posts;
      expect(posts.length).to.equal(3);
      posts = await store.read({username: username});
      if(posts instanceof Error) throw posts;
      expect(posts.length).to.equal(3);

    });

    it("should REMOVE each POST", async function () {
      let response = await store.remove({id:id0});
      if(response instanceof Error) throw response;
      expect(response).to.equal(true);
      response = await store.remove({id:id1});
      if(response instanceof Error) throw response;
      expect(response).to.equal(true);
      response = await store.remove({id:id2});
      if(response instanceof Error) throw response;
      expect(response).to.equal(true);

      const posts = await store.read({username: username});
      if(posts instanceof Error) throw posts;
      expect(posts.length).to.equal(0);
    });


  });

});
