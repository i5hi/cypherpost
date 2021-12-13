/*
cypherProfile.io
Developed @ Stackmate India
*/

export interface ProfileKeyInterface {
  addProfileDecryptionKeys(owner: string, key_updates: ProfileKeyStoreUpdate[]): Promise<boolean | Error>;
  updateProfileDecryptionKeys(owner: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error>;
  findProfileDecryptionKeyByReciever(receiver: string): Promise<ProfileDecryptionKey[] | Error>;
  findProfileDecryptionKeyByOwner(owner: string): Promise<ProfileDecryptionKey[] | Error>;
  removeProfileDecryptionKeyByReciever(owner: string, reciever: string): Promise<boolean | Error>;
  removeProfileDecryptionKeyByOwner(owner: string): Promise<boolean | Error>;
};


export interface ProfileDecryptionKeyStore {
  createMany(keys: ProfileDecryptionKey[]): Promise<boolean | Error>;
  readByOwner(owner: string): Promise<ProfileDecryptionKey[] | Error>;
  readByReciever(reciever: string): Promise<ProfileDecryptionKey[] | Error>;
  removeManyByReciever(owner: string, reciever: string): Promise<boolean | Error>;
  removeAll(owner: string): Promise<boolean | Error>;
  updateOne(owner: string, reciever: string, decryption_key: string): Promise<boolean | Error>;
}

export interface ProfileKeyStoreUpdate {
  reciever: string,
  decryption_key: string
}

export interface ProfileDecryptionKey {
  genesis: number;
  owner: string;
  reciever: string;
  decryption_key?: string;
}
