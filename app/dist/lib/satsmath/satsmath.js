"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.b2s = exports.s2b = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
var math = require('mathjs');
var SATS_DENOM = 100000000;
function s2b(sats) {
    return math.round((sats / SATS_DENOM), 8);
}
exports.s2b = s2b;
function b2s(bitcoin) {
    return math.round(bitcoin * SATS_DENOM, 0);
}
exports.b2s = b2s;
// export function convertExponentialToDecimal(exponentialNumber: number): number|string {
//   // sanity check - is it exponential number
//   const str = exponentialNumber.toString();
//   if (str.indexOf('e') !== -1) {
//     const exponent = parseInt(str.split('-')[1], 10);
//     // Unfortunately I can not return 1e-8 as 0.00000001, because even if I call parseFloat() on it,
//     // it will still return the exponential representation
//     // So I have to use .toFixed()
//     const result = exponentialNumber.toFixed(exponent);
//     return result;
//   } else {
//     return exponentialNumber;
//   }
// }
/*
const math = require('mathjs');
  
const SATS_DENOM = 100000000;


function s2b(sats){
  return math.round(math.evaluate(sats/SATS_DENOM),8);
}
function b2s(bitcoin){
  return math.round(bitcoin*SATS_DENOM,0);
}

*/ 
//# sourceMappingURL=satsmath.js.map