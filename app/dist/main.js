"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
cypherpost.io
Developed @ Stackmate India
*/
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
var winston_1 = require("./lib/logger/winston");
var express_1 = require("./lib/server/express");
var mongo_1 = require("./lib/storage/mongo");
var db = new mongo_1.MongoDatabase();
var key_path = process.env.KEY_PATH;
var filename = "sats_sig";
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
db.connect({
    port: process.env.DB_PORT,
    ip: process.env.DB_IP,
    name: process.env.DB_NAME,
    auth: process.env.DB_AUTH
}).catch(function (e) {
    winston_1.logger.error(e);
    process.exit(1);
});
express_1.start(process.env.MOLTRES_PORT).catch(function (e) {
    winston_1.logger.error(e);
    process.exit(1);
});
// -----° ̿ ̿'''\̵͇̿̿\з=(◕_◕)=ε/̵͇̿̿/'̿'̿ ̿ °-----------
//# sourceMappingURL=main.js.map