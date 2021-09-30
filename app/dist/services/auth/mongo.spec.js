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
var mongo_2 = require("./mongo");
var sinon = require("sinon");
var rsa_filename = "sats_sig";
var store = new mongo_2.MongoAuthStore();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username = "ishi";
var password = "mysecret";
var pass256 = "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0";
var new_password = "mynewsecret";
var new_pass256 = "6ccabd5d1defd8e78f7c0b768a27cc7ae4caab5f8e62ec3b35ab48b1f8f69908";
var seed = "eye busy fence satisfy garage senior traffic city ivory joy tent napkin supreme diamond ring cloud utility knock satisfy broom add canvas swim naive";
var seed256 = "a7238fdd7584a8612f8a494dcdeb525af77813a47dead83a73318a4ae2fc28e6";
var invite_code = "uyu7i8bhs";
var user_auth = {
    username: username,
    genesis: Date.now(),
    uid: "s5idSOMEID",
    pass256: pass256,
    seed256: seed256,
    invited_by: "ravi",
    inviter_code: invite_code
};
var user_auth_update = {
    username: username,
    pass256: new_pass256,
    seed256: seed256
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Auth Storage", function () {
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
                        return [4 /*yield*/, mongo_2.test_create_admin()];
                    case 2:
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
                    case 0: return [4 /*yield*/, store.remove(user_auth)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, store.remove({ username: "ravi" })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("AUTH STORAGE OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should CREATE a new user entry in mongo AND READ user from mongo", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.create(user_auth)];
                                case 1:
                                    response = _a.sent();
                                    chai_1.expect(response).to.have.property("uid");
                                    return [4 /*yield*/, store.read(user_auth)];
                                case 2:
                                    user = _a.sent();
                                    chai_1.expect(user['username']).to.equal(response['username']);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should UPDATE a user pass256 entry in mongo using seed256", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.update(user_auth, user_auth_update)];
                                case 1:
                                    response = _a.sent();
                                    chai_1.expect(response['pass256']).to.equal(new_pass256);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should PUSH & PULL a user invite_code array with an invite_code", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var push_response, user, pull_response, _user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.update_push(user_auth, invite_code)];
                                case 1:
                                    push_response = _a.sent();
                                    chai_1.expect(push_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_auth)];
                                case 2:
                                    user = _a.sent();
                                    chai_1.expect(user['invite_codes'].includes(invite_code)).to.equal(true);
                                    return [4 /*yield*/, store.update_pull(user_auth, invite_code)];
                                case 3:
                                    pull_response = _a.sent();
                                    chai_1.expect(pull_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_auth)];
                                case 4:
                                    _user = _a.sent();
                                    chai_1.expect(_user['invite_codes'].includes(invite_code)).to.equal(false);
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
//# sourceMappingURL=mongo.spec.js.map