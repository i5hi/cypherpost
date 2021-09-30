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
exports.filterError = exports.checkResponseSignature = exports.getResponseSignature = exports.respond = exports.parseRequest = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var crypto = __importStar(require("crypto"));
var fs = __importStar(require("fs"));
var e_1 = require("../errors/e");
var winston_1 = require("../logger/winston");
var uid_1 = require("../uid/uid");
// ------------------ '(◣ ◢)' ---------------------
var KEY_PATH = process.env.HOME + "/.keys";
var KEY_NAME = "sats_sig";
var s5uid = new uid_1.S5UID();
// ------------------ '(◣ ◢)' ---------------------
// try sending a request without header
function parseRequest(request) {
    var r_custom = {
        method: request.method || "method_error",
        resource: request.originalUrl || "resource_error",
        headers: request.headers || "headers_error",
        body: request.body || "body_error",
        uid: request.headers['uid'] || "private",
        files: request.files || "zil",
        file: request.file || "zil",
        timestamp: Date.now(),
        gmt: new Date(Date.now()).toUTCString(),
        ip: request.headers["x-forwarded-for"] || "ip_error",
        params: request.params || {},
        device: request.headers['user-agent'] || "unknown",
        query: request.query
    };
    return r_custom;
}
exports.parseRequest = parseRequest;
// ------------------ '(◣ ◢)' ---------------------
function respond(status_code, message, response, request) {
    return __awaiter(this, void 0, void 0, function () {
        var sats_id, now, headers, signature, headers_with_sig, e_2, message_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sats_id = s5uid.createResponseID();
                    now = Date.now();
                    headers = {
                        "x-s5-id": sats_id,
                        "x-s5-time": now
                    };
                    return [4 /*yield*/, getResponseSignature(status_code, request["resource"], request["method"], headers, message)];
                case 1:
                    signature = _a.sent();
                    if (signature instanceof Error) {
                        return [2 /*return*/, signature];
                    }
                    headers_with_sig = {
                        "x-s5-id": sats_id,
                        "x-s5-time": now,
                        "x-s5-signature": signature
                    };
                    // logger.info({ user: ((request.uid)?request.uid:"external"), resource: `${request['method']}-${(request["resource"] || request['originalUrl'])}`, status_code })
                    return [2 /*return*/, (response
                            .set(headers_with_sig)
                            .status(status_code)
                            .send(message))];
                case 2:
                    e_2 = _a.sent();
                    winston_1.logger.error("Ourskirts error at dto respond", e_2);
                    message_1 = winston_1.r_500;
                    switch (e_2.code) {
                        case 401:
                            message_1 = {
                                error: e_2.message
                            };
                            break;
                        case 400:
                            message_1 = {
                                error: e_2.message
                            };
                            break;
                        case 500:
                            message_1 = {
                                error: e_2.message
                            };
                            break;
                        default:
                            message_1 = {
                                error: "Internal Signing Error"
                            };
                            e_2.code = 500;
                            break;
                    }
                    return [2 /*return*/, (response.status(e_2.code).send(message_1))];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.respond = respond;
// ------------------ '(◣ ◢)' ---------------------
function getResponseSignature(status_code, ep, method, headers, body) {
    return __awaiter(this, void 0, void 0, function () {
        var private_key, message, sign, signature, status_1, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!fs.existsSync(KEY_PATH + "/" + KEY_NAME + ".pem")) return [3 /*break*/, 2];
                    private_key = fs
                        .readFileSync(KEY_PATH + "/" + KEY_NAME + ".pem")
                        .toString("ascii");
                    message = status_code + "-" + headers["x-s5-id"] + "-" + headers["x-s5-time"];
                    sign = crypto.createSign("RSA-SHA256");
                    sign.update(message);
                    sign.end();
                    signature = sign.sign({ key: private_key, passphrase: "test" }, 'base64');
                    return [4 /*yield*/, checkResponseSignature(status_code, headers, signature)];
                case 1:
                    status_1 = _a.sent();
                    if (status_1 instanceof Error)
                        return [2 /*return*/, status_1];
                    return [2 /*return*/, signature];
                case 2:
                    winston_1.logger.error("No response signing key found!. Run $ ditto crpf sats_sig");
                    return [2 /*return*/, e_1.handleError({
                            code: 500,
                            message: "No response signing key found!"
                        })];
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    winston_1.logger.error(e_3);
                    return [2 /*return*/, e_1.handleError(e_3)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getResponseSignature = getResponseSignature;
// ------------------ '(◣_◢)' ------------------
function checkResponseSignature(status_code, headers, sig_b64 // base64
) {
    return __awaiter(this, void 0, void 0, function () {
        var signature, public_key, message, verify;
        return __generator(this, function (_a) {
            try {
                signature = Buffer.from(sig_b64, 'base64');
                public_key = fs
                    .readFileSync(KEY_PATH + "/" + KEY_NAME + ".pub")
                    .toString("ascii");
                message = status_code + "-" + headers["x-s5-id"] + "-" + headers["x-s5-time"];
                verify = crypto.createVerify("RSA-SHA256");
                verify.update(message);
                // verify.end();
                return [2 /*return*/, (verify.verify(Buffer.from(public_key, 'ascii'), signature))];
            }
            catch (e) {
                return [2 /*return*/, e_1.handleError(e)];
            }
            return [2 /*return*/];
        });
    });
}
exports.checkResponseSignature = checkResponseSignature;
// ------------------ '(◣ ◢)' ---------------------
function filterError(e, custom_500_message, request_data) {
    try {
        var code = 500;
        var message = custom_500_message;
        var s_codes = ["202", "400", "401", "402", "403", "404", "406", "409", "415", "420", "422", "429"];
        var n_codes = [202, 400, 401, 402, 403, 404, 406, 409, 415, 420, 422, 429];
        if (e instanceof Error && s_codes.includes(e.name)) {
            code = parseInt(e.name, 10);
        }
        // just to not break old error format
        else if (e.code && typeof (e.code) == 'number') {
            code = e["code"];
        }
        // logger.warn({
        //   code,
        //   resource:request_data.resource,
        //   method: request_data.method,
        //   e: e['message'],
        //   user: (request_data.user) ? request_data.user.email : request_data.ip
        // });
        winston_1.logger.debug({ e: e });
        // if(code === 400) logger.debug({e})
        // important that these codes are numbers and not strings
        // node.js erorrs return strings, custom is number, ogay?
        if (n_codes.includes(code)) {
            // Client Errors: Change message from default 500
            // if (code === 400) message = { temp: "Bad body params" }
            // if (code === 401) message = { temp: "Bad authentication" }
            // if (code === 404) message = { temp: "Resource Not Available" }
            // if (code === 409) message = { temp: "Duplicate Entry" }
            // if (code === 409) message = { temp: "Duplicate Entry" }
            if (Array.isArray(e['message']))
                message = { array: e['message'] };
            if (parseJSONSafely(e["message"]))
                message = { error: parseJSONSafely(e["message"]) };
            else
                message = { error: e["message"] };
        }
        else {
            // Server Errors: Leave message as default 500
            // request_data["headers"] = undefined;
            winston_1.logger.error({
                request: {
                    body: request_data['body'],
                    resource: request_data['resource'],
                    ip: request_data.ip || "no ip",
                },
                e: e
            });
        }
        return {
            code: code,
            message: message
        };
    }
    catch (e) {
        return {
            code: 500,
            message: custom_500_message
        };
    }
}
exports.filterError = filterError;
function parseJSONSafely(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        //  console.log({e});
        // Return a default object, or null based on use case.
        return false;
    }
}
;
// ------------------ '(◣ ◢)' ---------------------
//# sourceMappingURL=handler.js.map