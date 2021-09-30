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
exports.start = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var express_1 = __importDefault(require("express"));
var helmet_1 = __importDefault(require("helmet"));
var router_1 = require("../../services/auth/router");
var router_2 = require("../../services/client/router");
var router_3 = require("../../services/posts/router");
var router_4 = require("../../services/profile/router");
var winston_1 = require("../logger/winston");
var handler_1 = require("./handler");
var base_path = "/home/node/cypherpost/app/src/services/client/public";
// ------------------ '(◣ ◢)' ---------------------
function start(port) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var server, app_1, sockets_1, nextSocketId_1;
                    var _this = this;
                    return __generator(this, function (_a) {
                        try {
                            server = express_1.default();
                            server.set("etag", false);
                            server.disable("x-powered-by");
                            server.use(helmet_1.default());
                            server.use(express_1.default.json());
                            server.use(express_1.default.urlencoded());
                            server.use(function (err, req, res, next) {
                                if (err) {
                                    winston_1.logger.warn({ err: err });
                                    handler_1.respond(400, { error: 'Invalid Request data format. Try another format like form, or url-encoded.' }, res, req);
                                }
                                else {
                                    next();
                                }
                            });
                            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                            server.use("/api/v1/auth", router_1.router);
                            server.use("/api/v1/profile", router_4.router);
                            server.use("/api/v1/posts", router_3.router);
                            server.use("/", router_2.router);
                            // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                            server.use(express_1.default.static(base_path));
                            app_1 = server.listen(port, function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    winston_1.logger.verbose("Server listening...");
                                    resolve(app_1);
                                    return [2 /*return*/];
                                });
                            }); });
                            // Gracefully terminate server on SIGINT AND SIGTERM
                            process.on("SIGINT", function () {
                                winston_1.logger.info({
                                    SIGINT: "Got SIGINT. Gracefully shutting down Http server"
                                });
                                app_1.close(function () {
                                    winston_1.logger.info("Http server closed.");
                                });
                            });
                            // quit properly on docker stop
                            process.on("SIGTERM", function () {
                                winston_1.logger.info({
                                    SIGTERM: "Got SIGTERM. Gracefully shutting down Http server."
                                });
                                app_1.close(function () {
                                    winston_1.logger.info("Http server closed.");
                                });
                            });
                            sockets_1 = {};
                            nextSocketId_1 = 0;
                            app_1.on("connection", function (socket) {
                                var socketId = nextSocketId_1++;
                                sockets_1[socketId] = socket;
                                socket.once("close", function () {
                                    delete sockets_1[socketId];
                                });
                            });
                            // server._router.stack.forEach(print.bind(null, []))
                            // console.log(JSON.stringify(availableRoutes(server), null, 2));
                            // console.log(availableRoutesString(server));
                            // listRoutes();
                        }
                        catch (e) {
                            winston_1.logger.error({ EXPRESS_ERROR: e });
                            reject(e);
                        }
                        return [2 /*return*/];
                    });
                }); })];
        });
    });
}
exports.start = start;
;
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=express.js.map