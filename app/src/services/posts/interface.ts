/*
cypherpost.io
Developed @ Stackmate India
*/

import { Key } from "../keys/interface";

export interface PostInterface{
  create(username: string, expiry: number, cipher_json: string, derivation_scheme: string, decryption_keys: Array<Key>): Promise<UserPost | Error>;
  find(username: string): Promise<Array<UserPost> | Error>;
  findMany(ids: Array<string>): Promise<Array<UserPost> | Error>; 
  remove(id: string): Promise<boolean | Error>;
}

export interface PostStore{
  create(post: UserPost):Promise<UserPost | Error>;
  read(post:UserPost): Promise<Array<UserPost> | Error>;
  readMany(ids: Array<string>): Promise<Array<UserPost> | Error>;
  // update_push(id: string, update:Comment): Promise<boolean | Error>;
  // update_pull(id: string, update:Comment): Promise<boolean | Error>;
  remove(id:string): Promise<boolean | Error>;
}
 
export interface UserPost{
  id?: string;
  genesis?: number;
  expiry?: number;
  username?: string;
  // visibility?: PostVisibility;
  cipher_json?: string;
  derivation_scheme?: string;
  // comments?: Array<Comment>;
}

export interface Comment {
  id?: string;
  username?: string;
  comment?: string;
  genesis?: string;
}

// export enum PostVisibility {
//   Trusting,
//   // TrustingChain,
//   Public, // plaintext
// }