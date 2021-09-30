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
exports.handleGetUsernames = exports.handleMuteUser = exports.handleRevokeTrustUser = exports.handleTrustUser = exports.handleUpdateProfile = exports.handleGetManyProfiles = exports.handleGetProfile = exports.handlePostGenesis = exports.profileMiddleware = void 0;
var crypto_1 = require("../../lib/crypto/crypto");
var e_1 = require("../../lib/errors/e");
var jwt_1 = require("../../lib/jwt/jwt");
var winston_1 = require("../../lib/logger/winston");
var handler_1 = require("../../lib/server/handler");
var auth_1 = require("../auth/auth");
var keys_1 = require("../keys/keys");
var profile_1 = require("./profile");
var validationResult = require('express-validator').validationResult;
// const auth = new LionBitProfile();
var s5crypto = new crypto_1.S5Crypto();
var server_rsa_filename = "sats_sig";
var profile = new profile_1.LionBitProfile();
var keys = new keys_1.LionBitKeys();
var auth = new auth_1.LionBitAuth();
var local_jwt = new jwt_1.S5LocalJWT();
function profileMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var request, token, decoded, audience, invite_code, invited_by, invite_status, token, decoded, audience, e_2, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    console.log(req.originalUrl);
                    if (!(req.originalUrl.split("?").shift() == "/api/v1/profile/usernames" || req.originalUrl == "/api/v1/profile/usernames/")) return [3 /*break*/, 6];
                    if (!req.headers['authorization']) return [3 /*break*/, 3];
                    token = req.headers['authorization'];
                    if (token === undefined || token === "")
                        throw e_1.handleError({
                            code: 401,
                            message: "Invalid token"
                        });
                    token = token.slice(7, token.length);
                    return [4 /*yield*/, local_jwt.verify(token)];
                case 2:
                    decoded = _a.sent();
                    if (decoded instanceof Error)
                        throw decoded;
                    audience = decoded.aud.split(",");
                    if (audience.includes("profile")) {
                        req.headers['user'] = decoded['payload']['user'];
                        next();
                    }
                    else {
                        throw e_1.handleError({
                            code: 401,
                            message: "Token not allowed to access profile."
                        });
                    }
                    return [3 /*break*/, 5];
                case 3:
                    invite_code = req.query.invite_code;
                    invited_by = req.query.invited_by;
                    return [4 /*yield*/, auth.check_invite(invited_by, invite_code)];
                case 4:
                    invite_status = _a.sent();
                    if (invite_status instanceof Error)
                        throw invite_status;
                    if (!invite_status)
                        throw {
                            code: 401,
                            message: "Invalid Invitation"
                        };
                    else {
                        next();
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 8];
                case 6:
                    token = req.headers['authorization'];
                    if (token === undefined || token === "")
                        throw e_1.handleError({
                            code: 401,
                            message: "Invalid token"
                        });
                    token = token.slice(7, token.length);
                    return [4 /*yield*/, local_jwt.verify(token)];
                case 7:
                    decoded = _a.sent();
                    if (decoded instanceof Error)
                        throw decoded;
                    audience = decoded.aud.split(",");
                    if (audience.includes("profile")) {
                        req.headers['user'] = decoded['payload']['user'];
                        next();
                    }
                    else {
                        throw e_1.handleError({
                            code: 401,
                            message: "Token not allowed to access profile."
                        });
                    }
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_2 = _a.sent();
                    result = handler_1.filterError(e_2, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.profileMiddleware = profileMiddleware;
function handlePostGenesis(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_1, new_profile, self_keys, response, e_3, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    return [4 /*yield*/, profile.genesis(request.headers['user'], request.body.derivation_scheme, request.body.recipient_xpub)];
                case 2:
                    status_1 = _a.sent();
                    if (status_1 instanceof Error)
                        throw status_1;
                    return [4 /*yield*/, profile.find(request.headers['user'])];
                case 3:
                    new_profile = _a.sent();
                    if (new_profile instanceof Error)
                        throw new_profile;
                    return [4 /*yield*/, keys.find(request.headers['user'])];
                case 4:
                    self_keys = _a.sent();
                    if (self_keys instanceof Error)
                        throw self_keys;
                    response = {
                        profile: new_profile,
                        keys: self_keys,
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 6];
                case 5:
                    e_3 = _a.sent();
                    result = handler_1.filterError(e_3, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.handlePostGenesis = handlePostGenesis;
function handleGetProfile(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, username, user_profile, self_keys, response, others_keys, response, e_4, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    console.log({ query: request.query.username });
                    username = (request.query.username) ? request.query.username : request.headers['user'];
                    return [4 /*yield*/, profile.find(username)];
                case 2:
                    user_profile = _a.sent();
                    if (user_profile instanceof Error)
                        throw user_profile;
                    if (!(request.query.username === undefined)) return [3 /*break*/, 4];
                    return [4 /*yield*/, keys.find(request.headers['user'])];
                case 3:
                    self_keys = _a.sent();
                    if (self_keys instanceof Error)
                        throw self_keys;
                    response = {
                        profile: user_profile,
                        keys: self_keys,
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, keys.find(username)];
                case 5:
                    others_keys = _a.sent();
                    if (others_keys instanceof Error)
                        throw others_keys;
                    response = {
                        profile: user_profile,
                        recipient_xpub: others_keys.recipient_xpub
                    };
                    handler_1.respond(200, response, res, request);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_4 = _a.sent();
                    result = handler_1.filterError(e_4, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.handleGetProfile = handleGetProfile;
function handleGetManyProfiles(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, user_profiles, user_keys, response, e_5, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    return [4 /*yield*/, profile.findMany(req.body.usernames)];
                case 2:
                    user_profiles = _a.sent();
                    if (user_profiles instanceof Error)
                        throw user_profiles;
                    return [4 /*yield*/, keys.findMany(req.body.usernames)];
                case 3:
                    user_keys = _a.sent();
                    if (user_keys instanceof Error)
                        throw user_keys;
                    response = {
                        profiles: user_profiles,
                        keys: user_keys
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 5];
                case 4:
                    e_5 = _a.sent();
                    result = handler_1.filterError(e_5, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleGetManyProfiles = handleGetManyProfiles;
function handleUpdateProfile(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, update, user_profile, response, e_6, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    update = {};
                    if (request.body.nickname !== "")
                        update['nickname'] = request.body.nickname;
                    if (request.body.status !== "")
                        update['status'] = request.body.status;
                    if (request.body.cipher_info !== "")
                        update['cipher_info'] = request.body.cipher_info;
                    return [4 /*yield*/, profile.update(request.headers['user'], update)];
                case 2:
                    user_profile = _a.sent();
                    if (user_profile instanceof Error)
                        throw user_profile;
                    response = {
                        profile: user_profile
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    result = handler_1.filterError(e_6, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handleUpdateProfile = handleUpdateProfile;
function handleTrustUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_2, updated, response, e_7, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    if (request.body.trusting === request.headers['user'])
                        throw {
                            code: 409,
                            message: "Trust in self is implied."
                        };
                    return [4 /*yield*/, profile.trust(request.headers['user'], request.body.trusting, request.body.decryption_key, request.body.signature)];
                case 2:
                    status_2 = _a.sent();
                    if (status_2 instanceof Error)
                        throw status_2;
                    return [4 /*yield*/, profile.find(request.headers['user'])];
                case 3:
                    updated = _a.sent();
                    if (updated instanceof Error)
                        throw updated;
                    response = {
                        profile: updated
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 5];
                case 4:
                    e_7 = _a.sent();
                    result = handler_1.filterError(e_7, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleTrustUser = handleTrustUser;
function handleRevokeTrustUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_3, updated, response, e_8, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    return [4 /*yield*/, profile.revoke(request.headers['user'], request.body.revoking, request.body.decryption_keys, request.body.derivation_scheme, request.body.cipher_info)];
                case 2:
                    status_3 = _a.sent();
                    if (status_3 instanceof Error)
                        throw status_3;
                    return [4 /*yield*/, profile.find(request.headers['user'])];
                case 3:
                    updated = _a.sent();
                    if (updated instanceof Error)
                        throw updated;
                    response = {
                        profile: updated
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 5];
                case 4:
                    e_8 = _a.sent();
                    result = handler_1.filterError(e_8, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleRevokeTrustUser = handleRevokeTrustUser;
function handleMuteUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_4, updated, response, e_9, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    return [4 /*yield*/, profile.mute(request.headers['user'], request.body.trusted_by, request.body.toggle_mute)];
                case 2:
                    status_4 = _a.sent();
                    if (status_4 instanceof Error)
                        throw status_4;
                    return [4 /*yield*/, profile.find(request.headers['user'])];
                case 3:
                    updated = _a.sent();
                    if (updated instanceof Error)
                        throw updated;
                    response = {
                        profile: updated
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 5];
                case 4:
                    e_9 = _a.sent();
                    result = handler_1.filterError(e_9, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.handleMuteUser = handleMuteUser;
function handleGetUsernames(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, usernames, response, e_10, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        throw {
                            code: 400,
                            message: errors.array()
                        };
                    }
                    return [4 /*yield*/, auth.taken_usernames()];
                case 2:
                    usernames = _a.sent();
                    if (usernames instanceof Error)
                        throw usernames;
                    response = {
                        usernames: usernames
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 4];
                case 3:
                    e_10 = _a.sent();
                    result = handler_1.filterError(e_10, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handleGetUsernames = handleGetUsernames;
//# sourceMappingURL=dto.js.map