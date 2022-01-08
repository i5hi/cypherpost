/*
cypherpost.io
Developed @ Stackmate India
*/

import * as crypto from "crypto";
import { handleError } from "../../../lib/errors/e";
import { S5UID } from "../../../lib/uid/uid";
import { PostDecryptionKey, PostKeyInterface, PostKeyStoreUpdate } from "./interface";
import { MongoPostKeyStore } from "./mongo";

const store = new MongoPostKeyStore();
const uuid = new S5UID();

export class CypherpostPostKeys implements PostKeyInterface {
  async removeAllPostDecryptionKeyOfUser(pubkey: string): Promise<boolean | Error> {
    try {
      let status = await store.removeAllGiver(pubkey);
      if (status instanceof Error) return status;
      status = await store.removeAllReciever(pubkey);
      return status;
    }
    catch (e) {
      handleError(e);
    }
  }
  async addPostDecryptionKeys(giver: string, id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      key_update.map(key => {
        keys.push({
          genesis: Date.now(),
          giver: giver,
          id: id,
          reciever: key.reciever,
          hash: crypto.createHash("sha256").update(`${giver}:${key.reciever}:${id}`).digest('hex'),
          decryption_key: key.decryption_key
        })
      });
      return await store.createMany(keys);
    }
    catch (e) {
      handleError(e);
    }
  }
  async updatePostDecryptionKeys(giver: string, id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error> {
    try {
      let keys = [];
      let updates = await key_update.map(async key => {
        const status = await store.updateOne(giver, id, key.reciever, key.decryption_key);
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
  async removePostDecryptionKeyById(giver: string, id: string): Promise<boolean | Error> {
    return store.removeManyByPostId(giver, id);
  }
  async removePostDecryptionKeyByReciever(giver: string, reciever: string): Promise<boolean | Error> {
    return store.removeManyByReciever(giver, reciever);
  }
  async removePostDecryptionKeyByGiver(giver: string): Promise<boolean | Error> {
    return store.removeAllGiver(giver);
  }

}