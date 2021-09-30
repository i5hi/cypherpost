"use strict";
/*
cypherpost.io
Developed @ Stackmate India
*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.LionBitAuth = void 0;
var crypto = __importStar(require("crypto"));
var e_1 = require("../../lib/errors/e");
var jwt = __importStar(require("../../lib/jwt/jwt"));
var uid_1 = require("../../lib/uid/uid");
var mongo_1 = require("./mongo");
var uid = new uid_1.S5UID();
var local_jwt = new jwt.S5LocalJWT();
var store = new mongo_1.MongoAuthStore();
var ONE_HOUR = 60 * 60 * 1000;
var LionBitAuth = /** @class */ (function () {
    function LionBitAuth() {
    }
    LionBitAuth.prototype.check_invite = function (invited_by, invite_code) {
        return __awaiter(this, void 0, void 0, function () {
            var inviter;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ username: invited_by })];
                    case 1:
                        inviter = _a.sent();
                        if (inviter instanceof Error)
                            return [2 /*return*/, inviter];
                        if (inviter.invite_codes.includes(invite_code))
                            return [2 /*return*/, true];
                        else
                            return [2 /*return*/, false];
                        return [2 /*return*/];
                }
            });
        });
    };
    LionBitAuth.prototype.register = function (username, pass256, seed256, invited_by, invite_code) {
        return __awaiter(this, void 0, void 0, function () {
            var inviter, new_user, user, updated_inviter, jwt_payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ username: invited_by })];
                    case 1:
                        inviter = _a.sent();
                        if (inviter instanceof Error) {
                            if (inviter['name'] === "404") {
                                return [2 /*return*/, e_1.handleError({
                                        code: 404,
                                        message: "Inviter does not exist."
                                    })];
                            }
                            else
                                return [2 /*return*/, inviter];
                        }
                        if (!inviter.verified)
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Inviter is not verified."
                                })];
                        if (!inviter.invite_codes.includes(invite_code))
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Invalid Invite Code."
                                })];
                        new_user = {
                            username: username,
                            pass256: crypto.createHash('sha256')
                                .update(username + ":" + pass256)
                                .digest('hex'),
                            seed256: seed256,
                            genesis: Date.now(),
                            uid: uid.createUserID(),
                            invited_by: invited_by,
                            verified: true,
                            invite_codes: [],
                        };
                        return [4 /*yield*/, store.create(new_user)];
                    case 2:
                        user = _a.sent();
                        if (user instanceof Error)
                            return [2 /*return*/, user];
                        return [4 /*yield*/, store.update_pull({ username: invited_by }, invite_code)];
                    case 3:
                        updated_inviter = _a.sent();
                        if (updated_inviter instanceof Error)
                            return [2 /*return*/, updated_inviter];
                        jwt_payload = {
                            user: user.username,
                            aud: "profile,posts"
                        };
                        token = local_jwt.issue(jwt_payload);
                        return [2 /*return*/, token];
                }
            });
        });
    };
    ;
    LionBitAuth.prototype.login = function (username, pass256) {
        return __awaiter(this, void 0, void 0, function () {
            var user, jwt_payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (user instanceof Error)
                            return [2 /*return*/, user];
                        if (!user.verified)
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Pending Verification."
                                })];
                        if (user.pass256 !== crypto.createHash('sha256')
                            .update(username + ":" + pass256)
                            .digest('hex'))
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Wrong Password"
                                })];
                        jwt_payload = {
                            user: user.username,
                            aud: "profile,posts"
                        };
                        token = local_jwt.issue(jwt_payload);
                        return [2 /*return*/, token];
                }
            });
        });
    };
    LionBitAuth.prototype.reset = function (seed256, pass256) {
        return __awaiter(this, void 0, void 0, function () {
            var user, query, update, status, jwt_payload, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ seed256: seed256 })];
                    case 1:
                        user = _a.sent();
                        if (user instanceof Error)
                            return [2 /*return*/, user];
                        query = {
                            seed256: seed256,
                        };
                        update = {
                            pass256: crypto.createHash('sha256')
                                .update(user.username + ":" + pass256)
                                .digest('hex'),
                        };
                        return [4 /*yield*/, store.update(query, update)];
                    case 2:
                        status = _a.sent();
                        if (status instanceof Error)
                            return [2 /*return*/, status];
                        jwt_payload = {
                            user: user.username,
                            aud: "profile,posts"
                        };
                        token = local_jwt.issue(jwt_payload);
                        return [2 /*return*/, token];
                }
            });
        });
    };
    LionBitAuth.prototype.remove = function (username, pass256) {
        return __awaiter(this, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.remove({ username: username, pass256: pass256 })];
                    case 1:
                        status = _a.sent();
                        if (status instanceof Error)
                            return [2 /*return*/, status];
                        return [2 /*return*/, status];
                }
            });
        });
    };
    LionBitAuth.prototype.invite = function (invited_by) {
        return __awaiter(this, void 0, void 0, function () {
            var inviter, invite_code, updated_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ username: invited_by })];
                    case 1:
                        inviter = _a.sent();
                        if (inviter instanceof Error) {
                            if (inviter['name'] === "404") {
                                return [2 /*return*/, e_1.handleError({
                                        code: 404,
                                        message: "Inviter does not exist."
                                    })];
                            }
                            else
                                return [2 /*return*/, inviter];
                        }
                        if (!inviter.verified)
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Inviter is not verified."
                                })];
                        invite_code = uid.createRandomID(12);
                        return [4 /*yield*/, store.update_push({ username: invited_by }, invite_code)];
                    case 2:
                        updated_user = _a.sent();
                        if (updated_user instanceof Error)
                            return [2 /*return*/, updated_user];
                        return [2 /*return*/, invite_code];
                }
            });
        });
    };
    LionBitAuth.prototype.taken_usernames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var auths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.readMany(["all"])];
                    case 1:
                        auths = _a.sent();
                        if (auths instanceof Error)
                            return [2 /*return*/, auths];
                        return [2 /*return*/, auths.map(function (auth) { return auth.username; })];
                }
            });
        });
    };
    LionBitAuth.prototype.check_seed256 = function (username, seed256) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, store.read({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (user instanceof Error) {
                            return [2 /*return*/, user];
                        }
                        if (user.seed256 === seed256) {
                            return [2 /*return*/, true];
                        }
                        else {
                            return [2 /*return*/, e_1.handleError({
                                    code: 403,
                                    message: "Seed does not match!"
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return LionBitAuth;
}());
exports.LionBitAuth = LionBitAuth;
;
//# sourceMappingURL=auth.js.map