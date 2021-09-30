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
exports.MongoKeyStore = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var mongoose_1 = __importDefault(require("mongoose"));
var e_1 = require("../../lib/errors/e");
var interface_1 = require("./interface");
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var keys_schema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },
    recipient_xpub: {
        type: String,
        required: true,
    },
    recipient_keys: {
        type: Array,
    },
    profile_keys: {
        type: Array,
    },
    post_keys: {
        type: Array,
    },
}, {
    strict: true
});
// ------------------ '(◣ ◢)' ---------------------
var keyStore = mongoose_1.default.model("keys", keys_schema);
// ------------------ '(◣ ◢)' ---------------------
var MongoKeyStore = /** @class */ (function () {
    function MongoKeyStore() {
    }
    MongoKeyStore.prototype.create = function (user) {
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
                        new_auth = new keyStore(user);
                        return [4 /*yield*/, new_auth.save()];
                    case 2:
                        doc = _a.sent();
                        if (doc instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(doc)];
                        }
                        else {
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, e_1.handleError({ code: 409, message: "Keys Exists" })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_2)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoKeyStore.prototype.remove = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, keyStore.deleteOne({ username: username })];
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
    MongoKeyStore.prototype.read = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var doc, out, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ;
                        return [4 /*yield*/, keyStore.findOne({ username: username }).exec()];
                    case 1:
                        doc = _a.sent();
                        if (doc) {
                            if (doc instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(doc)];
                            }
                            out = {
                                username: doc["username"],
                                recipient_xpub: doc["recipient_xpub"],
                                recipient_keys: (doc["recipient_keys"]) ? doc["recipient_keys"] : [],
                                profile_keys: (doc["profile_keys"]) ? doc["profile_keys"] : [],
                                post_keys: (doc["post_keys"]) ? doc["post_keys"] : [],
                            };
                            return [2 /*return*/, out];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No keys entry"
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
    MongoKeyStore.prototype.readMany = function (usernames) {
        return __awaiter(this, void 0, void 0, function () {
            var docs, keys, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ;
                        return [4 /*yield*/, keyStore.find({ username: { $in: usernames } }).exec()];
                    case 1:
                        docs = _a.sent();
                        if (docs) {
                            if (docs instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(docs)];
                            }
                            keys = docs.map(function (doc) {
                                return {
                                    username: doc["username"],
                                    recipient_xpub: doc["recipient_xpub"],
                                    recipient_keys: (doc["recipient_keys"]) ? doc["recipient_keys"] : [],
                                    profile_keys: (doc["profile_keys"]) ? doc["profile_keys"] : [],
                                    post_keys: (doc["post_keys"]) ? doc["post_keys"] : [],
                                };
                            });
                            return [2 /*return*/, keys];
                        }
                        else {
                            // no data from findOne
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No keys entry"
                                })];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_5)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // async update(username: string, update:UserKeys): Promise<UserKeys | Error> {
    //   try {
    //     const up = { $set: update };
    //     const status = await keyStore.updateOne({username}, up)
    //     if (status instanceof mongoose.Error) {
    //       return handleError(status);
    //     }
    //     else {
    //       const doc = await keyStore.findOne({username}).exec();
    //       if (doc) {
    //         if (doc instanceof mongoose.Error) {
    //           return handleError(doc);
    //         }
    //         const out: UserKeys = {
    //           username: doc["username"],
    //           profile_keys: doc["profile_keys"],
    //           post_keys: doc["post_keys"],
    //           recipient_xpub: doc["recipient_xpub"],
    //         };
    //         return out;
    //     }else {
    //       // no data from findOne
    //       return handleError({
    //         code: 404,
    //         message: `No auth entry`
    //       });
    //     }
    //   }
    //   } catch (e) {
    //     return handleError(e);
    //   }
    // }
    MongoKeyStore.prototype.update_push = function (username, usecase, update) {
        return __awaiter(this, void 0, void 0, function () {
            var up, status_2, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        up = void 0;
                        switch (usecase) {
                            case interface_1.UseCase.Post:
                                up = { $push: { post_keys: update } };
                                break;
                            case interface_1.UseCase.Profile:
                                up = { $push: { profile_keys: update } };
                                break;
                            case interface_1.UseCase.Recipient:
                                up = { $push: { recipient_keys: update } };
                                break;
                            default:
                                return [2 /*return*/, e_1.handleError({
                                        code: 400,
                                        message: "Invalid usecase. Use Recipient,Profile or Post"
                                    })];
                        }
                        return [4 /*yield*/, keyStore.updateOne({ username: username }, up)];
                    case 1:
                        status_2 = _a.sent();
                        if (status_2 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_2)];
                        }
                        // console.log({update_push_status: status});
                        return [2 /*return*/, (status_2.modifiedCount === 1) ? status_2.acknowledged : false];
                    case 2:
                        e_6 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_6)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoKeyStore.prototype.update_pull = function (username, usecase, update) {
        return __awaiter(this, void 0, void 0, function () {
            var up, status_3, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        up = void 0;
                        switch (usecase) {
                            case interface_1.UseCase.Post:
                                up = { $pull: { post_keys: { id: update.id } } };
                                break;
                            case interface_1.UseCase.Profile:
                                up = { $pull: { profile_keys: { id: update.id } } };
                                break;
                            case interface_1.UseCase.Recipient:
                                up = { $pull: { recipient_keys: update } };
                                break;
                            default:
                                return [2 /*return*/, e_1.handleError({
                                        code: 400,
                                        message: "Invalid usecase. Use Post or Profile"
                                    })];
                        }
                        return [4 /*yield*/, keyStore.updateOne({ username: username }, up)];
                    case 1:
                        status_3 = _a.sent();
                        if (status_3 instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(status_3)];
                        }
                        // console.log({update_pull_status: status});
                        return [2 /*return*/, (status_3.modifiedCount === 1) ? status_3.acknowledged : false];
                    case 2:
                        e_7 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_7)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return MongoKeyStore;
}());
exports.MongoKeyStore = MongoKeyStore;
function ensureUnique(username) {
    return __awaiter(this, void 0, void 0, function () {
        var doc, err, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, keyStore.findOne({ username: username }).exec()];
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
                    e_8 = _a.sent();
                    return [2 /*return*/, e_1.handleError(e_8)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// export async function test_create_admin(){
//   const admin_user: UserKeys = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };
//   const new_auth = new keyStore(admin_user);
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