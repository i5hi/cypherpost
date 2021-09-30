"use strict";
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
exports.handlePostCheckSeed256 = exports.handleGetInvite = exports.handlePostReset = exports.handlePostLogin = exports.handlePostRegistration = exports.authMiddleware = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
var crypto_1 = require("../../lib/crypto/crypto");
var e_1 = require("../../lib/errors/e");
var jwt = __importStar(require("../../lib/jwt/jwt"));
var winston_1 = require("../../lib/logger/winston");
var handler_1 = require("../../lib/server/handler");
var auth_1 = require("./auth");
var local_jwt = new jwt.S5LocalJWT();
var validationResult = require('express-validator').validationResult;
var auth = new auth_1.LionBitAuth();
var s5crypto = new crypto_1.S5Crypto();
var server_rsa_filename = "sats_sig";
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var request, token, decoded, e_2, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    request = handler_1.parseRequest(req);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!(req.originalUrl == "/api/v1/auth/invite/" ||
                        req.originalUrl == "/api/v1/auth/invite" ||
                        req.originalUrl == "/api/v1/auth/check/seed256/" ||
                        req.originalUrl == "/api/v1/auth/check/seed256")) return [3 /*break*/, 3];
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
                    req.headers['user'] = decoded['payload']['user'];
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    next();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_2 = _a.sent();
                    result = handler_1.filterError(e_2, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.authMiddleware = authMiddleware;
function handlePostRegistration(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, token, response, e_3, result;
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
                    return [4 /*yield*/, auth.register(request.body.username, request.body.pass256, request.body.seed256, request.body.invited_by, request.body.invite_code)];
                case 2:
                    token = _a.sent();
                    if (token instanceof Error)
                        throw token;
                    response = {
                        token: token
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
exports.handlePostRegistration = handlePostRegistration;
function handlePostLogin(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, token, response, e_4, result;
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
                    return [4 /*yield*/, auth.login(request.body.username, request.body.pass256)];
                case 2:
                    token = _a.sent();
                    if (token instanceof Error)
                        throw token;
                    response = {
                        token: token
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
exports.handlePostLogin = handlePostLogin;
function handlePostReset(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, token, response, e_5, result;
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
                    return [4 /*yield*/, auth.reset(request.body.seed256, request.body.pass256)];
                case 2:
                    token = _a.sent();
                    if (token instanceof Error)
                        throw token;
                    response = {
                        token: token
                    };
                    handler_1.respond(200, response, res, request);
                    return [3 /*break*/, 4];
                case 3:
                    e_5 = _a.sent();
                    result = handler_1.filterError(e_5, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handlePostReset = handlePostReset;
function handleGetInvite(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, invite_code, response, e_6, result;
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
                    return [4 /*yield*/, auth.invite(request.headers['user'])];
                case 2:
                    invite_code = _a.sent();
                    if (invite_code instanceof Error)
                        throw invite_code;
                    response = {
                        invite_code: invite_code
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
exports.handleGetInvite = handleGetInvite;
function handlePostCheckSeed256(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var request, errors, status_1, response, e_7, result;
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
                    return [4 /*yield*/, auth.check_seed256(request.headers['user'], request.body.seed256)];
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
                    e_7 = _a.sent();
                    result = handler_1.filterError(e_7, winston_1.r_500, request);
                    handler_1.respond(result.code, result.message, res, request);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.handlePostCheckSeed256 = handlePostCheckSeed256;
//# sourceMappingURL=dto.js.map