/*
cypherpost.io
Developed @ Stackmate India
*/

export interface JWTInterface{
 issue(payload: JWTPayload): Promise<string | Error>;
 verify(token: string): Promise<JWTPayload | Error>;
}

export interface JWTPayload{
 iss?: string;
 exp?:number;
 aud: string;
 iat?: number;
 user: string;
}