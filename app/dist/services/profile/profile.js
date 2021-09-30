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
exports.LionBitProfile = void 0;
var e_1 = require("../../lib/errors/e");
var keys_1 = require("../keys/keys");
var interface_1 = require("./interface");
var mongo_1 = require("./mongo");
var keys = new keys_1.LionBitKeys();
var store = new mongo_1.MongoProfileStore();
var LionBitProfile = /** @class */ (function () {
    function LionBitProfile() {
    }
    LionBitProfile.prototype.genesis = function (username, derivation_scheme, recipient_xpub) {
        return __awaiter(this, void 0, void 0, function () {
            var profile_status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.create({
                            username: username,
                            derivation_scheme: derivation_scheme,
                            trusted_by: [],
                            trusting: []
                        })];
                    case 1:
                        profile_status = _a.sent();
                        if (profile_status instanceof Error)
                            return [2 /*return*/, profile_status];
                        return [4 /*yield*/, keys.init(username, recipient_xpub)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LionBitProfile.prototype.find = function (username) {
        return store.read(username);
    };
    LionBitProfile.prototype.findMany = function (usernames) {
        return store.readMany(usernames);
    };
    LionBitProfile.prototype.update = function (username, update) {
        return store.update(username, update);
    };
    LionBitProfile.prototype.trust = function (username, trusting, decryption_key, signature) {
        return __awaiter(this, void 0, void 0, function () {
            var self_profile, trusting_users, self_profile_update, other_profile_update, other_keys, self_key_update, other_key_update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read(username)];
                    case 1:
                        self_profile = _a.sent();
                        if (self_profile instanceof Error)
                            throw self_profile;
                        trusting_users = self_profile.trusting.map(function (user) { return user.username; });
                        if (trusting_users.includes(trusting)) {
                            return [2 /*return*/, e_1.handleError({
                                    code: 409,
                                    message: "Already trusting."
                                })];
                        }
                        return [4 /*yield*/, store.update_push(username, interface_1.TrustDirection.Trusting, {
                                username: trusting
                            })];
                    case 2:
                        self_profile_update = _a.sent();
                        if (self_profile_update instanceof Error)
                            return [2 /*return*/, self_profile_update];
                        return [4 /*yield*/, store.update_push(trusting, interface_1.TrustDirection.TrustedBy, {
                                username: username,
                                mute: false
                            })];
                    case 3:
                        other_profile_update = _a.sent();
                        if (other_profile_update instanceof Error)
                            return [2 /*return*/, other_profile_update];
                        return [4 /*yield*/, keys.find(trusting)];
                    case 4:
                        other_keys = _a.sent();
                        if (other_keys instanceof Error)
                            return [2 /*return*/, other_keys];
                        return [4 /*yield*/, keys.add_recipient_key(username, { key: other_keys.recipient_xpub, id: other_keys.username, signature: signature })];
                    case 5:
                        self_key_update = _a.sent();
                        if (self_key_update instanceof Error)
                            return [2 /*return*/, self_key_update];
                        return [4 /*yield*/, keys.add_profile_key(trusting, { key: decryption_key, id: username })];
                    case 6:
                        other_key_update = _a.sent();
                        if (other_key_update instanceof Error)
                            return [2 /*return*/, other_key_update];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LionBitProfile.prototype.revoke = function (username, revoking, decryption_keys, derivation_scheme, cipher_info) {
        return __awaiter(this, void 0, void 0, function () {
            var self_profile, self_profile_update, self_profile_trusting_update, other_profile_update, revoke_key_status, updated_self_profile;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read(username)];
                    case 1:
                        self_profile = _a.sent();
                        if (self_profile instanceof Error)
                            return [2 /*return*/, self_profile];
                        if (!self_profile.trusting.some(function (element) { return element.username === revoking; })) return [3 /*break*/, 7];
                        return [4 /*yield*/, store.update(username, { cipher_info: cipher_info, derivation_scheme: derivation_scheme })];
                    case 2:
                        self_profile_update = _a.sent();
                        if (self_profile_update instanceof Error)
                            return [2 /*return*/, self_profile_update];
                        return [4 /*yield*/, store.update_pull(username, interface_1.TrustDirection.Trusting, {
                                username: revoking
                            })];
                    case 3:
                        self_profile_trusting_update = _a.sent();
                        if (self_profile_trusting_update instanceof Error)
                            return [2 /*return*/, self_profile_trusting_update];
                        return [4 /*yield*/, store.update_pull(revoking, interface_1.TrustDirection.TrustedBy, {
                                username: username
                            })];
                    case 4:
                        other_profile_update = _a.sent();
                        if (other_profile_update instanceof Error)
                            return [2 /*return*/, other_profile_update];
                        return [4 /*yield*/, keys.remove_profile_key(revoking, username)];
                    case 5:
                        revoke_key_status = _a.sent();
                        if (revoke_key_status instanceof Error)
                            return [2 /*return*/, revoke_key_status];
                        // update others
                        decryption_keys.map(function (decryption_key) { return __awaiter(_this, void 0, void 0, function () {
                            var status;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, keys.remove_profile_key(decryption_key.id, username)];
                                    case 1:
                                        status = _a.sent();
                                        if (status instanceof Error)
                                            return [2 /*return*/, status];
                                        return [4 /*yield*/, keys.add_profile_key(decryption_key.id, decryption_key)];
                                    case 2:
                                        // add new keys
                                        status = _a.sent();
                                        if (status instanceof Error)
                                            return [2 /*return*/, status];
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, store.update(username, { derivation_scheme: derivation_scheme })];
                    case 6:
                        updated_self_profile = _a.sent();
                        if (updated_self_profile instanceof Error)
                            return [2 /*return*/, updated_self_profile];
                        return [2 /*return*/, updated_self_profile];
                    case 7: return [2 /*return*/, e_1.handleError({
                            code: 400,
                            message: "Cannot revoke a user you are not already trusting."
                        })];
                }
            });
        });
    };
    LionBitProfile.prototype.mute = function (username, trusted_by, toggle) {
        return __awaiter(this, void 0, void 0, function () {
            var pulled, pushed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.update_pull(username, interface_1.TrustDirection.TrustedBy, { username: trusted_by })];
                    case 1:
                        pulled = _a.sent();
                        if (pulled instanceof Error)
                            return [2 /*return*/, pulled];
                        return [4 /*yield*/, store.update_push(username, interface_1.TrustDirection.TrustedBy, { username: trusted_by, mute: toggle })];
                    case 2:
                        pushed = _a.sent();
                        if (pushed instanceof Error)
                            return [2 /*return*/, pushed];
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LionBitProfile.prototype.remove = function (username) {
        return store.remove(username);
    };
    return LionBitProfile;
}());
exports.LionBitProfile = LionBitProfile;
;
//# sourceMappingURL=profile.js.map