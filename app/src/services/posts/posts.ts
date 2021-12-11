/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../lib/errors/e";
import { S5UID } from "../../lib/uid/uid";
import { Key } from "../keys/interface";
import { LionBitKeys } from "../keys/keys";
import { LionBitProfile } from "../profile/profile";
import { PostInterface, UserPost } from "./interface";
import { MongoPostStore } from "./mongo";

const store = new MongoPostStore();
const keys = new LionBitKeys();
const profile = new LionBitProfile();
const uuid = new S5UID();

export class LionBitPosts implements PostInterface {

  async create(
    username: string, 
    expiry: number, 
    cipher_json: string, 
    derivation_scheme: string, 
    decryption_keys: Array<Key>,
    ): Promise<UserPost | Error> {
  
    const post: UserPost = {
      id: uuid.createPostCode(),
      username: username,
      genesis: Date.now(),
      expiry,
      cipher_json: cipher_json,
      derivation_scheme: derivation_scheme
    }

    const created = await store.create(post);
    if (created instanceof Error) return created;

    // check if all decryption key usernames are valid
    const valid_decryption_keys = await keys.findMany([...decryption_keys.map(key => key.id)]);
    if (valid_decryption_keys instanceof Error) return valid_decryption_keys;

    console.log({ valid_decryption_keys, decryption_keys })
    if (valid_decryption_keys.length !== decryption_keys.length) return handleError({
      code: 400,
      message: "Decryption Keys contains invalid user"
    });

    await decryption_keys.map(async (decryption_key) => {
      const trusting_username = decryption_key.id;
      decryption_key.id = post.id;
      const status = await keys.add_post_key(trusting_username, decryption_key);
      if (status instanceof Error && status.name != "409") {
        return status
      }
    });

    return post;
  }
  async find(username: string): Promise<Array<UserPost> | Error> {
    return store.read({ username });
  }
  async findMany(ids: Array<string>): Promise<Array<UserPost> | Error> {
    return store.readMany(ids);
  }
  async removeById(id: string, username: string): Promise<boolean | Error> {
    return store.remove({ id, username });
  }
  async removeByUser(username: string): Promise<boolean | Error> {
    const user_profile = await profile.find(username);
    if (user_profile instanceof Error) return user_profile;
    const posts = await store.read({ username });
    if (posts instanceof Error) return posts;
        
    user_profile.trusting.map(async (trusting) => {
      posts.map(async (post) => {
        await keys.remove_post_key(trusting.username, post.id);
      })
    });
    store.removeMany([{ username }]);
  }
  async removeExpired(username: string): Promise<boolean | Error> {
    try {
      const user_posts = await store.read({ username });
      if (user_posts instanceof Error) return user_posts;
      const expired_ids = user_posts.filter((post) => {
        if (post.expiry < Date.now() && post.expiry != 0)
          return { id: post.id };
      });

      const user_profile = await profile.find(username);
      if (user_profile instanceof Error) return user_profile;

      if (expired_ids.length === 0) return true;
      else {
        user_profile.trusting.map(async (trusting) => {
          expired_ids.map(async (expired) => {
            await keys.remove_post_key(trusting.username, expired.id);
          })
        });
        return store.removeMany([...expired_ids]);
      }
    }
    catch (e) {
      console.error({ e });
      return handleError(e)
    }
  }
}