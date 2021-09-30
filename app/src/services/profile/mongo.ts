/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { ProfileStore, TrustDirection, UserProfile, UserSet } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const profile_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    nickname: {
      type: String,
    },
    status: {
      type: String,
    },
    cipher_info: {
      type: String,
    },
    derivation_scheme: {
      type: String,
    },
    trusted_by: {
      type: Array,
    },
    trusting: {
      type: Array,
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const profileStore = mongoose.model("profile", profile_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoProfileStore implements ProfileStore {

  async create(user: UserProfile):Promise<boolean | Error> {
    try {

      const unique = await ensureUnique(user.username);
      if (unique instanceof Error)
        return unique;
      
      if (unique) {
       
        const new_profile = new profileStore(user);

        const doc = await new_profile.save();
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        } else {
          return true;
        }
      }

      else {
        return handleError({ code: 409, message: "Profile Exists" })
      }

    } catch (e) {
      return handleError(e);
    }
  }
  async remove(username: string): Promise<boolean | Error> {
    try {
      const status = await profileStore.deleteOne({ username })
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
  async read(username: string): Promise<UserProfile | Error> {
    try {;
      const doc = await profileStore.findOne({username}).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }
      
        const out: UserProfile = {
          username: doc["username"],
          nickname: doc["nickname"],
          status: doc["status"],
          cipher_info: doc["cipher_info"],
          derivation_scheme: doc["derivation_scheme"],
          trusted_by: (doc["trusted_by"])?doc["trusted_by"]:[],
          trusting: (doc["trusting"])?doc["trusting"]:[],
        };
        
        return out;
      
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
  async readMany(usernames: Array<string>): Promise<Array<UserProfile> | Error> {
    try {
      const docs = (usernames[0]==="all")?
        await profileStore.find().exec():
        await profileStore.find({username:{$in: usernames}}).exec();
      
      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const profiles = docs.map(doc=>{
          return {
            username: doc["username"],
            nickname: doc["nickname"],
            status: doc["status"],
            cipher_info: doc["cipher_info"],
            derivation_scheme: doc["derivation_scheme"],
            trusted_by: (doc["trusted_by"])?doc["trusted_by"]:[],
            trusting: (doc["trusting"])?doc["trusting"]:[],
          }  
        });
        
        return profiles;
      
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
  async update(username: string, update:UserProfile): Promise<UserProfile | Error> {
    try {
      
      const up = { $set: update };
      const status = await profileStore.updateOne({username}, up)
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      else {
        const doc = await profileStore.findOne({username}).exec();

        if (doc) {
          if (doc instanceof mongoose.Error) {
            return handleError(doc);
          }
  
          const out: UserProfile = {
            username: doc["username"],
            nickname: doc["nickname"],
            status: doc["status"],
            cipher_info: doc["cipher_info"],
            derivation_scheme: doc["derivation_scheme"],
            trusted_by: (doc["trusted_by"])?doc["trusted_by"]:[],
            trusting: (doc["trusting"])?doc["trusting"]:[],
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

  async update_push(username: string, trust_direction: TrustDirection,  update: UserSet): Promise<boolean | Error> {
    try {
      let up;

      switch(trust_direction){
        case TrustDirection.Trusting:
            up = { $push: {trusting: update} };
          break;
        case TrustDirection.TrustedBy:
            up = { $push: {trusted_by: update} };
          break;
        default: 
          return handleError({
            code: 400, 
            message: "Invalid usecase. Use Trusting or TrustedBy"
          });
      }

      const status = await profileStore.updateOne({username}, up);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      
      // console.log({update_push_status: status});
      return (status.modifiedCount===1)?status.acknowledged:false;
   
    } catch (e) {
      return handleError(e);
    }
  }
  async update_pull(username: string, trust_direction: TrustDirection,  update: UserSet): Promise<boolean | Error> {
    try {
      let up;

      switch(trust_direction){
        case TrustDirection.Trusting:
            up = { $pull: {trusting: {username:update.username}} };
          break;
        case TrustDirection.TrustedBy:
            up = { $pull: {trusted_by: {username:update.username}} };
          break;
        default: 
          return handleError({
            code: 400, 
            message: "Invalid usecase. Use Trusting or TrustedBy"
          });
      }

      const status = await profileStore.updateOne({username}, up);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      // console.log({update_pull_status: status});
      return (status.modifiedCount===1)?status.acknowledged:false;
   
    } catch (e) {
      return handleError(e);
    }
  }

}

async function ensureUnique(username: string): Promise<boolean | Error> {
  try {
    const doc = await profileStore.findOne({ username }).exec();
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
  
//   const admin_user: UserProfile = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };

//   const new_auth = new profileStore(admin_user);

//   const doc = await new_auth.save();
//   if (doc instanceof mongoose.Error) {
//     return handleError(doc);
//   } else {
//     return true;
//   }
// }




// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
