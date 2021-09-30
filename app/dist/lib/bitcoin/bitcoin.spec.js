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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var bitcoin_1 = require("./bitcoin");
var bitcoin = new bitcoin_1.LionBitClientKeyOps();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
var alice_words = "flash tortoise arctic forum play dish finish arrow chaos version find sword";
var alice_expected_root = "xprv9s21ZrQH143K2Yq5WQBcUxCy7k1YDx6VrQLFCQnvvjbknjByo3SN16QFaR7FLZw7BumMNwGYtQnaE29yjWPwsKFqYJE5jJWUKeQy8uLEScL";
// m/128h/0h
var expected_hardened_master = {
    xprv: "xprv9xWFJqfxvunUJjx6nckgn1f6iqrHjc2qaiJn5eKvpaVoPkBbbSzqHCPDxbV5QgL9V4JWF2RAhkDh3HTEkYkDtdPyFJmUDRC3BgzsgEwuCQb",
    xpub: "xpub6BVbiMCrmHLmXE2ZteHh99bqGsgn94kgwwENt2jYNv2nGYWk8zK5pzhhospChAGzWnD5EEnymtekQTbzPrvqnnUFerZVCZouaTYqqLorHng"
};
var expected_hardened_contact_recipient = {
    xprv: "xprvA15eCAJsgoaHj2jCrrBBVKhvfaiW6ek8FLY5cV5YtTjhudwfdHzzHgBH7FKXs8UkVVa3ksUuYDtvNJGrS63eWMDNDfqjrFJeEEdke6ux3Y3",
    xpub: "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5"
};
var expected_hardened_recipient = {
    xprv: "xprvA3nZFEAQSiHpvAyAJwoY2X6wJJJBbpcs2fzYgCHaqpP4MmHe3tjViGSfMEu61bWK7tH8GXjkZ6o9UZdGefEa1iovWEoaFf7unpDto8LC3We",
    xpub: "xpub6GmuejhJH5r88f3dQyLYPf3frL8g1HLiPtv9UahCQ9v3EZcnbS3kG4m9CWAQq94r7dXXzxnChH47bhbZg5JfETAqbSTfFrioLZWuMKrzknc"
};
var expected_hardened_posts_sender = {
    xprv: "xprvA3kHeTNRh3U3krmc18PTZbeofPodfhACPzEkeKsFTLSneXKDNpA2j6vJYsbs5XMaK5tVfxjEZuGzWhAh1XvhSW9Re3t3J74DDGcS9ebnTuG",
    xpub: "xpub6Gje3xuKXR2LyLr579vTvjbYDRe859t3mDAMSiGs1fymXKeMvMUHGuEnQ8Q1PvZpU1wSg2W7DGwjRr6Hd4TiPTh3X2XMQB7eYE521nnSLWi"
};
var expected_hardened_profile_sender = {
    xprv: "xprvA31FQKGxmJyGAMhf4vR6pU6S3CxjqHR6rrqQ49aKKV3HTSWvUuHZ9HUBx7jGZSyQJa64BoW87zmspDATwpY9Wj2z92Pb9tZVSpzMqPCCNFi",
    xpub: "xpub6FzboporbgXZNqn8Awx7Bc3AbEoEEk8xE5kzrXyvspaGLEr52Sboh5nfoQsDCo7XTLrtyPqjVeq97bbKbzUyJiMjnf5LzkVDshQmu9DhUfa"
};
var xkeys = {
    xprv: "xprvA3nH6HUGxEUZbeZ2AGbsuVcsoEsa269AmySR95i3E81mwY3TmWoxoGUUqB59p8kjS6wb3Ppg2c9y3vKyG2aecijRpJfGWMxVX4swXwMLaSB",
    xpub: "xpub6GmdVo1Anc2rp8dVGJ8tGdZcMGi4RYs29CN1wU7enTYkpLNcK48DM4nxgTLoSCEfGYGJZ6JqPwCpSnoGfEwDUU6tszeSUcdEqntoqqRCLhm"
};
var expected_ecdsa_pair = {
    private_key: "3c842fc0e15f2f1395922d432aafa60c35e09ad97c363a37b637f03e7adcb1a7",
    public_key: "02dfbbf1979269802015da7dba4143ff5935ea502ef3a7276cc650be0d84a9c882",
};
var alice_pair = expected_ecdsa_pair;
var bob_pair = {
    private_key: "d5f984d2ab332345dbf7ddff9f47852125721b2025329e6981c4130671e237d0",
    public_key: "023946267e8f3eeeea651b0ea865b52d1f9d1c12e851b0f98a3303c15a26cf235d",
};
var expected_shared_secret = "49ab8cb9ba741c6083343688544861872e3b73b3d094b09e36550cf62d06ef1e";
// let bob_pair =  {
//   private_key: "3c842fc0e15f2f1395922d432aafa60c35e09ad97c363a37b637f03e7adcb1a7",
//   public_key: "02dfbbf1979269802015da7dba4143ff5935ea502ef3a7276cc650be0d84a9c882",
// }; 
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: S5Crypto Lib ", function () {
    after(function (done) {
        done();
    });
    describe("Bitcoin Operations TEST", function () {
        it("should generate a 12 word mnemonic phrase", function () {
            return __awaiter(this, void 0, void 0, function () {
                var mnemonic, word_array;
                return __generator(this, function (_a) {
                    mnemonic = bitcoin.generate_mnemonic();
                    if (mnemonic instanceof Error)
                        throw mnemonic;
                    word_array = mnemonic.split(" ");
                    chai_1.expect(word_array.length).to.equal(12);
                    return [2 /*return*/];
                });
            });
        });
        it("should get the seed_root xprv", function () {
            return __awaiter(this, void 0, void 0, function () {
                var root_xprv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bitcoin.seed_root(alice_words)];
                        case 1:
                            root_xprv = _a.sent();
                            if (root_xprv instanceof Error)
                                throw root_xprv;
                            chai_1.expect(root_xprv).to.equal(alice_expected_root);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("should derive_parent at m/128h/0h", function () {
            return __awaiter(this, void 0, void 0, function () {
                var key_pair;
                return __generator(this, function (_a) {
                    key_pair = bitcoin.derive_parent_128(alice_expected_root);
                    if (key_pair instanceof Error)
                        throw key_pair;
                    chai_1.expect(key_pair.xprv).to.equal(expected_hardened_master.xprv);
                    chai_1.expect(key_pair.xpub).to.equal(expected_hardened_master.xpub);
                    return [2 /*return*/];
                });
            });
        });
        it("should derive_hardened pair at m/0h/0h for hardened recipient/index/revoke", function () {
            return __awaiter(this, void 0, void 0, function () {
                var key_pair;
                return __generator(this, function (_a) {
                    key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv, 0, 0, 0);
                    if (key_pair instanceof Error)
                        throw key_pair;
                    chai_1.expect(key_pair.xprv).to.equal(expected_hardened_recipient.xprv);
                    chai_1.expect(key_pair.xpub).to.equal(expected_hardened_recipient.xpub);
                    return [2 /*return*/];
                });
            });
        });
        it("should derive_hardened pair at m/1h/0h for hardened contact/index/revoke", function () {
            return __awaiter(this, void 0, void 0, function () {
                var key_pair;
                return __generator(this, function (_a) {
                    key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv, 1, 0, 0);
                    if (key_pair instanceof Error)
                        throw key_pair;
                    chai_1.expect(key_pair.xprv).to.equal(expected_hardened_profile_sender.xprv);
                    chai_1.expect(key_pair.xpub).to.equal(expected_hardened_profile_sender.xpub);
                    return [2 /*return*/];
                });
            });
        });
        it("should derive_hardened pair at m/1h/1h for hardened posts/index/revoke", function () {
            return __awaiter(this, void 0, void 0, function () {
                var key_pair;
                return __generator(this, function (_a) {
                    key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv, 2, 1, 0);
                    if (key_pair instanceof Error)
                        throw key_pair;
                    chai_1.expect(key_pair.xprv).to.equal(expected_hardened_posts_sender.xprv);
                    chai_1.expect(key_pair.xpub).to.equal(expected_hardened_posts_sender.xpub);
                    return [2 /*return*/];
                });
            });
        });
        it("should extract_ecdsa_pair from extended key pair", function () {
            return __awaiter(this, void 0, void 0, function () {
                var key_pair;
                return __generator(this, function (_a) {
                    key_pair = bitcoin.extract_ecdsa_pair(xkeys);
                    if (key_pair instanceof Error)
                        throw key_pair;
                    chai_1.expect(key_pair.public_key).to.equal(expected_ecdsa_pair.public_key);
                    chai_1.expect(key_pair.private_key).to.equal(expected_ecdsa_pair.private_key);
                    return [2 /*return*/];
                });
            });
        });
        it("should generate_shared_secret from alice public_key and bob private_key", function () {
            return __awaiter(this, void 0, void 0, function () {
                var shared_secret_0, shared_secret_1;
                return __generator(this, function (_a) {
                    shared_secret_0 = bitcoin.calculate_shared_secret({ private_key: alice_pair.private_key, public_key: bob_pair.public_key });
                    shared_secret_1 = bitcoin.calculate_shared_secret({ private_key: bob_pair.private_key, public_key: alice_pair.public_key });
                    console.log({ shared_secret_0: shared_secret_0 });
                    chai_1.expect(shared_secret_0).to.equal(shared_secret_1);
                    return [2 /*return*/];
                });
            });
        });
        var message = "hello";
        var signature;
        it("should sign and verify a message with ecdsa keys", function () {
            return __awaiter(this, void 0, void 0, function () {
                var status;
                return __generator(this, function (_a) {
                    signature = bitcoin.sign(message, alice_pair.private_key);
                    if (signature instanceof Error)
                        throw signature;
                    console.log(signature);
                    status = bitcoin.verify(message, signature, alice_pair.public_key);
                    if (status instanceof Error)
                        throw status;
                    chai_1.expect(status).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=bitcoin.spec.js.map