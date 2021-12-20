/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../../lib/errors/e";
import { ProfileDecryptionKey, ProfileDecryptionKeyStore } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const profile_key_schema = new mongoose.Schema(
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
    hash: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    decryption_key: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const profileKeyStore = mongoose.model("profile_key", profile_key_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoProfileKeyStore implements ProfileDecryptionKeyStore {

  async createMany(keys: ProfileDecryptionKey[]): Promise<boolean | Error> {
    try {
      await profileKeyStore.syncIndexes();
      const doc = await profileKeyStore.create(keys);
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
  async readByGiver(giver: string): Promise<ProfileDecryptionKey[] | Error> {
    try {
      const query = { giver: { $in: giver } };

      const docs = await profileKeyStore.find(query).sort({ "genesis": -1 }).exec();
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
  async readByReciever(reciever: string): Promise<ProfileDecryptionKey[] | Error> {
    try {
      const query = { reciever: { $in: reciever } };

      const docs = await profileKeyStore.find(query).sort({ "genesis": -1 }).exec();
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

  async removeManyByReciever(giver: string, reciever: string): Promise<boolean | Error> {
    try {
      const query = { giver, reciever };

      const status = await profileKeyStore.deleteMany(query)
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

      const status = await profileKeyStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(giver: string, reciever: string, decryption_key: string): Promise<boolean | Error> {
    try {
      const query = {
        giver,
        reciever,
      };

      const update = {
        $set: {
          decryption_key
        }
      };

      // const options = {
      //   upsert: false
      // };

      const doc = await profileKeyStore.updateOne(query, update);
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
