/*
cypherpost.io
Developed @ Stackmate India
*/

export interface UIDInterface{
 createUserID(): string;
 createSessionID():string;
 createIDVSReference(prefix: string):string;
 createAccountID(): string;
 createBuyOrderID():string; 
 createSellOrderID():string;
 createTxID():string;
 createResponseID(): string;
 createRandomID(length: number): string;
 createAffiliateCode(): string;
 createXFloatTxID():string;
 createPostCode():string;
}
export interface InternalTxidPair{
    sender: string;
    receiver: string;
}