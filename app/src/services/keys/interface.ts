/*
cypherpost.io
Developed @ Stackmate India
*/

export interface KeyInterface {
  init(username: string, recipient_xpub: string): Promise<boolean | Error>;
  findMany(usernames:Array<string>): Promise<Array<UserKeys> | Error>;
  add_recipient_key(username: string, key: Key): Promise<boolean | Error>;
  remove_recipient_key(username: string, id: string): Promise<boolean | Error>;
  add_profile_key(username: string, key: Key): Promise<boolean | Error>;
  remove_profile_key(username: string, id: string): Promise<boolean | Error>;
  add_post_key(username: string, key: Key): Promise<boolean | Error>;
  remove_post_key(username: string, id: string): Promise<boolean | Error>;
  remove(username: string): Promise<boolean | Error>;
};

export interface KeyStore{
  create(user: UserKeys):Promise<boolean | Error>;
  read(username:string): Promise<UserKeys | Error>;
  readMany(usernames:Array<string>): Promise<Array<UserKeys> | Error>;
  update_push(username: string, usecase: UseCase, update:Key): Promise<boolean | Error>;
  update_pull(username: string, usecase: UseCase, update:Key): Promise<boolean | Error>;
  remove(username: string): Promise<boolean | Error>;
}

export enum UseCase{
  Recipient,
  Profile,
  Post
}

export interface UserKeys{
  //mine
  username?: string;// my identity name
  recipient_xpub?: string;// my identity pubkey
  //others
  recipient_keys?: Array<Key>;//0 who i trust
  profile_keys?: Array<Key>;//1 who trust me
  post_keys?: Array<Key>;//2 based on visibility
};

export interface Key{
  id?: string;
  key?: string;
  signature?:string;
}
