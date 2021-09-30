"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var express_1 = __importDefault(require("express"));
var dto_1 = require("./dto");
// // ------------------ '(◣ ◢' ---------------------
exports.router = express_1.default.Router();
exports.router.use(dto_1.adminMiddleWare);
exports.router.get("/", dto_1.handleGetLandingPage);
exports.router.get("/invitation", dto_1.handleGetInvitationPage);
exports.router.get("/login", dto_1.handleGetLoginPage);
exports.router.get("/reset", dto_1.handleGetResetPage);
exports.router.get("/profile", dto_1.handleGetProfilePage);
exports.router.get("/network", dto_1.handleGetNetworkPage);
exports.router.get("/posts", dto_1.handleGetPostsPage);
// // ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=router.js.map