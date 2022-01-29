/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { Badge, BadgeStore, BadgeType } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const badge_schema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      unique: true,
      required: true,
      index: true,
      dropDups: true
    },
    nonce: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    }
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const badgeStore = mongoose.model("badge", badge_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoBadgeStore implements BadgeStore {
  async create(badge: Badge): Promise<boolean | Error> {
    try {
      await badgeStore.syncIndexes();
      const doc = await badgeStore.create(badge);
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
  async removeByReciever(giver: string, reciever: string, type: BadgeType): Promise<boolean | Error> {
    try {
      const query = { giver, reciever, type };

      const status = await badgeStore.deleteOne(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }

      if (status.deletedCount >= 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeAll(pubkey: string): Promise<boolean | Error> {
    try {
      const giver_query = { giver : {$in: pubkey} };

      let status = await badgeStore.deleteMany(giver_query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }

      const reciever_query = { reciever : {$in: pubkey} };

      status = await badgeStore.deleteMany(reciever_query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      return true;
      
    } catch (e) {
      return handleError(e);
    }
  }

  async readByGiver(giver: string): Promise<Badge[] | Error> {
    try {
      const query = { giver: { $in: giver } };

      const docs = await badgeStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length > 0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const badges = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            hash: doc["hash"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            signature: doc["signature"],
            type: doc["type"],
            nonce: doc["nonce"],

          }
        });
        return badges;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readAll(): Promise<Badge[] | Error> {
    try {
      const docs = await badgeStore.find().sort({ "genesis": -1 }).exec();
      if (docs.length > 0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const badges = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            hash: doc["hash"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            signature: doc["signature"],
            type: doc["type"],
            nonce: doc["nonce"],

          }
        });
        return badges;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readByReciever(reciever: string): Promise<Badge[] | Error> {
    try {
      const query = { reciever: { $in: reciever } };

      const docs = await badgeStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length > 0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const badges = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            hash: doc["hash"],
            giver: doc["giver"],
            reciever: doc["reciever"],
            signature: doc["signature"],
            type: doc["type"],
            nonce: doc["nonce"],
          }
        });
        return badges;
      } else
        return [];

    } catch (e) {
      return handleError(e);
    }
  }

}




// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
