export interface TrustBadgeInterface{
  create(from: string, to: string, signature: string): Promise<boolean | Error>;
  findByTrustGiver(from: string): Promise<Badge[] | Error>;
  findByTrustReciever(to:string):  Promise<Badge[] | Error>;
  revoke(from: string, to: string): Promise<boolean | Error>;
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