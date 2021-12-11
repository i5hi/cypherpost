/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../lib/errors/e";
import { S5UID } from "../../lib/uid/uid";
import { PostInterface, PostStoreIndex, UserPost } from "./interface";
import { MongoPostStore } from "./mongo";

const store = new MongoPostStore();
const uuid = new S5UID();

export class CypherpostPosts implements PostInterface {

  findAllByOwner(owner: string): Promise<UserPost[] | Error> {
    return store.readMany([owner],PostStoreIndex.Owner);
  }

  async create(owner: string, expiry: number, cypher_json: string, derivation_scheme: string): Promise<string | Error>
  {
  
    const post: UserPost = {
      id: uuid.createPostCode(),
      owner: owner,
      genesis: Date.now(),
      expiry,
      cypher_json: cypher_json,
      derivation_scheme: derivation_scheme
    }

    const status = await store.createOne(post);
    if (status instanceof Error) return status;
    return post.id;
  }
  async findManyById(ids: Array<string>): Promise<Array<UserPost> | Error>{
    return store.readMany(ids,PostStoreIndex.PostId);
  }

  async removeOneById(id: string, owner: string): Promise<boolean | Error> {
    return store.removeOne(id,owner);
  }
  async removeAllByOwner(owner: string): Promise<Array<string> | Error> {
    const user_posts = await store.readMany([owner],PostStoreIndex.Owner);
    if (user_posts instanceof Error) return user_posts;

    const status = await store.removeMany([ owner ], PostStoreIndex.Owner);
    if (status instanceof Error) return status;

    return user_posts.map(post=>post.id);
  }
  async removeAllExpired(owner: string): Promise<Array<string> | Error> {
    try {
      const user_posts = await store.readMany([owner],PostStoreIndex.Owner);
      if (user_posts instanceof Error) return user_posts;
      let expired_ids=[]; 
      
      user_posts.filter((post) => {
        if (post.expiry < Date.now() && post.expiry != 0)
          expired_ids.push(post.id);
      });

      if (expired_ids.length === 0) return [];
      else {
        const status = await store.removeMany([...expired_ids], PostStoreIndex.PostId);
        if (status instanceof Error) return status;
        else return expired_ids;
      }
    }
    catch (e) {
      console.error({ e });
      return handleError(e)
    }
  }
}