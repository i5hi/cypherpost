/*
cypherpost.io
Developed @ Stackmate India
*/
import { Key } from "../keys/interface";

export interface ProfileInterface {
  genesis(username: string, derivation_scheme: string, recipient_xpub: string): Promise<boolean | Error>;
  find(username: string): Promise<UserProfile | Error>;
  findMany(usernames:  Array<string>): Promise<Array<UserProfile> | Error>;
  update(username: string, update: UserProfile): Promise<UserProfile | Error>;
  trust(username: string, trusting: string, decryption_key: string, signature: string): Promise<boolean | Error>;
  revoke(username: string, trusting: string, decryption_keys: Array<Key>, derivation_scheme: string, cipher_info:string): Promise<UserProfile | Error>;
  mute(username: string, trusted_by: string, toggle: boolean): Promise<boolean | Error>;
  remove(username: string): Promise<boolean | Error>;
};

export interface ProfileStore{
  create(user: UserProfile):Promise<boolean | Error>;
  read(username: string): Promise<UserProfile | Error>;
  readMany(usernames: Array<string>): Promise<Array<UserProfile> | Error>;
  update(username: string, update:UserProfile): Promise<UserProfile | Error>;
  update_push(username: string, trust_direction: TrustDirection, update: UserSet): Promise<boolean | Error>;
  update_pull(username: string, trust_direction: TrustDirection,  update: UserSet): Promise<boolean | Error>;
  remove(username: string): Promise<boolean | Error>;
}
 
export interface UserProfile{
  pubkey?: string;
  username ?: string,
  nickname ?: string,
  status ?: string,
  cipher_info ?: string,
  derivation_scheme ?: string,
  trusted_by ?: Array<UserSet>,
  trusting ?: Array<UserSet>,

};



export enum TrustDirection{
  Trusting,
  TrustedBy
}

export interface UserSet {
  username ?: string,
  mute ?: boolean
}

export interface X {

}
