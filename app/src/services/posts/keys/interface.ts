/*
cypherpost.io
Developed @ Stackmate India
*/

export interface PostKeyInterface {
  addPostDecryptionKeys(owner: string, post_id: string, key_updates: PostKeyStoreUpdate[]): Promise<boolean | Error>;
  updatePostDecryptionKeys(owner: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error>;
  findPostDecryptionKeyByReciever(receiver: string): Promise<PostDecryptionKey[] | Error>;
  findPostDecryptionKeyByOwner(owner: string): Promise<PostDecryptionKey[] | Error>;
  removePostDecryptionKeyById(owner: string, post_id: string): Promise<boolean | Error>;
  removePostDecryptionKeyByReciever(owner: string, reciever: string): Promise<boolean | Error>;
  removePostDecryptionKeyByOwner(owner: string): Promise<boolean | Error>;
};


export interface PostDecryptionKeyStore {
  createMany(keys: PostDecryptionKey[]): Promise<boolean | Error>;
  readByOwner(owner: string): Promise<PostDecryptionKey[] | Error>;
  readByReciever(reciever: string): Promise<PostDecryptionKey[] | Error>;
  readByPostId(post_id: string): Promise<PostDecryptionKey[] | Error>;
  removeManyByPostId(owner: string, post_id: string): Promise<boolean | Error>;
  removeManyByReciever(owner: string, reciever: string): Promise<boolean | Error>;
  removeAll(owner: string): Promise<boolean | Error>;
  updateOne(owner: string, post_id: string, reciever: string, decryption_key: string): Promise<boolean | Error>;
}

export interface PostKeyStoreUpdate {
  reciever: string,
  decryption_key: string
}

export interface PostDecryptionKey {
  genesis: number;
  owner: string;
  reciever: string;
  post_id: string;
  decryption_key?: string;
}
