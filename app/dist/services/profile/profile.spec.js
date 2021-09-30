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
var keys_1 = require("../keys/keys");
var mongo_2 = require("./mongo");
var profile_1 = require("./profile");
var profile = new profile_1.LionBitProfile();
var keys = new keys_1.LionBitKeys();
var store = new mongo_2.MongoProfileStore();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username0 = "ishi";
var nickname0 = "Bitcoin Watchdog";
var status0 = "Sound Money, Sound World.";
var updated_status0 = "Watching Bitcoin.";
var contact_info0 = "Contact me on telegram @i5hi_ or Signal: +97283782733";
var cipher_info0 = "";
var decryption_key00 = "for1";
var derivation_scheme0 = "m/0'/0'";
var recipient_xpub0 = "xpubasd9o3k2s";
var decryption_key01 = "for2";
var decryption_key_revoked_01 = "for1only";
var derivation_scheme_after_revoke = "m/0'/1'";
var new_key_set = [{
        key: "for1only",
        id: "ravi"
    }];
var profile_update0 = {
    username: username0,
    status: updated_status0
};
var username1 = "ravi";
var nickname1 = "RPH";
var status1 = "Sound Money, Sound World.";
var contact_info1 = "Contact me on telegram @ravi or Signal: +938274982374";
var cipher_info1 = "";
var derivation_scheme1 = "m/0'/0'";
var recipient_xpub1 = "xpubasd9o3k2s12ed2wesax";
var username2 = "mj";
var nickname2 = "mocodescmo";
var status2 = "Testing";
var contact_info2 = "Contact me on telegram @mj or Signal: +91230921834";
var cipher_info2 = "";
var derivation_scheme2 = "m/0'/0'";
var recipient_xpub2 = "xpubasd9o3k2s122344324ed2wesax";
var signature = "TestSignaturueInMain.Spec.ts";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
function cleanUp() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, profile.remove(username0)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, profile.remove(username1)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, profile.remove(username2)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, keys.remove(username0)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, keys.remove(username1)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, keys.remove(username2)];
                case 6:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
;
describe("Initalizing Test: Profile Controller", function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
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
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cleanUp()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("PROFILE CONTROLLER OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should CREATE a NEW PROFILE for USER 0 collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.genesis(username0, derivation_scheme0, recipient_xpub0)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should CREATE a NEW PROFILE for USER 1 collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.genesis(username1, derivation_scheme1, recipient_xpub1)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should CREATE a NEW PROFILE for USER 2 collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.genesis(username2, derivation_scheme2, recipient_xpub2)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND a PROFILE collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.find(username0)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['nickname']).to.equal(nickname0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND MANY PROFILE collections", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.findMany([username0, username1])];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.length).to.equal(2);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should UPDATE a PROFILE collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.update(username0, profile_update0)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['status']).to.equal(updated_status0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should MAKE USER 0 TRUST USER 1", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, key_response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.trust(username0, username1, decryption_key00, signature)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, profile.find(username0)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusting'].some(function (element) { return element.username === username1; })).to.equal(true);
                                    return [4 /*yield*/, profile.find(username1)];
                                case 3:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    console.log({ response: response });
                                    chai_1.expect(response['trusted_by'].some(function (element) { return element.username === username0; })).to.equal(true);
                                    return [4 /*yield*/, keys.find(username0)];
                                case 4:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response['recipient_keys'].some(function (element) { return element.id === username1; })).to.equal(true);
                                    chai_1.expect(key_response['recipient_keys'].some(function (element) { return element.signature === signature; })).to.equal(true);
                                    chai_1.expect(key_response['recipient_keys'].some(function (element) { return element.key === recipient_xpub1; })).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should MAKE USER 0 TRUST USER 2", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.trust(username0, username2, decryption_key01, signature)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, profile.find(username0)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusting'].some(function (element) { return element.username === username2; })).to.equal(true);
                                    return [4 /*yield*/, profile.find(username2)];
                                case 3:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusted_by'].some(function (element) { return element.username === username0; })).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should MAKE USER 1 MUTE USER 0", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.mute(username1, username0, true)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    return [4 /*yield*/, profile.find(username1)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusted_by'][0].username).to.equal(username0);
                                    chai_1.expect(response['trusted_by'][0].mute).to.equal(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should MAKE USER 1 UNMUTE USER 0", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, profile.mute(username1, username0, false)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    return [4 /*yield*/, profile.find(username1)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusted_by'][0].username).to.equal(username0);
                                    chai_1.expect(response['trusted_by'][0].mute).to.equal(false);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should MAKE USER 0 REVOKE TRUST IN USER 2", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var key_response, response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.find(username2)];
                                case 1:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response['profile_keys'].length).to.equal(1);
                                    return [4 /*yield*/, keys.find(username1)];
                                case 2:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response['profile_keys'].length).to.equal(1);
                                    return [4 /*yield*/, profile.revoke(username0, username2, new_key_set, derivation_scheme_after_revoke, cipher_info2)];
                                case 3:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.username).to.equal(username0);
                                    chai_1.expect(response['trusting'].length).to.equal(1);
                                    chai_1.expect(response['trusting'].some(function (element) { return element.username === username1; })).to.equal(true);
                                    chai_1.expect(response['trusting'].some(function (element) { return element.username === username2; })).to.equal(false);
                                    return [4 /*yield*/, profile.find(username2)];
                                case 4:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusted_by'].some(function (element) { return element.username === username0; })).to.equal(false);
                                    return [4 /*yield*/, profile.find(username1)];
                                case 5:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['trusted_by'].some(function (element) { return element.username === username0; })).to.equal(true);
                                    return [4 /*yield*/, keys.find(username2)];
                                case 6:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response['profile_keys'].length).to.equal(0);
                                    return [4 /*yield*/, keys.find(username1)];
                                case 7:
                                    key_response = _a.sent();
                                    if (key_response instanceof Error)
                                        throw key_response;
                                    chai_1.expect(key_response['profile_keys'].length).to.equal(1);
                                    chai_1.expect(key_response['profile_keys'].some(function (element) { return element.id === new_key_set[0].id; })).to.equal(true);
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
//# sourceMappingURL=profile.spec.js.map