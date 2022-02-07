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
  getAll(genesis_filter: Number): Promise<Badge[] | Error> {
    return store.readAll(genesis_filter);
  }
  removeAllOfUser(xpub: string): Promise<boolean | Error> {
    return store.removeAll(xpub);
  }
  async create(from: string, to: string, type: BadgeType, nonce: string, signature: string): Promise<boolean | Error> {
    try{
  
      const trust_message = `${from}:${to}:${type.toString()}:${nonce}`;
      console.log({trust_message});
      console.log({signature});
      const verify = await bitcoin.verify(trust_message, signature,from);
      if (verify instanceof Error) return verify;
      if (!verify) return handleError({
        code: 400,
        message: "Invalid badge signature"
      });
      const badge: Badge = {
        genesis: Date.now(),
        giver: from,
        reciever: to,
        type: type,
        hash:crypto.createHash("sha256").update(`${from}:${to}:${type.toString()}`).digest("hex"),
        nonce,
        signature,
      };

      console.log({badge})
      return store.create(badge);
    }catch(e){
      handleError(e);
    }
  }
  findByGiver(from: string, genesis_filter: Number): Promise<Error | Badge[]> {
    return store.readByGiver(from,genesis_filter);
  }
  findByReciever(to: string,genesis_filter: Number): Promise<Error | Badge[]> {
    return store.readByReciever(to,genesis_filter);
  }
  revoke(from: string, to: string, type: BadgeType): Promise<boolean | Error> {
    return store.removeByReciever(from,to, type);
  }

}