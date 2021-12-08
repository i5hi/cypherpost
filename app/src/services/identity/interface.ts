/*
cypherpost.io
Developed @ Stackmate India
*/

export interface IdentityInterface{
  register(username: string, xpub: string):Promise<boolean | Error>;
  verify(xpub: string, message: string, signature: string): Promise<boolean | Error>;
  all(): Promise<Array<UserIdentity> | Error>;
  remove(xpub: string): Promise<boolean | Error>;
}

export interface IdentityStore{
  create(identity: UserIdentity): Promise<boolean | Error>;
  read(index: string, indexType: IdentityIndex): Promise<UserIdentity | Error>;
  readAll(): Promise<Array<UserIdentity> | Error>;
  remove(xpub: string): Promise<boolean | Error>;
}

export interface UserIdentity{
  genesis : number;
  username: string;
  xpub:string;
}

export enum IdentityIndex{
  Username,
  XPub
}
