/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import * as fs from "fs";
import "mocha";
import { S5Crypto } from "./crypto";
import { ECDHPair } from "./interface";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
const crypto = new S5Crypto();
const message = "xprvA3nH6HUGxEUZbeZ2AGbsuVcsoEsa269AmySR95i3E81mwY3TmWoxoGUUqB59p8kjS6wb3Ppg2c9y3vKyG2aecijRpJfGWMxVX4swXwMLaSB"
const public_key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvxHJVaUo8J8PbKfpZ7lW\nffrRaSOcVmraoMwJeiYi2A/YTB2BnJNGUZd20Gj/ShRasnCWvjtZCEPpkNMAkXN4\nG7/xALKDzC9YBJCDhEP48J0sxhN37zvjlDaav2If0H/jSqKn5KlJ1im/maZ25sdG\ngYUN7h5F3kxwTBVDomTj4unmmiPiqk+/JJFq0ZMOSA+iAW4UVq14f4lTsyQ+peEe\nP2cr75Jn9/z0mTan/buYJ+B5KrM5pYLnfOKZrac2GJUzL2asJpj/ZMYyOq5YMGEk\nN29GasGlrF0unZI1P+4tmfE0j+A6Gi3MN1ZpHmFvyF2oBpLhReh7f0efvXYAemSV\nRQIDAQAB\n-----END PUBLIC KEY-----"
const private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/EclVpSjwnw9s\np+lnuVZ9+tFpI5xWatqgzAl6JiLYD9hMHYGck0ZRl3bQaP9KFFqycJa+O1kIQ+mQ\n0wCRc3gbv/EAsoPML1gEkIOEQ/jwnSzGE3fvO+OUNpq/Yh/Qf+NKoqfkqUnWKb+Z\npnbmx0aBhQ3uHkXeTHBMFUOiZOPi6eaaI+KqT78kkWrRkw5ID6IBbhRWrXh/iVOz\nJD6l4R4/Zyvvkmf3/PSZNqf9u5gn4Hkqszmlgud84pmtpzYYlTMvZqwmmP9kxjI6\nrlgwYSQ3b0ZqwaWsXS6dkjU/7i2Z8TSP4DoaLcw3VmkeYW/IXagGkuFF6Ht/R5+9\ndgB6ZJVFAgMBAAECggEAKxxVRBi+0wPglBCSzk94H3avNzzMsobri2peHQxrwjpZ\nAFuL+gsUy6YULdPy/gD3sdlLeeKkJQRFt+KT9z2JdSFqvFCLAlAQWP9OXVKE4a1l\nA9AyuGzX3YIwikwWh5HDc/ydSy+TNFo5G+7+VvXRh7nAueBkvVKb597IYuTGslTV\n1JrOJw6ifNcECKfp8BL4inBTbpyfh/iKgh+1jbQFnWsAqOLdtNGpx0Ntxcf22Gij\nROtn96hrNtMqG/ED8uVYHZvZVp145Y7EU7I1EtHDMdhEu/z0D5NevqtuIi7p5wiN\nLod0pfo8Zf3CD9xxWyugLofK8kDJPvIpghvT8TzaYQKBgQD1i8ekVTQ8xQPk37D2\ng/PQwEj+70Hw6RY+Gj2prAbxgFh05fOUkU4bgui+j5O+ExYIXTe2NuAuzuJt9l3F\nWtMkkXVmMFAheMGjl3oluc5HSrL1zLJlXBlcAS2wsmLqB2pcQWgoX+1cfvqsVu2T\nVZJX49DKEsRutO/glWnSjGMoWQKBgQDHNEOCFCMm5zAFREY31DpqTqaio/X+GUvU\nII7HS9oDcskDdPdVmLogGrK40CqTj5jqRl0vETXujU7f4qcNDrBdD4w4myenE05C\nLW9bocEAJSqV5cpqddfJgPviaSKOcyp6oI3LGjMZadN8sd9Zx8OnoWZKnfsdVBde\n9qYwyP62zQKBgQDOY7VlLbEAu2Dwig1Gx9aySk2Q6y5z/peRj6Dw8wXLDGRNrdM1\nt4T9nuVe93PpukU0tpXTdQCul3q/jut2rUb4X8NcJ5PS7ptklDg5aZo3VlRiQrJY\nfDdcnCj5cpetupnt/ZQ9C5SJwLmXDmIXC0A82+JtV6UAoNlX3n7aWOIn0QKBgEBu\nAgu3kasKiXianY9/ICm0KKdgGrdF3UXOBgAl42zMGoH4uerAjCrIF9g41ByIDHBx\ns7/+dBAlOkalm1xYzOg8mCDS5h9e2igDZAoiJjdyzfRPr4mBdfrhshaH5LpoO2wQ\nM+xmG/LzTIj/SvtR5lF4nYoy0L6qrSh05EnRKLldAoGBAKHDyT4oCxCUsQzUkCQM\ny72mJBedxTTMPIaYsKAD2zTPrrgwIJNkBX9NXqobYMQB5DjAhG21Qkn81UF4teVz\nn74QgoHNS/FEaNaBRmAGrtS/kEzajdhoauo9Y3WjZaulVzMCsLyW5q65RF6H6DBv\npaq2IF0TUqBVLKjDHqAKJ15h\n-----END PRIVATE KEY-----"
const signature = "Gbs8VBXyic9Wmm2F0CUMJFlucqA+aADHCY15Q+YTdZ9GOdsPHmLwZuUndMFQo4kMP3qiTDw+Hlyj3QPcpGUpNq6p5AxOJ8Uzs6tXehusmpi8x9EDU26DdPKFOslOeLTY+tNY0gDvr0vICx3RF8EH0CVXbZkr/wpwtEhMVJttMJj3p8rJYRBJryxXSwNLLi0I7x42qca2F+ZIy51cxDaUc6s05pBF9T3g/xgQ9BcksNgW5nHgEXriUt12fHZiLxhOJ4+JQtKnYma6UNk9HU2RSKJQROKYPsXmMOLI03X6OoirU6ePbsA3PGaSu8ZF7DZ5qsDPIOimL341mg8HqOrwYw==";
const rsa_filename = "crypto-test-secret";
const rsa_fixed = "sats_sig";
const key_hex = "9870aa5092c44767f7a0d60cfb4dde81abc66ed8ac71bc2d466ed8b6e0323fd4";
let ecdh: ECDHPair = {
  privkey: "shhhHH!",
  pubkey: "oh, hi! :)"
}
let ivcrypt_message;
const key = "supersecret";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: S5Crypto Lib ", function () {

  after(function (done) {
    fs.unlinkSync(process.env.KEY_PATH + rsa_filename + ".pem");
    fs.unlinkSync(process.env.KEY_PATH + rsa_filename + ".pub");
    done();
  });


  describe("createRSAPairFile", function () {
    it("SHOULD create an RSA Key Pair as a File", async function () {
      const response = await crypto.createRSAPairFile(rsa_filename);
      if (response instanceof Error) throw response;
      const status = (fs.existsSync(response + ".pem") && fs.existsSync(response + ".pub")) ? true : false;

      expect(status).to.equal(true);
    });
  });
  describe("signS256Message", function () {
    it("SHOULD return a hmac sha256 signature of a message using an rsa private key", async function () {
      const response = crypto.signS256Message(message, private_key);
      //  console.log({response});
      expect(response).to.equal(signature);
    });
  });
  describe("verifyS256Message", function () {
    it("SHOULD verify if a signture of a message is valid using an rsa public key", async function () {
      const response = crypto.verifyS256Signature(message, signature, public_key);
      expect(response).to.equal(true);
    });
  });
  describe("getECDHPair", function () {
    it("SHOULD create an ECDHPair object", async function () {
      const response = await crypto.getECDHPair();
      ecdh = response as ECDHPair;
      console.log({ecdh});
      expect(response).to.have.property("privkey");
      expect(response).to.have.property("pubkey");
    });
  });

  describe("encryptAESMessageWithIV()", function () {
    it("SHOULD encrypt a message with a 16byte/32char IV", async function () {
      const response = await crypto.encryptAESMessageWithIV(message, key_hex);
      if (response instanceof Error) throw response;
      const iv = response.split(':')[0];
      ivcrypt_message = response;
       console.log({ivcrypt_message})
      expect(iv.length).to.equal(32);
    });
  });
  describe("decryptAESMessageWithIV()", function () {
    it("SHOULD decrypt an 16byte/32 char IV padded encrypted message", async function () {
      const response = await crypto.decryptAESMessageWithIV(ivcrypt_message, key_hex);
      expect(response).to.equal(message);
    });
  });
  describe("501: encryptAESMessageWithIV()", function () {
    it("SHOULD return 501 Error Invalid Key Length", async function () {
      const response = await crypto.encryptAESMessageWithIV(message, key);
      expect(response['name']).to.equal("501");
    });
  });

});

// ------------------ '(◣ ◢)' ---------------------
