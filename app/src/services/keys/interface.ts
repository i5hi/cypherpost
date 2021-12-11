/*
cypherpost.io
Developed @ Stackmate India
*/

export interface KeyInterface {
  init(owner: string, recipient_xpub: string): Promise<boolean | Error>;
  getKeyChain(owner:Array<string>): Promise<Array<KeyChain> | Error>;
  removeKeyChain(owner: string): Promise<boolean | Error>;
  // Identity key operations are primarily invoked by owner for owner keystore
  getIdentityTrustRelation(owner:string): Promise<IdentityTrustRelation[] | Error>;
  addIdentityKeyRelation(owner:string, reference: string): Promise<boolean | Error>;
  removeIdentityKeyRelation(owner: string, reference: string): Promise<boolean | Error>;
  // Profile and Post key operations are primarily invoked by reference for owner keystore
  addProfileDecryptionKey(reference: string, owner: string,  decryption_key: string): Promise<boolean | Error>;
  removeProfileDecryptionKey(reference: string): Promise<boolean | Error>;
  updateProfileDecryptionKey(reference: string, decryption_key: string): Promise<boolean | Error>;
  addPostDecryptionKey(owner: string, reference: string,decryption_key: string): Promise<boolean | Error>;
  removePostDecryptionKey(owner: string, id: string): Promise<boolean | Error>;
  updatePostDecryptionKey(reference: string, decryption_key: string): Promise<boolean | Error>;
};

export interface IdentityKeyStore{
  createOne(key_entry: IdentityKeyRelation):Promise<boolean | Error>;
  readMany(index:string, index_type: KeyStoreIndex): Promise<IdentityKeyRelation | Error>;
  removeOne(owner: string, reference: string): Promise<boolean | Error>;
  removeMany(index:string, index_type: KeyStoreIndex): Promise<boolean | Error>;
}

export interface ProfileDecryptionKeyStore{
  create(key_entry: ProfileDecryptionKey):Promise<boolean | Error>;
  read(owner:string): Promise<ProfileDecryptionKey | Error>;
  remove(owner: string, reference: string): Promise<boolean | Error>;
  updateOne(owner: string, reference: string, decryption_key: string): Promise<boolean | Error>;
}
export interface PostDecryptionKeyStore{
  create(key_entry: PostDecryptionKey):Promise<boolean | Error>;
  read(owner:string): Promise<PostDecryptionKey | Error>;
  remove(owner: string, reference: string): Promise<boolean | Error>;
  updateOne(owner: string, reference: string, decryption_key: string): Promise<boolean | Error>;
}

export enum KeyStoreIndex{
  Owner,
  Reference
}

export interface IdentityKeyRelation {
  genesis: string;
  owner?: string;
  reference?: string;
  signature?:string;
}

export interface IdentityTrustRelation{
  identity: string;
  trusting: string[];
  trusted_by: string[]; 
}

export interface ProfileDecryptionKey {
  genesis: number;
  owner: string;
  reference: string;
  decryption_key?: string;
}
export interface PostDecryptionKey {
  genesis: number;
  owner: string;
  reference: string;
  decryption_key?: string;
}

export interface KeyChain {
  indentity: IdentityKeyRelation[],
  profile: ProfileDecryptionKey[],
  post: PostDecryptionKey[]   
}