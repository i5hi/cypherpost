/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { IdentityIndex, IdentityStore, UserIdentity, VerificationStatus } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------

const identity_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    pubkey: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    genesis: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "PENDING"
    }
  }
);
// ------------------ '(◣ ◢)' ---------------------
const identityStore = mongoose.model("identity", identity_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoIdentityStore implements IdentityStore {

  async createOne(identity: UserIdentity): Promise<boolean | Error> {
    try {
      await identityStore.syncIndexes();
      const doc = await identityStore.create(identity);
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
  async removeOne(pubkey: string): Promise<boolean | Error> {
    try {
      const query = { pubkey };
      const status = await identityStore.deleteMany(query)
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
  async readOne(index: string, indexType: IdentityIndex): Promise<UserIdentity | Error> {
    try {
      const query = (indexType === IdentityIndex.Username) ? { username: index } : { pubkey: index };
      const doc = await identityStore.findOne(query).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }

        const out: UserIdentity = {
          genesis: doc["genesis"],
          username: doc["username"],
          pubkey: doc["pubkey"],
          status: doc["status"],
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
  async readAll(genesis_filter: Number): Promise<Array<UserIdentity> | Error> {
    try {
      
      const docs = await identityStore.find({ genesis: { $gte: genesis_filter } }).exec();
      if (docs instanceof mongoose.Error) {
        return handleError(docs);
      }
      const identities = docs.map(doc => {
        return {
          genesis: doc["genesis"],
          username: doc["username"],
          pubkey: doc["pubkey"],
          status: doc["status"],
        };
      });
      return identities;
    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(pubkey: string, status: VerificationStatus): Promise<boolean | Error> {
    try {
      const q = { pubkey };
      const u = { $set: { status: status.toString() } };
      // console.log({q,u})

      const result = await identityStore.updateOne(q, u);
      if (result instanceof mongoose.Error) {
        return handleError(result);
      };
      console.log({result})
      return result.modifiedCount > 0 || result.matchedCount >0;
      // if verified if true the document is not updated and will return modifiedCount = 0 
      // watchout
    } catch (e) {
      return handleError(e);
    }
  }
}
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
