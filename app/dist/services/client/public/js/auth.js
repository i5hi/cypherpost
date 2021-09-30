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
/**
 *
 * localStorage:
 *  ${username}_parent_128
 *
 * sessionStorage:
 *  existing_usernames
 *  token
 *  username
 *  inivited_by
 *  invite_code
 *  seed256
 *  recipient_parent
 *  profile_parent
 *  posts_parent
 */
var crypto = require("crypto");
var loadInitialState = require('./init').loadInitialState;
var store = require("./store");
var bitcoin = require("./bitcoin");
var _a = require("./api"), apiLogin = _a.apiLogin, apiRegister = _a.apiRegister, apiReset = _a.apiReset, apiGetUsernames = _a.apiGetUsernames;
var web_url = (document.domain === 'localhost') ? "http://localhost" : "https://lionbit.network";
// DISPLAY
function displayInvitation(valid, invited_by) {
    if (valid) {
        document.getElementById('invitation').textContent = "You have been invited by " + invited_by + ".";
    }
    else {
        document.getElementById('invitation').textContent = "Your invitation is invalid or expired.";
        document.getElementById("seed_note_0").classList.add("hidden");
        document.getElementById("seed_note_1").classList.add("hidden");
    }
}
function displayMnemonic(mnemonic) {
    document.getElementById("welcome").classList.add("hidden");
    document.getElementById("seedgen").classList.remove("hidden");
    document.getElementById('mnemonic').textContent = mnemonic;
    return true;
}
function displayRegistration() {
    document.getElementById("seedgen").classList.add("hidden");
    document.getElementById("registration").classList.remove("hidden");
    return true;
}
// STORAGE
function storeInvitation() {
    var params = new URLSearchParams(window.location.search);
    if (params.has('invited_by') && params.has('invite_code')) {
        if (!store.setInvitation(params.get('invited_by'), params.get('invite_code')))
            return false;
        else
            return true;
    }
    else {
        return false;
    }
    ;
}
function tempParentAndSeed256Storage(seed) {
    return __awaiter(this, void 0, void 0, function () {
        var root, parent_128, seed256;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bitcoin.seed_root(seed)];
                case 1:
                    root = _a.sent();
                    parent_128 = bitcoin.derive_parent_128(root);
                    if (!store.setParentKeys(parent_128['xprv'])) {
                        console.error("Error setting parent keys.");
                        return [2 /*return*/, false];
                    }
                    // temp encryption
                    store.setParent128(parent_128, "temp", "temp");
                    seed256 = crypto.createHash('sha256')
                        .update(seed)
                        .digest('hex');
                    return [2 /*return*/, store.setSeed256(seed256)];
            }
        });
    });
}
function updateParentStorage(username, password) {
    var parent_128_plain = store.getParent128("temp", "temp");
    // update encryption
    return store.setParent128(parent_128_plain, username, password);
}
// GLOBAL
function exit() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            sessionStorage.clear();
            window.location.href = web_url;
            return [2 /*return*/];
        });
    });
}
function decodeJWTUser(token) {
    return __awaiter(this, void 0, void 0, function () {
        var split_token, header, payload;
        return __generator(this, function (_a) {
            split_token = token.split(".");
            header = JSON.parse(Buffer.from(split_token[0], "base64"));
            payload = JSON.parse(Buffer.from(split_token[1], "base64"));
            console.log(header, payload['payload']);
            return [2 /*return*/, payload['payload']['user']];
        });
    });
}
// COMPOSITES
function registerComposite() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, confirm, token, status_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = document.getElementById("register_username").value;
                    password = document.getElementById("register_pass").value;
                    confirm = document.getElementById("register_confirm_pass").value;
                    document.getElementById("register_pass").value = "";
                    document.getElementById("register_confirm_pass").value = "";
                    return [4 /*yield*/, apiRegister(username, password, confirm)];
                case 1:
                    token = _a.sent();
                    if (!(token instanceof Error)) return [3 /*break*/, 2];
                    alert(e.message);
                    return [2 /*return*/, false];
                case 2:
                    updateParentStorage(username, password);
                    return [4 /*yield*/, loadInitialState(token, username, password)];
                case 3:
                    status_1 = _a.sent();
                    if (!status_1)
                        alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
                    window.location.href = "profile";
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function resetComposite() {
    return __awaiter(this, void 0, void 0, function () {
        var seed, password, confirm, token, username, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seed = document.getElementById("reset_seed").value;
                    password = document.getElementById("reset_pass").value;
                    confirm = document.getElementById("reset_confirm_pass").value;
                    document.getElementById("reset_seed").value = "";
                    document.getElementById("reset_pass").value = "";
                    document.getElementById("reset_confirm_pass").value = "";
                    return [4 /*yield*/, apiReset(seed, password, confirm)];
                case 1:
                    token = _a.sent();
                    if (token instanceof Error) {
                        alert(token.message);
                        return [2 /*return*/, false];
                    }
                    username = decodeJWTUser(token);
                    updateParentStorage(username, password);
                    return [4 /*yield*/, loadInitialState(token, username, password)];
                case 2:
                    status = _a.sent();
                    if (!status)
                        alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
                    else
                        window.location.href = "posts";
                    return [2 /*return*/];
            }
        });
    });
}
function loginComposite() {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, token, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username = document.getElementById("login_username").value;
                    password = document.getElementById("login_pass").value;
                    document.getElementById("login_pass").value = "";
                    return [4 /*yield*/, apiLogin(username, password)];
                case 1:
                    token = _a.sent();
                    if (token instanceof Error) {
                        alert(token.message);
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, loadInitialState(token, username, password)];
                case 2:
                    status = _a.sent();
                    if (!status)
                        alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
                    else if (status === "import_seed")
                        window.location.href = "profile";
                    else
                        window.location.href = "posts";
                    return [2 /*return*/];
            }
        });
    });
}
// EVENT LISTENERS
function loadAuthEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var path, endpoint, _a, params, invited_by, invite_code, usernames;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    path = window.location.href.split("/");
                    endpoint = path[path.length - 1];
                    if (endpoint.startsWith('invitation'))
                        endpoint = "invitation";
                    if (endpoint === '')
                        endpoint = "home";
                    else
                        endpoint = endpoint.split(".")[0];
                    _a = endpoint;
                    switch (_a) {
                        case "home": return [3 /*break*/, 1];
                        case "login": return [3 /*break*/, 2];
                        case "invitation": return [3 /*break*/, 3];
                        case "reset": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 1:
                    document.getElementById("home_login").addEventListener("click", function (event) {
                        event.preventDefault();
                        window.location.href = "login";
                    });
                    document.getElementById("home_reset").addEventListener("click", function (event) {
                        event.preventDefault();
                        window.location.href = "reset";
                    });
                    return [3 /*break*/, 7];
                case 2:
                    document.getElementById("login_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            loginComposite();
                            return [2 /*return*/];
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 3:
                    document.getElementById("show_mnemonic_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            displayMnemonic(bitcoin.generate_mnemonic());
                            return [2 /*return*/];
                        });
                    }); });
                    document.getElementById("setup_access_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.preventDefault();
                                    return [4 /*yield*/, tempParentAndSeed256Storage(document.getElementById("mnemonic").textContent)];
                                case 1:
                                    _a.sent();
                                    document.getElementById("mnemonic").textContent = "";
                                    displayRegistration();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    document.getElementById("register_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            registerComposite();
                            return [2 /*return*/];
                        });
                    }); });
                    params = new URLSearchParams(window.location.search);
                    invited_by = params.get('invited_by');
                    invite_code = params.get('invite_code');
                    return [4 /*yield*/, apiGetUsernames(false, invite_code, invited_by)];
                case 4:
                    usernames = _b.sent();
                    if (usernames && usernames.includes(invited_by)) {
                        storeInvitation();
                        displayInvitation(true, invited_by);
                        store.setExistingUsernames(usernames);
                    }
                    else
                        displayInvitation(false);
                    return [3 /*break*/, 7];
                case 5:
                    document.getElementById("reset_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            resetComposite();
                            return [2 /*return*/];
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 6: return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
window.onload = loadAuthEvents();
module.exports = {
    exit: exit
};
/**
 * test user
 * ishi9
 * hawk injury roast shy market vendor alone combine wasp pledge gadget appear
 * test
 */ 
//# sourceMappingURL=auth.js.map