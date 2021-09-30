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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeletePost = exports.handleGetOthersPosts = exports.handleGetMyPosts = exports.handleCreatePost = exports.postMiddleware = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
var crypto_1 = require("../../lib/crypto/crypto");
var e_1 = require("../../lib/errors/e");
var jwt_1 = require("../../lib/jwt/jwt");
var winston_1 = require("../../lib/logger/winston");
var handler_1 = require("../../lib/server/handler");
var keys_1 = require("../keys/keys");
var posts_1 = require("./posts");
var validationResult = require('express-validator').validationResult;
var s5crypto = new crypto_1.S5Crypto();
var server_rsa_filename = "sats_sig";
var posts = new posts_1.LionBitPosts();
var keys = new keys_1.LionBitKeys();
var local_jwt = new jwt_1.S5LocalJWT();
function postMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var request, token, decoded, audience, e_2, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
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
                    if (audience.includes("posts")) {
                        req.headers['user'] = decoded['payload']['user'];
                        next();
                    }
                    else {
                        throw e_1.handleError({
                            code: 401,
                            message: "Token not allowed to access posts."
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    result = handler_1.filterError(e_2, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.postMiddleware = postMiddleware;
function handleCreatePost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, post, response, e_3, result;
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
                    return [4 /*yield*/, posts.create(req.headers['user'], req.body.expiry, req.body.cipher_json, req.body.derivation_scheme, req.body.decryption_keys)];
                case 2:
                    post = _a.sent();
                    if (post instanceof Error)
                        throw post;
                    response = {
                        post: post
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    result = handler_1.filterError(e_3, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handleCreatePost = handleCreatePost;
function handleGetMyPosts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, my_posts, response, e_4, result;
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
                    return [4 /*yield*/, posts.find(req.headers['user'])];
                case 2:
                    my_posts = _a.sent();
                    if (my_posts instanceof Error)
                        throw my_posts;
                    response = {
                        posts: my_posts
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 4];
                case 3:
                    e_4 = _a.sent();
                    result = handler_1.filterError(e_4, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handleGetMyPosts = handleGetMyPosts;
function handleGetOthersPosts(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, my_keys, allowed_posts, others_posts, response, e_5, result;
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
                    return [4 /*yield*/, keys.find(req.headers['user'])];
                case 2:
                    my_keys = _a.sent();
                    if (my_keys instanceof Error)
                        throw my_keys;
                    allowed_posts = my_keys.post_keys.map(function (post_key) { return post_key.id; });
                    if (allowed_posts instanceof Error)
                        throw allowed_posts;
                    return [4 /*yield*/, posts.findMany(allowed_posts)];
                case 3:
                    others_posts = _a.sent();
                    if (others_posts instanceof Error)
                        throw others_posts;
                    response = {
                        posts: others_posts
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
exports.handleGetOthersPosts = handleGetOthersPosts;
function handleDeletePost(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_1, response, e_6, result;
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
                    return [4 /*yield*/, posts.remove(req.params.id)];
                case 2:
                    status_1 = _a.sent();
                    if (status_1 instanceof Error)
                        throw status_1;
                    response = {
                        status: status_1
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
exports.handleDeletePost = handleDeletePost;
//# sourceMappingURL=dto.js.map