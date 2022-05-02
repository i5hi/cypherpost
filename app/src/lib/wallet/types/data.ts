export enum MnemonicWords {
  Low = 12,
  High = 24
}

export enum BitcoinNetwork {
  Main = "main",
  Test = "test"
}

export type MasterKey = {
  fingerprint: string,
  mnemonic: string,
  xprv: string
};

export type ChildKey=  {
  fingerprint: String,
  hardened_path: String,
  xprv: String,
  xpub: String
}

export enum PurposePath{
  SegwitNative  = "84",
  SegwitP2SH = "49",
  Legacy = "44"
}

export type WalletPolicy = {
  policy: string,
  descriptor: string
};

export enum ScriptType {
  SegwitSingle = "wpkh",
  SegwitScript = "wsh",
  SegwitP2SH = "sh-wsh",
  LegacyScript = "sh"
}

export type NetworkFee = {
  rate:  number;
  absolute: number;
}

export enum NodeAddress  {
  Default = "default",
}
export type WalletAddress = {
  address:string
}
export type WalletBalance = {
  balance: number
}
export type WalletTransaction = {
  timestamp: number,
  height: number,
  verified: boolean,
  txid: string,
  received: number,
  sent: number,
  fee: number
}
export type WalletHistory =  {
  history: WalletTransaction[]
}

export type WalletPSBT = {
  psbt: string,
  is_finalized: boolean
}