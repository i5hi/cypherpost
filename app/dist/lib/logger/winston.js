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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.r_500 = exports.logger = void 0;
/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
var util_1 = __importDefault(require("util"));
var time = __importStar(require("../time/time"));
var _a = require("winston"), createLogger = _a.createLogger, format = _a.format, transports = _a.transports;
var combine = format.combine, colorize = format.colorize, timestamp = format.timestamp, prettyPrint = format.prettyPrint, printf = format.printf;
var times = new time.S5Times();
// ------------------ '(◣ ◢)' ---------------------
var FLUENTD_ADDRESS = process.env.LOGGER_IP;
var FLUENTD_PORT = process.env.LOGGER_PORT;
var FLUENTD_PATH = '/moltres.log';
var LOG_PATH = process.env.HOME + "/winston";
var custom_format = printf(function (data) {
    if (typeof data !== "string")
        data.message = util_1.default.format("%o", data.message);
    var now = Date.now();
    return "ist:" + times.convertUnixToIST(now) + "\nlevel: " + data.level + "\nmessage: " + data.message + "\n";
    // print stack trace here and never reject a stack trace?
});
var options = {
    file: {
        level: "info",
        // watch out when changing it
        filename: LOG_PATH + "/logs/moltres.log",
        handleExceptions: false,
        maxsize: 5281000,
        format: combine(format.splat(), custom_format)
    },
    console: {
        level: "debug",
        handleExceptions: false,
        format: combine(format.splat(), custom_format)
    }
};
exports.logger = createLogger({
    level: "info",
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console),
        new transports.Http({
            level: 'verbose',
            format: format.json(),
            host: FLUENTD_ADDRESS,
            port: FLUENTD_PORT,
            path: FLUENTD_PATH,
        })
    ],
    exitOnError: false
});
// logger.add(winston.transports.Console, {
//     level: 'info',
//     prettyPrint: true,
//     colorize: true,
//     silent: false,
//     timestamp: true
// });
exports.logger.stream = {
    write: function (message, encoding) {
        exports.logger.info(message);
    }
};
// ------------------ '(◣ ◢)' ---------------------
exports.r_500 = {
    error: "Internal Error. Contact support@satsbank.io"
};
// -----------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------------
// ------------° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------------
/*

Transport Settings:

    level - Level of messages to log.
    filename - The file to be used to write log data to.
    handleExceptions - Catch and log unhandled exceptions.
    json - Records log data in JSON format.
    maxsize - Max size of log file, in bytes, before a new file will be created.
    maxFiles - Limit the number of files created when the size of the logfile is exceeded.
    colorize - Colorize the output. This can be helpful when looking at console logs.

Log Levels:

    0: error
    1: warn
    2: info
    3: verbose
    4: debug
    5: silly


*/
//# sourceMappingURL=winston.js.map