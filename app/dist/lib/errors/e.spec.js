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
var chai_1 = require("chai");
require("mocha");
var e_1 = require("./e");
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
var e1 = {
    joe: "bloggs",
    can: "bark",
    and: "bite"
};
var e2 = {
    code: "430",
    message: e1
};
var e3 = {
    code: 420,
    message: "thisise3"
};
var e4 = new Error(JSON.stringify(e1));
var e5 = {
    code: 404,
    message: e4
};
var e6 = {
    code: 404,
    messages: e1
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Errors ", function () {
    describe("handleError(no code or message)", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e1);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal('501');
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("handleError(string code)", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e2);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal("430");
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("handleError(number code)", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e3);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal("420");
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("handleError(Error type)", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e4);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal("501");
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("handleError(Error as message)", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e5);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal("404");
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("handleError(code without message) external code protection", function () {
        it("SHOULD convert a provided message object or string into an approriately named Error type", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = e_1.handleError(e6);
                    // console.log({response})
                    chai_1.expect(response['name']).to.equal("501");
                    return [2 /*return*/];
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=e.spec.js.map