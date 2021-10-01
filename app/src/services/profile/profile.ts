/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../lib/errors/e";
import { Key } from "../keys/interface";
import { LionBitKeys } from "../keys/keys";
import { ProfileInterface, TrustDirection, UserProfile } from "./interface";
import { MongoProfileStore } from "./mongo";


const keys = new LionBitKeys();
const store = new MongoProfileStore();

export class LionBitProfile implements ProfileInterface {
  async genesis(username: string, derivation_scheme: string, recipient_xpub: string): Promise<boolean | Error> {
    const profile_status = await store.create({
      username,
      derivation_scheme,
      trusted_by: [],
      trusting: []
    });
    if (profile_status instanceof Error) return profile_status;

    return await keys.init(username, recipient_xpub);

  }
  find(username: string): Promise<Error | UserProfile> {
    return store.read(username);
  }

  findMany(usernames: Array<string>): Promise<Error | Array<UserProfile>> {
    return store.readMany(usernames);
  }
  update(username: string, update: UserProfile): Promise<Error | UserProfile> {
    return store.update(username, update);
  }
  async trust(username: string, trusting: string, decryption_key: string, signature: string): Promise<boolean | Error> {

    // CHECK IF USER IS ALREADY BEING TRUSTED
    const self_profile = await store.read(username);
    if (self_profile instanceof  Error) throw self_profile;

    const trusting_users = self_profile.trusting.map((user)=>user.username);
    if(trusting_users.includes(trusting)){
      return handleError({
        code: 409,
        message:"Already trusting."
      });
    }
    
    const self_profile_update = await store.update_push(username, TrustDirection.Trusting, {
      username: trusting
    });
    if (self_profile_update instanceof Error) return self_profile_update;

    const other_profile_update = await store.update_push(trusting, TrustDirection.TrustedBy, {
      username,
      mute: false
    });
    if (other_profile_update instanceof Error) return other_profile_update;

    const other_keys = await  keys.find(trusting);
    if (other_keys instanceof Error) return other_keys;

    const self_key_update = await keys.add_recipient_key(username, { key: other_keys.recipient_xpub, id: other_keys.username, signature });
    if (self_key_update instanceof Error) return self_key_update;

    const other_key_update = await keys.add_profile_key(trusting, { key: decryption_key, id: username });
    if (other_key_update instanceof Error) return other_key_update;

    return true;
  }
  async revoke(username: string, revoking: string, decryption_keys: Array<Key>, derivation_scheme: string, cipher_info: string): Promise<UserProfile | Error> {
    // update self derivation_scheme
    const self_profile = await store.read(username);
    if (self_profile instanceof Error) return self_profile;

    if (self_profile.trusting.some(element=>element.username === revoking)) {

      const self_profile_update = await store.update(username, { cipher_info, derivation_scheme });
      if (self_profile_update instanceof Error) return self_profile_update;

      // update self profile trusting array
      const self_profile_trusting_update = await store.update_pull(username, TrustDirection.Trusting, {
        username: revoking
      });
      if (self_profile_trusting_update instanceof Error) return self_profile_trusting_update;

      // update other profile trusted_by
      const other_profile_update = await store.update_pull(revoking, TrustDirection.TrustedBy, {
        username
      });
      if (other_profile_update instanceof Error) return other_profile_update;

      // update other trusting keys
      const revoke_key_status = await keys.remove_profile_key(revoking, username);
      if (revoke_key_status instanceof Error) return revoke_key_status;

      // update others
      decryption_keys.map(async (decryption_key) => {
        // decryption_key.id must be of the user being revoked
        // check if decryption_key.id is trusted by username
        // if (self_profile.trusting.includes({username: decryption_key.id}))

        // remove old keys
        let status = await keys.remove_profile_key(decryption_key.id, username);
        if (status instanceof Error) return status;
        // add new keys
        status = await keys.add_profile_key(decryption_key.id, decryption_key);
        if (status instanceof Error) return status;

      });
      const updated_self_profile = await store.update(username,{derivation_scheme});
      if (updated_self_profile instanceof Error) return updated_self_profile;
  


      return updated_self_profile;
    }
    else {
      return handleError({
        code: 400,
        message: "Cannot revoke a user you are not already trusting."
      });
    }

  }

  async mute(username: string, trusted_by: string, toggle: boolean): Promise<boolean | Error> {

      const pulled = await store.update_pull(username, TrustDirection.TrustedBy, {username: trusted_by});
      if (pulled instanceof Error) return pulled;

      const pushed = await store.update_push(username, TrustDirection.TrustedBy, {username: trusted_by, mute:toggle});
      if (pushed instanceof Error) return pushed;
      
      return true;
    
  }
  async remove(username: string): Promise<boolean | Error> {
    return store.remove(username);
  }

};

