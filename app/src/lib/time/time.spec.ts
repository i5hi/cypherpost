/*
cypherpost.io
Developed @ Stackmate India
*/
import { expect } from "chai";
import "mocha";
import { S5Times } from "./time";

const time =  new S5Times();

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Times ", function () {

 describe("convertUnixToGlobal", function () {
  it("SHOULD convert a unix timestamp to global times", async function () {
   const timestamp = Date.now();
   const response = time.convertUnixToGlobal(timestamp);
   console.log({timestamp,response})
   expect(response).to.have.property("london");
   expect(response).to.have.property("kolkata");
   expect(response).to.have.property("amsterdam");
   expect(response).to.have.property("brisbane");
   expect(response).to.have.property("curacao");


  });
 });

});

// ------------------ '(◣ ◢)' ---------------------
