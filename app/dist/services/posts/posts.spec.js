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
var mongo_1 = require("../../lib/storage/mongo");
var uid_1 = require("../../lib/uid/uid");
var keys_1 = require("../keys/keys");
var posts_1 = require("./posts");
var sinon = require("sinon");
var posts = new posts_1.LionBitPosts();
var keys = new keys_1.LionBitKeys();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username = "ishi";
var id0 = "someid1";
var id1 = "someid1";
var id2 = "someid1";
var ds0 = "2h/0h/0h";
var ds1 = "2h/1h/0h";
var ds2 = "2h/2h/0h";
var cipher_json_0 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
var cipher_json_1 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
var cipher_json_2 = "oid2j3oid3kjwqfoilj:1093eijd2o9k34q0odik";
var user1 = "ravi";
var user2 = "mj";
// assuming trusting 2
// client sends username as id
// server replaces id with post id
var decryption_keys = [{
        id: user1,
        key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
    },
    {
        id: user2,
        key: "ivencrypted:decryptionkeyusingrecipientxpubsharedsecret"
    }];
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Posts Controller", function () {
    var sandbox = sinon.createSandbox();
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection, stub0;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = {
                            port: process.env.DB_PORT,
                            ip: process.env.DB_IP,
                            name: 'lionbit',
                            auth: 'lb:secret',
                        };
                        return [4 /*yield*/, db.connect(connection)];
                    case 1:
                        _a.sent();
                        stub0 = sinon.stub(uid_1.S5UID.prototype, "createPostCode");
                        stub0.onCall(0).returns(id0);
                        return [4 /*yield*/, keys.init(user1, "recipient_xpub1")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, keys.init(user2, "recipient_xpub2")];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, keys.remove(user1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, keys.remove(user2)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, posts.remove(id0)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, posts.remove(id1)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, posts.remove(id2)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("PROFILE CONTROLLER OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should CREATE a NEW POST", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, key_response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, posts.create(username, Date.now() + 10000, cipher_json_0, ds0, decryption_keys)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.username).to.equal(username);
                                    return [4 /*yield*/, keys.findMany([user1, user2])];
                                case 2:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response.length).to.equal(2);
                                    chai_1.expect(key_response[0].post_keys.length).to.equal(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND a POST", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, posts.find(username)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.length).to.equal(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND MANY POSTS", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, posts.findMany([id0, id1, id2])];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.length).to.equal(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    });
});
//# sourceMappingURL=posts.spec.js.map