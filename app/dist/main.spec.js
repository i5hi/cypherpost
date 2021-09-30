"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
cypherpost.io
Developed @ Stackmate India
*/
// IMPORTS
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var node_crypto = __importStar(require("crypto"));
require("mocha");
var bitcoin_1 = require("./lib/bitcoin/bitcoin");
var crypto_1 = require("./lib/crypto/crypto");
var winston_1 = require("./lib/logger/winston");
var express = __importStar(require("./lib/server/express"));
var mongo_1 = require("./lib/storage/mongo");
var auth_1 = require("./services/auth/auth");
var mongo_2 = require("./services/auth/mongo");
var keys_1 = require("./services/keys/keys");
var profile_1 = require("./services/profile/profile");
var sinon = require('sinon');
var bitcoin = new bitcoin_1.LionBitClientKeyOps();
var crypto = new crypto_1.S5Crypto();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
var should = chai_1.default.should();
var expect = chai_1.default.expect;
chai_1.default.use(chai_http_1.default);
var db = new mongo_1.MongoDatabase();
var auth = new auth_1.LionBitAuth();
var keys = new keys_1.LionBitKeys();
var profile = new profile_1.LionBitProfile();
var server;
var admin_username = "ravi";
var admin_pass256 = "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7";
var admin_nickname = "Lion Bitcoiner";
var admin_status = "online";
var admin_contact_info = "Contact me on telegram @ravip ONLY";
var admin_token;
var user0_token;
var user1_token;
var invite_code;
var username = "ishi";
var nickname = "Bitcoin Watchdog";
var updated_nickname = "UV Bitcoin Watchdog";
var status = "Sound Money, Sound World.";
var updated_status = "Watching Bitcoin.";
var contact_info = "Contact me on telegram @i5hi_ or Signal: +97283782733";
var updated_contact_info = "Contact me on telegram @i5hi_ ONLY";
var username1 = "mj";
var nickname1 = "mocodesmo";
var status1 = "Cypherpunks write code.";
var contact_info1 = "Contact me on telegram @mj or Signal: +3284923847";
var password = "mysecret";
var pass256 = "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0";
var invalid_pass256 = "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd9";
var seed256 = "a490eac4b0c20ce5f9008e88191d51ba87722d23bfdc0c3252e7f9e7a0574c22";
var unregistered_seed256 = "77238fdd7584a8612f8a494dcdeb525af77813a47dead83a73318a4ae2fc28e6";
var preset_invite_code = "t780opsd";
var unregistered_username = "prahalad";
var invalid_username = "!!!";
var invalid_invite_code = "tyu909ui";
//--------------------------------------------------
// KEYS
var ishi_master_seed = {
    "fingerprint": "484a0df0",
    "mnemonic": "embrace hint style unusual island radar sweet area maple chalk opinion flash",
    "xprv": "xprv9s21ZrQH143K3B3gTrs1zVnzoRu75y9NL1cZJZUVj85Ypx85f6A7QUed9eB2qSNYwjj1C7J1stgfHfwHhyZRJq11QV6JMW54wtnTdfEtcqt"
};
var ishi_recipient_ds = "0h/0h/0h/"; // ishi_recipient_ds.split("h/")
var ishi_profile_ds = "1h/0h/0h/";
var ishi_posts_ds = "2h/0h/0h/";
var ravi_master_seed = {
    "fingerprint": "05d72448",
    "mnemonic": "south lesson business curve draft market omit box spray promote about horror",
    "xprv": "xprv9s21ZrQH143K4MzLUystCT7Tdf9WzGDvBXwdQvNNka6Ybf48kvXTgSXPwwuF1hgtYZYkFBWbGP5Twid2Ztbmk1GgHfGSd2Bjf7hDBwst3iC"
};
var ravi_recipient_ds = "0h/0h/0h/";
var ravi_profile_ds = "1h/0h/0h/";
var ravi_posts_ds = "2h/0h/0h/";
var mj_master_seed = {
    "fingerprint": "59fda320",
    "mnemonic": "rubber token marine embark such grow crash maple napkin trip section front",
    "xprv": "xprv9s21ZrQH143K2ENzcwZQqk7JQKdhwRw7mdj2Crt5Qit6p6ht5NhQuppYs1fNQmv2GB98zUJThoY9JaGi6emWLNWZVxwf8e9hTzhdZ24yH92"
};
var mj_recipient_ds = "0h/0h/0h/";
var mj_profile_ds = "1h/0h/0h/";
var mj_posts_ds = "2h/0h/0h/";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("LIONBIT: API BEHAVIOUR SPECIFICATION", function () {
    return __awaiter(this, void 0, void 0, function () {
        var ishi_128, ishi_recipient_xkeys, ishi_recipient_ecdsa, ravi_128, ravi_recipient_xkeys, ravi_recipient_ecdsa, mj_128, mj_recipient_xkeys, mj_recipient_ecdsa;
        return __generator(this, function (_a) {
            before(function () {
                return __awaiter(this, void 0, void 0, function () {
                    var connection;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                connection = {
                                    port: process.env.DB_PORT,
                                    ip: process.env.DB_IP,
                                    name: 'cypherpost',
                                    auth: 'cp:secret',
                                };
                                sinon.stub(winston_1.logger, "debug");
                                return [4 /*yield*/, db.connect(connection)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, mongo_2.test_create_admin()];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, express.start(process.env.TEST_PORT)];
                            case 3:
                                server = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            after(function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, auth.remove(username, pass256)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, auth.remove(username1, pass256)];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, auth.remove(admin_username, admin_pass256)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, profile.remove(username)];
                            case 4:
                                _a.sent();
                                return [4 /*yield*/, profile.remove(username1)];
                            case 5:
                                _a.sent();
                                return [4 /*yield*/, profile.remove(admin_username)];
                            case 6:
                                _a.sent();
                                return [4 /*yield*/, keys.remove(username)];
                            case 7:
                                _a.sent();
                                return [4 /*yield*/, keys.remove(username1)];
                            case 8:
                                _a.sent();
                                return [4 /*yield*/, keys.remove(admin_username)];
                            case 9:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            });
            // ------------------- AUTH ---------------------
            describe("200 - AUTH", function () {
                it("should LOGIN as ADMIN user with username, pass256 & return JWT.", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/login")
                        .send({
                        username: admin_username,
                        pass256: admin_pass256,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("token");
                        admin_token = res.body.token;
                        done();
                    });
                });
                it("should get an INVITE code to register USER0 by admin", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/auth/invite")
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("invite_code");
                        invite_code = res.body.invite_code;
                        done();
                    });
                });
                it("should REGISTER USER0 with username, pass256 and seed256 & return JWT.", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: username,
                        pass256: pass256,
                        seed256: seed256,
                        invite_code: invite_code,
                        invited_by: admin_username
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("token");
                        done();
                    });
                });
                it("should LOGIN a USER0 with username, pass256 & return JWT.", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/login")
                        .send({
                        username: username,
                        pass256: pass256,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("token");
                        user0_token = res.body.token;
                        done();
                    });
                });
                it("should RESET USER0 password with seed256 & return JWT", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/reset")
                        .send({
                        seed256: seed256,
                        pass256: pass256
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("token");
                        // let decoded = jwt_decode(res.body.token);
                        // expect(decoded.iss).to.equal("LionBit");
                        // check email
                        done();
                    });
                });
                it("should get an INVITE code to register USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/auth/invite")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("invite_code");
                        invite_code = res.body.invite_code;
                        done();
                    });
                });
                it("should get AVAILABLE USERNAMES for USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/usernames?invited_by=" + username + "&invite_code=" + invite_code)
                        .end(function (err, res) {
                        console.log({ res: res.body });
                        res.should.have.status(200);
                        expect(res.body).to.have.property("usernames");
                        done();
                    });
                });
                it("should REGISTER USER1 with username, pass256 and seed256 & return JWT.", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: username1,
                        pass256: pass256,
                        seed256: seed256,
                        invite_code: invite_code,
                        invited_by: username
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        user1_token = res.body.token;
                        expect(res.body).to.have.property("token");
                        done();
                    });
                });
                it("should CHECK USER1's seed256 for Client side import check.", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/check/seed256")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .send({
                        seed256: seed256
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body.status).to.be.equal(true);
                        done();
                    });
                });
            });
            describe("4** - AUTH", function () {
                it("should ERROR 409 for username ALREADY EXISTS", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: username,
                        pass256: pass256,
                        seed256: seed256,
                        invite_code: preset_invite_code,
                        invited_by: admin_username
                    })
                        .end(function (err, res) {
                        res.should.have.status(409);
                        done();
                    });
                });
                it("should ERROR 400 for INVALID username MUST SATISY [a-z, 0-9 and chars {1+}]", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: invalid_username,
                        pass256: pass256,
                        seed256: seed256
                    })
                        .end(function (err, res) {
                        res.should.have.status(400);
                        done();
                    });
                });
                it("should ERROR 404 for username NOT FOUND", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/login")
                        .send({
                        username: unregistered_username,
                        pass256: pass256,
                    })
                        .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
                });
                it("should ERROR 401 a user for INVALID PASSWORD", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/login")
                        .send({
                        username: username,
                        pass256: invalid_pass256,
                    })
                        .end(function (err, res) {
                        res.should.have.status(401);
                        // console.log(res.body);
                        done();
                    });
                });
                it("should ERROR 404 for seed256 NOT FOUND", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/reset")
                        .send({
                        seed256: unregistered_seed256,
                        pass256: pass256,
                    })
                        .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
                });
                it("should ERROR 404 for inviter NOT FOUND", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: username,
                        pass256: pass256,
                        seed256: seed256,
                        invite_code: invite_code,
                        invited_by: unregistered_username
                    })
                        .end(function (err, res) {
                        res.should.have.status(404);
                        done();
                    });
                });
                it("should ERROR 401 for INVALID invite_code", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/auth/register")
                        .send({
                        username: username,
                        pass256: pass256,
                        seed256: seed256,
                        invite_code: invalid_invite_code,
                        invited_by: admin_username
                    })
                        .end(function (err, res) {
                        res.should.have.status(401);
                        done();
                    });
                });
            });
            // ------------------ PROFILE -------------------
            describe("2** - PROFILE", function () {
                var ishi_profile_xkeys_00;
                var ishi_profile_xkeys_01;
                var ravi_profile_xkeys_00;
                var mj_profile_xkeys_00;
                var decryption_key_for_admin;
                var user0_signed_admin_recipient_key;
                var user0_signed_user1_recipient_key;
                // derive ishi parent
                ishi_128 = bitcoin.derive_parent_128(ishi_master_seed.xprv);
                if (ishi_128 instanceof Error)
                    throw ishi_128;
                // derive ishi recipient/index/revoke
                var path = ishi_recipient_ds.split("h/").map(function (element) { return parseInt(element); });
                ishi_recipient_xkeys = bitcoin.derive_hardened(ishi_128.xprv, path[0], path[1], path[2]);
                if (ishi_recipient_xkeys instanceof Error)
                    throw ishi_recipient_xkeys;
                ishi_recipient_ecdsa = bitcoin.extract_ecdsa_pair(ishi_recipient_xkeys);
                // derive ishi profile/index/revoke
                path = ishi_profile_ds.split("h/").map(function (element) { return parseInt(element); });
                ishi_profile_xkeys_00 = bitcoin.derive_hardened(ishi_128.xprv, path[0], path[1], path[2]);
                if (ishi_profile_xkeys_00 instanceof Error)
                    throw ishi_profile_xkeys_00;
                // encrypt contact_info
                var ishi_key_hash = node_crypto.createHash('sha256')
                    .update(ishi_profile_xkeys_00.xprv)
                    .digest('hex');
                var ishi_cipher_info = crypto.encryptAESMessageWithIV(contact_info, ishi_key_hash);
                // derive ravi parent
                ravi_128 = bitcoin.derive_parent_128(ravi_master_seed.xprv);
                if (ravi_128 instanceof Error)
                    throw ravi_128;
                // derive ravi recipient/index/revoke
                path = ravi_recipient_ds.split("h/").map(function (element) { return parseInt(element); });
                ravi_recipient_xkeys = bitcoin.derive_hardened(ravi_128.xprv, path[0], path[1], path[2]);
                if (ravi_recipient_xkeys instanceof Error)
                    throw ravi_recipient_xkeys;
                ravi_recipient_ecdsa = bitcoin.extract_ecdsa_pair(ravi_recipient_xkeys);
                // derive ravi profile/index/revoke
                path = ravi_profile_ds.split("h/").map(function (element) { return parseInt(element); });
                ravi_profile_xkeys_00 = bitcoin.derive_hardened(ravi_128.xprv, path[0], path[1], path[2]);
                if (ravi_profile_xkeys_00 instanceof Error)
                    throw ravi_profile_xkeys_00;
                // encrypt contact_info
                var ravi_key_hash = node_crypto.createHash('sha256')
                    .update(ravi_profile_xkeys_00.xprv)
                    .digest('hex');
                var ravi_cipher_info = crypto.encryptAESMessageWithIV(contact_info, ravi_key_hash);
                // derive mj parent
                mj_128 = bitcoin.derive_parent_128(mj_master_seed.xprv);
                if (mj_128 instanceof Error)
                    throw mj_128;
                // derive mj recipient/index/revoke
                path = mj_recipient_ds.split("h/").map(function (element) { return parseInt(element); });
                mj_recipient_xkeys = bitcoin.derive_hardened(mj_128.xprv, path[0], path[1], path[2]);
                if (mj_recipient_xkeys instanceof Error)
                    throw mj_recipient_xkeys;
                mj_recipient_ecdsa = bitcoin.extract_ecdsa_pair(mj_recipient_xkeys);
                // derive mj profile/index/revoke
                path = mj_profile_ds.split("h/").map(function (element) { return parseInt(element); });
                mj_profile_xkeys_00 = bitcoin.derive_hardened(mj_128.xprv, path[0], path[1], path[2]);
                if (mj_profile_xkeys_00 instanceof Error)
                    throw mj_profile_xkeys_00;
                // encrypt contact_info
                var mj_key_hash = node_crypto.createHash('sha256')
                    .update(mj_profile_xkeys_00.xprv)
                    .digest('hex');
                var mj_cipher_info = crypto.encryptAESMessageWithIV(contact_info, mj_key_hash);
                it("should CREATE a new profile for USER0, USER1 & ADMIN", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/genesis")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        recipient_xpub: ishi_recipient_xkeys.xpub,
                        derivation_scheme: ishi_profile_ds
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // console.log(res.body)
                    });
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/genesis")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .send({
                        recipient_xpub: mj_recipient_xkeys.xpub,
                        derivation_scheme: mj_profile_ds
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // console.log(res.body)
                    });
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/genesis")
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .send({
                        recipient_xpub: ravi_recipient_xkeys.xpub,
                        derivation_scheme: ravi_profile_ds
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // console.log(res.body)
                        done();
                    });
                });
                it("should FETCH USER0's profile", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("profile");
                        expect(res.body).to.have.property("keys");
                        expect(res.body['keys']['recipient_keys'].length).to.equal(0);
                        // console.log(res.body)
                        done();
                    });
                });
                it("should UPDATE USER0 USER1 and ADMIN profile", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        nickname: updated_nickname,
                        status: updated_status,
                        cipher_info: ishi_cipher_info,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                    });
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .send({
                        nickname: nickname1,
                        status: status1,
                        cipher_info: mj_cipher_info,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                    });
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .send({
                        nickname: admin_nickname,
                        status: admin_status,
                        cipher_info: ravi_cipher_info,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
                });
                it("should FETCH ADMIN & USER1 profile as a USER0 (to sign recipient_xpub)", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/find_many")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        usernames: [admin_username, username1]
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body).to.have.property("profiles");
                        expect(res.body).to.have.property("keys");
                        // console.log(JSON.stringify(res.body,null,2));
                        user0_signed_admin_recipient_key = bitcoin.sign(res.body.keys[0].recipient_xpub, ishi_recipient_ecdsa.private_key);
                        user0_signed_user1_recipient_key = bitcoin.sign(res.body.keys[1].recipient_xpub, ishi_recipient_ecdsa.private_key);
                        done();
                    });
                    // chai
                    //   .request(server)
                    //   .get(`/profile?username=${admin_username}`)
                    //   .set({
                    //     "authorization": `Bearer ${user0_token}`
                    //   })
                    //   .end((err, res) => {
                    //     res.should.have.status(200);
                    //     expect(res.body).to.have.property("profile");
                    //     expect(res.body['profile']['trusted_by'].length).to.equal(0);
                    //     console.log(res.body);
                    //     user0_signed_admin_recipient_key = bitcoin.sign(res.body.recipient_xpub, ishi_recipient_ecdsa.private_key);
                    //     console.log({ user0_signed_admin_recipient_key })
                    //   });
                    //   chai
                    //   .request(server)
                    //   .get(`/profile?username=${username1}`)
                    //   .set({
                    //     "authorization": `Bearer ${user0_token}`
                    //   })
                    //   .end((err, res) => {
                    //     res.should.have.status(200);
                    //     expect(res.body).to.have.property("profile");
                    //     expect(res.body['profile']['trusted_by'].length).to.equal(0);
                    //     console.log(res.body);
                    //     user0_signed_user1_recipient_key = bitcoin.sign(res.body.recipient_xpub, ishi_recipient_ecdsa.private_key);
                    //     console.log({ user0_signed_user1_recipient_key })
                    //     done();
                    //   });
                });
                /**
                 *
                 *
                 *
                 * COMPUUTE SHARED SECRETS
                 *
                 *
                 *
                 *
                 */
                var shared_secret_user0_admin = bitcoin.calculate_shared_secret({
                    public_key: ravi_recipient_ecdsa.public_key,
                    private_key: ishi_recipient_ecdsa.private_key
                });
                if (shared_secret_user0_admin instanceof Error)
                    throw shared_secret_user0_admin;
                var decryption_key_user0_admin = crypto.encryptAESMessageWithIV(ishi_key_hash, shared_secret_user0_admin);
                var shared_secret_user0_user1 = bitcoin.calculate_shared_secret({
                    public_key: mj_recipient_ecdsa.public_key,
                    private_key: ishi_recipient_ecdsa.private_key
                });
                if (shared_secret_user0_user1 instanceof Error)
                    throw shared_secret_user0_user1;
                var decryption_key_user0_user1 = crypto.encryptAESMessageWithIV(ishi_key_hash, shared_secret_user0_user1);
                it("should MAKE USER0 TRUST ADMIN & USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/trust")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        trusting: admin_username,
                        decryption_key: decryption_key_user0_admin,
                        signature: user0_signed_admin_recipient_key,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                    });
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/trust")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        trusting: username1,
                        decryption_key: decryption_key_user0_user1,
                        signature: user0_signed_user1_recipient_key,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
                });
                var plain_decryption_key_user0_admin;
                it("should FETCH ADMIN profile as ADMIN which CONTAINS a DECRYPTION_KEY from USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body.profile.trusted_by.length).to.equal(1);
                        expect(res.body['keys']['profile_keys'][0].key).to.equal(decryption_key_user0_admin);
                        expect(res.body.profile.trusted_by[0].username).to.equal(username);
                        //decrypt
                        var shared_secret_admin_user0 = bitcoin.calculate_shared_secret({
                            public_key: ishi_recipient_ecdsa.public_key,
                            private_key: ravi_recipient_ecdsa.private_key
                        });
                        if (shared_secret_admin_user0 instanceof Error)
                            throw shared_secret_user0_admin;
                        plain_decryption_key_user0_admin = crypto.decryptAESMessageWithIV(res.body['keys']['profile_keys'][0].key, shared_secret_admin_user0);
                        done();
                    });
                });
                it("ADMIN should be ABLE TO VIEW a USER0's contact_info with DECRYPTION_KEY", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile?username:{username}")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // should be able to decrypt contact_info
                        var decrypted_contact_info = crypto.decryptAESMessageWithIV(res.body['profile']['cipher_info'], plain_decryption_key_user0_admin);
                        expect(decrypted_contact_info).to.equal(contact_info);
                        done();
                    });
                });
                /**
                 *
                 *
                 *
                 * RENCRYPT BEFORE REVOKING TRUST
                 *
                 *
                 *
                 *
                 */
                ishi_profile_ds = "1h/0h/1h";
                path = ishi_profile_ds.split("h/").map(function (element) { return parseInt(element); });
                ishi_profile_xkeys_01 = bitcoin.derive_hardened(ishi_128.xprv, path[0], path[1], path[2]);
                if (ishi_profile_xkeys_01 instanceof Error)
                    throw ishi_profile_xkeys_01;
                // encrypt contact_info
                var ishi_key_01_hash = node_crypto.createHash('sha256')
                    .update(ishi_profile_xkeys_01.xprv)
                    .digest('hex');
                var ishi_cipher_info_01 = crypto.encryptAESMessageWithIV(contact_info, ishi_key_01_hash);
                decryption_key_user0_user1 = crypto.encryptAESMessageWithIV(ishi_key_01_hash, shared_secret_user0_user1);
                it("should MAKE USER0 REVOKE TRUST in ADMIN", function (done) {
                    chai_1.default
                        .request(server)
                        .post("/api/v1/profile/revoke")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        revoking: admin_username,
                        decryption_keys: [decryption_key_user0_user1],
                        derivation_scheme: ishi_profile_ds,
                        cipher_info: ishi_cipher_info_01
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
                });
                it("should get ADMIN profile as admin without any trusted_by", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body.profile.trusted_by.length).to.equal(0);
                        done();
                    });
                });
                it("ADMIN should be UNABLE TO VIEW user contact_info", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile?username=" + username)
                        .set({
                        "authorization": "Bearer " + admin_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // should not be able to decrypt contact_info
                        // expect(res.body.contact_info).to.equal(updated_contact_info);
                        var decrypted_contact_info = crypto.decryptAESMessageWithIV(res.body['profile']['cipher_info'], plain_decryption_key_user0_admin);
                        expect(decrypted_contact_info instanceof Error).to.equal(true);
                        done();
                    });
                });
                var plain_decryption_key_user0_user1;
                it("should FETCH USER1 profile as USER1 which CONTAINS a DECRYPTION_KEY from USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body.profile.trusted_by.length).to.equal(1);
                        expect(res.body['keys']['profile_keys'][0].key).to.equal(decryption_key_user0_user1);
                        expect(res.body.profile.trusted_by[0].username).to.equal(username);
                        //decrypt      
                        plain_decryption_key_user0_user1 = crypto.decryptAESMessageWithIV(res.body['keys']['profile_keys'][0].key, shared_secret_user0_user1);
                        done();
                    });
                });
                it("should FETCH USER0 as USER1 and expect working DECRYPTION_KEY", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile?username=" + username)
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        // shouuld still be able to decrypt
                        var decrypted_contact_info = crypto.decryptAESMessageWithIV(res.body['profile']['cipher_info'], plain_decryption_key_user0_user1);
                        expect(decrypted_contact_info).to.equal(contact_info);
                        done();
                    });
                });
            });
            // ------------------ POSTS --------------------
            describe("2** - POSTS", function () {
                /**
                 *
                 *
                 *
                 *
                 * POST ENCRYPTION
                 *
                 *
                 *
                 */
                var post0_id;
                var cipher_json0;
                var decryption_keys = [];
                var ishi_post_json0 = {
                    message: "My first post",
                };
                // derive ishi profile/index/revoke
                var path = ishi_profile_ds.split("h/").map(function (element) { return parseInt(element); });
                var ishi_posts_xkeys_00 = bitcoin.derive_hardened(ishi_128.xprv, path[0], path[1], path[2]);
                if (ishi_posts_xkeys_00 instanceof Error)
                    throw ishi_posts_xkeys_00;
                // encrypt contact_info
                var ishi_key_hash = node_crypto.createHash('sha256')
                    .update(ishi_posts_xkeys_00.xprv)
                    .digest('hex');
                var ishi_cipher_json0 = crypto.encryptAESMessageWithIV(JSON.stringify(ishi_post_json0), ishi_key_hash);
                var shared_secret_user0_user1 = bitcoin.calculate_shared_secret({
                    public_key: mj_recipient_ecdsa.public_key,
                    private_key: ishi_recipient_ecdsa.private_key
                });
                if (shared_secret_user0_user1 instanceof Error)
                    throw shared_secret_user0_user1;
                var decryption_key_user0_user1 = crypto.encryptAESMessageWithIV(ishi_key_hash, shared_secret_user0_user1);
                var mj_posts_decrypt = {
                    id: username1,
                    key: decryption_key_user0_user1
                };
                decryption_keys.push(mj_posts_decrypt);
                it("should CREATE a new POST by USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .put("/api/v1/posts")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .send({
                        expiry: Date.now() + 10000000,
                        cipher_json: ishi_cipher_json0,
                        decryption_keys: decryption_keys,
                        derivation_scheme: ishi_posts_ds,
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
                });
                it("should FIND OWN POST BY USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/posts/self")
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        post0_id = res.body.posts[0].id;
                        done();
                    });
                });
                var plain_decryption_key_user0_user1;
                it("should FETCH USER1 profile as USER1 which CONTAINS a DECRYPTION_KEY from USER1", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/profile/")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        expect(res.body.profile.trusted_by.length).to.equal(1);
                        expect(res.body.profile.trusted_by[0].username).to.equal(username);
                        //decrypt      
                        plain_decryption_key_user0_user1 = crypto.decryptAESMessageWithIV(res.body['keys']['post_keys'][0].key, shared_secret_user0_user1);
                        done();
                    });
                });
                it("should FIND USER1 POST BY USER2 and DECRYPT cipher_json", function (done) {
                    chai_1.default
                        .request(server)
                        .get("/api/v1/posts/others")
                        .set({
                        "authorization": "Bearer " + user1_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        var decrypted_cipher_json = crypto.decryptAESMessageWithIV(res.body.others_posts.posts[0]['cipher_json'], plain_decryption_key_user0_user1);
                        if (decrypted_cipher_json instanceof Error)
                            throw decrypted_cipher_json;
                        expect(JSON.parse(decrypted_cipher_json).message).to.equal(ishi_post_json0.message);
                        done();
                    });
                });
                it("should DELETE OWN POST BY USER0", function (done) {
                    chai_1.default
                        .request(server)
                        .delete("/api/v1/posts/" + post0_id)
                        .set({
                        "authorization": "Bearer " + user0_token
                    })
                        .end(function (err, res) {
                        res.should.have.status(200);
                        done();
                    });
                });
            });
            return [2 /*return*/];
        });
    });
});
//# sourceMappingURL=main.spec.js.map