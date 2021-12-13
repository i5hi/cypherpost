/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { ProfileStore, UserProfile } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------

const profile_schema = new mongoose.Schema(
  {
    owner: {
      type: String,
      unique: true,
      required: true,
      index: true,
      dropDups: true,
    },
    derivation_scheme: {
      type: String,
    },
    cypher_json:{
      type:String
    },  
    genesis: {
      type: Number,
      required: true,
    },
  }
);
// ------------------ '(◣ ◢)' ---------------------
const profileStore = mongoose.model("profile", profile_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoProfileStore implements ProfileStore {
  async createOne(profile: UserProfile): Promise<boolean | Error> {
    try {
      await profileStore.syncIndexes();
      const doc = await profileStore.create(profile);
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
  async removeOne(owner: string): Promise<boolean | Error> {
    try {
      const query = { owner };
      const status = await profileStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      // console.log({ status })
      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async readOne(owner: string): Promise<UserProfile | Error> {
    try {
      const query = { owner };
      const doc = await profileStore.findOne(query).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }

        const out: UserProfile = {
          genesis: doc["genesis"],
          owner: doc["owner"],
          derivation_scheme: doc["derivation_scheme"],
          cypher_json: doc['cypher_json']
        };

        return out;
      } else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No Profile Found`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(owners: string[]): Promise<UserProfile[] | Error> {
    try {;
      const docs =  await profileStore.find({owner:{$in: owners}}).exec();
      
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const profiles = docs.map(doc=>{
          return {
            genesis: doc["genesis"],
            owner: doc["owner"],
            derivation_scheme: doc["derivation_scheme"],
            cypher_json: doc['cypher_json']
          }; 
        });
        
        return profiles;
      
      } else {
        return handleError({
          code: 404,
          message: `No profiles found.`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(owner: string, profile: UserProfile): Promise<boolean | Error> {
    try {
      const query = {
        owner
      };
      
      const update = {$set:{
        derivation_scheme: profile.derivation_scheme,
        cypher_json: profile.cypher_json
      }};

      const doc = await profileStore.updateOne(query,update);
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

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
