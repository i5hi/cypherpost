/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { Preference, PreferenceStore } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const preference_schema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    cypher_json: {
      type: String,
      required: true,
    },
    last_updated: {
      type: Number,
      required: true,
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const preferenceStore = mongoose.model("preference", preference_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoPreferenceStore implements PreferenceStore {

  async createOne(preference: Preference): Promise<boolean | Error> {
    try {
      await preferenceStore.syncIndexes();
      const doc = await preferenceStore.create(preference);
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
  async readOne(owner: string): Promise<Preference | Error> {
    try {
      const query = { owner };

      const doc = await preferenceStore.findOne(query).exec();
      if(doc){
      if (doc instanceof mongoose.Error) {
        return handleError(doc);
      }
      else
      return {
        owner: doc["owner"],
        cypher_json: doc['cypher_json'],
        last_updated: doc["last_updated"],
      }
    }else{
      return handleError({
        code: 404,
        message: "Preferences Not Found."
      })
    }

    } catch (e) {
      return handleError(e);
    }
  }

  async removeOne(owner: string): Promise<boolean | Error> {
    try {
      const query = { owner };

      const status = await preferenceStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(owner: string, cypher_json: string): Promise<boolean | Error> {
    try {
      const query = {
        owner,
      };

      const update = {
        $set: {
          cypher_json,
          last_updated: Date.now()
        }
      };

      // const options = {
      //   upsert: false
      // };

      const doc = await preferenceStore.updateOne(query, update);
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
