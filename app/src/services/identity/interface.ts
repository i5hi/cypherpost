/*
cypherpost.io
Developed @ Stackmate India
*/

export interface IdentityInterface{
  register(username: string, pubkey: string):Promise<boolean | Error>;
  verify(username: string, message: string, signature: string): Promise<boolean | Error>;
  all(): Promise<Array<UserIdentity> | Error>;
  remove(username: string): Promise<boolean | Error>;
}

export interface IdentityStore{
  create(identity: UserIdentity): Promise<boolean | Error>;
  read(index: string, indexType: IdentityIndex): Promise<UserIdentity | Error>;
  readMany(usernames: Array<string>): Promise<Array<UserIdentity> | Error>;
  remove(username: string): Promise<boolean | Error>;
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
