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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDatabase = void 0;
// ______________________________________________________
var mongoose_1 = __importDefault(require("mongoose"));
var e_1 = require("../errors/e");
// import { S5Vault } from '../kms/vault';
var winston_1 = require("../logger/winston");
// ______________________________________________________
// const kms = new S5Vault();
// ______________________________________________________
var MongoDatabase = /** @class */ (function () {
    function MongoDatabase() {
    }
    MongoDatabase.prototype.connect = function (db_options) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var db_location, connect_string, options, database_1;
            return __generator(this, function (_a) {
                try {
                    db_location = db_options.ip + ":" + db_options.port;
                    connect_string = "mongodb://" + db_options.auth + "@" + db_location + "/" + db_options.name;
                    options = {
                        autoIndex: false,
                        serverSelectionTimeoutMS: 9000,
                        socketTimeoutMS: 21000,
                        family: 4 // Use IPv4, skip trying IPv6
                    };
                    database_1 = mongoose_1.default
                        .connect(connect_string, options)
                        .catch(function (error) {
                        winston_1.logger.error("Error connecting to MongoDb.", error);
                    });
                    mongoose_1.default.connection.once("open", function () {
                        console.log("Connected to MongoDb.");
                        resolve(database_1);
                    });
                    // If the connection throws an error
                    mongoose_1.default.connection.on("error", function (error) {
                        winston_1.logger.error("!!!Error in mongoose connection!!!", error);
                        reject(error);
                    });
                    // When the connection is disconnected
                    mongoose_1.default.connection.on("disconnected", function () {
                        winston_1.logger.error("Disconnected from MongoDb.");
                    });
                    // If the Node process ends, close the Mongoose connection
                    process.on("SIGINT", function () {
                        mongoose_1.default.connection.close(function () {
                            winston_1.logger.error("Mongoose default connection disconnected through app termination");
                            process.exit(0);
                        });
                    });
                    // quit properly on docker stop
                    process.on("SIGTERM", function () {
                        mongoose_1.default.connection.close(function () {
                            winston_1.logger.error("Mongoose default connection disconnected through app termination");
                            process.exit(0);
                        });
                    });
                }
                catch (e) {
                    return [2 /*return*/, e_1.handleError(e)];
                }
                return [2 /*return*/];
            });
        }); });
    };
    return MongoDatabase;
}());
exports.MongoDatabase = MongoDatabase;
//______________________________________________________
//# sourceMappingURL=mongo.js.map