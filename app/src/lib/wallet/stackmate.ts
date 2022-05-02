const LINUX_PATH = "./bin/linux/libstackmate.so";
const MAC_PATH = "./bin/osx/libstackmate.dylib";
const WINDOWNS_PATH = "./bin/win32/libstackmate.dll";

import { handleError } from "../errors/e";
import {
  BitcoinNetwork,
  ChildKey,
  MasterKey,
  MnemonicWords,
  NetworkFee,
  NodeAddress,
  PurposePath,
  ScriptType,
  WalletAddress,
  WalletBalance,
  WalletHistory,
  WalletPolicy,
  WalletTransaction
} from "./types/data";

const ffi = require("ffi-napi")
const string = "string";

const platform = process.platform
let libStackmateLocation = null

if (platform === "linux") {
  libStackmateLocation = LINUX_PATH;
}
else if (platform === "darwin") {
  libStackmateLocation = MAC_PATH
}
else if (platform === "win32") {
  libStackmateLocation = WINDOWNS_PATH
}
else {
  throw new Error("unsupported plateform for mathlibLoc")
}

export const stackmate = ffi.Library(libStackmateLocation, {
  get_address:[string, [string,string]],
  sync_balance:[string, [string,string]],
  sync_history:[string, [string,string]],
});

export function generateMaster(network: BitcoinNetwork,strength: MnemonicWords, passphrase: string): MasterKey | Error {
  try {
    const stringified = stackmate.generate_master(network.toString(),strength.toString(),passphrase);
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        fingerprint: json.fingerprint,
        mnemonic: json.mnemonic,
        xprv: json.xprv
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function importMaster(network: BitcoinNetwork,mnemonic: string, passphrase: string): MasterKey | Error {
  try {
    const stringified = stackmate.import_master(network.toString(), mnemonic, passphrase);
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        fingerprint: json.fingerprint,
        mnemonic: json.mnemonic,
        xprv: json.xprv
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}
export function deriveHardened(master_xprv: string,purpose: PurposePath, account: number): ChildKey | Error {
  try {
    const stringified = stackmate.derive_hardened(master_xprv, purpose.toString(), account.toString());
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        fingerprint: json.fingerprint,
        hardened_path: json.hardened_path,
        xprv: json.xprv,
        xpub: json.xpub
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function compilePolicy(policy_string: string, script_type: ScriptType): WalletPolicy | Error{
  try {
    const stringified = stackmate.compile(policy_string, script_type.toString());
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        policy: json.policy,
        descriptor: json.descriptor
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function createExtendedKeyString(child_key: ChildKey): string{
  return `[${child_key.fingerprint}/${child_key.hardened_path.substring(2)}]${child_key.xpub}/*`;
}

export function createMultiPolicyString(thresh: number, keys: string[]): string{
  return `thresh(${thresh},${keys.map(key=>`pk(${key})`).join(",")})`;
}

export function estimateNetworkFee(network: BitcoinNetwork, node_address: NodeAddress,confirmation_blocks:number): NetworkFee | Error{
  try {
    const stringified = stackmate.estimate_network_fee(network.toString(),node_address.toString(),confirmation_blocks.toString());
    const json = JSON.parse(stringified);

    console.log(json)
    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        rate: parseFloat(json.rate),
        absolute: (json.absolute == null)?0:parseInt(json.absolute)
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function getAddress(descriptor: string, index: number): WalletAddress | Error{
  try {
    const stringified = stackmate.get_address(descriptor,index.toString());
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        address: json.address
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function syncBalance(descriptor: string, node_address: NodeAddress): WalletBalance | Error{
  try {
    const stringified = stackmate.sync_balance(descriptor,node_address.toString());
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        balance: json.balance
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}

export function syncHistory(descriptor: string, node_address: NodeAddress): WalletHistory | Error{
  try {
    const stringified = stackmate.sync_history(descriptor,node_address.toString());
    const json = JSON.parse(stringified);

    if (json.hasOwnProperty("kind")) {
      return handleError(json);
    }
    else {
      return {
        history: json.history.map((item)=>{
          const transaction: WalletTransaction = {
            timestamp: item.timestamp,
            height: item.height,
            verified: item.verified,
            txid: item.txid,
            received: item.received,
            sent: item.sent,
            fee: item.fee
          }
          return transaction;
        })
      }
    }
  }
  catch (e) {
    return handleError(e);
  }
}
