/*
cypherpost.io
Developed @ Stackmate India
*/

export interface CryptoInterface {
 createRSAPairFile(filename: string): Promise<string | Error>; 
 signS256Message(message: string, private_key: string): string | Error;
 verifyS256Signature(message: string, sig: string, public_key: string): boolean | Error;

 getECDHPair(): Promise<ECDHPair | Error>;
 encryptAESMessageWithIV(text: string, key_hex: string): string  | Error;
 decryptAESMessageWithIV(iv_text_crypt: string, key_hex: string): string  | Error;

//  readECDHPairFromFile():Promise<ECDHPair | Error>;
}

export interface  ECDHPair{
 privkey: string;
 pubkey: string;
}
