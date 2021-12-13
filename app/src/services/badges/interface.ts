export interface TrustBadgeInterface{
  create(from: string, to: string, signature: string): Promise<boolean | Error>;
  findByGiver(from: string): Promise<Badge[] | Error>;
  findByReciever(to:string):  Promise<Badge[] | Error>;
  revoke(from: string, to: string): Promise<boolean | Error>;
}

export interface BadgeStore{
  create(badge: Badge): Promise<boolean | Error>;
  readByGiver(giver: string): Promise<Badge[] | Error>;
  readByReciever(reciever: string): Promise<Badge[] | Error>;
  removeByReciever(reciever: string, type: BadgeType): Promise<boolean | Error>;
  removeAllByGiver(giver: string): Promise<boolean | Error>;
}

export interface Badge {
  genesis: string;
  giver: string;
  reciever: string;
  type: BadgeType;
  hash: string;
  signature: string;
}
export enum BadgeType {
  Trusted,
  VerifiedInPerson,
}