/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { PostStore, UserPost } from "./interface";
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
    username: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    cipher_json: {
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
  removeOne(query: UserPost): Promise<boolean | Error> {
    throw new Error("Method not implemented.");
  }

  async create(post: UserPost): Promise<UserPost | Error> {
    try {

      const unique = await ensureUnique(post.id);
      if (unique instanceof Error)
        return unique;

      if (unique) {

        const new_post = new postStore(post);

        const doc = await new_post.save();
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        } else {
          return post;
        }
      }

      else {
        return handleError({ code: 409, message: "Post Exists" })
      }

    } catch (e) {
      return handleError(e);
    }
  }
  async remove(query: UserPost): Promise<boolean | Error> {
    try {

      const status = await postStore.deleteOne(query)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      // console.log({ status })
      if (status.deletedCount == 1) return true;
      else return false;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeMany(items: Array<UserPost>): Promise<boolean | Error> {
    try {
      const query = (items.length > 1) ? { id: { $in: items.map(item => item.id) } } : { username: items[0].username };

      const status = await postStore.deleteMany(query)
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
  async read(post: UserPost): Promise<Array<UserPost> | Error> {
    try {
      let query = (post.id) ? { id: post.id } : { username: post.username };
      const docs = await postStore.find(query).exec();

      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }

        const posts = docs.map(doc => {
          return {
            username: doc["username"],
            id: doc["id"],
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            cipher_json: doc["cipher_json"],
            derivation_scheme: doc["derivation_scheme"],
          }
        });

        return posts;

      } else {
        return handleError({
          code: 404,
          message: `No post entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(ids: Array<string>): Promise<Array<UserPost> | Error> {
    try {
      ;
      const docs = await postStore.find({ id: { $in: ids } }).exec();

      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const posts = docs.map(doc => {
          return {
            username: doc["username"],
            id: doc["id"],
            genesis: doc["genesis"],
            expiry: doc["expiry"],
            cipher_json: doc["cipher_json"],
            derivation_scheme: doc["derivation_scheme"],
          }
        });

        return posts;

      } else {
        return handleError({
          code: 404,
          message: `No profile entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }

}

async function ensureUnique(username: string): Promise<boolean | Error> {
  try {
    const doc = await postStore.findOne({ username }).exec();
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
    } else return true;
  } catch (e) {
    return handleError(e);
  }
}


// export async function test_create_admin(){

//   const admin_user: UserPost = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };

//   const new_auth = new postStore(admin_user);

//   const doc = await new_auth.save();
//   if (doc instanceof mongoose.Error) {
//     return handleError(doc);
//   } else {
//     return true;
//   }
// }




// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
