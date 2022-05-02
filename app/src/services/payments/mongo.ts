/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
import mongoose from "mongoose";
import { handleError } from "../../lib/errors/e";
import { CypherpostWallet, CypherpostWalletStore, PaymentStore, Transaction, UserPayment } from "./interface";
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
const payment_schema = new mongoose.Schema(
  {
    genesis: {
      type: Number,
      required: true,
    },
    pubkey: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    txid: {
      type: String,
      required: true,
      unique: true,
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false
    },
    fingerprint: {
      type: String,
      required: true,
    }
  },
  {
    strict: true
  }
);
// ------------------ '(◣ ◢)' ---------------------
const paymentStore = mongoose.model("payment", payment_schema);
// ------------------ '(◣ ◢)' ---------------------
export class MongoPaymentStore implements PaymentStore {
  async create(payment: UserPayment): Promise<boolean | Error> {
    try {
      await paymentStore.syncIndexes();
      const doc = await paymentStore.create(payment);
      if (doc instanceof mongoose.Error) {
        return handleError(doc);
      } else {
        return true;
      }
    } catch (e) {
      if (e['code'] && e['code'] == 11000) {
        return handleError({
          code: 409,
          message: "Duplicate Index."
        })
      }
      return handleError(e);
    }
  }
  async readAll(genesis_filter: Number): Promise<Error | UserPayment[]> {
    try {
      const query = { genesis: { $gte: genesis_filter } };

      const docs = await paymentStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length > 0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }

        const payments = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            pubkey: doc["pubkey"],
            address: doc["address"],
            amount: doc["amount"],
            txid: doc["txid"],
            timestamp: doc["timestamp"],
            confirmed: doc["confirmed"],
          }
        });
        return payments;
      } else {
        return [];
      }
    } catch (e) {
      return handleError(e);
    }
  }
  async readByPubkey(pubkey: string): Promise<Error | UserPayment[]> {
    try {
      const query = { pubkey: { $in: pubkey } };

      const docs = await paymentStore.find(query).sort({ "genesis": -1 }).exec();
      if (docs.length > 0) {
        if (docs instanceof mongoose.Error) {
          return handleError(docs);
        }
        const payments = docs.map(doc => {
          return {
            genesis: doc["genesis"],
            pubkey: doc["pubkey"],
            address: doc["address"],
            amount: doc["amount"],
            txid: doc["txid"],
            timestamp: doc["timestamp"],
            confirmed: doc["confirmed"],
          }
        });
        return payments;
      } else
        return [];

    } catch (e) {
      return handleError(e);
    }
  }
  async updateOne(update: Transaction): Promise<boolean | Error> {
    try {
      const q = { address: update.address };
      const u = {
        txid: update.txid ? update.txid : undefined,
        confirmed: update.confirmed ? update.confirmed : undefined,
        timestamp: update.timestamp ? update.timestamp : undefined,
      };

      console.log({ u });
      const status = await paymentStore.updateOne(q, u);
      if (status instanceof mongoose.Error) {
        return handleError(status);
      };
      return true;
    } catch (e) {
      return handleError(e);
    }
  }
  async bulkUpdate(updates: Transaction[]): Promise<boolean | Error> {
    try {
      const status = await paymentStore.bulkWrite(updates.map((item) => {
        return {
          updateOne: {
            filter: { address: item.address },
            update: {
              txid: item.txid ? item.txid : undefined,
              confirmed: item.confirmed ? item.confirmed : undefined,
              timestamp: item.timestamp ? item.timestamp : undefined,
            }
          }
        }
      }));
      if (status instanceof mongoose.Error) {
        return handleError(status);
      };
      return true;
    } catch (e) {
      return handleError(e);
    }
  }
  async removeAll(): Promise<boolean | Error> {
    try {
      let status = await paymentStore.deleteMany({});
      if (status instanceof mongoose.Error) {
        return handleError(status);
      };
      return true;
    } catch (e) {
      return handleError(e);
    }
  }
}
// // ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
// const wallet_schema = new mongoose.Schema(
//   {
//     tag: {
//       type: String,
//       required: true,
//       default: "SMSolo2022",
//     },
//     genesis: {
//       type: Number,
//       required: true,
//     },
//     public_descriptor: {
//       type: String,
//       required: true,
//       index: true,
//       unique: true,
//     },
//     last_used_index: {
//       type: Number,
//       required: true,
//       unique: true,
//       default: 0,
//     },
//   },
//   {
//     strict: true
//   }
// );
// // ------------------ '(◣ ◢)' ---------------------
// const walletStore = mongoose.model("wallet", wallet_schema);
// // ------------------ '(◣ ◢)' ---------------------
// export class MongoCypherpostWalletStore implements CypherpostWalletStore {
//   update(index: number): Promise<number | Error> {
//     throw new Error("Method not implemented.");
//   }
//   async create(wallet: CypherpostWallet): Promise<boolean | Error> {
//     try {
//       await walletStore.syncIndexes();
//       const doc = await walletStore.create(wallet);
//       if (doc instanceof mongoose.Error) {
//         return handleError(doc);
//       } else {
//         return true;
//       }
//     } catch (e) {
//       if (e['code'] && e['code'] == 11000) {
//         return handleError({
//           code: 409,
//           message: "Duplicate Index."
//         })
//       }
//       return handleError(e);
//     }
//   }
//   async read(): Promise<CypherpostWallet | Error> {
//     try {
//       const docs = await walletStore.find({}).exec();
//       if (docs.length > 0) {
//         if (docs instanceof mongoose.Error) {
//           return handleError(docs);
//         }

//         const wallet = docs.map(doc => {
//           return {
//             genesis: doc["genesis"],
//             public_descriptor: doc["public_descriptor"],
//             last_used_index: doc["last_used_index"],
//           }
//         })[0];
//         return wallet;
//       } else {
//         return handleError({
//           code: 500,
//           message: "Server wallet not initialized."
//         });
//       }
//     } catch (e) {
//       return handleError(e);
//     }
//   }
//   async rotateIndex(): Promise<number | Error> {
//     try{
//       const doc = walletStore.findOneAndUpdate(
//         {tag :"SMSolo2022"}, 
//         {$inc : {last_used_index : 1}}, 
//         {new: true}
//       ).exec();
//       if (doc instanceof mongoose.Error) {
//         return handleError(doc);
//       }
//       return doc["last_used_index"];
//     }catch(e){
//       return handleError(e);
//     }
//   }
//   async removeAll(): Promise<boolean | Error> {
//     try {
//       let status = await walletStore.deleteMany({});
//       if (status instanceof mongoose.Error) {
//         return handleError(status);
//       };
//       return true;
//     } catch (e) {
//       return handleError(e);
//     }
//   }

// }
// // ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
