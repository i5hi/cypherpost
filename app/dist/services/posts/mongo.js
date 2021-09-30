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
exports.MongoPostStore = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var mongoose_1 = __importDefault(require("mongoose"));
var e_1 = require("../../lib/errors/e");
// ---------------- ┌∩┐(◣_◢)┌∩┐ -----------------
var post_schema = new mongoose_1.default.Schema({
    genesis: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    cipher_json: {
        type: String,
    },
    derivation_scheme: {
        type: String,
    },
}, {
    strict: true
});
// ------------------ '(◣ ◢)' ---------------------
var postStore = mongoose_1.default.model("posts", post_schema);
// ------------------ '(◣ ◢)' ---------------------
var MongoPostStore = /** @class */ (function () {
    function MongoPostStore() {
    }
    MongoPostStore.prototype.create = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var unique, new_post, doc, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, ensureUnique(post.id)];
                    case 1:
                        unique = _a.sent();
                        if (unique instanceof Error)
                            return [2 /*return*/, unique];
                        if (!unique) return [3 /*break*/, 3];
                        new_post = new postStore(post);
                        return [4 /*yield*/, new_post.save()];
                    case 2:
                        doc = _a.sent();
                        if (doc instanceof mongoose_1.default.Error) {
                            return [2 /*return*/, e_1.handleError(doc)];
                        }
                        else {
                            return [2 /*return*/, post];
                        }
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, e_1.handleError({ code: 409, message: "Post Exists" })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, e_1.handleError(e_2)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MongoPostStore.prototype.remove = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var status_1, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, postStore.deleteOne({ id: id })];
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
    MongoPostStore.prototype.read = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var query, docs, posts, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = (post.id) ? { id: post.id } : { username: post.username };
                        return [4 /*yield*/, postStore.find(query).exec()];
                    case 1:
                        docs = _a.sent();
                        if (docs) {
                            if (docs instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(docs)];
                            }
                            posts = docs.map(function (doc) {
                                return {
                                    username: doc["username"],
                                    id: doc["id"],
                                    genesis: doc["genesis"],
                                    expiry: doc["expiry"],
                                    cipher_json: doc["cipher_json"],
                                    derivation_scheme: doc["derivation_scheme"],
                                };
                            });
                            return [2 /*return*/, posts];
                        }
                        else {
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No post entry"
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
    MongoPostStore.prototype.readMany = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var docs, posts, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        ;
                        return [4 /*yield*/, postStore.find({ id: { $in: ids } }).exec()];
                    case 1:
                        docs = _a.sent();
                        if (docs) {
                            if (docs instanceof mongoose_1.default.Error) {
                                return [2 /*return*/, e_1.handleError(docs)];
                            }
                            posts = docs.map(function (doc) {
                                return {
                                    username: doc["username"],
                                    id: doc["id"],
                                    genesis: doc["genesis"],
                                    expiry: doc["expiry"],
                                    cipher_json: doc["cipher_json"],
                                    derivation_scheme: doc["derivation_scheme"],
                                };
                            });
                            return [2 /*return*/, posts];
                        }
                        else {
                            return [2 /*return*/, e_1.handleError({
                                    code: 404,
                                    message: "No profile entry"
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
    return MongoPostStore;
}());
exports.MongoPostStore = MongoPostStore;
function ensureUnique(username) {
    return __awaiter(this, void 0, void 0, function () {
        var doc, err, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, postStore.findOne({ username: username }).exec()];
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
                    e_6 = _a.sent();
                    return [2 /*return*/, e_1.handleError(e_6)];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// export async function test_create_admin(){
//   const admin_user: UserPost = {
//     username: "ravi",
//     pass256: "f75778f7425be4db0369d09af37a6c2b9a83dea0e53e7bd57412e4b060e607f7",
//     seed256: "652c7dc687d98c9889304ed2e408c74b611e86a40caa51c4b43f1dd5913c5cd0",
//     genesis: Date.now(),
//     uid: "s5idAdmin",
//     invited_by: "satoshi",
//     verified: true,
//     invite_codes: ["t780opsd"]
//   };
//   const new_auth = new postStore(admin_user);
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