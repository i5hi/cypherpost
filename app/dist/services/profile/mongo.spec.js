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
var interface_1 = require("./interface");
var mongo_2 = require("./mongo");
var store = new mongo_2.MongoProfileStore();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username = "ishi";
var nickname = "Bitcoin Watchdog";
var status = "Sound Money, Sound World.";
var contact_info = "Contact me on telegram @i5hi_ or Signal: +97283782733";
var updated_contact_info = "Contact me on telegram @i5hi_ ONLY";
var user_profile = {
    username: username,
    nickname: nickname,
    status: status,
    cipher_info: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
    derivation_scheme: "m/0h/0h",
    trusted_by: [],
    trusting: [],
};
var update = {
    nickname: "UV Bitcoin Watchdog"
};
var trusted_by = {
    username: "ravi",
    mute: false
};
var trusting = {
    username: "mj"
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Profile Storage", function () {
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
                    case 0: return [4 /*yield*/, store.remove(user_profile.username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("PROFILE STORAGE OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should CREATE a NEW PROFILE in mongo AND READ PROFILE from mongo", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, user, users;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.create(user_profile)];
                                case 1:
                                    response = _a.sent();
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_profile.username)];
                                case 2:
                                    user = _a.sent();
                                    if (user instanceof Error)
                                        throw user;
                                    chai_1.expect(user['nickname']).to.equal(user_profile.nickname);
                                    chai_1.expect(user['status']).to.equal(user_profile.status);
                                    chai_1.expect(user['cipher_info']).to.equal(user_profile.cipher_info);
                                    return [4 /*yield*/, store.readMany([user_profile.username])];
                                case 3:
                                    users = _a.sent();
                                    if (users instanceof Error)
                                        throw users;
                                    chai_1.expect(users.length).to.equal(1);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should UPDATE a PROFILE in mongo AND READ UPDATED PROFILE from mongo", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.update(username, update)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response['nickname']).to.equal(update.nickname);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should PUSH & PULL a USER SET to TRUSTING ARRAY", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var push_response, user, pull_response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.update_push(user_profile.username, interface_1.TrustDirection.Trusting, trusting)];
                                case 1:
                                    push_response = _a.sent();
                                    chai_1.expect(push_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_profile.username)];
                                case 2:
                                    user = _a.sent();
                                    chai_1.expect(user['trusting'].length).to.equal(1);
                                    return [4 /*yield*/, store.update_pull(user_profile.username, interface_1.TrustDirection.Trusting, trusting)];
                                case 3:
                                    pull_response = _a.sent();
                                    chai_1.expect(pull_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_profile.username)];
                                case 4:
                                    user = _a.sent();
                                    chai_1.expect(user['trusting'].length).to.equal(0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should PUSH & PULL a USER SET to TRUSTED_BY ARRAY", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var push_response, user, pull_response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.update_push(user_profile.username, interface_1.TrustDirection.TrustedBy, trusted_by)];
                                case 1:
                                    push_response = _a.sent();
                                    chai_1.expect(push_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_profile.username)];
                                case 2:
                                    user = _a.sent();
                                    chai_1.expect(user['trusted_by'].length).to.equal(1);
                                    return [4 /*yield*/, store.update_pull(user_profile.username, interface_1.TrustDirection.TrustedBy, trusted_by)];
                                case 3:
                                    pull_response = _a.sent();
                                    chai_1.expect(pull_response).to.equal(true);
                                    return [4 /*yield*/, store.read(user_profile.username)];
                                case 4:
                                    user = _a.sent();
                                    chai_1.expect(user['trusted_by'].length).to.equal(0);
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