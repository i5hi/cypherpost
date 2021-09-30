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
/*
cypherpost.io
Developed @ Stackmate India
*/
var chai_1 = require("chai");
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
require("mocha");
var util_1 = __importDefault(require("util"));
var winston_1 = require("./winston");
var LOG_FILE = process.env.HOME + "/winston/logs/moltres.log";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: logger::WINSTON ", function () {
    var message = "*****'(◣ ◢)'*****";
    describe("logger.verbose()", function () {
        it("SHOULD ONLY log to console NOT to file", function () {
            return __awaiter(this, void 0, void 0, function () {
                var exec_prom, out, exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            winston_1.logger.verbose({
                                this: message
                            });
                            exec_prom = util_1.default.promisify(child_process_1.exec);
                            return [4 /*yield*/, exec_prom("tail -2 " + LOG_FILE)];
                        case 1:
                            out = _a.sent();
                            exists = fs_1.default.existsSync(LOG_FILE);
                            chai_1.expect(out.stdout.includes(message)).to.equal(false);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe("logger.error()", function () {
        it("SHOULD log to console AND file", function () {
            return __awaiter(this, void 0, void 0, function () {
                var exec_prom, out;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            winston_1.logger.error({
                                this: message
                            });
                            exec_prom = util_1.default.promisify(child_process_1.exec);
                            return [4 /*yield*/, exec_prom("tail -2 " + LOG_FILE)];
                        case 1:
                            out = _a.sent();
                            chai_1.expect(out.stdout.includes(message)).to.equal(true);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=winston.spec.js.map