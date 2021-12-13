/*
cypherpost.io
Developed @ Stackmate India
*/

export interface PostKeyInterface {
  addPostDecryptionKeys(giver: string, post_id: string, key_updates: PostKeyStoreUpdate[]): Promise<boolean | Error>;
  updatePostDecryptionKeys(giver: string, post_id: string, key_update: PostKeyStoreUpdate[]): Promise<boolean | Error>;
  findPostDecryptionKeyByReciever(receiver: string): Promise<PostDecryptionKey[] | Error>;
  findPostDecryptionKeyByGiver(giver: string): Promise<PostDecryptionKey[] | Error>;
  removePostDecryptionKeyById(giver: string, post_id: string): Promise<boolean | Error>;
  removePostDecryptionKeyByReciever(giver: string, reciever: string): Promise<boolean | Error>;
  removePostDecryptionKeyByGiver(giver: string): Promise<boolean | Error>;
};


export interface PostDecryptionKeyStore {
  createMany(keys: PostDecryptionKey[]): Promise<boolean | Error>;
  readByGiver(giver: string): Promise<PostDecryptionKey[] | Error>;
  readByReciever(reciever: string): Promise<PostDecryptionKey[] | Error>;
  readByPostId(post_id: string): Promise<PostDecryptionKey[] | Error>;
  removeManyByPostId(giver: string, post_id: string): Promise<boolean | Error>;
  removeManyByReciever(giver: string, reciever: string): Promise<boolean | Error>;
  removeAll(giver: string): Promise<boolean | Error>;
  updateOne(giver: string, post_id: string, reciever: string, decryption_key: string): Promise<boolean | Error>;
}

export interface PostKeyStoreUpdate {
  reciever: string,
  decryption_key: string
}

export interface PostDecryptionKey {
  genesis: number;
  giver: string;
  reciever: string;
  post_id: string;
  decryption_key?: string;
}