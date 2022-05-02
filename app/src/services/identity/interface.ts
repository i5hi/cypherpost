/*
cypherpost.io
Developed @ Stackmate India
*/

export interface IdentityInterface{
  register(username: string, pubkey: string, type: RegistrationType):Promise<boolean | Error>;
  authenticate(pubkey: string, message: string, signature: string): Promise<boolean | Error>;
  updateStatus(pubkey:string, status: VerificationStatus): Promise<boolean | Error>;
  all(genesis_filter: Number): Promise<Array<UserIdentity> | Error>;
  remove(pubkey: string): Promise<boolean | Error>;
}

export interface IdentityStore{
  createOne(identity: UserIdentity): Promise<boolean | Error>;
  readOne(index: string, indexType: IdentityIndex): Promise<UserIdentity | Error>;
  updateOne(pubkey: string, status: VerificationStatus):Promise<boolean | Error>;
  readAll(genesis_filter: Number): Promise<Array<UserIdentity> | Error>;
  removeOne(pubkey: string): Promise<boolean | Error>;
}

export interface UserIdentity{
  genesis : number;
  username: string;
  pubkey:string;
  status: VerificationStatus;
};

export enum RegistrationType{
  Invite,
  Payment
}

export enum VerificationStatus{
  Verified = "VERIFIED",
  Partial = "PARTIAL",
  Pending = "PENDING"
}

export enum IdentityIndex{
  Username,
  Pubkey
}
