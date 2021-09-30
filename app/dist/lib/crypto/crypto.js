"use strict";
/*
cypherpost.io
Developed @ Stackmate India
*/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S5Crypto = void 0;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var e_1 = require("../errors/e");
var key_path = process.env.KEY_PATH;
var S5Crypto = /** @class */ (function () {
    function S5Crypto() {
    }
    S5Crypto.prototype.signS256Message = function (message, private_key) {
        try {
            var signer = crypto_1.default.createSign('SHA256');
            signer.write(message);
            signer.end();
            return signer.sign(private_key, 'base64');
        }
        catch (e) {
            return e_1.handleError(e);
        }
    };
    S5Crypto.prototype.verifyS256Signature = function (message, sig, public_key) {
        try {
            var verifier = crypto_1.default.createVerify('SHA256');
            verifier.write(message);
            verifier.end();
            return verifier.verify(public_key, sig, 'base64');
        }
        catch (e) {
            return e_1.handleError(e);
        }
    };
    S5Crypto.prototype.createRSAPairFile = function (filename) {
        return __awaiter(this, void 0, void 0, function () {
            var generate_key_pair, result, message, sign, verify, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        generate_key_pair = util_1.default.promisify(crypto_1.default.generateKeyPair);
                        return [4 /*yield*/, generate_key_pair("rsa", {
                                modulusLength: 2048,
                                publicKeyEncoding: {
                                    type: "spki",
                                    format: "pem"
                                },
                                privateKeyEncoding: {
                                    type: "pkcs8",
                                    format: "pem"
                                }
                            })];
                    case 1:
                        result = _a.sent();
                        message = "check";
                        sign = crypto_1.default.createSign("SHA256");
                        sign.update(message);
                        sign.end();
                        verify = crypto_1.default.createVerify("SHA256");
                        verify.write(message);
                        verify.end();
                        console.log({ verify: verify.verify(result.privateKey.toString(), sign.sign(result.privateKey.toString(), "base64"), "base64") });
                        fs_1.default.writeFileSync(key_path + "/" + filename + ".pem", result.privateKey.toString(), "utf8");
                        fs_1.default.writeFileSync(key_path + "/" + filename + ".pub", result.publicKey.toString(), "utf8");
                        return [2 /*return*/, key_path + "/" + filename];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    S5Crypto.prototype.getECDHPair = function () {
        try {
            var ecdh = crypto_1.default.createECDH("secp256k1");
            ecdh.generateKeys("hex");
            var private_key = ecdh.getPrivateKey("hex");
            var public_key = ecdh.getPublicKey("hex");
            return {
                private_key: private_key,
                public_key: public_key
            };
        }
        catch (e) {
            return e_1.handleError(e);
        }
    };
    S5Crypto.prototype.encryptAESMessageWithIV = function (text, key_hex) {
        try {
            var algorithm = "aes-256-cbc";
            var key = Buffer.from(key_hex, "hex");
            var IV_LENGTH = 16; // For AES, this is always 16
            var iv = crypto_1.default.randomBytes(IV_LENGTH);
            var cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
            var encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            var encrypted_text = iv.toString("hex") + ":" + encrypted.toString("base64");
            return encrypted_text;
        }
        catch (e) {
            return e_1.handleError(e);
        }
    };
    S5Crypto.prototype.decryptAESMessageWithIV = function (iv_text_crypt, key_hex) {
        try {
            var algorithm = "aes-256-cbc";
            var key = Buffer.from(key_hex, "hex");
            var IV_LENGTH = 16; // For AES, this is always 16
            var text_parts = iv_text_crypt.split(":");
            var iv = Buffer.from(text_parts.shift(), "hex");
            var encrypted_text = Buffer.from(text_parts.join(":"), "base64");
            var decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
            var decrypted = decipher.update(encrypted_text);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
        catch (e) {
            return e_1.handleError(e);
        }
    };
    return S5Crypto;
}());
exports.S5Crypto = S5Crypto;
// ------------------ '(◣ ◢)' ----------------------
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=crypto.js.map