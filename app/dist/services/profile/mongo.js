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
exports.MongoProfileStore = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var mongoose_1 = __importDefault(require("mongoose"));
var e_1 = require("../../lib/errors/e");
var interface_1 = require("./interface");
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var profile_schema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    nickname: {
        type: String,
    },
    status: {
        type: String,
    },
    cipher_info: {
        type: String,
    },
    derivation_scheme: {
        type: String,
    },
    trusted_by: {
        type: Array,
    },
    trusting: {
        type: Array,
    },
}, {
    strict: true
});
// ------------------ '(◣ ◢)' ---------------------
var profileStore = mongoose_1.default.model("profile", profile_schema);
// ------------------ '(◣ ◢)' ---------------------
var MongoProfileStore = /** @class */ (function () {
    function MongoProfileStore() {
    }
    MongoProfileStore.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var unique, new_profile, doc, e_2;
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
                        new_profile = new profileStore(user);
                        return [4 /*yield*/, new_profile.save()];
                    case 2:
                        doc = _a.sent();
                        if (doc instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(doc)];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, e_1.handleError({ code: 409, message: "Profile Exists" })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_2)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoProfileStore.prototype.remove = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, profileStore.deleteOne({ username: username })];
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
    MongoProfileStore.prototype.read = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, out, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ;
                        return [4 /*yield*/, profileStore.findOne({ username: username }).exec()];
                    case 1:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            out = {
                                username: doc["username"],
                                nickname: doc["nickname"],
                                status: doc["status"],
                                cipher_info: doc["cipher_info"],
                                derivation_scheme: doc["derivation_scheme"],
                                trusted_by: (doc["trusted_by"]) ? doc["trusted_by"] : [],
                                trusting: (doc["trusting"]) ? doc["trusting"] : [],
                            };
                            return [2 /*return*/, out];
                        }
                        else {
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No profile entry"
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
    MongoProfileStore.prototype.readMany = function (usernames) {
        return __awaiter(this, void 0, void 0, function () {
            var docs, _a, profiles, e_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        if (!(usernames[0] === "all")) return [3 /*break*/, 2];
                        return [4 /*yield*/, profileStore.find().exec()];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, profileStore.find({ username: { $in: usernames } }).exec()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        docs = _a;
                        if (docs) {
                            if (docs instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(docs)];
                            }
                            profiles = docs.map(function (doc) {
                                return {
                                    username: doc["username"],
                                    nickname: doc["nickname"],
                                    status: doc["status"],
                                    cipher_info: doc["cipher_info"],
                                    derivation_scheme: doc["derivation_scheme"],
                                    trusted_by: (doc["trusted_by"]) ? doc["trusted_by"] : [],
                                    trusting: (doc["trusting"]) ? doc["trusting"] : [],
                                };
                            });
                            return [2 /*return*/, profiles];
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
    MongoProfileStore.prototype.update = function (username, update) {
        return __awaiter(this, void 0, void 0, function () {
            var up, status_2, doc, out, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        up = { $set: update };
                        return [4 /*yield*/, profileStore.updateOne({ username: username }, up)];
                    case 1:
                        status_2 = _a.sent();
                        if (!(status_2 instanceof mongoose_1.default.Error)) return [3 /*break*/, 2];
                        return [2 /*return*/, e_1.handleError(status_2)];
                    case 2: return [4 /*yield*/, profileStore.findOne({ username: username }).exec()];
                    case 3:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            out = {
                                username: doc["username"],
                                nickname: doc["nickname"],
                                status: doc["status"],
                                cipher_info: doc["cipher_info"],
                                derivation_scheme: doc["derivation_scheme"],
                                trusted_by: (doc["trusted_by"]) ? doc["trusted_by"] : [],
                                trusting: (doc["trusting"]) ? doc["trusting"] : [],
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
    MongoProfileStore.prototype.update_push = function (username, trust_direction, update) {
        return __awaiter(this, void 0, void 0, function () {
            var up, status_3, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        up = void 0;
                        switch (trust_direction) {
                            case interface_1.TrustDirection.Trusting:
                                up = { $push: { trusting: update } };
                                break;
                            case interface_1.TrustDirection.TrustedBy:
                                up = { $push: { trusted_by: update } };
                                break;
                            default:
                                return [2 /*return*/, e_1.handleError({
                                        code: 400,
                                        message: "Invalid usecase. Use Trusting or TrustedBy"
                                    })];
                        }
                        return [4 /*yield*/, profileStore.updateOne({ username: username }, up)];
                    case 1:
                        status_3 = _a.sent();
                        if (status_3 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_3)];
                        }
                        // console.log({update_push_status: status});
                        return [2 /*return*/, (status_3.modifiedCount === 1) ? status_3.acknowledged : false];
                    case 2:
                        e_7 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoProfileStore.prototype.update_pull = function (username, trust_direction, update) {
        return __awaiter(this, void 0, void 0, function () {
            var up, status_4, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        up = void 0;
                        switch (trust_direction) {
                            case interface_1.TrustDirection.Trusting:
                                up = { $pull: { trusting: { username: update.username } } };
                                break;
                            case interface_1.TrustDirection.TrustedBy:
                                up = { $pull: { trusted_by: { username: update.username } } };
                                break;
                            default:
                                return [2 /*return*/, e_1.handleError({
                                        code: 400,
                                        message: "Invalid usecase. Use Trusting or TrustedBy"
                                    })];
                        }
                        return [4 /*yield*/, profileStore.updateOne({ username: username }, up)];
                    case 1:
                        status_4 = _a.sent();
                        if (status_4 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_4)];
                        }
                        if (status_4 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_4)];
                        }
                        // console.log({update_pull_status: status});
                        return [2 /*return*/, (status_4.modifiedCount === 1) ? status_4.acknowledged : false];
                    case 2:
                        e_8 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_8)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MongoProfileStore;
}());
exports.MongoProfileStore = MongoProfileStore;
function ensureUnique(username) {
    return __awaiter(this, void 0, void 0, function () {
        var doc, err, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, profileStore.findOne({ username: username }).exec()];
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
// export async function test_create_admin(){
//   const admin_user: UserProfile = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };
//   const new_auth = new profileStore(admin_user);
//   const doc = await new_auth.save();
//   if (doc instanceof mongoose.Error) {
//     return handleError(doc);
//   } else {
//     return true;
//   }
// }
// ------------------ '(◣ ◢)' ---------------------
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=mongo.js.map