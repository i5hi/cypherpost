"use strict";
/*
cypherpost.io
Developed @ Stackmate India
*/
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fs = __importStar(require("fs"));
require("mocha");
var crypto_1 = require("./crypto");
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
var crypto = new crypto_1.S5Crypto();
var message = "xprvA3nH6HUGxEUZbeZ2AGbsuVcsoEsa269AmySR95i3E81mwY3TmWoxoGUUqB59p8kjS6wb3Ppg2c9y3vKyG2aecijRpJfGWMxVX4swXwMLaSB";
var public_key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvxHJVaUo8J8PbKfpZ7lW\nffrRaSOcVmraoMwJeiYi2A/YTB2BnJNGUZd20Gj/ShRasnCWvjtZCEPpkNMAkXN4\nG7/xALKDzC9YBJCDhEP48J0sxhN37zvjlDaav2If0H/jSqKn5KlJ1im/maZ25sdG\ngYUN7h5F3kxwTBVDomTj4unmmiPiqk+/JJFq0ZMOSA+iAW4UVq14f4lTsyQ+peEe\nP2cr75Jn9/z0mTan/buYJ+B5KrM5pYLnfOKZrac2GJUzL2asJpj/ZMYyOq5YMGEk\nN29GasGlrF0unZI1P+4tmfE0j+A6Gi3MN1ZpHmFvyF2oBpLhReh7f0efvXYAemSV\nRQIDAQAB\n-----END PUBLIC KEY-----";
var private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/EclVpSjwnw9s\np+lnuVZ9+tFpI5xWatqgzAl6JiLYD9hMHYGck0ZRl3bQaP9KFFqycJa+O1kIQ+mQ\n0wCRc3gbv/EAsoPML1gEkIOEQ/jwnSzGE3fvO+OUNpq/Yh/Qf+NKoqfkqUnWKb+Z\npnbmx0aBhQ3uHkXeTHBMFUOiZOPi6eaaI+KqT78kkWrRkw5ID6IBbhRWrXh/iVOz\nJD6l4R4/Zyvvkmf3/PSZNqf9u5gn4Hkqszmlgud84pmtpzYYlTMvZqwmmP9kxjI6\nrlgwYSQ3b0ZqwaWsXS6dkjU/7i2Z8TSP4DoaLcw3VmkeYW/IXagGkuFF6Ht/R5+9\ndgB6ZJVFAgMBAAECggEAKxxVRBi+0wPglBCSzk94H3avNzzMsobri2peHQxrwjpZ\nAFuL+gsUy6YULdPy/gD3sdlLeeKkJQRFt+KT9z2JdSFqvFCLAlAQWP9OXVKE4a1l\nA9AyuGzX3YIwikwWh5HDc/ydSy+TNFo5G+7+VvXRh7nAueBkvVKb597IYuTGslTV\n1JrOJw6ifNcECKfp8BL4inBTbpyfh/iKgh+1jbQFnWsAqOLdtNGpx0Ntxcf22Gij\nROtn96hrNtMqG/ED8uVYHZvZVp145Y7EU7I1EtHDMdhEu/z0D5NevqtuIi7p5wiN\nLod0pfo8Zf3CD9xxWyugLofK8kDJPvIpghvT8TzaYQKBgQD1i8ekVTQ8xQPk37D2\ng/PQwEj+70Hw6RY+Gj2prAbxgFh05fOUkU4bgui+j5O+ExYIXTe2NuAuzuJt9l3F\nWtMkkXVmMFAheMGjl3oluc5HSrL1zLJlXBlcAS2wsmLqB2pcQWgoX+1cfvqsVu2T\nVZJX49DKEsRutO/glWnSjGMoWQKBgQDHNEOCFCMm5zAFREY31DpqTqaio/X+GUvU\nII7HS9oDcskDdPdVmLogGrK40CqTj5jqRl0vETXujU7f4qcNDrBdD4w4myenE05C\nLW9bocEAJSqV5cpqddfJgPviaSKOcyp6oI3LGjMZadN8sd9Zx8OnoWZKnfsdVBde\n9qYwyP62zQKBgQDOY7VlLbEAu2Dwig1Gx9aySk2Q6y5z/peRj6Dw8wXLDGRNrdM1\nt4T9nuVe93PpukU0tpXTdQCul3q/jut2rUb4X8NcJ5PS7ptklDg5aZo3VlRiQrJY\nfDdcnCj5cpetupnt/ZQ9C5SJwLmXDmIXC0A82+JtV6UAoNlX3n7aWOIn0QKBgEBu\nAgu3kasKiXianY9/ICm0KKdgGrdF3UXOBgAl42zMGoH4uerAjCrIF9g41ByIDHBx\ns7/+dBAlOkalm1xYzOg8mCDS5h9e2igDZAoiJjdyzfRPr4mBdfrhshaH5LpoO2wQ\nM+xmG/LzTIj/SvtR5lF4nYoy0L6qrSh05EnRKLldAoGBAKHDyT4oCxCUsQzUkCQM\ny72mJBedxTTMPIaYsKAD2zTPrrgwIJNkBX9NXqobYMQB5DjAhG21Qkn81UF4teVz\nn74QgoHNS/FEaNaBRmAGrtS/kEzajdhoauo9Y3WjZaulVzMCsLyW5q65RF6H6DBv\npaq2IF0TUqBVLKjDHqAKJ15h\n-----END PRIVATE KEY-----";
var signature = "CHq0hwIxpejMqWrhMQ0SGoHwYMQJ8il0kza+r5MtlF9wMI6vpHU8/KI9+CAdkjs2QH2NkOBF6I+tKekAuzYOitnASrpz/4KmnF3FFQk/JChshNkOkyQe97wEaEcfb+/MV4llwdo659hAGIbLq8yzzLEB06uRXiaybJ/BzRzkvx2K/vMj6UuA9XFgO9DDjUko7JBtQNR9Gop4Gw9TQlk5cE+xqdj+dd7aujEeKNpWiF0knNZJC60gFyUhKWQlse7L3nqBMQV/ykwtSUMVN8wikV3HuCornnoyQnZTUc2fBm2u+mB0LuU+NphW9rlA9dsaIyMXFvDLykQqxDCtGsjQvw==";
var rsa_filename = "crypto-test-secret";
var rsa_fixed = "sats_sig";
var key_hex = "9870aa5092c44767f7a0d60cfb4dde81abc66ed8ac71bc2d466ed8b6e0323fd4";
var ecdh = {
    private_key: "shhhHH!",
    public_key: "oh, hi! :)"
};
var ivcrypt_message;
var key = "supersecret";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: S5Crypto Lib ", function () {
    after(function (done) {
        fs.unlinkSync(process.env.KEY_PATH + rsa_filename + ".pem");
        fs.unlinkSync(process.env.KEY_PATH + rsa_filename + ".pub");
        done();
    });
    describe("createRSAPairFile", function () {
        it("SHOULD create an RSA Key Pair as a File", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, crypto.createRSAPairFile(rsa_filename)];
                        case 1:
                            response = _a.sent();
                            if (response instanceof Error)
                                throw response;
                            status = (fs.existsSync(response + ".pem") && fs.existsSync(response + ".pub")) ? true : false;
                            chai_1.expect(status).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("signS256Message", function () {
        it("SHOULD return a hmac sha256 signature of a message using an rsa private key", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = crypto.signS256Message(message, private_key);
                    //  console.log({response});
                    chai_1.expect(response).to.equal(signature);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("verifyS256Message", function () {
        it("SHOULD verify if a signture of a message is valid using an rsa public key", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = crypto.verifyS256Signature(message, signature, public_key);
                    chai_1.expect(response).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("getECDHPair", function () {
        it("SHOULD create an ECDHPair object", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, crypto.getECDHPair()];
                        case 1:
                            response = _a.sent();
                            ecdh = response;
                            chai_1.expect(response).to.have.property("private_key");
                            chai_1.expect(response).to.have.property("public_key");
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe.only("encryptAESMessageWithIV()", function () {
        it("SHOULD encrypt a message with a 16byte/32char IV", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, iv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, crypto.encryptAESMessageWithIV(message, key_hex)];
                        case 1:
                            response = _a.sent();
                            if (response instanceof Error)
                                throw response;
                            iv = response.split(':')[0];
                            ivcrypt_message = response;
                            console.log({ ivcrypt_message: ivcrypt_message });
                            chai_1.expect(iv.length).to.equal(32);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("decryptAESMessageWithIV()", function () {
        it("SHOULD decrypt an 16byte/32 char IV padded encrypted message", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, crypto.decryptAESMessageWithIV(ivcrypt_message, key_hex)];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response).to.equal(message);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("501: encryptAESMessageWithIV()", function () {
        it("SHOULD return 501 Error Invalid Key Length", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, crypto.encryptAESMessageWithIV(message, key)];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response['name']).to.equal("501");
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=crypto.spec.js.map