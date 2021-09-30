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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var mongo_1 = require("../../lib/storage/mongo");
var mongo_2 = require("./mongo");
var store = new mongo_2.MongoPostStore();
var db = new mongo_1.MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
var username = "ishi";
var id0 = "someid1";
var id1 = "someid1";
var id2 = "someid1";
var ds0 = "2h/0h/0h";
var ds1 = "2h/1h/0h";
var ds2 = "2h/2h/0h";
var post0 = {
    username: username,
    id: id0,
    genesis: Date.now(),
    expiry: Date.now() + 1000 * 60 * 60 * 2,
    cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
    derivation_scheme: ds0,
};
var post1 = {
    username: username,
    id: id1,
    genesis: Date.now(),
    expiry: Date.now() + 1000 * 60 * 60 * 2,
    cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
    derivation_scheme: ds1,
};
var post2 = {
    username: username,
    id: id2,
    genesis: Date.now(),
    expiry: Date.now() + 1000 * 60 * 60 * 2,
    cipher_json: "asoidasodkjajsd:asfaskfjsw982iujkdwoiesjkdoefdlkj",
    derivation_scheme: ds2,
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Posts Storage", function () {
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        connection = {
                            port: process.env.DB_PORT,
                            ip: process.env.DB_IP,
                            name: 'lionbit',
                            auth: 'lb:secret',
                        };
                        return [4 /*yield*/, db.connect(connection)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    });
    describe("PROFILE STORAGE OPERATIONS:", function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                it("should CREATE a NEW PROFILE in mongo AND READ PROFILE from mongo", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, post, posts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.create(post0)];
                                case 1:
                                    response = _a.sent();
                                    chai_1.expect(response['id']).to.equal(id0);
                                    return [4 /*yield*/, store.read({ id: post0.id })];
                                case 2:
                                    post = _a.sent();
                                    if (post instanceof Error)
                                        throw post;
                                    chai_1.expect(post[0]['genesis']).to.equal(post0.genesis);
                                    return [4 /*yield*/, store.create(post1)];
                                case 3:
                                    _a.sent();
                                    return [4 /*yield*/, store.create(post2)];
                                case 4:
                                    _a.sent();
                                    return [4 /*yield*/, store.readMany([post0.id, post1.id, post2.id])];
                                case 5:
                                    posts = _a.sent();
                                    if (posts instanceof Error)
                                        throw posts;
                                    chai_1.expect(posts.length).to.equal(3);
                                    return [4 /*yield*/, store.read({ username: username })];
                                case 6:
                                    posts = _a.sent();
                                    if (posts instanceof Error)
                                        throw posts;
                                    chai_1.expect(posts.length).to.equal(3);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it("should REMOVE each POST", function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, posts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, store.remove(id0)];
                                case 1:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, store.remove(id1)];
                                case 2:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, store.remove(id2)];
                                case 3:
                                    response = _a.sent();
                                    if (response instanceof Error)
                                        throw response;
                                    chai_1.expect(response).to.equal(true);
                                    return [4 /*yield*/, store.read({ username: username })];
                                case 4:
                                    posts = _a.sent();
                                    if (posts instanceof Error)
                                        throw posts;
                                    chai_1.expect(posts.length).to.equal(0);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    });
});
//# sourceMappingURL=mongo.spec.js.map