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
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var express_1 = require("express");
var val = __importStar(require("express-validator"));
var dto_1 = require("./dto");
// ------------------ '(◣ ◢)' ---------------------
exports.router = express_1.Router();
// ------------------ '(◣ ◢)' ---------------------
var registrationCheck = [
    val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/),
    val.check('pass256').exists(),
    val.check('seed256').exists(),
    val.check('invited_by').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9_.]+$/),
    val.check('invite_code').exists(),
];
var loginCheck = [
    val.check('username').exists().matches(/^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/),
    val.check('pass256').exists(),
];
var resetCheck = [
    val.check('seed256').exists(),
    val.check('pass256').exists(),
];
// ------------------ '(◣ ◢)' ---------------------
exports.router.use(dto_1.authMiddleware);
exports.router.post("/register", registrationCheck, dto_1.handlePostRegistration);
exports.router.post("/login", loginCheck, dto_1.handlePostLogin);
exports.router.post("/reset", resetCheck, dto_1.handlePostReset);
exports.router.get("/invite", dto_1.handleGetInvite);
exports.router.post("/check/seed256", dto_1.handlePostCheckSeed256);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=router.js.map