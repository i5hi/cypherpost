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
exports.S5LocalJWT = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var e_1 = require("../errors/e");
var ONE_HOUR = 60 * 60 * 1000;
// ------------------ '(◣ ◢)' ----------------------
var S5LocalJWT = /** @class */ (function () {
    function S5LocalJWT() {
    }
    S5LocalJWT.prototype.verify = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var private_key, decoded;
            return __generator(this, function (_a) {
                try {
                    private_key = "supersecret";
                    if (token === undefined || token === "")
                        return [2 /*return*/, e_1.handleError({
                                code: 401,
                                message: "Invalid token"
                            })];
                    if (token.startsWith("Bearer ")) {
                        // Remove Bearer from string
                        token = token.slice(7, token.length);
                    }
                    if (token) {
                        decoded = jsonwebtoken_1.default.verify(token, private_key, { algorithm: "HS256" });
                        // console.log({decoded});
                        // console.log({now: Date.now(), exp: decoded.exp * 1000});
                        // console.log(decoded.exp * 1000 - (Date.now()))
                        if (decoded.exp * 1000 < (Date.now())) {
                            return [2 /*return*/, e_1.handleError({
                                    code: 401,
                                    message: "Expired token"
                                })];
                        }
                        else {
                            return [2 /*return*/, (decoded)];
                        }
                    }
                    else {
                        return [2 /*return*/, e_1.handleError({
                                code: 401,
                                message: "Invalid token"
                            })];
                    }
                }
                catch (e) {
                    if (e.message === "jwt malformed" || e.message === "jwt expired" || e.message === "invalid token")
                        return [2 /*return*/, e_1.handleError({
                                code: 401,
                                message: "Invalid token"
                            })];
                    return [2 /*return*/, e_1.handleError(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    // ------------------ '(◣ ◢)' ----------------------
    S5LocalJWT.prototype.issue = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var private_key;
            return __generator(this, function (_a) {
                try {
                    private_key = "supersecret";
                    payload.iss = "lionbit";
                    payload.iat = Date.now();
                    payload.exp = payload.iat + ONE_HOUR;
                    return [2 /*return*/, jsonwebtoken_1.default.sign({
                            payload: payload
                        }, private_key, {
                            expiresIn: 60 * 60,
                            algorithm: "HS256",
                            audience: payload.aud,
                            issuer: payload.iss
                        })];
                }
                catch (e) {
                    return [2 /*return*/, e_1.handleError(e)];
                }
                return [2 /*return*/];
            });
        });
    };
    return S5LocalJWT;
}());
exports.S5LocalJWT = S5LocalJWT;
// ------------------ ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=jwt.js.map