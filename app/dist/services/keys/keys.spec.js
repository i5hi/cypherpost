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
var keys_1 = require("./keys");
var mongo_2 = require("./mongo");
var sinon = require("sinon");
var rsa_filename = "sats_sig";
var keys = new keys_1.LionBitKeys();
var store = new mongo_2.MongoKeyStore();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username = "i5hi";
var recipient_xpub = "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5";
var recipient_key = {
    key: "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5",
    id: "s5id8jkdu9oij",
    signature: "+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/"
};
var profile_key = {
    key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
    id: "s5id8oiu23fsljh"
};
var post_key = {
    key: "14e8d62ede0506a61d87a18b842b77b0:+LXi9HaE2Ep4HVeLv6OPfHW0KPdDxhtUhz5DFmf+2QnjsVKm/d07oxHuNcQ6uZwo7/UHZCfg0CpH7Ob0SGfwOsSKYbryP6LeRBl7Aa/w0UmJ8D9z1GBsI3gFFWb58tOGpQW7DGizCPaR0IQ2lnBjjw==",
    id: "s5id08uoijlk897u8u"
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Keys Controller", function () {
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
                    case 0: return [4 /*yield*/, keys.remove(username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("KEYS CONTROLLER OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should INITIALIZE a key collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.init(username, recipient_xpub)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND a key collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.find(username)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(0);
                                    chai_1.expect(response['profile_keys'].length).equals(0);
                                    chai_1.expect(response['post_keys'].length).equals(0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should FIND MANY key collections", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.findMany([username])];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response.length).equals(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should ADD a PROFILE KEY to the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.add_recipient_key(username, recipient_key)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(1);
                                    chai_1.expect(response['profile_keys'].length).equals(0);
                                    chai_1.expect(response['post_keys'].length).equals(0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should ADD a PROFILE KEY to the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.add_profile_key(username, profile_key)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(1);
                                    chai_1.expect(response['profile_keys'].length).equals(1);
                                    chai_1.expect(response['post_keys'].length).equals(0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should ADD a POST KEY to the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.add_post_key(username, post_key)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(1);
                                    chai_1.expect(response['profile_keys'].length).equals(1);
                                    chai_1.expect(response['post_keys'].length).equals(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should REMOVE a RECIPIENT KEY from the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.remove_recipient_key(username, recipient_key.id)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(0);
                                    chai_1.expect(response['profile_keys'].length).equals(1);
                                    chai_1.expect(response['post_keys'].length).equals(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should REMOVE a PROFILE KEY to the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.remove_profile_key(username, profile_key.id)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['recipient_keys'].length).equals(0);
                                    chai_1.expect(response['profile_keys'].length).equals(0);
                                    chai_1.expect(response['post_keys'].length).equals(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should REMOVE a POST KEY to the collection", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, keys.remove_post_key(username, post_key.id)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).equals(true);
                                    return [4 /*yield*/, keys.find(username)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['username']).equals(username);
                                    chai_1.expect(response['recipient_xpub']).equals(recipient_xpub);
                                    chai_1.expect(response['profile_keys'].length).equals(0);
                                    chai_1.expect(response['post_keys'].length).equals(0);
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
//# sourceMappingURL=keys.spec.js.map