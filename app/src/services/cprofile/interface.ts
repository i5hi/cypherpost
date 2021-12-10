/*
cypherpost.io
Developed @ Stackmate India
*/

export interface ProfileInterface {
  initialize(owner: string): Promise<boolean | Error>;
  findOne(owner: string): Promise<UserProfile | Error>;
  findMany(owners:  Array<string>): Promise<Array<UserProfile> | Error>;
  update(owner: string, update: UserProfile): Promise<boolean | Error>;
  remove(owner: string): Promise<boolean | Error>;
};

export interface ProfileStore{
  createOne(user: UserProfile):Promise<boolean | Error>;
  readOne(owner: string): Promise<UserProfile | Error>;
  readMany(owners: Array<string>): Promise<Array<UserProfile> | Error>;
  updateOne(owner: string, update:UserProfile): Promise<UserProfile | Error>;
  removeOne(owner: string): Promise<boolean | Error>;
}

export interface UserProfile{
  genesis?: number;
  owner?: string;
  derivation_scheme?:string;
  cypher_json?:string;
};
