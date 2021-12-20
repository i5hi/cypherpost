/*
cypherProfile.io
Developed @ Stackmate India
*/

export interface PreferenceInterface{
  create(owner: string, cypher_json: string): Promise< boolean | Error>;
  find(owner: string): Promise<Preference | Error>;
  update(owner: string, cypher_json: string):Promise<boolean | Error>;
  remove(owner:string): Promise<boolean | Error>; 
}
export interface PreferenceStore{
  createOne(pref: Preference): Promise<boolean | Error>;
  readOne(owner: string): Promise<Preference | Error>;
  updateOne(owner: string, cypher_json: string): Promise<boolean | Error>;
  removeOne(owner: string);
}
export interface Preference{
  owner: string,
  cypher_json: string,
  last_updated: number;
};