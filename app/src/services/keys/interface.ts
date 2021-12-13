/*
cypherpost.io
Developed @ Stackmate India
*/

export interface KeyInterface{
  getOwnerKeyChain(owner:Array<string>): Promise<Array<KeyChain> | Error>;
  getRecieverKeyChain(reciever:Array<string>): Promise<Array<KeyChain> | Error>;
  removeKeyChain(owner: string): Promise<boolean | Error>;

  addProfileDecryptionKey(owner: string, reciever: string,  decryption_key: string): Promise<boolean | Error>;
  removeProfileDecryptionKey(owner: string, reciever: string): Promise<boolean | Error>;
  updateProfileDecryptionKey(owner: string, reciever: string, decryption_key: string): Promise<boolean | Error>;

  addPostDecryptionKey(owner: string, reciever: string, post_reference: string, decryption_key: string): Promise<boolean | Error>;
  removePostDecryptionKey(owner: string, post_reference: string): Promise<boolean | Error>;
  updatePostDecryptionKey(owner: string, reciever: string, post_reference: string, decryption_key: string): Promise<boolean | Error>;
};

export interface ProfileDecryptionKeyStore{
  create(key_entry: ProfileDecryptionKey):Promise<boolean | Error>;
  readByOwner(owner:string): Promise<ProfileDecryptionKey | Error>;
  readByReciever(reciever:string): Promise<ProfileDecryptionKey | Error>;
  removeOne(owner: string, reciever: string): Promise<boolean | Error>;
  removeAll(owner: string): Promise<boolean | Error>;
  updateOne(owner: string, reciever: string, decryption_key: string): Promise<boolean | Error>;
}

export interface PostDecryptionKeyStore{
  create(key_entry: PostDecryptionKey):Promise<boolean | Error>;
  readByOwner(owner:string): Promise<PostDecryptionKey | Error>;
  readByReciever(reciever:string): Promise<PostDecryptionKey | Error>;
  readByPostReference(post_reference: string): Promise<PostDecryptionKey | Error>;
  removeManyByPostReference(owner: string, post_reference: string): Promise<boolean | Error>;
  removeManyByReciever(owner: string, reciever: string): Promise<boolean | Error>;
  removeAll(owner: string): Promise<boolean | Error>;
  updateOne(owner: string, reciever: string, post_reference: string, decryption_key: string): Promise<boolean | Error>;
}

export interface ProfileDecryptionKey{
  genesis: number;
  owner: string;
  reciever: string;
  decryption_key?: string;
}

export interface PostDecryptionKey{
  genesis: number;
  owner: string;
  reciever: string;
  post_reference: string;
  decryption_key?: string;
}

export interface KeyChain{
  profile: ProfileDecryptionKey[],
  post: PostDecryptionKey[]   
}