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
var uid_1 = require("./uid");
var s5uid = new uid_1.S5UID();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: UID ", function () {
    describe("createUserID", function () {
        it("SHOULD create S5ID", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createUserID();
                    console.log(response);
                    chai_1.expect(response.startsWith("s5id")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createIDVSReference", function () {
        it("SHOULD create S5IDVS", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createIDVSReference('S5');
                    console.log(response);
                    chai_1.expect(response.startsWith("s5iv")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createAccountID", function () {
        it("SHOULD create S5WL", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createAccountID();
                    console.log(response);
                    chai_1.expect(response.startsWith("s5wl")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createBuyOrderID", function () {
        it("SHOULD create S5BY", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createBuyOrderID();
                    chai_1.expect(response.startsWith("s5by")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createSellOrderID", function () {
        it("SHOULD create S5SL", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createSellOrderID();
                    chai_1.expect(response.startsWith("s5sl")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createTxID", function () {
        it("SHOULD create S5TX", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createTxID();
                    chai_1.expect(response.startsWith("s5tx")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createResponseID", function () {
        it("SHOULD create S5RES", function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    response = s5uid.createResponseID();
                    chai_1.expect(response.startsWith("s5rs")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
    describe("createRandomID", function () {
        it("SHOULD create random ID of a given length", function () {
            return __awaiter(this, void 0, void 0, function () {
                var length, response;
                return __generator(this, function (_a) {
                    length = 21;
                    response = s5uid.createRandomID(length);
                    chai_1.expect(response.startsWith("s5xp")).to.equal(true);
                    return [2 /*return*/];
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=uid.spec.js.map