/*
cypherpost.io
Developed @ Stackmate India
*/
export interface AuthInterface {
  register(username: string, pass256: string, seed256: string, invited_by: string, invite_code: string): Promise<string | Error>; // JWT
  login(username: string, pass256: string): Promise<string | Error>; // JWT
  reset(seed256: string, pass256: string): Promise<string | Error>;  // JWT
  remove(username: string): Promise<boolean | Error>; 
  invite(invited_by: string): Promise<string | Error>; 
  check_invite(invited_by: string, invite_code: string): Promise<boolean | Error>;
};
 
export interface AuthStore{
  create(user: UserAuth):Promise<UserAuth | Error>;
  read(user:UserAuth): Promise<UserAuth | Error>;
  update(query: UserAuth, update:UserAuth): Promise<UserAuth | Error>;
  update_push(query: UserAuth, update: string): Promise<boolean | Error>;
  update_pull(query: UserAuth, update: string): Promise<boolean | Error>;
  remove(user:UserAuth): Promise<boolean | Error>;
}


export interface UserAuth{
  genesis?: number;
  uid?: string;
  username?: string;
  pass256?:string;
  seed256?:string;
  verified?:boolean;
  invited_by?:string;
  inviter_code?: string;
  invite_codes?:Array<string>;
};