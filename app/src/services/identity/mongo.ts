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
  }
);
// ------------------ '(◣ ◢)' ---------------------
const identityStore = mongoose.model("identity", identity_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoIdentityStore implements IdentityStore {
  readMany(usernames: string[]): Promise<UserIdentity[] | Error> {
    throw new Error("Method not implemented.");
  }
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
  async readAll(): Promise<Array<UserIdentity> | Error> {
    try {
      const docs = await identityStore.find().exec();
      if (docs instanceof mongoose.Error) {
        return handleError(docs);
      }
      const identities = docs.map(doc => {
        return {
          genesis: doc["genesis"],
          username: doc["username"],
          pubkey: doc["pubkey"],
        };
      });
      return identities;
    } catch (e) {
      return handleError(e);
    }
  }
}

// async function ensureUnique(identity: UserIdentity): Promise<boolean | Error> {
//   try {
//     const doc = await identityStore.findOne({ username: identity.username }).exec();
//     if (doc === null) return true;

//     if (doc) {
//       const err = doc.validateSync();
//       if (err instanceof mongoose.Error) {
//         return handleError(err);
//       }

//       return handleError({
//         code: 409,
//         message:
//           "Username Exists"
//       });
//     } else {
//       const doc = await identityStore.findOne({ pubkey: identity.pubkey }).exec();
//       if (doc === null) return true;

//       if (doc) {
//         const err = doc.validateSync();
//         if (err instanceof mongoose.Error) {
//           return handleError(err);
//         }

//         return handleError({
//           code: 409,
//           message:
//             "Public Key Exists"
//         });
//       } else return true;

//     }


//   } catch (e) {
//     return handleError(e);
//   }
// }
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
