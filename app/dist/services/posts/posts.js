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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LionBitPosts = void 0;
var e_1 = require("../../lib/errors/e");
var uid_1 = require("../../lib/uid/uid");
var keys_1 = require("../keys/keys");
var mongo_1 = require("./mongo");
var store = new mongo_1.MongoPostStore();
var keys = new keys_1.LionBitKeys();
var uuid = new uid_1.S5UID();
var LionBitPosts = /** @class */ (function () {
    function LionBitPosts() {
    }
    LionBitPosts.prototype.create = function (username, expiry, cipher_json, derivation_scheme, decryption_keys) {
        return __awaiter(this, void 0, void 0, function () {
            var post, created, valid_decryption_keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        post = {
                            id: uuid.createPostCode(),
                            username: username,
                            genesis: Date.now(),
                            expiry: expiry,
                            cipher_json: cipher_json,
                            derivation_scheme: derivation_scheme
                        };
                        return [4 /*yield*/, store.create(post)];
                    case 1:
                        created = _a.sent();
                        if (created instanceof Error)
                            return [2 /*return*/, created];
                        return [4 /*yield*/, keys.findMany(__spreadArray([], decryption_keys.map(function (key) { return key.id; })))];
                    case 2:
                        valid_decryption_keys = _a.sent();
                        if (valid_decryption_keys instanceof Error)
                            return [2 /*return*/, valid_decryption_keys];
                        if (valid_decryption_keys.length !== decryption_keys.length)
                            return [2 /*return*/, e_1.handleError({
                                    code: 400,
                                    message: "Decryption Keys contains invalid user"
                                })];
                        return [4 /*yield*/, decryption_keys.map(function (decryption_key) { return __awaiter(_this, void 0, void 0, function () {
                                var trusting_username, status;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            trusting_username = decryption_key.id;
                                            decryption_key.id = post.id;
                                            return [4 /*yield*/, keys.add_post_key(trusting_username, decryption_key)];
                                        case 1:
                                            status = _a.sent();
                                            if (status instanceof Error) {
                                                console.error("!!!ERROR: NOTIFY ADMIN!!!\nCOULD NOT UPDATE KEYS IN POST", status);
                                                return [2 /*return*/, status];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, post];
                }
            });
        });
    };
    LionBitPosts.prototype.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, store.read({ username: username })];
            });
        });
    };
    LionBitPosts.prototype.findMany = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, store.readMany(ids)];
            });
        });
    };
    LionBitPosts.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, store.remove(id)];
            });
        });
    };
    return LionBitPosts;
}());
exports.LionBitPosts = LionBitPosts;
//# sourceMappingURL=posts.js.map