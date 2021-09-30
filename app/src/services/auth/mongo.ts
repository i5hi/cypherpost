/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { AuthStore, UserAuth } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------

const auth_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    seed256: {
      type: String,
      required: true,
      index: true,
    },
    pass256: {
      type: String,
      // unique: true, 
      required: true,
    },
    genesis: {
      type: Number,
      required: true,
    },
    uid: {
      type: String,
      unique: true,
      required: true,
    },
    invited_by: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false
    },
    invite_codes: {
      type: Array,
      required: false,
    },    
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const authStore = mongoose.model("auth", auth_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoAuthStore implements AuthStore {

  async create(user: UserAuth):Promise<UserAuth | Error> {
    try {

      const unique = await ensureUnique(user.username);
      if (unique instanceof Error)
        return unique;
      
      if (unique) {
       
        const new_auth = new authStore(user);

        const doc = await new_auth.save();
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        } else {
          return user;
        }
      }

      else {
        return handleError({ code: 409, message: "Auth Exists" })
      }

    } catch (e) {
      return handleError(e);
    }
  }
  async remove(user:UserAuth): Promise<boolean | Error> {
    try {
      const status = await authStore.deleteOne({ username: user.username })
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
  async read(user:UserAuth): Promise<UserAuth | Error> {
    try {
      const query = (user.username) ? { username: user.username } : { seed256: user.seed256 };
      const doc = await authStore.findOne(query).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }

        const out: UserAuth = {
          genesis: doc["genesis"],
          uid: doc["uid"],
          username: doc["username"],
          pass256: doc["pass256"],
          seed256: doc["seed256"],
          verified: doc["verified"],
          invited_by: doc["invited_by"],
          invite_codes: doc["invite_codes"],
          inviter_code: doc["inviter_code"]

        };
        
        return out;
      } else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No auth entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(usernames: Array<string>): Promise<Array<UserAuth> | Error> {
    try {;
      const docs = (usernames[0]==="all")?
        await authStore.find().exec():
        await authStore.find({username:{$in: usernames}}).exec();
      
      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const auths = docs.map(doc=>{
          return {
            genesis: doc["genesis"],
            uid: doc["uid"],
            username: doc["username"],
            pass256: doc["pass256"],
            seed256: doc["seed256"],
            verified: doc["verified"],
            invited_by: doc["invited_by"],
            invite_codes: doc["invite_codes"],
            inviter_code: doc["inviter_code"]
  
          }; 
        });
        
        return auths;
      
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
  async update(query: UserAuth, update:UserAuth): Promise<UserAuth | Error> {
    try {
      const q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
      const up = { $set: update };
      const status = await authStore.updateOne(q, up)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      else {
        const doc = await authStore.findOne(q).exec();

        if (doc) {
          if (doc instanceof mongoose.Error) {
            return handleError(doc);
          }
  
          const out: UserAuth = {
            genesis: doc["genesis"],
            uid: doc["uid"],
            username: doc["username"],
            pass256: doc["pass256"],
            seed256: doc["seed256"],
            verified: doc["verified"],
            invited_by: doc["invited_by"],
            invite_codes: doc["invite_codes"]
          };
          return out;
      }else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No auth entry`
        });
      }
    }
    } catch (e) {
      return handleError(e);
    }
  }

  async update_push(query: UserAuth, update:string): Promise<boolean | Error> {
    try {
      const q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
      const up = { $push: {invite_codes: update} };
      const status = await authStore.updateOne(q, up);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      else {
        const doc = await authStore.findOne(q).exec();

        if (doc) {
          if (doc instanceof mongoose.Error) {
            return handleError(doc);
          }
  
          return true;
      }else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No auth entry`
        });
      }
    }
    } catch (e) {
      return handleError(e);
    }
  }
  async update_pull(query: UserAuth, update:string): Promise<boolean | Error> {
    try {
      const q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
      const up = { $pull: {invite_codes: update} };
      const status = await authStore.updateOne(q, up);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      else {
        const doc = await authStore.findOne(q).exec();

        if (doc) {
          if (doc instanceof mongoose.Error) {
            return handleError(doc);
          }
  
          return true;
      }else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No auth entry`
        });
      }
    }
    } catch (e) {
      return handleError(e);
    }
  }


}

async function ensureUnique(username: string): Promise<boolean | Error> {
  try {
    const doc = await authStore.findOne({ username }).exec();
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


export async function test_create_admin(){
  
  const admin_user: UserAuth = {
    username: "ravi",
    pass256: "f45691f7b6726de2d5aba5732a7252d72078d9f2180a953c1a7daffdfd37bc86",
    seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
    genesis: Date.now(),
    uid: "s5idAdmin",
    invited_by: "satoshi",
    verified: true,
    invite_codes: ["t780opsd"]
  };

  const new_auth = new authStore(admin_user);

  const doc = await new_auth.save();
  if (doc instanceof mongoose.Error) {
    return handleError(doc);
  } else {
    return true;
  }
}


// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
