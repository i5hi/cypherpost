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
  async addPostDecryptionKeys(owner: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      key_update.map(key => {
        keys.push({
          genesis: Date.now(),
          owner: owner,
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
  async updatePostDecryptionKeys(owner: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      let updates = await key_update.map(async key => {
        const status = await store.updateOne(owner, post_id, key.reciever, key.decryption_key);
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
  async findPostDecryptionKeyByOwner(owner: string): Promise<Error | PostDecryptionKey[]> {
    return store.readByOwner(owner);
  }
  async removePostDecryptionKeyById(owner: string, post_id: string): Promise<boolean | Error> {
    return store.removeManyByPostId(owner, post_id);
  }
  async removePostDecryptionKeyByReciever(owner: string, reciever: string): Promise<boolean | Error> {
    return store.removeManyByReciever(owner, reciever);
  }
  async removePostDecryptionKeyByOwner(owner: string): Promise<boolean | Error> {
    return store.removeAll(owner);
  }

}