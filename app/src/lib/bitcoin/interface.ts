/*
cypherpost.io
Developed @ Stackmate India
*/

export interface BitcoinKeyOperations {
  generate_mnemonic(): string | Error;
  seed_root(mnemonic: string): Promise<string | Error>;
  derive_parent_128(root_xprv: string): ExtendedKeys | Error;
  derive_hardened(parent: string, use_case: number,index: number,revoke: number,): ExtendedKeys | Error;
  derive_child(parent: string, index: number): ExtendedKeys | Error;
  extract_ecdsa_pair(extended_keys:ExtendedKeys):Promise<ECDSAKeys | Error>;
  calculate_shared_secret(ecdsa_keys: ECDSAKeys): string | Error;
  sign(message:string, private_key: string): Promise<string | Error>;
  verify(message:string, signature: string, public_key: string): Promise<boolean | Error>;
}

export interface ExtendedKeys{
  xpub: string;
  xprv: string;
}

export interface ECDSAKeys{
  pubkey: string;
  privkey: string; 
}

