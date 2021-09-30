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
var chai_1 = require("chai");
require("mocha");
var local = __importStar(require("./jwt"));
var jwt = new local.S5LocalJWT();
var jwt_signing_key = "dab5612c77258a215b971e53569be21dc0fe3bb5cc474b9885e532a99e622a1b";
var token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIzNzA1ZmNmY2NjMTg4Njg2ZjhhZjkyYWJiZjAxYzRmMjZiZDVlODMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2F0cy1jYyIsImF1ZCI6InNhdHMtY2MiLCJhdXRoX3RpbWUiOjE2MDExMzc1NTgsInVzZXJfaWQiOiIxWFNRbTJuMHB0UkllNmtrZTdPRWdqaTRQV20xIiwic3ViIjoiMVhTUW0ybjBwdFJJZTZra2U3T0Vnamk0UFdtMSIsImlhdCI6MTYwMjQ5NjY0OCwiZXhwIjoxNjAyNTAwMjQ4LCJlbWFpbCI6Imt5YzBAdGVzdC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsia3ljMEB0ZXN0LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.WNjgtDEB5JhyndWlxuZJURPCm7_6Kl2fJiMmt31JhyHr6YuyAIiGgiHAPvK6s8_zE2JsWNFLX80prVRjmIMs-8L03pzqj_3tXfk4JDTzPoc1fy3vCvO1EmDnvxXQNQNz-EVXN652trGxK3Q39TjP3HBAFkD6XvfmSPPQdOfDG1YKySGrRSkfNRVDx6S5BorcF8ybNMqn9blK3-EglyZQAah6rHfNRg7AqTJX_u5SdIFnuQ1wTvgTPKfG3si-XwT6L3DYzlav9A67PlG_Ym4cojfhIBdH9VaHiC4Qjh8JJkxb6OqF_6STUGxTNTTngaTnkrlp9rGGn5hh3XU-XwJjGQ";
var expired_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXIiOiJ2bSIsImF1ZCI6InByb2ZpbGUsb2ZmZXJzIiwiaXNzIjoibGlvbmJpdCIsImlhdCI6MTYzMDM4NjkwMDA3MCwiZXhwIjoxNjMwMzkwNTAwMDcwfSwiaWF0IjoxNjMwMzg2OTAwLCJleHAiOjE2MzAzODY5NjAsImF1ZCI6InByb2ZpbGUsb2ZmZXJzIiwiaXNzIjoibGlvbmJpdCJ9.ei-MywxPT9x6Se-RMMca_o8UPk6ZYz96aJ7U4mBj0OY";
var email = "kyc0@test.com";
var payload = {
    user: "vm",
    aud: "profile,offers",
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Local JWT ", function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    after(function (done) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                done();
                return [2 /*return*/];
            });
        });
    });
    describe("issue", function () {
        it("SHOULD issue a jwt", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, jwt.issue(payload)];
                        case 1:
                            response = _a.sent();
                            token = response;
                            console.log(response);
                            chai_1.expect(response).to.be.a("string");
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("verify", function () {
        it("SHOULD verify a token", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, jwt.verify(token)];
                        case 1:
                            response = _a.sent();
                            // console.log({response})
                            chai_1.expect(response['payload']['user']).to.equal(payload.user);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("401 Expired: verify", function () {
        it("SHOULD error for an expired token", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, jwt.verify(expired_token)];
                        case 1:
                            response = _a.sent();
                            // console.log({response})
                            chai_1.expect(response['name']).to.equal("401");
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=jwt.spec.js.map