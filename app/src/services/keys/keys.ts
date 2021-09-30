/*
cypherpost.io
Developed @ Stackmate India
*/

import { Key, KeyInterface, UseCase, UserKeys } from "./interface";
import { MongoKeyStore } from "./mongo";



const store = new MongoKeyStore();

export class LionBitKeys implements KeyInterface {
  async remove(username: string): Promise<boolean | Error> {
    return store.remove(username);
  }
  async init(username: string, recipient_xpub: string): Promise<boolean | Error> {
    return store.create({
      username,
      recipient_xpub,
      post_keys: [],
      profile_keys:[]
    });
  }
  find(username: string): Promise<Error | UserKeys> {
    return store.read(username);
  }
  findMany(usernames: Array<string>): Promise<Error | Array<UserKeys>> {
    return store.readMany(usernames);
  }
  add_recipient_key(username: string, key: Key): Promise<boolean | Error> {
    return store.update_push(username,UseCase.Recipient,key);
  }
  remove_recipient_key(username: string, id: string): Promise<boolean | Error> {
    return store.update_pull(username,UseCase.Recipient,{id});
  }
  add_profile_key(username: string, key: Key): Promise<boolean | Error> {
    return store.update_push(username,UseCase.Profile,key);
  }
  remove_profile_key(username: string, id: string): Promise<boolean | Error> {
    return store.update_pull(username,UseCase.Profile,{id});
  }
  add_post_key(username: string, key: Key): Promise<boolean | Error> {
    return store.update_push(username,UseCase.Post,key);
  }
  remove_post_key(username: string, id: string): Promise<boolean | Error> {
    return store.update_pull(username,UseCase.Post,{id});
  }

};

