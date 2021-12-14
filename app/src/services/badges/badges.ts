/*
cypherpost.io
Developed @ Stackmate India
*/

import crypto from "crypto";
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { handleError } from "../../lib/errors/e";
import { S5UID } from "../../lib/uid/uid";
import { Badge, BadgeInterface, BadgeType } from "./interface";
import { MongoBadgeStore } from "./mongo";

const store = new MongoBadgeStore();
const uuid = new S5UID();
const bitcoin = new CypherpostBitcoinOps();


export class CypherpostBadges implements BadgeInterface {
  async create(from: string, to: string, type: BadgeType, nonce: string, signature: string): Promise<boolean | Error> {
    try{

      const pubkey = bitcoin.extract_ecdsa_pub(from);
      if(pubkey instanceof Error) return pubkey;
      const message = `${from}${to}${type}${nonce}`;
      const verify = bitcoin.verify(message, signature,pubkey);
      if (verify instanceof Error) return verify;
      if (!verify) return handleError({
        code: 401,
        message: "Invalid badge signature"
      });
      
      const badge: Badge = {
        genesis: Date.now(),
        giver: from,
        reciever: to,
        type,
        hash:crypto.createHash("sha256").update(`${from}:${to}:${type}`).digest("hex"),
        nonce,
        signature,
      };
      return store.create(badge);
    }catch(e){
      handleError(e);
    }
  }
  findByGiver(from: string): Promise<Error | Badge[]> {
    return store.readByGiver(from);
  }
  findByReciever(to: string): Promise<Error | Badge[]> {
    return store.readByReciever(to);
  }
  revoke(from: string, to: string, type: BadgeType): Promise<boolean | Error> {
    return store.removeByReciever(from,to, type);
  }

}