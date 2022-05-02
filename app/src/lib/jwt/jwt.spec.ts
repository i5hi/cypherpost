/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { JWTPayload } from "./interface";
import * as local from "./jwt";

const jwt = new local.S5LocalJWT();
let jwt_signing_key = "dab5612c77258a215b971e53569be21dc0fe3bb5cc474b9885e532a99e622a1b";

let token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzNzA1ZmNmY2NjMTg4Njg2ZjhhZjkyYWJiZjAxYzRmMjZiZDVlODMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2F0cy1jYyIsImF1ZCI6InNhdHMtY2MiLCJhdXRoX3RpbWUiOjE2MDExMzc1NTgsInVzZXJfaWQiOiIxWFNRbTJuMHB0UkllNmtrZTdPRWdqaTRQV20xIiwic3ViIjoiMVhTUW0ybjBwdFJJZTZra2U3T0Vnamk0UFdtMSIsImlhdCI6MTYwMjQ5NjY0OCwiZXhwIjoxNjAyNTAwMjQ4LCJlbWFpbCI6Imt5YzBAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia3ljMEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.WNjgtDEB5JhyndWlxuZJURPCm7_6Kl2fJiMmt31JhyHr6YuyAIiGgiHAPvK6s8_zE2JsWNFLX80prVRjmIMs-8L03pzqj_3tXfk4JDTzPoc1fy3vCvO1EmDnvxXQNQNz-EVXN652trGxK3Q39TjP3HBAFkD6XvfmSPPQdOfDG1YKySGrRSkfNRVDx6S5BorcF8ybNMqn9blK3-EglyZQAah6rHfNRg7AqTJX_u5SdIFnuQ1wTvgTPKfG3si-XwT6L3DYzlav9A67PlG_Ym4cojfhIBdH9VaHiC4Qjh8JJkxb6OqF_6STUGxTNTTngaTnkrlp9rGGn5hh3XU-XwJjGQ";
const expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOiJ2bSIsImF1ZCI6InByb2ZpbGUsb2ZmZXJzIiwiaXNzIjoibGlvbmJpdCIsImlhdCI6MTYzMDM4NjkwMDA3MCwiZXhwIjoxNjMwMzkwNTAwMDcwfSwiaWF0IjoxNjMwMzg2OTAwLCJleHAiOjE2MzAzODY5NjAsImF1ZCI6InByb2ZpbGUsb2ZmZXJzIiwiaXNzIjoibGlvbmJpdCJ9.ei-MywxPT9x6Se-RMMca_o8UPk6ZYz96aJ7U4mBj0OY";

const email = "kyc0@test.com"

const payload: JWTPayload = {
    user: "vm",
    aud: "profile,offers",
}
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Local JWT ", function () {
    
    before(async function () {
        
    });
    after(async function (done) {
        done();
      });
      
    describe("issue", function () {
        it("SHOULD issue a jwt", async function () {
            const response = await jwt.issue(payload);
            token = response as string;
            console.log(response);
            expect(response).to.be.a("string");
        });
    });

    describe("verify", function () {
        it("SHOULD verify a token", async function () {
            
            const response = await jwt.verify(token);
            // console.log({response})
            expect(response['payload']['user']).to.equal(payload.user);

        });
    });
    describe("401 Expired: verify", function () {
        it("SHOULD error for an expired token", async function () {
        
            const response = await jwt.verify(expired_token);
            // console.log({response})
            expect(response['name']).to.equal("401");

        });
    });

});

// ------------------ '(◣ ◢)' ---------------------
