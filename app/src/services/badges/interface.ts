export interface BadgeInterface{
  create(from: string, to: string, type: BadgeType, nonce: string, signature: string): Promise<boolean | Error>;
  findByGiver(from: string, genesis_filter: Number): Promise<Badge[] | Error>;
  findByReciever(to:string, genesis_filter: Number):  Promise<Badge[] | Error>;
  revoke(from: string, to: string, type: BadgeType): Promise<boolean | Error>;
  removeAllOfUser(pubkey: string): Promise<boolean | Error>;
  getAll(genesis_filter: Number): Promise<Badge[] | Error>;
}

export interface BadgeStore{
  create(badge: Badge): Promise<boolean | Error>;
  readAll(genesis_filter: Number):Promise<Badge[] | Error>;
  readByGiver(giver: string, genesis_filter: Number): Promise<Badge[] | Error>;
  readByReciever(reciever: string, genesis_filter: Number): Promise<Badge[] | Error>;
  removeByReciever(giver: string, reciever: string, type: BadgeType): Promise<boolean | Error>;
  removeAll(pubkey: string): Promise<boolean | Error>;
}

export interface Badge {
  genesis: number;
  giver: string;
  reciever: string;
  type: BadgeType;
  hash: string;
  nonce: string;
  signature: string;
}
export enum BadgeType {
  Trusted="TRUST",
  Scammer="SCAMMER"
}