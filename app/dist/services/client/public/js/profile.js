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
var crypto = require("crypto");
var axios = require('axios');
var bitcoin = require("./bitcoin");
var _a = require("./aes"), encrypt = _a.encrypt, decrypt = _a.decrypt;
var exit = require("./auth").exit;
var store = require("./store");
var _b = require("./api"), apiInvite = _b.apiInvite, apiCheckSeed256 = _b.apiCheckSeed256, apiEditProfile = _b.apiEditProfile, apiGetMyProfile = _b.apiGetMyProfile, apiProfileGenesis = _b.apiProfileGenesis;
// DISPLAY
function displayProfile(profile, contact_info) {
    document.getElementById("profile_nickname").textContent = profile.nickname;
    document.getElementById("profile_username").textContent = profile.username;
    document.getElementById("profile_status").textContent = profile.status;
    document.getElementById("profile_trusting").textContent = profile.trusting.length;
    document.getElementById("profile_trusted_by").textContent = profile.trusted_by.length;
    document.getElementById("profile_contact").textContent = contact_info;
}
// HELPERS
function createCipherInfo(contact_info, derivation_scheme, profile_parent_xprv) {
    var revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
    var contact_encryption_key = bitcoin.derive_child_indexes(profile_parent_xprv, 0, revoke);
    return encrypt(contact_info, crypto.createHash('sha256').update(contact_encryption_key["xprv"]).digest('hex'));
}
function createContactInfo(cipher_info, derivation_scheme, profile_parent_xprv) {
    var revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
    var contact_encryption_key = bitcoin.derive_child_indexes(profile_parent_xprv, 0, revoke);
    return decrypt(cipher_info, crypto.createHash('sha256').update(contact_encryption_key["xprv"]).digest('hex'));
}
// COMPOSITES
function initProfileState() {
    return __awaiter(this, void 0, void 0, function () {
        var my_profile_and_keys, _a, my_recipient_xpub, new_profile_and_keys;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(store.getMyProfile() && store.getMyKeys())) return [3 /*break*/, 1];
                    _a = { profile: store.getMyProfile(), keys: store.getMyKeys() };
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, apiGetMyProfile(store.getToken())];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    my_profile_and_keys = _a;
                    if (!(my_profile_and_keys instanceof Error)) return [3 /*break*/, 6];
                    if (!(my_profile_and_keys.name === "404" && my_profile_and_keys.message.startsWith("No profile"))) return [3 /*break*/, 5];
                    my_recipient_xpub = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']["xprv"], 0, 0)['xpub'];
                    return [4 /*yield*/, apiProfileGenesis(my_recipient_xpub, token)];
                case 4:
                    new_profile_and_keys = _b.sent();
                    if (new_profile_and_keys instanceof Error) {
                        console.error("ERROR AT initProfileState - apiProfileGenesis");
                        console.error({ e: e });
                    }
                    return [2 /*return*/, new_profile_and_keys];
                case 5:
                    console.error("ERROR at initProfileState");
                    console.error({ my_profile_and_keys: my_profile_and_keys });
                    _b.label = 6;
                case 6: return [2 /*return*/, my_profile_and_keys];
            }
        });
    });
}
function editComposite() {
    return __awaiter(this, void 0, void 0, function () {
        var nickname, status, contact_info, cipher_info, new_profile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nickname = document.getElementById("nickname_input").value;
                    status = document.getElementById("status_input").value;
                    contact_info = document.getElementById("contact_input").value;
                    cipher_info = (contact_info) ? createCipherInfo(contact_info, store.getMyProfile()['derivation_scheme'], store.getParentKeys()["profile_parent"]['xprv']) : null;
                    return [4 /*yield*/, apiEditProfile(nickname, cipher_info, status, store.getToken())];
                case 1:
                    new_profile = _a.sent();
                    if (new_profile instanceof Error) {
                        console.error({ e: new_profile });
                    }
                    else {
                        store.setMyProfile(new_profile.profile);
                        displayProfile(new_profile.profile, createContactInfo(new_profile["profile"]["cipher_info"], new_profile["profile"]['derivation_scheme'], store.getParentKeys()["profile_parent"]['xprv']));
                    }
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    });
}
function importKeys() {
    return __awaiter(this, void 0, void 0, function () {
        var seed, password, status, root, parent_128;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seed = document.getElementById("import_keys_input").value;
                    document.getElementById("import_keys_input").value = "";
                    password = document.getElementById("import_keys_password_input").value;
                    document.getElementById("import_keys_password_input").value = "";
                    return [4 /*yield*/, apiCheckSeed256(store.getToken(), seed, store.getUsername(), password)];
                case 1:
                    status = _a.sent();
                    if (!(status instanceof Error)) return [3 /*break*/, 2];
                    console.error({ apiCheckSeed256: status });
                    return [3 /*break*/, 5];
                case 2:
                    if (!status) return [3 /*break*/, 4];
                    return [4 /*yield*/, bitcoin.seed_root(seed)];
                case 3:
                    root = _a.sent();
                    parent_128 = bitcoin.derive_parent_128(root);
                    if (!store.setParent128(parent_128, store.getUsername(), password)) {
                        console.error("Error setting parent_128 key.");
                        return [2 /*return*/, false];
                    }
                    if (!store.setParentKeys(parent_128['xprv'])) {
                        console.error("Error setting parent usecase keys.");
                        return [2 /*return*/, false];
                    }
                    else {
                        alert("Successfully Imported Keys");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    alert("Incorrect Seed!!!");
                    _a.label = 5;
                case 5:
                    window.location.reload();
                    return [2 /*return*/];
            }
        });
    });
}
// EVENT LISTENERS
function loadProfileEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var path, endpoint, _a, init_profile, contact_info;
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
                        case "profile": return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 3];
                case 1:
                    document.getElementById("profile_username").textContent = store.getUsername();
                    if (!localStorage.getItem(store.getUsername() + "_parent_128")) {
                        document.getElementById("import_keys_button").click();
                    }
                    document.getElementById("exit").addEventListener("click", function (event) {
                        event.preventDefault();
                        exit();
                    });
                    return [4 /*yield*/, initProfileState()];
                case 2:
                    init_profile = _b.sent();
                    if (init_profile instanceof Error) {
                        alert("Error initializing profile state");
                    }
                    store.setMyProfile(init_profile['profile']);
                    store.setMyKeys(init_profile['keys']);
                    contact_info = (store.getParentKeys() && init_profile['profile']['cipher_info']) ?
                        createContactInfo(init_profile['profile']['cipher_info'], init_profile['profile']['derivation_scheme'], store.getParentKeys()['profile_parent']['xprv']) :
                        (init_profile['profile']['cipher_info']) ?
                            init_profile['profile']['cipher_info'] :
                            "No contact info added.";
                    displayProfile(init_profile['profile'], contact_info);
                    /***
                     *
                     *
                     * BUTTONS
                     *
                     *
                     *
                     */
                    document.getElementById("edit_profile_execute").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            editComposite();
                            return [2 /*return*/];
                        });
                    }); });
                    /**
                     * MODAL EXECUTE BUTTON
                     */
                    document.getElementById("import_keys_execute").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            event.preventDefault();
                            importKeys();
                            return [2 /*return*/];
                        });
                    }); });
                    document.getElementById("invite_button").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var invite_link;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.preventDefault();
                                    return [4 /*yield*/, apiInvite(store.getUsername(), store.getToken())];
                                case 1:
                                    invite_link = _a.sent();
                                    if (invite_link instanceof Error) {
                                        console.error({ invite_link: invite_link });
                                    }
                                    else {
                                        document.getElementById("invite_link_space").textContent = invite_link;
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    document.getElementById("invite_link_space").addEventListener("click", function (event) {
                        event.preventDefault();
                        var copyText = document.getElementById("invite_link_space");
                        navigator.clipboard.writeText(copyText.textContent);
                        alert("Copied invitation link to clipboard.");
                    });
                    return [3 /*break*/, 4];
                case 3: return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
window.onload = loadProfileEvents();
module.exports = {};
/**
 *
 * ishi9
 * hawk injury roast shy market vendor alone combine wasp pledge gadget appear
 * test
 *
 *
 * bwij
 * sing frost length wait group salon man area reduce snap betray moral
 * test
 *
 *
 * bob
 * glow spot next melt purity music magnet axis business observe galaxy all
 *
 *
 *
 * ishi
 *
 */
//# sourceMappingURL=profile.js.map