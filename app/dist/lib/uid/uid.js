"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S5UID = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var crypto = __importStar(require("crypto"));
var uuid_1 = require("uuid");
// ------------------ '(◣ ◢)' ---------------------
var LENGTH = 17;
var S5UID = /** @class */ (function () {
    function S5UID() {
    }
    S5UID.prototype.createUserID = function () {
        return "s5id" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createInternalTxidPair = function () {
        var common = to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
        return {
            sender: "s5sen" + common,
            receiver: "s5rec" + common
        };
    };
    S5UID.prototype.createRandomID = function (length) {
        return "" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, length);
    };
    S5UID.prototype.createSessionID = function () {
        return "s5sh" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createIDVSReference = function (prefix) {
        return "s5iv" + prefix + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createAccountID = function () {
        return "s5wl" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createBuyOrderID = function () {
        return "s5by" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createSellOrderID = function () {
        return "s5sl" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createTxID = function () {
        return "s5tx" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createResponseID = function () {
        return "s5rs" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createAffiliateCode = function () {
        return "s5af" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createFloatWalletID = function () {
        return "s5fw" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createColdWalletID = function () {
        return "s5cl" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createPostCode = function () {
        return "s5p" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createBTCWithdrawID = function () {
        return "s5wb" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createEURWithdrawID = function () {
        return "s5we" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createXFloatTxID = function () {
        return "s5fx" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    S5UID.prototype.createFiatReference = function () {
        return "s5fr" + to_b58(Buffer.from(uuid_1.v4().replace(/-/g, "")), MAP).slice(0, LENGTH);
    };
    return S5UID;
}());
exports.S5UID = S5UID;
// ------------------ '(◣ ◢)' ---------------------
function hex(len) {
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString("hex")
        .slice(0, len)
        .replace(/0/g, "z")
        .toUpperCase(); // replace all 0 and O with f to avoid confusion
}
// ------------------ '(◣ ◢)' ---------------------
function number(minimum, maximum) {
    var distance = maximum - minimum;
    if (minimum >= maximum) {
        return "Minimum number should be less than maximum";
    }
    else if (distance > 231474976710655) {
        return "You can not get all possible random numbers if range is greater than 256^6-1";
    }
    else if (maximum > Number.MAX_SAFE_INTEGER) {
        return "Maximum number should be safe integer limit";
    }
    else {
        var maxBytes = 6;
        var maxDec = 231474976710656;
        // To avoid huge mathematical operations and increase function performance for small ranges, you can uncomment following script
        if (distance < 256) {
            maxBytes = 1;
            maxDec = 256;
        }
        else if (distance < 65536) {
            maxBytes = 2;
            maxDec = 65536;
        }
        else if (distance < 16777216) {
            maxBytes = 3;
            maxDec = 16777216;
        }
        else if (distance < 4294967296) {
            maxBytes = 4;
            maxDec = 4294967296;
        }
        else if (distance < 1099511627776) {
            maxBytes = 4;
            maxDec = 1099511627776;
        }
        var random_bytes = parseInt(crypto.randomBytes(maxBytes).toString("hex"), 16);
        var result = Math.floor((random_bytes / maxDec) * (maximum - minimum + 1) + minimum);
        if (result > maximum) {
            result = maximum;
        }
        return result;
    }
}
// ------------------ '(◣ ◢)' ---------------------
var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
var to_b58 = function (B, //Uint8Array raw byte input
A //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [], //the array for storing the stream of base58 digits
    s = "", //the result string variable that will be returned
    i, //the iterator variable for the byte input
    j, //the iterator variable for the base58 digit array (d)
    c, //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
    n; //a temporary placeholder variable for the current base58 digit
    for (i in B) { //loop through each byte in the input stream
        j = 0, //reset the base58 digit iterator
            c = B[i]; //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while (j in d || c) { //start looping through the digits until there are no more digits and no carry amount
            n = d[j]; //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c; //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0; //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58; //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++; //iterate to the next base58 digit
        }
    }
    while (j--) //since the base58 digits are backwards, loop through them in reverse order
        s += A[d[j]]; //lookup the character associated with each base58 digit
    return s; //return the final base58 string
};
var from_b58 = function (S, //Base58 encoded string input
A //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [], //the array for storing the stream of decoded bytes
    b = [], //the result byte array that will be returned
    i, //the iterator variable for the base58 string
    j, //the iterator variable for the byte array (d)
    c, //the carry amount variable that is used to overflow from the current byte to the next byte
    n; //a temporary placeholder variable for the current byte
    for (i in S) { //loop through each base58 character in the input string
        j = 0, //reset the byte iterator
            c = A.indexOf(S[i]); //set the initial carry amount equal to the current base58 digit
        if (c < 0) //see if the base58 digit lookup is invalid (-1)
            return undefined; //if invalid base58 digit, bail out and return undefined
        c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
        while (j in d || c) { //start looping through the bytes until there are no more bytes and no carry amount
            n = d[j]; //set the placeholder for the current byte
            n = n ? n * 58 + c : c; //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
            c = n >> 8; //find the new carry amount (1-byte shift of current byte value)
            d[j] = n % 256; //reset the current byte to the remainder (the carry amount will pass on the overflow)
            j++; //iterate to the next byte
        }
    }
    while (j--) //since the byte array is backwards, loop through it in reverse order
        b.push(d[j]); //append each byte to the result
    return new Uint8Array(b); //return the final byte array in Uint8Array format
};
//# sourceMappingURL=uid.js.map