/*
cypherpost.io
Developed @ Stackmate India
*/

import { ProfileInterface, UserProfile } from "./interface";
import { MongoProfileStore } from "./mongo";

const store = new MongoProfileStore();

export class CypherpostProfile implements ProfileInterface{
  async initialize(owner: string): Promise<boolean | Error> {
    const new_profile: UserProfile = {
      owner,
      genesis: Date.now()
    };
    const status = await store.createOne(new_profile);
    return status;
  }
  async findOne(owner: string): Promise<Error | UserProfile> {
    return store.readOne(owner);
  }
  async findMany(owners: string[]): Promise<Error | UserProfile[]> {
    return store.readMany(owners);
  }
  async update(owner: string, derivation_scheme: string, cypher_json: string): Promise<boolean | Error> {
    const profile_update = {
      derivation_scheme,
      cypher_json
    }
    return store.updateOne(owner,profile_update)
  }
  async remove(owner: string): Promise<boolean | Error> {
    return store.removeOne(owner)
  }  
}
