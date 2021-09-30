/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { handleError } from './e';

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
const e1 = {
 joe: "bloggs",
 can: "bark",
 and: "bite"
};
const e2 = {
 code: "430",
 message: e1
};
const e3 = {
 code: 420,
 message: "thisise3"
}
const e4 = new Error(JSON.stringify(e1));
const e5 = {
 code: 404,
 message: e4
};
const e6 = {
 code: 404,
 messages: e1
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Errors ", function () {

 describe("handleError(no code or message)", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e1);
   // console.log({response})
   expect(response['name']).to.equal('501');
  });
 });
 describe("handleError(string code)", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e2);
   // console.log({response})
   expect(response['name']).to.equal("430");
  });
 });
 describe("handleError(number code)", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e3);
   // console.log({response})
   expect(response['name']).to.equal("420");
  });
 });
 describe("handleError(Error type)", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e4);
   // console.log({response})
   expect(response['name']).to.equal("501");
  });
 });
 describe("handleError(Error as message)", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e5);
   // console.log({response})
   expect(response['name']).to.equal("404");
  });
 });
 describe("handleError(code without message) external code protection", function () {
  it("SHOULD convert a provided message object or string into an approriately named Error type", async function () {
   const response = handleError(e6);
   // console.log({response})
   expect(response['name']).to.equal("501");
  });
 });
});

// ------------------ '(◣ ◢)' ---------------------

