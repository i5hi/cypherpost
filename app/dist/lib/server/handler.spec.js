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
/*
cypherpost.io
Developed @ Stackmate India
*/
var chai_1 = require("chai");
require("mocha");
var e_1 = require("../errors/e");
var winston_1 = require("../logger/winston");
var uid_1 = require("../uid/uid");
var handler = __importStar(require("./handler"));
var s5uid = new uid_1.S5UID();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
var status_code = 200;
var ep = "/session/login";
var method = "POST";
var sats_id = s5uid.createResponseID();
var sid = s5uid.createSessionID();
var now = Date.now();
var headers = {
    "x-s5-id": sats_id,
    "x-s5-time": now
};
var out = {
    sid: sid
};
var sig;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: DTO Handler ", function () {
    describe("getResponseSignature", function () {
        it("SHOULD return a signed response", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, handler.getResponseSignature(status_code, ep, method, headers, out)];
                        case 1:
                            response = _a.sent();
                            sig = response;
                            chai_1.expect(response).to.be.a('string');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("checkResponseSignature", function () {
        it("SHOULD check a signed response", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, handler.checkResponseSignature(status_code, headers, sig)];
                        case 1:
                            response = _a.sent();
                            console.log({ response: response });
                            chai_1.expect(response).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    var request_data = {
        body: {
            amount: 12000,
        },
        resource: "",
        ip: ""
    };
    describe("filterError::cases", function () {
        it("Should filter a stringified json type error", function () {
            return __awaiter(this, void 0, void 0, function () {
                var e, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e = JSON.stringify({ a: "nice", little: "stringified", json: "json" });
                            return [4 /*yield*/, handler.filterError(e, winston_1.r_500, request_data)];
                        case 1:
                            response = _a.sent();
                            console.log(response);
                            chai_1.expect(response).to.have.property("code");
                            chai_1.expect(response).to.have.property("message");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Should filter an array type error", function () {
            return __awaiter(this, void 0, void 0, function () {
                var e, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e = ["this", "shit", "like", "that", "shit"];
                            return [4 /*yield*/, handler.filterError(e, winston_1.r_500, request_data)];
                        case 1:
                            response = _a.sent();
                            console.log(response);
                            chai_1.expect(response).to.have.property("code");
                            chai_1.expect(response).to.have.property("message");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Should filter an object type error", function () {
            return __awaiter(this, void 0, void 0, function () {
                var e, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e = { a: "nice", little: "stringified", json: "json" };
                            return [4 /*yield*/, handler.filterError(e, winston_1.r_500, request_data)];
                        case 1:
                            response = _a.sent();
                            console.log(response);
                            chai_1.expect(response).to.have.property("code");
                            chai_1.expect(response).to.have.property("message");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Should filter an Error type error", function () {
            return __awaiter(this, void 0, void 0, function () {
                var e, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e = { a: "nice", little: "stringified", json: "json" };
                            return [4 /*yield*/, handler.filterError(e_1.handleError(e), winston_1.r_500, request_data)];
                        case 1:
                            response = _a.sent();
                            console.log(response);
                            chai_1.expect(response).to.have.property("code");
                            chai_1.expect(response).to.have.property("message");
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("Should filter an coded client error", function () {
            return __awaiter(this, void 0, void 0, function () {
                var e, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            e = { code: 400, message: [{ one: "two" }, { three: "four" }] };
                            return [4 /*yield*/, handler.filterError(e, winston_1.r_500, request_data)];
                        case 1:
                            response = _a.sent();
                            console.log(response);
                            chai_1.expect(response).to.have.property("code");
                            chai_1.expect(response).to.have.property("message");
                            chai_1.expect(response.message['error'].length).to.equal(2);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=handler.spec.js.map