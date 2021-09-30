/*
cypherpost.io
Developed @ Stackmate India
*/
// ------------------ '(◣ ◢)' ---------------------
import util from "util";
import * as time from '../time/time';

const { createLogger, format, transports } = require("winston");
const { combine, colorize, timestamp, prettyPrint, printf } = format;
const times = new time.S5Times();
// ------------------ '(◣ ◢)' ---------------------
const FLUENTD_ADDRESS = process.env.LOGGER_IP;
const FLUENTD_PORT = process.env.LOGGER_PORT;
const FLUENTD_PATH = '/moltres.log';

const LOG_PATH = `${process.env.HOME}/winston`;

const custom_format = printf(data => {
  if (typeof data !== "string") data.message = util.format("%o", data.message);

  const now = Date.now()

  return `ist:${times.convertUnixToIST(now)}\nlevel: ${data.level}\nmessage: ${data.message}\n`;
  // print stack trace here and never reject a stack trace?
});

const options = {
  file: {
    level: "info", // this has been thought through
    // watch out when changing it
    filename: `${LOG_PATH}/logs/moltres.log`,
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

export const logger = createLogger({
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

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  }
};

// ------------------ '(◣ ◢)' ---------------------
export const r_500 = {
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
