/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../../lib/errors/e";
import { S5UID } from "../../../lib/uid/uid";
import { PostDecryptionKey, PostKeyInterface, PostKeyStoreUpdate } from "./interface";
import { MongoPostKeyStore } from "./mongo";

const store = new MongoPostKeyStore();
const uuid = new S5UID();

export class CypherpostPostKeys implements PostKeyInterface {
  async addPostDecryptionKeys(giver: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      key_update.map(key => {
        keys.push({
          genesis: Date.now(),
          giver: giver,
          post_id: post_id,
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
  async updatePostDecryptionKeys(giver: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      let updates = await key_update.map(async key => {
        const status = await store.updateOne(giver, post_id, key.reciever, key.decryption_key);
        if (status instanceof Error) throw status;
      });

      Promise.all(updates);
      return true;
    }
    catch (e) {
      handleError(e);
    }
  }
  async findPostDecryptionKeyByReciever(receiver: string): Promise<Error | PostDecryptionKey[]> {
    return store.readByReciever(receiver);
  }
  async findPostDecryptionKeyByGiver(giver: string): Promise<Error | PostDecryptionKey[]> {
    return store.readByGiver(giver);
  }
  async removePostDecryptionKeyById(giver: string, post_id: string): Promise<boolean | Error> {
    return store.removeManyByPostId(giver, post_id);
  }
  async removePostDecryptionKeyByReciever(giver: string, reciever: string): Promise<boolean | Error> {
    return store.removeManyByReciever(giver, reciever);
  }
  async removePostDecryptionKeyByGiver(giver: string): Promise<boolean | Error> {
    return store.removeAll(giver);
  }

}