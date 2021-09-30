/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { Key, KeyStore, UseCase, UserKeys } from "./interface";

// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------

const keys_schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    recipient_xpub: {
      type: String,
      required: true,
    },
    recipient_keys: {
      type: Array,
    },
    profile_keys: {
      type: Array,
    },
    post_keys: {
      type: Array,
    },
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const keyStore = mongoose.model("keys", keys_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoKeyStore implements KeyStore {

  async create(user: UserKeys):Promise<boolean | Error> {
    try {

      const unique = await ensureUnique(user.username);
      if (unique instanceof Error)
        return unique;
      
      if (unique) {
       
        const new_auth = new keyStore(user);

        const doc = await new_auth.save();
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        } else {
          return true;
        }
      }

      else {
        return handleError({ code: 409, message: "Keys Exists" })
      }

    } catch (e) {
      return handleError(e);
    }
  }
  async remove(username: string): Promise<boolean | Error> {
    try {
      const status = await keyStore.deleteOne({ username })
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
  async read(username: string): Promise<UserKeys | Error> {
    try {;
      const doc = await keyStore.findOne({username}).exec();

      if (doc) {
        if (doc instanceof mongoose.Error) {
          return handleError(doc);
        }

        const out: UserKeys = {
          username: doc["username"],
          recipient_xpub: doc["recipient_xpub"],
          recipient_keys: (doc["recipient_keys"])?doc["recipient_keys"]:[],
          profile_keys: (doc["profile_keys"])?doc["profile_keys"]:[],
          post_keys: (doc["post_keys"])?doc["post_keys"]:[],
        };
        
        return out;
      } else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No keys entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readMany(usernames: Array<string>): Promise<Array<UserKeys> | Error> {
    try {;
      const docs = await keyStore.find({username: {$in: usernames}}).exec();

      if (docs) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        
        const keys = docs.map((doc)=>{
          return  {
            username: doc["username"],
            recipient_xpub: doc["recipient_xpub"],
            recipient_keys: (doc["recipient_keys"])?doc["recipient_keys"]:[],
            profile_keys: (doc["profile_keys"])?doc["profile_keys"]:[],
            post_keys: (doc["post_keys"])?doc["post_keys"]:[],
          };
        })
        
        return keys;
      } else {
        // no data from findOne
        return handleError({
          code: 404,
          message: `No keys entry`
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }
  // async update(username: string, update:UserKeys): Promise<UserKeys | Error> {
  //   try {
      
  //     const up = { $set: update };
  //     const status = await keyStore.updateOne({username}, up)
  //     if (status instanceof mongoose.Error) {
  //       return handleError(status);
  //     }
  //     else {
  //       const doc = await keyStore.findOne({username}).exec();

  //       if (doc) {
  //         if (doc instanceof mongoose.Error) {
  //           return handleError(doc);
  //         }
  
  //         const out: UserKeys = {
  //           username: doc["username"],
  //           profile_keys: doc["profile_keys"],
  //           post_keys: doc["post_keys"],
  //           recipient_xpub: doc["recipient_xpub"],
  //         };
  //         return out;
  //     }else {
  //       // no data from findOne
  //       return handleError({
  //         code: 404,
  //         message: `No auth entry`
  //       });
  //     }
  //   }
  //   } catch (e) {
  //     return handleError(e);
  //   }
  // }

  async update_push(username: string, usecase: UseCase, update: Key ): Promise<boolean | Error> {
    try {
      let up;

      switch(usecase){
        case UseCase.Post:
            up = { $push: {post_keys: update} };
          break;
        case UseCase.Profile:
            up = { $push: {profile_keys: update} };
          break;
        case UseCase.Recipient:
            up = { $push: {recipient_keys: update} };
            break;
        default: 
          return handleError({
            code: 400, 
            message: "Invalid usecase. Use Recipient,Profile or Post"
          });
      }

      const status = await keyStore.updateOne({username}, up);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      }
      
      // console.log({update_push_status: status});
      return (status.modifiedCount===1)?status.acknowledged:false;
   
    } catch (e) {
      return handleError(e);
    }
  }
  async update_pull(username: string, usecase: UseCase, update: Key): Promise<boolean | Error> {
    try {
      let up;

      switch(usecase){
        case UseCase.Post:
            up = { $pull: {post_keys: {id: update.id}} };
          break;
        case UseCase.Profile:
            up = { $pull: {profile_keys: {id: update.id}} };
          break;
        case UseCase.Recipient:
          up = { $pull: {recipient_keys: update } };
          break;
        default: 
          return handleError({
            code: 400, 
            message: "Invalid usecase. Use Post or Profile"
          });
      }

      const status = await keyStore.updateOne({username}, up);
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
    const doc = await keyStore.findOne({ username }).exec();
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
  
//   const admin_user: UserKeys = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };

//   const new_auth = new keyStore(admin_user);

//   const doc = await new_auth.save();
//   if (doc instanceof mongoose.Error) {
//     return handleError(doc);
//   } else {
//     return true;
//   }
// }


// ------------------ '(◣ ◢)' ---------------------

// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
