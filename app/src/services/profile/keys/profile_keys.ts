/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../../lib/errors/e";
import { S5UID } from "../../../lib/uid/uid";
import { ProfileDecryptionKey, ProfileKeyInterface, ProfileKeyStoreUpdate } from "./interface";
import { MongoProfileKeyStore } from "./mongo";

const store = new MongoProfileKeyStore();
const uuid = new S5UID();

export class CypherpostProfileKeys implements ProfileKeyInterface {

  async addProfileDecryptionKeys(owner: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      key_update.map(key => {
        keys.push({
          genesis: Date.now(),
          owner: owner,
          reciever: key.reciever,
          decryption_key: key.decryption_key
        })
      });
      return await store.createMany(keys);
    }
    catch (e) {
      handleError(e);
    }
  }
  async updateProfileDecryptionKeys(owner: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      let updates = await key_update.map(async key => {
        const status = await store.updateOne(owner, key.reciever, key.decryption_key);
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
  async findProfileDecryptionKeyByOwner(owner: string): Promise<Error | ProfileDecryptionKey[]> {
    return store.readByOwner(owner);
  }
  async removeProfileDecryptionKeyByReciever(owner: string, reciever: string): Promise<boolean | Error> {
    return store.removeManyByReciever(owner, reciever);
  }
  async removeProfileDecryptionKeyByOwner(owner: string): Promise<boolean | Error> {
    return store.removeAll(owner);
  }

}