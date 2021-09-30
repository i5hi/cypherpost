/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { LionBitKeys } from "../keys/keys";
import { UserProfile } from "./interface";
import { MongoProfileStore } from "./mongo";
import { LionBitProfile } from "./profile";


const profile = new LionBitProfile();
const keys = new LionBitKeys();
const store = new MongoProfileStore();

const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const username0 = "ishi";
const nickname0 = "Bitcoin Watchdog";
const status0 = "Sound Money, Sound World.";
const updated_status0 = "Watching Bitcoin.";
const contact_info0 = "Contact me on telegram @i5hi_ or Signal: +97283782733";
let cipher_info0 =  "";
const decryption_key00 = "for1";
const derivation_scheme0 = "m/0'/0'";
const recipient_xpub0 = "xpubasd9o3k2s";
const decryption_key01 = "for2";

const decryption_key_revoked_01 = "for1only";
const derivation_scheme_after_revoke = "m/0'/1'";

const new_key_set = [{
  key: "for1only",
  id: "ravi"
}]

const profile_update0 = {
  username: username0,
  status: updated_status0
};

const username1 = "ravi";
const nickname1 = "RPH";
const status1 = "Sound Money, Sound World.";
const contact_info1 = "Contact me on telegram @ravi or Signal: +938274982374";
let cipher_info1 =  "";
const derivation_scheme1 = "m/0'/0'";
const recipient_xpub1 = "xpubasd9o3k2s12ed2wesax";

const username2 = "mj";
const nickname2 = "mocodescmo";
const status2 = "Testing";
const contact_info2 = "Contact me on telegram @mj or Signal: +91230921834";
let cipher_info2 =  "";
const derivation_scheme2 = "m/0'/0'";
const recipient_xpub2 = "xpubasd9o3k2s122344324ed2wesax";

const signature = "TestSignaturueInMain.Spec.ts";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
async function cleanUp(){
  await profile.remove(username0);
  await profile.remove(username1);
  await profile.remove(username2);
  await keys.remove(username0);
  await keys.remove(username1);
  await keys.remove(username2);
  return true;
};

describe("Initalizing Test: Profile Controller", function () {
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
    await cleanUp();
  });
  describe("PROFILE CONTROLLER OPERATIONS:", async function () {
    it("should CREATE a NEW PROFILE for USER 0 collection", async function () {
      const response = await profile.genesis(username0,derivation_scheme0,recipient_xpub0);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);

    });

    it("should CREATE a NEW PROFILE for USER 1 collection", async function () {
      const response = await profile.genesis(username1,derivation_scheme1,recipient_xpub1);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);
    });

    it("should CREATE a NEW PROFILE for USER 2 collection", async function () {
      const response = await profile.genesis(username2,derivation_scheme2,recipient_xpub2);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);
    });

    it("should FIND a PROFILE collection", async function () {
      const response = await profile.find(username0);
      if (response instanceof Error) throw response;
      expect(response['nickname']).to.equal(nickname0);
    });

    it("should FIND MANY PROFILE collections", async function () {
      const response = await profile.findMany([username0,username1]);
      if (response instanceof Error) throw response;
      expect(response.length).to.equal(2);
    });

    it("should UPDATE a PROFILE collection", async function () {
      const response = await profile.update(username0,profile_update0);
      if (response instanceof Error) throw response;
      expect(response['status']).to.equal(updated_status0);
    });

    it("should MAKE USER 0 TRUST USER 1", async function () {
      let response: boolean | UserProfile | Error = await profile.trust(username0,username1,decryption_key00, signature);
      if (response instanceof Error) throw response;

      expect(response).to.equal(true);
      response = await profile.find(username0);
      if (response instanceof Error) throw response;

      expect(response['trusting'].some(element=>element.username === username1)).to.equal(true);
      response = await profile.find(username1);
      if (response instanceof Error) throw response;
      console.log({response})

      expect(response['trusted_by'].some(element=>element.username === username0)).to.equal(true);

      let key_response = await keys.find(username0);
      if (key_response instanceof Error) throw key_response;
      expect(key_response['recipient_keys'].some(element=>element.id === username1)).to.equal(true);
      expect(key_response['recipient_keys'].some(element=>element.signature === signature)).to.equal(true);
      expect(key_response['recipient_keys'].some(element=>element.key === recipient_xpub1)).to.equal(true);

      
    });
    it("should MAKE USER 0 TRUST USER 2", async function () {
      let response: boolean | UserProfile | Error = await profile.trust(username0,username2,decryption_key01,signature);
      if (response instanceof Error) throw response;
      expect(response).to.equal(true);
      response = await profile.find(username0);
      if (response instanceof Error) throw response;
      expect(response['trusting'].some(element=>element.username === username2)).to.equal(true);
      response = await profile.find(username2);
      if (response instanceof Error) throw response;
      expect(response['trusted_by'].some(element=>element.username === username0)).to.equal(true);
      
    });

    it("should MAKE USER 1 MUTE USER 0", async function () {
      let response: boolean | UserProfile | Error = await profile.mute(username1,username0,true);
      if (response instanceof Error) throw response;
      response = await profile.find(username1);
      if (response instanceof Error) throw response;
      expect(response['trusted_by'][0].username).to.equal(username0);
      expect(response['trusted_by'][0].mute).to.equal(true);
    });
    
    it("should MAKE USER 1 UNMUTE USER 0", async function () {
      let response: boolean | UserProfile | Error = await profile.mute(username1,username0,false);
      if (response instanceof Error) throw response;
      response = await profile.find(username1);
      if (response instanceof Error) throw response;
      expect(response['trusted_by'][0].username).to.equal(username0);
      expect(response['trusted_by'][0].mute).to.equal(false);
    });

    it("should MAKE USER 0 REVOKE TRUST IN USER 2", async function () {
      let key_response = await keys.find(username2);
      if (key_response instanceof Error) throw key_response;
      expect(key_response['profile_keys'].length).to.equal(1);
      
      key_response = await keys.find(username1);
      if (key_response instanceof Error) throw key_response;
      expect(key_response['profile_keys'].length).to.equal(1);

      let response: boolean | UserProfile | Error = await profile.revoke(username0,username2,new_key_set,derivation_scheme_after_revoke, cipher_info2);
      if (response instanceof Error) throw response;
      expect(response.username).to.equal(username0);

      expect(response['trusting'].length).to.equal(1);
      expect(response['trusting'].some(element=>element.username === username1)).to.equal(true);
      expect(response['trusting'].some(element=>element.username === username2)).to.equal(false);

      response = await profile.find(username2);
      if (response instanceof Error) throw response;
      expect(response['trusted_by'].some(element=>element.username === username0)).to.equal(false);

      response = await profile.find(username1);
      if (response instanceof Error) throw response;
      expect(response['trusted_by'].some(element=>element.username === username0)).to.equal(true);

      key_response = await keys.find(username2);
      if (key_response instanceof Error) throw key_response;
      expect(key_response['profile_keys'].length).to.equal(0);

      key_response = await keys.find(username1);
      if (key_response instanceof Error) throw key_response;
      expect(key_response['profile_keys'].length).to.equal(1);
      expect(key_response['profile_keys'].some(element=>element.id === new_key_set[0].id)).to.equal(true);

    });

  });
});
