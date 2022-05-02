/*
cypherpost.io
Developed @ Stackmate India
*/

import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { handleError } from "../../lib/errors/e";
import * as jwt from "../../lib/jwt/jwt";
import { S5UID } from "../../lib/uid/uid";
import { IdentityIndex, IdentityInterface, RegistrationType, UserIdentity, VerificationStatus } from "./interface";
import { MongoIdentityStore } from "./mongo";



const uid = new S5UID();
const TYPE = process.env.TYPE;
const INVITE_CODE = process.env.SECRET;

const bitcoin = new CypherpostBitcoinOps();
const local_jwt = new jwt.S5LocalJWT();
const store = new MongoIdentityStore();
const crypto = new S5Crypto();

const ONE_HOUR = 60 * 60 * 1000;
const THIRTY_DAYS = 30 * 24 * ONE_HOUR;

export class CypherpostIdentity implements IdentityInterface {

  async register(username: string, pubkey: string, type: RegistrationType): Promise<boolean | Error> {
    const new_identity: UserIdentity = {
      genesis: Date.now(),
      username,
      pubkey: pubkey,
      status: type === RegistrationType.Payment ? VerificationStatus.Pending:VerificationStatus.Verified
    };

    const status = await store.createOne(new_identity);
    return status;
  }
  async authenticate(pubkey: string, message: string, signature: string): Promise<boolean | Error> {
    const identity = await store.readOne(pubkey, IdentityIndex.Pubkey);
    if (identity instanceof Error) return identity;
    
    if (
        identity.status===VerificationStatus.Pending || 
        (identity.status === VerificationStatus.Partial && identity.genesis + THIRTY_DAYS > Date.now())
      )
    {
      return handleError({
        code: TYPE.toLowerCase()==="public"?402:401,
        message: TYPE.toLowerCase()==="public"?"Payment Required.":"Register with invite code."
      });
    }
    
    let verified = await bitcoin.verify(message, signature, pubkey);
    if(verified instanceof Error) return verified;
    if (!verified) return handleError({
      code: 401,
      message: "Invalid Request Signature."
    });
    else return verified;
  }
  async remove(pubkey: string): Promise<boolean | Error> {
    const status = await store.removeOne(pubkey);
    return status;
  }
  async updateStatus(pubkey: string, status: VerificationStatus): Promise<boolean | Error> {
    const result = await store.updateOne(pubkey,status);
    return result;
  }
  async all(genesis_filter: Number): Promise<Array<UserIdentity> | Error> {
    const identities = await store.readAll(genesis_filter);
    return identities;
  }
};

