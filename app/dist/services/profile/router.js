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
var genesisCheck = [
    val.check('derivation_scheme').isAscii().isLength({ min: 3, max: 21 }),
    val.check('recipient_xpub').exists(),
];
var updateCheck = [
    val.check('nickname').optional({ nullable: true, checkFalsy: true }).isAscii().isLength({ max: 50 }),
    val.check('status').optional({ nullable: true, checkFalsy: true }).isAscii().isLength({ max: 160 }),
    val.check('cipher_info').optional({ nullable: true, checkFalsy: true }).isAscii().isLength({ max: 365 }),
];
var trustCheck = [
    val.check('trusting').exists(),
    val.check('decryption_key').exists(),
    val.check('signature').exists(),
];
var muteCheck = [
    val.check('trusted_by').exists(),
    val.check('toggle_mute').exists(),
];
var revokeCheck = [
    val.check('revoking').exists(),
    val.check('decryption_keys').exists(),
    val.check('derivation_scheme').exists(),
    val.check('cipher_info').exists(),
];
// ------------------ '(◣ ◢)' ---------------------
exports.router.use(dto_1.profileMiddleware);
exports.router.post("/genesis", genesisCheck, dto_1.handlePostGenesis);
exports.router.get("/", dto_1.handleGetProfile);
exports.router.get("/usernames", dto_1.handleGetUsernames);
exports.router.post("/find_many", dto_1.handleGetManyProfiles);
exports.router.post("/", updateCheck, dto_1.handleUpdateProfile);
exports.router.post("/trust", trustCheck, dto_1.handleTrustUser);
exports.router.post("/mute", muteCheck, dto_1.handleMuteUser);
exports.router.post("/revoke", revokeCheck, dto_1.handleRevokeTrustUser);
// router.post("/reveal/:aspect");
// ------------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °------------------
//# sourceMappingURL=router.js.map