/*
cypherProfile.io
Developed @ Stackmate India
*/

export interface ProfileKeyInterface {
  addProfileDecryptionKeys(giver: string, key_updates: ProfileKeyStoreUpdate[]): Promise<boolean | Error>;
  updateProfileDecryptionKeys(giver: string, key_update: ProfileKeyStoreUpdate[]): Promise<boolean | Error>;
  findProfileDecryptionKeyByReciever(receiver: string): Promise<ProfileDecryptionKey[] | Error>;
  findProfileDecryptionKeyByGiver(giver: string): Promise<ProfileDecryptionKey[] | Error>;
  removeProfileDecryptionKeyByReciever(giver: string, reciever: string): Promise<boolean | Error>;
  removeProfileDecryptionKeyByGiver(giver: string): Promise<boolean | Error>;
};

export interface ProfileDecryptionKeyStore {
  createMany(keys: ProfileDecryptionKey[]): Promise<boolean | Error>;
  readByGiver(giver: string): Promise<ProfileDecryptionKey[] | Error>;
  readByReciever(reciever: string): Promise<ProfileDecryptionKey[] | Error>;
  removeManyByReciever(giver: string, reciever: string): Promise<boolean | Error>;
  removeAll(giver: string): Promise<boolean | Error>;
  updateOne(giver: string, reciever: string, decryption_key: string): Promise<boolean | Error>;
}

export interface ProfileKeyStoreUpdate {
  reciever: string,
  decryption_key: string
}

export interface ProfileDecryptionKey {
  genesis: number;
  giver: string;
  reciever: string;
  decryption_key?: string;
}
