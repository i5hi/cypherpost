/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { PostStore, PostStoreIndex, UserPost } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const post_schema = new mongoose.Schema(
  {
    genesis: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Number,
      required: true,
    },
    owner: {
      type: String,
      required: true,
      index: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reference: {
      type: String,
      required: false,
      index: true,
    },
    cypher_json: {
      type: String,
    },
    derivation_scheme: {
      type: String,
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const postStore = mongoose.model("posts", post_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoPostStore implements PostStore {
  async createOne(post: UserPost): Promise<boolean | Error> {
      try {
        await postStore.syncIndexes();
        const doc = await postStore.create(post);
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
  async removeMany(indexes:Array<string>, index_type: PostStoreIndex): Promise<boolean | Error> {
    try {
      const query = (index_type == PostStoreIndex.Owner) ? { owner: { $in: indexes } } : { id: { $in: indexes } } ;

      const status = await postStore.deleteMany(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
      else false;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeOne(id: string, owner: string): Promise<boolean | Error> {
    try {

      const status = await postStore.deleteOne({id,owner});
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      if (status.deletedCount >= 1) return true;
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(indexes: Array<string>, index_type: PostStoreIndex): Promise<Array<UserPost> | Error> {
    try {
      const query = (index_type == PostStoreIndex.Owner) ? { owner: { $in: indexes } } : { id: { $in: indexes } } ;

      const docs = await postStore.find(query).sort({"genesis": -1}).exec();
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const posts = docs.map(doc => {
          return {
            owner: doc["owner"],
            id: doc["id"],
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            cypher_json: doc["cypher_json"],
            derivation_scheme: doc["derivation_scheme"],
          }
        });
        return posts;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readAll(): Promise<Array<UserPost> | Error> {
    try {
      const docs = await postStore.find({}).sort({"genesis": -1}).exec();
      if (docs.length>0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const posts = docs.map(doc => {
          return {
            owner: doc["owner"],
            id: doc["id"],
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            cypher_json: doc["cypher_json"],
            derivation_scheme: doc["derivation_scheme"],
          }
        });
        return posts;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }

}




// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
