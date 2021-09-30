/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { b2s, s2b } from "./satsmath";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
const bitval  = 0.00004072;
const satsval =  4072;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: satsmath ", function () {

 describe("b2s()", function () {
  it("SHOULD convert bitcoin value to sats", async function () {
    const result = b2s(bitval);
    expect(result).to.equal(satsval);
  });
 });

 describe("s2b()", function () {
  it("SHOULD convert sats value to bitcoin", async function () {
      const result = s2b(satsval);
   expect(result).to.equal(bitval);
  });
 });
});

// ------------------ '(◣ ◢)' ---------------------
