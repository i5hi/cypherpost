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
var createPostCheck = [
    val.check('expiry').exists(),
    val.check('derivation_scheme').exists(),
    val.check('cipher_json').exists(),
    val.check('decryption_keys').exists().isArray()
];
// ------------------ '(◣ ◢)' ---------------------
exports.router.use(dto_1.postMiddleware);
exports.router.put("/", createPostCheck, dto_1.handleCreatePost);
exports.router.get("/self", dto_1.handleGetMyPosts);
exports.router.get("/others", dto_1.handleGetOthersPosts);
exports.router.delete("/:id", dto_1.handleDeletePost);
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=router.js.map