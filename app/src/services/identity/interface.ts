/*
cypherpost.io
Developed @ Stackmate India
*/

export interface IdentityInterface{
  register(username: string, pubkey: string):Promise<boolean | Error>;
  verify(pubkey: string, message: string, signature: string): Promise<boolean | Error>;
  all(): Promise<Array<UserIdentity> | Error>;
  remove(pubkey: string): Promise<boolean | Error>;
}

export interface IdentityStore{
  createOne(identity: UserIdentity): Promise<boolean | Error>;
  readOne(index: string, indexType: IdentityIndex): Promise<UserIdentity | Error>;
  readAll(): Promise<Array<UserIdentity> | Error>;
  removeOne(pubkey: string): Promise<boolean | Error>;
}

export interface UserIdentity{
  genesis : number;
  username: string;
  pubkey:string;
}

export enum IdentityIndex{
  Username,
  Pubkey
}
