/*
cypherpost.io
Developed @ Stackmate India
*/

import { S5Crypto } from "../../lib/crypto/crypto";
import * as jwt from "../../lib/jwt/jwt";
import { S5UID } from "../../lib/uid/uid";
import { IdentityIndex, IdentityInterface, UserIdentity } from "./interface";
import { MongoIdentityStore } from "./mongo";

const uid = new S5UID();

const local_jwt = new jwt.S5LocalJWT();
const store = new MongoIdentityStore();
const crypto = new S5Crypto();

const ONE_HOUR = 60 * 60 * 1000;

export class CypherpostIdentity implements IdentityInterface {
  async verify(username: string, message: string, signature: string): Promise<boolean | Error> {
    const identity = await store.read(username, IdentityIndex.Username);
    if (identity instanceof Error) return identity;

    let verified = crypto.verifyS256Signature(message, signature, identity.pubkey);
    return verified;
  }

  async register(username: string, pubkey: string): Promise<boolean | Error> {
    const new_identity: UserIdentity = {
      genesis: Date.now(),
      username: username,
      pubkey: pubkey
    };

    const user = await store.create(new_identity);
    if (user instanceof Error) return user;

    return user;
  };

  async remove(username: string): Promise<boolean | Error> {
    const status = await store.remove(username);
    return status;
  }

  async all(): Promise<Array<UserIdentity> | Error> {
    const identities = await store.readMany(["all"]);
    return identities;
  }

};

