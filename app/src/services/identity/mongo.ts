/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { IdentityIndex, IdentityStore, UserIdentity } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------

const identity_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
      dropDups: true,
    },
    pubkey: {
      type: String,
      unique: true,
      required: true,
      index: true,
      dropDups: true,
    },
    genesis: {
      type: Number,
      required: true,
    },
  }
);
// ------------------ '(◣ ◢)' ---------------------
const identityStore = mongoose.model("identity", identity_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoIdentityStore implements IdentityStore {
  async create(identity: UserIdentity):Promise<boolean | Error> {
    try {
        const status = await ensureUnique(identity);
        // console.log({new_identity});
        if (status instanceof Error) return status;
        
        const doc = await identityStore.create(identity);
        console.log({doc});
        // let status = await doc.validate();
        // console.log({status});
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        } else {
          return true;
        }

    } catch (e) {
      return handleError(e);
    }
  }
  async remove(username: string): Promise<boolean | Error> {
    try {
      const query = {username};
      const status = await identityStore.deleteOne(query)
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
  async read(index:string, indexType: IdentityIndex):  Promise<UserIdentity | Error> {
    try {
      const query = (indexType===IdentityIndex.Username) ? { username: index } : { pubkey: index };
      const doc = await identityStore.findOne(query).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }

        const out: UserIdentity = {
          genesis: doc["genesis"],
          username: doc["username"],
          pubkey: doc["pubkey"],
        };
        
        return out;
      } else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No Identity Entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(usernames: Array<string>): Promise<Array<UserIdentity> | Error> {
    try {;
      const docs = (usernames[0]==="all")?
        await identityStore.find().exec():
        await identityStore.find({username:{$in: usernames}}).exec();
      
      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const auths = docs.map(doc=>{
          return {
            genesis: doc["genesis"],
            username: doc["username"],
            pubkey: doc["pubkey"],
          }; 
        });
        
        return auths;
      
      } else {
        return handleError({
          code: 404,
          message: `No Identity Entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
}
async function ensureUnique(identity: UserIdentity): Promise<boolean | Error> {
  try {
    const doc = await identityStore.findOne({ username: identity.username }).exec();
    if (doc === null) return true;

    if (doc) {
      const err = doc.validateSync();
      if (err instanceof mongoose.Error) {
        return handleError(err);
      }

      return handleError({
        code: 409,
        message:
          "Username Exists"
      });
    } else {
      const doc = await identityStore.findOne({ pubkey: identity.pubkey }).exec();
      if (doc === null) return true;
  
      if (doc) {
        const err = doc.validateSync();
        if (err instanceof mongoose.Error) {
          return handleError(err);
        }
  
        return handleError({
          code: 409,
          message:
            "Public Key Exists"
        });
      } else return true;
      
    }


  } catch (e) {
    return handleError(e);
  }
}
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
