/*
cypherpost.io
Developed @ Stackmate India
*/

import * as crypto from "crypto";
import { handleError } from "../../lib/errors/e";
import * as jwt from "../../lib/jwt/jwt";
import { S5UID } from "../../lib/uid/uid";
import { AuthInterface, UserAuth } from "./interface";
import { MongoAuthStore } from "./mongo";


const uid = new S5UID();

const local_jwt = new jwt.S5LocalJWT();
const store = new MongoAuthStore();

const ONE_HOUR = 60 * 60 * 1000;

export class LionBitAuth implements AuthInterface {
  async check_invite(invited_by: string, invite_code: string): Promise<boolean | Error> {
    // const inviter = await store.read({username: invited_by});
    // if(inviter instanceof Error) return inviter;
    
    // if(inviter.invite_codes.includes(invite_code)) return true;
    // else return false;
    return true
  }
  async register(username: string, pass256: string, seed256: string, invited_by: string, invite_code: string): Promise<string | Error>{
    const inviter = await store.read({username: invited_by});
    // if (inviter instanceof Error) {
    //   if (inviter['name'] === "404"){
    //     return handleError({
    //       code: 404,
    //       message: "Inviter does not exist."
    //     });
    //   }
    //   else return inviter
    // }
    // if (!inviter.verified) return handleError({
    //   code: 401,
    //   message: "Inviter is not verified."
    // });
    
    // if (!inviter.invite_codes.includes(invite_code)) return handleError({
    //   code: 401,
    //   message: "Invalid Invite Code."
    // });
    
    const new_user: UserAuth = {
      username: username,
      pass256: crypto.createHash('sha256')
      .update(`${username}:${pass256}`)
      .digest('hex'),
      seed256: seed256,
      genesis: Date.now(),
      uid: uid.createUserID(),
      invited_by,
      verified: true,
      invite_codes: [],
    };

    const user = await store.create(new_user);
    if (user instanceof Error) return user;

    // const updated_inviter = await store.update_pull({username: invited_by}, invite_code);
    // if (updated_inviter instanceof Error) return updated_inviter;

    const jwt_payload = {
      user: user.username,
      aud: "profile,posts"
    };

    const token = local_jwt.issue(jwt_payload);
    return token;
  };

  async login(username: string, pass256: string): Promise<string | Error>{
    const user = await store.read({username: username});
    if (user instanceof Error) return user;


    if (!user.verified) return handleError({
      code: 401,
      message: "Pending Verification."
    });
    
    
    if (user.pass256 !== crypto.createHash('sha256')
    .update(`${username}:${pass256}`)
    .digest('hex')) 
    return handleError({
      code: 401,
      message: "Wrong Password"
    });

    const jwt_payload = {
      user: user.username,
      aud: "profile,posts"
    };

    const token = local_jwt.issue(jwt_payload);
    return token;
  }

  
  async reset(seed256: string, pass256: string): Promise<string | Error>{
    const user = await store.read({seed256: seed256});
    if (user instanceof Error) return user;

    const query: UserAuth = {
      seed256: seed256,
    };

    const update: UserAuth = {
      pass256: crypto.createHash('sha256')
      .update(`${user.username}:${pass256}`)
      .digest('hex'),
    };

    const status = await store.update(query, update);
    if (status instanceof Error) return status;

    const jwt_payload = {
      user: user.username,
      aud: "profile,posts"
    };

    const token = local_jwt.issue(jwt_payload);
    return token;
  }
 
  async remove(username: string): Promise<boolean | Error>{
    const status = await store.remove({username: username});
    if (status instanceof Error) return status;

    return status;
  }

  async invite(invited_by: string): Promise<string | Error>
  {
    const inviter = await store.read({username: invited_by});
    if (inviter instanceof Error) {
      if (inviter['name'] === "404"){
        return handleError({
          code: 404,
          message: "Inviter does not exist."
        });
      }
      else return inviter
    }
    if (!inviter.verified) return handleError({
      code: 401,
      message: "Inviter is not verified."
    });

    const invite_code =  uid.createRandomID(12);

    const updated_user = await store.update_push({username: invited_by}, invite_code);
    if (updated_user instanceof Error) return updated_user;

    return invite_code;
  }

  async taken_usernames(): Promise<Array<string> | Error>{
    const auths = await store.readMany(["all"]);
    if(auths instanceof Error) return auths;

    return auths.map((auth)=>auth.username);
  }

  async check_seed256(username: string, seed256: string):Promise<boolean | Error>{
    const user = await store.read({username: username});
    if(user instanceof Error){
      return user;
    }
    if(user.seed256 === seed256){
      return true;
    }
    else{
      return handleError({
        code: 403,
        message: "Seed does not match!"
      });
    }
  }
};

