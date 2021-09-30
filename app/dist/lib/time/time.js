"use strict";
/*
cypherpost.io
Developed @ Stackmate India
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.dst = exports.ist = exports.global = exports.S5Times = void 0;
var S5Times = /** @class */ (function () {
    function S5Times() {
    }
    S5Times.prototype.convertUnixToGlobal = function (timestamp) {
        return global(timestamp);
    };
    S5Times.prototype.convertUnixToIST = function (timestamp) {
        return ist(timestamp);
    };
    S5Times.prototype.convertUnixToDST = function (timestamp) {
        return dst(timestamp);
    };
    return S5Times;
}());
exports.S5Times = S5Times;
function global(timestamp) {
    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    var london = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Europe/London"
    });
    // const londonTimeTForm = new Date(london);
    var brisbane = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Australia/Brisbane"
    });
    // const aestTimeTForm = new Date(brisbane);
    var shanghai = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Shanghai"
    });
    // const asiaTimeTForm = new Date(kolkata);
    var vancouver = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "America/Vancouver"
    });
    // const canadaWestTimeTForm = new Date(vancouver);
    var kolkata = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });
    // const indiaTimeTForm = new Date(kolkata);
    var nyc = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "America/New_york"
    });
    // const usaTimeTForm = new Date(nyc);
    var amsterdam = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Europe/Amsterdam"
    });
    // const netherlandsTimeTForm = new Date(amsterdam);
    var curacao = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "America/Curacao"
    });
    // const curacaoTimeTForm = new Date(curacao);
    return {
        brisbane: brisbane,
        shanghai: shanghai,
        nyc: nyc,
        kolkata: kolkata,
        vancouver: vancouver,
        amsterdam: amsterdam,
        curacao: curacao,
        london: london
    };
}
exports.global = global;
;
function ist(timestamp) {
    var indiaTime = new Date(timestamp).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    });
    // const indiaTimeTForm = new Date(indiaTime);
    return indiaTime;
}
exports.ist = ist;
function dst(timestamp) {
    var netherlandsTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Amsterdam"
    });
    // const netherlandsTimeTForm = new Date(netherlandsTime);
    return netherlandsTime;
}
exports.dst = dst;
//# sourceMappingURL=time.js.map