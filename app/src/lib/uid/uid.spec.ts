/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { S5UID } from "./uid";

const s5uid = new S5UID();

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: UID ", function () {

 describe("createUserID", function () {
  it("SHOULD create S5ID", async function () {
   const response = s5uid.createUserID();
   console.log(response);
   expect(response.startsWith("s5id")).to.equal(true);
  });
 });
 describe("createIDVSReference", function () {
  it("SHOULD create S5IDVS", async function () {
   const response = s5uid.createIDVSReference('S5');
   console.log(response);

   expect(response.startsWith("s5iv")).to.equal(true);
  });
 });

 describe("createAccountID", function () {
  it("SHOULD create S5WL", async function () {
   const response = s5uid.createAccountID();
   console.log(response);

   expect(response.startsWith("s5wl")).to.equal(true);
  });
 });

 describe("createBuyOrderID", function () {
  it("SHOULD create S5BY", async function () {
   const response = s5uid.createBuyOrderID();
   expect(response.startsWith("s5by")).to.equal(true);
  });
 });
 describe("createSellOrderID", function () {
  it("SHOULD create S5SL", async function () {
   const response = s5uid.createSellOrderID();
   expect(response.startsWith("s5sl")).to.equal(true);
  });
 });
 describe("createTxID", function () {
  it("SHOULD create S5TX", async function () {
   const response = s5uid.createTxID();
   expect(response.startsWith("s5tx")).to.equal(true);
  });
  });
 describe("createResponseID", function () {
  it("SHOULD create S5RES", async function () {
   const response = s5uid.createResponseID();
   expect(response.startsWith("s5rs")).to.equal(true);
  });
 });
 describe("createRandomID", function () {
  it("SHOULD create random ID of a given length", async function () {
   const length = 21;
   const response = s5uid.createRandomID(length);
   expect(response.startsWith("s5xp")).to.equal(true);
  });
 });
});

// ------------------ '(◣ ◢)' ---------------------
