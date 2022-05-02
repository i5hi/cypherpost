/*
cypherpost.io
Developed @ Stackmate India
*/

import { handleError } from "../../lib/errors/e";
import { PaymentInterface, Transaction, UserPayment } from "./interface";
import { MongoPaymentStore } from "./mongo";
const {lnClient} = require("cyphernode-js-sdk");  

const paymentStore = new MongoPaymentStore();

export class CyphernodePayments implements PaymentInterface {
  async createInvoice(for_pubkey: string, amount: number): Promise<string | Error> {
    try{
      const records = await paymentStore.readByPubkey(for_pubkey);
      if(records instanceof Error) return records;
      console.log("USER HAS A HISTORY OF ", records.length, " address(es).");
      const unpaid = records.map((record)=>{
        if (!record.confirmed) return record;
      });
      console.log("USER HAS A TOTAL OF ", unpaid.length, " unpaid address(es).");

      if(unpaid.length>0){
        return unpaid[0].address;
      }
      console.log("USER HAS A TOTAL OF ", records.length - unpaid.length, " paid address(es).");

      const client = lnClient();
      const makeInvoicePayload = {
        msatoshi: amount*1000, // 100 sats?
        label: for_pubkey + ":" + Date.now(), // cannot be duplicate
        description: "Cypherpost rocks!",
        expiry: 90000,
        callback_url: "https://application/api/v2/payments/notification?key=SomeRandyRandomness"
      };
      const response = await client.createInvoice(makeInvoicePayload);
      if(response instanceof Error) return response;

      console.log({response});
      const status = await paymentStore.create({
        pubkey: for_pubkey,
        address: response.bolt11,
        amount: Math.round(response.msatoshi),
        txid: response.payment_hash,
        genesis: Date.now(),
        timestamp: Date.now(),
        confirmed: response.status==="paid"?true:false,
        fingerprint: process.env.CYPHERNODE_FIGERPRINT
      });

      if(status instanceof Error) return status;

      return response.bolt11;

      
    }
    catch(e){
      return handleError(e);
    }
  }
  async getInfo():Promise<any | Error>{
    try{
      const client = lnClient();
      const peers = await client.listPeers();
      const info = await client.getNodeInfo();
      return {info,peers};
    }
    catch(e){
      return handleError(e);
    }
  }
  async getUserTransactions(pubkey: string): Promise<Error | UserPayment[]> {
    const user_payment_records =  await paymentStore.readByPubkey(pubkey);
    return user_payment_records;
  }
  async syncWallet(): Promise<boolean | Error>{
    // all txs in the currently plugged in payment backend - must exist in the local db
    // different sources should be noted in the fingerprint field
    // fingerprint can either be the seed fingerprint, or a reference to a wallet name like cyphernode-may-2020
    const client = lnClient();

    const incoming = await client.getInvoice();

    const local_wallet = await paymentStore.readAll(0);
    if (local_wallet instanceof Error) return local_wallet;

    let wallet_updates = [];
    let wallet_removes = [];

    incoming.map((invoice)=>{
      // update local model with transaction status updates
      // remove expired entries from cyphernode and local model

    })
    console.log({statuses: incoming.map(invoice=>invoice.status)});
    return false;
  }
  async getUnconfirmed(): Promise<Error | UserPayment[]> {
    const user_payment_records =  await paymentStore.readAll(0);
    if (user_payment_records instanceof Error) return user_payment_records;
    return user_payment_records.filter(record=>{
      if(record.confirmed===false) return record;
    });
  }
  singleUpdate(update: Transaction): Promise<boolean | Error> {
    return paymentStore.updateOne(update);
  }
  batchUpdate(updates: Transaction[]): Promise<boolean | Error> {
    return paymentStore.bulkUpdate(updates);
  }
  async getTransactionDetail(txid: string): Promise<Transaction | Error>{
    return new Error("NOT YET");
  }

  // async spend(pubkey: string, amount: number): Promise<boolean | Error> {
  //   const user_payment_records =  await paymentStore.readByPubkey(pubkey);
  //   if (user_payment_records instanceof Error) return user_payment_records;

  //   let accumulator = 0;
  //   const spendable = [];
    
  //   user_payment_records.filter(record=>{
  //     if(record.exhausted===false && (record.amount>record.spent)){
  //       if(accumulator<=amount){
  //         accumulator += record.amount - record.spent;
  //         spendable.push(record);
  //       }
  //       else{
  //         return;
  //       }
  //     }
  //   });
    
  //   if (accumulator<amount) return handleError({
  //     code: 402,
  //     message: "Insufficient Balance. Get new address and top up with funds."
  //   });

  //   let cumulative_spent = amount;
  //   spendable.filter(async record=>{
  //     if(cumulative_spent<=0) return;
  
  //     if (cumulative_spent>=record.amount-record.spent){
  //       await paymentStore.updateOne({address: record.address, spent: record.amount - record.spent, exhausted: true});
  //       cumulative_spent -= record.amount - record.spent;
  //     }
  //     if (cumulative_spent<=record.amount-record.spent){
  //       await paymentStore.updateOne({address: record.address, spent: cumulative_spent});
  //       cumulative_spent = 0;
  //     }
  //   });

  //   return true;
  // }
};

