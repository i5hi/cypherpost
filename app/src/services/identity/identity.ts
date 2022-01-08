/*
cypherpost.io
Developed @ Stackmate India
*/

import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { handleError } from "../../lib/errors/e";
import * as jwt from "../../lib/jwt/jwt";
import { S5UID } from "../../lib/uid/uid";
import { IdentityIndex, IdentityInterface, UserIdentity } from "./interface";
import { MongoIdentityStore } from "./mongo";



const uid = new S5UID();

const bitcoin = new CypherpostBitcoinOps();
const local_jwt = new jwt.S5LocalJWT();
const store = new MongoIdentityStore();
const crypto = new S5Crypto();

const ONE_HOUR = 60 * 60 * 1000;

export class CypherpostIdentity implements IdentityInterface {
  async verify(xpub: string, message: string, signature: string): Promise<boolean | Error> {
    if(!xpub.startsWith("xpub")){
      return handleError({
        code: 401,
        message: "Invalid Xpub"
      })
    };
    const identity = await store.readOne(xpub, IdentityIndex.Pubkey);
    if (identity instanceof Error) return identity;

    const pubkey = await bitcoin.extract_ecdsa_pub(identity.pubkey);
    if(pubkey instanceof Error) return pubkey;
    
    let verified = await bitcoin.verify(message, signature, pubkey);
    if(verified instanceof Error) return  verified;
    if (!verified) return handleError({
      code: 401,
      message: "Invalid Request Signature."
    });
    else return verified;
  }

  async register(username: string, xpub: string): Promise<boolean | Error> {
    const new_identity: UserIdentity = {
      genesis: Date.now(),
      username,
      pubkey: xpub
    };

    const status = await store.createOne(new_identity);
    return status;
  };

  async remove(xpub: string): Promise<boolean | Error> {
    const status = await store.removeOne(xpub);
    return status;
  }

  async all(): Promise<Array<UserIdentity> | Error> {
    const identities = await store.readAll();
    return identities;
  }

};

