export interface BadgeInterface{
  create(from: string, to: string, type: BadgeType, nonce: string, signature: string): Promise<boolean | Error>;
  findByGiver(from: string): Promise<Badge[] | Error>;
  findByReciever(to:string):  Promise<Badge[] | Error>;
  revoke(from: string, to: string, type: BadgeType): Promise<boolean | Error>;
}

export interface BadgeStore{
  create(badge: Badge): Promise<boolean | Error>;
  readByGiver(giver: string): Promise<Badge[] | Error>;
  readByReciever(reciever: string): Promise<Badge[] | Error>;
  removeByReciever(giver: string, reciever: string, type: BadgeType): Promise<boolean | Error>;
  removeAllByGiver(giver: string): Promise<boolean | Error>;
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
  Trusted,
  VerifiedInPerson,
}