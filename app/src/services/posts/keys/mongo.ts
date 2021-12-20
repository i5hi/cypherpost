/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../../lib/errors/e";
import { PostDecryptionKey, PostDecryptionKeyStore } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const post_key_schema = new mongoose.Schema(
  {
    genesis: {
      type: Number,
      required: true,
    },
    giver: {
      type: String,
      required: true,
      index: true
    },
    reciever: {
      type: String,
      required: true,
      index: true,
    },
    post_id: {
      type: String,
      required: true,
      index: true,
    },
    decryption_key: {
      type: String,
      unique: true,
      required: true,
    },
    hash: {
      type: String,
      required: true,
      index: true,
      unique: true,
      dropDups: true
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const postKeyStore = mongoose.model("post_key", post_key_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoPostKeyStore implements PostDecryptionKeyStore {

  async createMany(keys: PostDecryptionKey[]): Promise<boolean | Error> {
    try {
      await postKeyStore.syncIndexes();
      const doc = await postKeyStore.create(keys);
      if (doc instanceof mongoose.Error) {
        return handleError(doc);
      } else {
        return true;
      }
    } catch (e) {
      if (e['code'] && e['code'] == 11000) {
        return handleError({
          code: 409,
          message: "Duplicate Index."
        })
      }
      return handleError(e);
    }
  }
  async readByGiver(giver: string): Promise<PostDecryptionKey[] | Error> {
    try {
      const query = { giver: { $in: giver } };

      const docs = await postKeyStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const keys = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            post_id: doc["post_id"],
            hash: doc['hash'],
            decryption_key: doc["decryption_key"],
          }
        });
        return keys;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readByReciever(reciever: string): Promise<PostDecryptionKey[] | Error> {
    try {
      const query = { reciever: { $in: reciever } };

      const docs = await postKeyStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const keys = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            post_id: doc["post_id"],
            hash: doc['hash'],
            decryption_key: doc["decryption_key"],
          }
        });
        return keys;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  // might not be needed
  async readByPostId(post_id: string): Promise<PostDecryptionKey[] | Error> {
    try {
      const query = { post_id: { $in: post_id } };

      const docs = await postKeyStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const keys = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            post_id: doc["post_id"],
            hash: doc['hash'],
            decryption_key: doc["decryption_key"],
          }
        });
        return keys;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async removeManyByPostId(giver: string, post_id: string): Promise<boolean | Error> {
    try {
      const query = { giver, post_id };

      const status = await postKeyStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeManyByReciever(giver: string, reciever: string): Promise<boolean | Error> {
    try {
      const query = { giver, reciever };

      const status = await postKeyStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeAll(giver: string): Promise<boolean | Error> {
    try {
      const query = { giver };

      const status = await postKeyStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(giver: string, post_id: string, reciever: string, decryption_key: string): Promise<boolean | Error> {
    try {
      const query = {
        giver,
        post_id,
        reciever,
      };

      const update = {
        $set: {
          decryption_key
        }
      };

      const doc = await postKeyStore.updateOne(query, update);
      if (doc instanceof mongoose.Error) {
        return handleError(doc);
      } else {
        return true;
      }
    } catch (e) {
      return handleError(e);
    }
  }  

}




// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
