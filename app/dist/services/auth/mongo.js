"use strict";
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
exports.test_create_admin = exports.MongoAuthStore = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var mongoose_1 = __importDefault(require("mongoose"));
var e_1 = require("../../lib/errors/e");
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var auth_schema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    seed256: {
        type: String,
        required: true,
        index: true,
    },
    pass256: {
        type: String,
        // unique: true, 
        required: true,
    },
    genesis: {
        type: Number,
        required: true,
    },
    uid: {
        type: String,
        unique: true,
        required: true,
    },
    invited_by: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    invite_codes: {
        type: Array,
        required: false,
    },
}, {
    strict: true
});
// ------------------ '(◣ ◢)' ---------------------
var authStore = mongoose_1.default.model("auth", auth_schema);
// ------------------ '(◣ ◢)' ---------------------
var MongoAuthStore = /** @class */ (function () {
    function MongoAuthStore() {
    }
    MongoAuthStore.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var unique, new_auth, doc, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, ensureUnique(user.username)];
                    case 1:
                        unique = _a.sent();
                        if (unique instanceof Error)
                            return [2 /*return*/, unique];
                        if (!unique) return [3 /*break*/, 3];
                        new_auth = new authStore(user);
                        return [4 /*yield*/, new_auth.save()];
                    case 2:
                        doc = _a.sent();
                        if (doc instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(doc)];
                        }
                        else {
                            return [2 /*return*/, user];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, e_1.handleError({ code: 409, message: "Auth Exists" })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_2)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.remove = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, authStore.deleteOne({ username: user.username })];
                    case 1:
                        status_1 = _a.sent();
                        if (status_1 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_1)];
                        }
                        // console.log({ status })
                        if (status_1.deletedCount >= 1)
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_3)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.read = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var query, doc, out, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = (user.username) ? { username: user.username } : { seed256: user.seed256 };
                        return [4 /*yield*/, authStore.findOne(query).exec()];
                    case 1:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            out = {
                                genesis: doc["genesis"],
                                uid: doc["uid"],
                                username: doc["username"],
                                pass256: doc["pass256"],
                                seed256: doc["seed256"],
                                verified: doc["verified"],
                                invited_by: doc["invited_by"],
                                invite_codes: doc["invite_codes"],
                                inviter_code: doc["inviter_code"]
                            };
                            return [2 /*return*/, out];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No auth entry"
                                })];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_4)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.readMany = function (usernames) {
        return __awaiter(this, void 0, void 0, function () {
            var docs, _a, auths, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        ;
                        if (!(usernames[0] === "all")) return [3 /*break*/, 2];
                        return [4 /*yield*/, authStore.find().exec()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, authStore.find({ username: { $in: usernames } }).exec()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        docs = _a;
                        if (docs) {
                            if (docs instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(docs)];
                            }
                            auths = docs.map(function (doc) {
                                return {
                                    genesis: doc["genesis"],
                                    uid: doc["uid"],
                                    username: doc["username"],
                                    pass256: doc["pass256"],
                                    seed256: doc["seed256"],
                                    verified: doc["verified"],
                                    invited_by: doc["invited_by"],
                                    invite_codes: doc["invite_codes"],
                                    inviter_code: doc["inviter_code"]
                                };
                            });
                            return [2 /*return*/, auths];
                        }
                        else {
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No profile entry"
                                })];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        e_5 = _b.sent();
                        return [2 /*return*/, e_1.handleError(e_5)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.update = function (query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var q, up, status_2, doc, out, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
                        up = { $set: update };
                        return [4 /*yield*/, authStore.updateOne(q, up)];
                    case 1:
                        status_2 = _a.sent();
                        if (!(status_2 instanceof mongoose_1.default.Error)) return [3 /*break*/, 2];
                        return [2 /*return*/, e_1.handleError(status_2)];
                    case 2: return [4 /*yield*/, authStore.findOne(q).exec()];
                    case 3:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            out = {
                                genesis: doc["genesis"],
                                uid: doc["uid"],
                                username: doc["username"],
                                pass256: doc["pass256"],
                                seed256: doc["seed256"],
                                verified: doc["verified"],
                                invited_by: doc["invited_by"],
                                invite_codes: doc["invite_codes"]
                            };
                            return [2 /*return*/, out];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No auth entry"
                                })];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_6 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_6)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.update_push = function (query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var q, up, status_3, doc, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
                        up = { $push: { invite_codes: update } };
                        return [4 /*yield*/, authStore.updateOne(q, up)];
                    case 1:
                        status_3 = _a.sent();
                        if (!(status_3 instanceof mongoose_1.default.Error)) return [3 /*break*/, 2];
                        return [2 /*return*/, e_1.handleError(status_3)];
                    case 2: return [4 /*yield*/, authStore.findOne(q).exec()];
                    case 3:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            return [2 /*return*/, true];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No auth entry"
                                })];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_7 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_7)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoAuthStore.prototype.update_pull = function (query, update) {
        return __awaiter(this, void 0, void 0, function () {
            var q, up, status_4, doc, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        q = (query.username) ? { username: query.username } : { seed256: query.seed256 };
                        up = { $pull: { invite_codes: update } };
                        return [4 /*yield*/, authStore.updateOne(q, up)];
                    case 1:
                        status_4 = _a.sent();
                        if (!(status_4 instanceof mongoose_1.default.Error)) return [3 /*break*/, 2];
                        return [2 /*return*/, e_1.handleError(status_4)];
                    case 2: return [4 /*yield*/, authStore.findOne(q).exec()];
                    case 3:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            return [2 /*return*/, true];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No auth entry"
                                })];
                        }
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_8 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_8)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return MongoAuthStore;
}());
exports.MongoAuthStore = MongoAuthStore;
function ensureUnique(username) {
    return __awaiter(this, void 0, void 0, function () {
        var doc, err, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, authStore.findOne({ username: username }).exec()];
                case 1:
                    doc = _a.sent();
                    if (doc === null)
                        return [2 /*return*/, true];
                    if (doc) {
                        err = doc.validateSync();
                        if (err instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(err)];
                        }
                        return [2 /*return*/, e_1.handleError({
                                code: 409,
                                message: "Username Exists"
                            })];
                    }
                    else
                        return [2 /*return*/, true];
                    return [3 /*break*/, 3];
                case 2:
                    e_9 = _a.sent();
                    return [2 /*return*/, e_1.handleError(e_9)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function test_create_admin() {
    return __awaiter(this, void 0, void 0, function () {
        var admin_user, new_auth, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    admin_user = {
                        username: "ravi",
                        pass256: "f45691f7b6726de2d5aba5732a7252d72078d9f2180a953c1a7daffdfd37bc86",
                        seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
                        genesis: Date.now(),
                        uid: "s5idAdmin",
                        invited_by: "satoshi",
                        verified: true,
                        invite_codes: ["t780opsd"]
                    };
                    new_auth = new authStore(admin_user);
                    return [4 /*yield*/, new_auth.save()];
                case 1:
                    doc = _a.sent();
                    if (doc instanceof mongoose_1.default.Error) {
                        return [2 /*return*/, e_1.handleError(doc)];
                    }
                    else {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.test_create_admin = test_create_admin;
// ------------------ '(◣ ◢)' ---------------------
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=mongo.js.map