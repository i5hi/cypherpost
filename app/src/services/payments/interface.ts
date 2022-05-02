export interface PaymentInterface {
  createInvoice(for_pubkey: string, amount: number): Promise<string | Error>;
  getInfo(): Promise<any | Error>;
  syncWallet(): Promise<boolean | Error>;
  getUserTransactions(pubkey: string): Promise<UserPayment[] | Error>;
  getTransactionDetail(txid: string): Promise<Transaction | Error>;
  singleUpdate(update: Transaction): Promise<boolean | Error>;
  batchUpdate(updates: Transaction[]): Promise<boolean | Error>;
}

export interface PaymentStore {
  create(payment: UserPayment): Promise<boolean | Error>;
  readAll(genesis_filter: Number): Promise<UserPayment[] | Error>;
  readByPubkey(pubkey: string): Promise<UserPayment[] | Error>;  
  updateOne(update: Transaction): Promise<boolean | Error>;
  bulkUpdate(updates:Transaction[]): Promise<boolean | Error>;
  removeAll(): Promise<boolean | Error>;
}
export interface CypherpostWalletStore{
  create(wallet: CypherpostWallet): Promise<boolean | Error>;
  read(): Promise<CypherpostWallet | Error>;
  rotateIndex(): Promise<number | Error>;
  removeAll(): Promise<boolean | Error>;
}

export interface UserPayment {
  genesis: number;
  pubkey: string;
  address: string;
  amount: number;
  txid: string;
  timestamp: number;
  confirmed: boolean;
  fingerprint?: string;
};

export interface Transaction{
  address?: string;
  txid?: string,
  timestamp?: string,
  confirmed?: boolean,
  amount?: number
};

export enum PaymentIndex {
  Pubkey,
  Address
};

export interface CypherpostWallet{
  public_descriptor: string;
  last_used_index: number;
};