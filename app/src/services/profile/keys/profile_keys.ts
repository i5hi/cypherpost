/*
cypherpost.io
Developed @ Stackmate India
*/

import * as crypto from "crypto";
import { handleError } from "../../../lib/errors/e";
import { S5UID } from "../../../lib/uid/uid";
import { ProfileDecryptionKey, ProfileKeyInterface, ProfileKeyStoreUpdate } from "./interface";
import { MongoProfileKeyStore } from "./mongo";

const store = new MongoProfileKeyStore();
const uuid = new S5UID();

export class CypherpostProfileKeys implements ProfileKeyInterface {

  async addProfileDecryptionKeys(giver: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      key_update.map(key => {
        keys.push({
          genesis: Date.now(),
          giver: giver,
          reciever: key.reciever,
          hash: crypto.createHash("sha256").update(`${giver}:${key.reciever}`).digest('hex'),
          decryption_key: key.decryption_key
        })
      });
      return await store.createMany(keys);
    }
    catch (e) {
      handleError(e);
    }
  }
  async updateProfileDecryptionKeys(giver: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      let updates = await key_update.map(async key => {
        const status = await store.updateOne(giver, key.reciever, key.decryption_key);
        if (status instanceof Error) throw status;
      });

      Promise.all(updates);
      return true;
    }
    catch (e) {
      handleError(e);
    }
  }
  async findProfileDecryptionKeyByReciever(receiver: string): Promise<Error | ProfileDecryptionKey[]> {
    return store.readByReciever(receiver);
  }
  async findProfileDecryptionKeyByGiver(giver: string): Promise<Error | ProfileDecryptionKey[]> {
    return store.readByGiver(giver);
  }
  async removeProfileDecryptionKeyByReciever(giver: string, reciever: string): Promise<boolean | Error> {
    return store.removeManyByReciever(giver, reciever);
  }
  async removeProfileDecryptionKeyByGiver(giver: string): Promise<boolean | Error> {
    return store.removeAll(giver);
  }

}