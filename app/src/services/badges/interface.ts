export interface Badge {
  genesis: string;
  from: string;
  to: string;
  type: BadgeType;
  hash: string;
  signature: string;
}
export enum BadgeType {
  Accepted,
  Trusted,
  VerifiedInPerson,
}