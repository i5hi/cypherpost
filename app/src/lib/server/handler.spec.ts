/*
cypherpost.io
Developed @ Stackmate India
*/
import { expect } from "chai";
import "mocha";
import { handleError } from "../errors/e";
import { r_500 } from "../logger/winston";
import { S5UID } from "../uid/uid";
import * as handler from "./handler";

const s5uid = new S5UID();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
const status_code = 200;
const ep = "/session/login";
const method = "POST";
const sats_id = s5uid.createResponseID();
const sid = s5uid.createSessionID(); 
const now = Date.now();
const headers = {
  "x-s5-id": sats_id,
  "x-s5-time": now
};
const out = {
 sid
}
let sig;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: DTO Handler ", function () {

 describe("getResponseSignature", function () {
  it("SHOULD return a signed response", async function () {
   const response = await handler.getResponseSignature(status_code,ep,method,headers,out);
   sig = response;
   expect(response).to.be.a('string');
  });
 });
 describe("checkResponseSignature", function () {
  it("SHOULD check a signed response", async function () {
   const response = await handler.checkResponseSignature(status_code,headers,sig)
   console.log({response})
   expect(response).to.equal(true);
  });
 });

 const request_data : handler.S5Request = {
   body: {
     amount:12000,
   },
   resource:"",
   ip:""
 }
 describe("filterError::cases",function(){
  it("Should filter a stringified json type error",async function(){
    const e = JSON.stringify({a:"nice", little:"stringified", json:"json"});
    const response = await handler.filterError(e, r_500,request_data)
    console.log(response);
    expect(response).to.have.property("code")
    expect(response).to.have.property("message")
  });
  it("Should filter an array type error",async function(){
    const e = ["this", "shit", "like", "that", "shit"];
    const response = await handler.filterError(e, r_500,request_data)
    console.log(response);
    expect(response).to.have.property("code")
    expect(response).to.have.property("message")
  });
  it("Should filter an object type error",async function(){
    const e = {a:"nice", little:"stringified", json:"json"}
    const response = await handler.filterError(e, r_500,request_data)
    console.log(response);
    expect(response).to.have.property("code")
    expect(response).to.have.property("message")
  });
  it("Should filter an Error type error",async function(){
    const e = {a:"nice", little:"stringified", json:"json"}
    const response = await handler.filterError(handleError(e), r_500,request_data)
    console.log(response);
    expect(response).to.have.property("code")
    expect(response).to.have.property("message")
  });
  it("Should filter an coded client error",async function(){
    const e = {code:400, message:[{one:"two"},{three:"four"}]}
    const response = await handler.filterError(e, r_500,request_data)
    console.log(response);
    expect(response).to.have.property("code")
    expect(response).to.have.property("message")
    expect(response.message['error'].length).to.equal(2)
  });
 })

});

// ------------------ '(◣ ◢)' ---------------------
