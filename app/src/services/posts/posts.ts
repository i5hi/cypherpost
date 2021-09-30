/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../lib/errors/e";
import { S5UID } from "../../lib/uid/uid";
import { Key } from "../keys/interface";
import { LionBitKeys } from "../keys/keys";
import { PostInterface, UserPost } from "./interface";
import { MongoPostStore } from "./mongo";

const store = new MongoPostStore();
const keys  = new LionBitKeys();
const uuid = new S5UID();

export class LionBitPosts implements PostInterface{
  async create(username: string, expiry: number,  cipher_json: string, derivation_scheme: string, decryption_keys: Array<Key>): Promise<UserPost | Error>{
    const post: UserPost = {
      id: uuid.createPostCode(),
      username: username,
      genesis: Date.now(),
      expiry,
      cipher_json: cipher_json,
      derivation_scheme: derivation_scheme
    }
    
    const created = await store.create(post);
    if(created instanceof Error) return created;
    
    // check if all decryption key usernames are valid
    const valid_decryption_keys = await keys.findMany([...decryption_keys.map(key => key.id)]);
    if(valid_decryption_keys instanceof Error) return valid_decryption_keys;

    if(valid_decryption_keys.length !== decryption_keys.length) return handleError({
      code: 400,
      message: "Decryption Keys contains invalid user"
    });
    
    await decryption_keys.map(async (decryption_key) => {
      const trusting_username = decryption_key.id;
      decryption_key.id = post.id;
      const status = await keys.add_post_key(trusting_username, decryption_key);
      if (status instanceof Error){
        console.error("!!!ERROR: NOTIFY ADMIN!!!\nCOULD NOT UPDATE KEYS IN POST", status)
        return status;
      }
    });
    
    return post;
  }
  async find(username: string): Promise<Array<UserPost> | Error>{
    return store.read({username});
  }
  async findMany(ids: Array<string>): Promise<Array<UserPost> | Error>{
    return store.readMany(ids);
  }
  async remove(id:string): Promise<boolean | Error>{
    return store.remove(id);
  }
}