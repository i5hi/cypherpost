/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
import * as crypto from "crypto";
import { v4 } from "uuid";
import { InternalTxidPair, UIDInterface } from "./interface";
// ------------------ '(◣ ◢)' ---------------------
const LENGTH = 21;

export class S5UID implements UIDInterface {
  createUserID(): string {
    return `s5id${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createInternalTxidPair(): InternalTxidPair {
    const common = to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH);

    return {
      sender: `s5sen${common}`,
      receiver: `s5rec${common}`
    }
  }
  createRandomID(length: number): string{
    return `${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,length)}`;
  }
  createSessionID(): string {
    return `s5sh${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createIDVSReference(prefix: string): string {
    return `s5iv${prefix}${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createAccountID(): string {
    return `s5wl${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createBuyOrderID(): string {
    return `s5by${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createSellOrderID(): string {
    return `s5sl${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createTxID(): string {
    return `s5tx${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createResponseID(): string {
    return `s5rs${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createAffiliateCode(): string {
    return `s5af${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createFloatWalletID(): string {
    return `s5fw${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createColdWalletID(): string {
    return `s5cl${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`;
  }
  createPostCode(): string {
    return `s5p${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`
  }
  createBTCWithdrawID(): string {
    return `s5wb${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`
  }
  createEURWithdrawID(): string {
    return `s5we${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`
  }
  createXFloatTxID(): string {
    return `s5fx${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`
  }
  createFiatReference(): string {
    return `s5fr${to_b58(Buffer.from(v4().replace(/-/g, "")),MAP).slice(0,LENGTH)}`
  }
}
// ------------------ '(◣ ◢)' ---------------------

function hex(len: number): string {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len)
    .replace(/0/g, "z")
    .toUpperCase(); // replace all 0 and O with f to avoid confusion
}


// ------------------ '(◣ ◢)' ---------------------
function number(minimum: number, maximum: number): number | string {
  const distance = maximum - minimum;

  if (minimum >= maximum) {
    return "Minimum number should be less than maximum";
  } else if (distance > 231474976710655) {
    return "You can not get all possible random numbers if range is greater than 256^6-1";
  } else if (maximum > Number.MAX_SAFE_INTEGER) {
    return "Maximum number should be safe integer limit";
  } else {
    let maxBytes = 6;
    let maxDec = 231474976710656;

    // To avoid huge mathematical operations and increase function performance for small ranges, you can uncomment following script

    if (distance < 256) {
      maxBytes = 1;
      maxDec = 256;
    } else if (distance < 65536) {
      maxBytes = 2;
      maxDec = 65536;
    } else if (distance < 16777216) {
      maxBytes = 3;
      maxDec = 16777216;
    } else if (distance < 4294967296) {
      maxBytes = 4;
      maxDec = 4294967296;
    } else if (distance < 1099511627776) {
      maxBytes = 4;
      maxDec = 1099511627776;
    }

    const random_bytes = parseInt(
      crypto.randomBytes(maxBytes).toString("hex"),
      16
    );
    let result = Math.floor(
      (random_bytes / maxDec) * (maximum - minimum + 1) + minimum
    );

    if (result > maximum) {
      result = maximum;
    }
    return result;
  }
}
// ------------------ '(◣ ◢)' ---------------------
var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

var to_b58 = function(
  B,            //Uint8Array raw byte input
  A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
  var d = [],   //the array for storing the stream of base58 digits
      s = "",   //the result string variable that will be returned
      i,        //the iterator variable for the byte input
      j,        //the iterator variable for the base58 digit array (d)
      c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
      n;        //a temporary placeholder variable for the current base58 digit
  for(i in B) { //loop through each byte in the input stream
      j = 0,                           //reset the base58 digit iterator
      c = B[i];                        //set the initial carry amount equal to the current byte amount
      s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
      while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
          n = d[j];                    //set the placeholder for the current base58 digit
          n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
          c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
          d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
          j++                          //iterate to the next base58 digit
      }
  }
  while(j--)        //since the base58 digits are backwards, loop through them in reverse order
      s += A[d[j]]; //lookup the character associated with each base58 digit
  return s          //return the final base58 string
}


var from_b58 = function(
  S,            //Base58 encoded string input
  A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
  var d = [],   //the array for storing the stream of decoded bytes
      b = [],   //the result byte array that will be returned
      i,        //the iterator variable for the base58 string
      j,        //the iterator variable for the byte array (d)
      c,        //the carry amount variable that is used to overflow from the current byte to the next byte
      n;        //a temporary placeholder variable for the current byte
  for(i in S) { //loop through each base58 character in the input string
      j = 0,                             //reset the byte iterator
      c = A.indexOf( S[i] );             //set the initial carry amount equal to the current base58 digit
      if(c < 0)                          //see if the base58 digit lookup is invalid (-1)
          return undefined;              //if invalid base58 digit, bail out and return undefined
      c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
      while(j in d || c) {               //start looping through the bytes until there are no more bytes and no carry amount
          n = d[j];                      //set the placeholder for the current byte
          n = n ? n * 58 + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
          c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
          d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
          j++                            //iterate to the next byte
      }
  }
  while(j--)               //since the byte array is backwards, loop through it in reverse order
      b.push( d[j] );      //append each byte to the result
  return new Uint8Array(b) //return the final byte array in Uint8Array format
}