/*
cypherpost.io
Developed @ Stackmate India
*/

export interface PostInterface{
  create(owner: string, expiry: number, cypher_json: string, derivation_scheme: string): Promise<string | Error>;
  findManyById(ids: Array<string>): Promise<Array<UserPost> | Error>;
  findAllByOwner(owner: string): Promise<Array<UserPost> | Error>; 
  removeOneById(id: string, owner: string): Promise<boolean | Error>;
  removeAllByOwner(owner:string): Promise<Array<string> | Error>;
  removeAllExpired(owner:string): Promise<Array<string> | Error>;
}

export interface PostStore{
  createOne(post: UserPost):Promise<boolean | Error>;
  readMany(indexes: Array<string>, index_type: PostStoreIndex): Promise<Array<UserPost> | Error>;
  removeOne(owner: string, id: string): Promise<boolean | Error>;
  removeMany(indexes:Array<string>, index_type: PostStoreIndex): Promise<boolean | Error>;
}
 
export interface UserPost{
  id?: string;
  genesis?: number;
  expiry?: number;
  owner?: string;
  cypher_json?: string;
  derivation_scheme?: string;
}

export enum PostStoreIndex{
  Owner,
  PostId
}
