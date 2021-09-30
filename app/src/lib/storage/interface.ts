/*
cypherpost.io
Developed @ Stackmate India
*/

export interface Database{
 connect(db_options: DbConnection): Promise<object | Error>;
}

export interface DbConnection{
 ip: string;
 port: string;
 name?: string;
 auth?:string;
}