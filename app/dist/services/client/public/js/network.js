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
var bitcoin = require("./bitcoin");
var _a = require("./aes"), encrypt = _a.encrypt, decrypt = _a.decrypt;
var store = require("./store");
var exit = require("./auth").exit;
var _b = require('./api'), apiRevoke = _b.apiRevoke, apiTrust = _b.apiTrust, apiGetMyProfile = _b.apiGetMyProfile, apiGetUsernames = _b.apiGetUsernames, apiGetUserProfile = _b.apiGetUserProfile, apiGetManyProfiles = _b.apiGetManyProfiles, apiMuteUser = _b.apiMuteUser;
// console.log({ existing_usernames });
// console.log({ trusting_usernames });
// console.log({ search_usernames });
function trust(username) {
    return __awaiter(this, void 0, void 0, function () {
        var other_profile, _a, other_recipient_xpub, my_recipient_xprv, ecdsa_grouped, shared_secret, derivation_scheme, revoke, profile_encryption_key, encrypted_pek, signature, updated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(store.getUserProfile(username))) return [3 /*break*/, 1];
                    _a = store.getUserProfile(username);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, apiGetUserProfile(store.getToken(), username)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    other_profile = _a;
                    store.setUserProfile(username, other_profile);
                    other_recipient_xpub = other_profile.recipient_xpub;
                    my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
                    ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
                    shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
                    derivation_scheme = store.getMyProfile()['derivation_scheme'];
                    revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
                    profile_encryption_key = crypto.createHash('sha256')
                        .update(bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, revoke)['xprv'])
                        .digest('hex');
                    encrypted_pek = encrypt(profile_encryption_key, shared_secret);
                    signature = ".signLater.";
                    return [4 /*yield*/, apiTrust(store.getToken(), username, encrypted_pek, signature)];
                case 4:
                    updated = _b.sent();
                    if (updated instanceof Error) {
                        console.error({ trusting: updated });
                        alert("Failed to trust " + username);
                    }
                    else {
                        // do the right thing
                        store.setMyProfile(updated);
                        alert("Trusting " + username);
                        window.location.reload();
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function revoke(username) {
    return __awaiter(this, void 0, void 0, function () {
        var revoke_profile, _a, index, decryption_keys_1, my_profile, current_profile_ds, revoke_1, derivation_scheme_update, contact_decryption_key, contact_info, new_profile_key_1, updated_cipher_info, trusting_profiles, my_recipient_xprv_1, updated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!confirm("Revoke Trust for " + username + "?")) return [3 /*break*/, 7];
                    if (!(store.getUserProfile(username))) return [3 /*break*/, 1];
                    _a = store.getUserProfile(username);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, apiGetUserProfile(store.getToken(), username)];
                case 2:
                    _a = _b.sent();
                    _b.label = 3;
                case 3:
                    revoke_profile = _a;
                    store.setUserProfile(username, revoke_profile);
                    index = trusting_usernames.indexOf(username);
                    if (index > -1) {
                        trusting_usernames.splice(index, 1);
                    }
                    decryption_keys_1 = [];
                    my_profile = store.getMyProfile();
                    current_profile_ds = my_profile.derivation_scheme;
                    revoke_1 = parseInt(current_profile_ds.split("/")[2].replace("'", ""));
                    derivation_scheme_update = "m/0'/" + (revoke_1 + 1) + "'";
                    contact_decryption_key = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']["xprv"], 0, revoke_1);
                    contact_info = decrypt(my_profile.cipher_info, crypto.createHash('sha256').update(contact_decryption_key.xprv).digest('hex'));
                    new_profile_key_1 = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, revoke_1 + 1);
                    updated_cipher_info = encrypt(contact_info, crypto.createHash('sha256').update(new_profile_key_1.xprv).digest('hex'));
                    if (!(trusting_usernames.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, apiGetManyProfiles(store.getToken(), trusting_usernames)];
                case 4:
                    trusting_profiles = _b.sent();
                    my_recipient_xprv_1 = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
                    trusting_profiles.keys.map(function (item) {
                        var ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: item.recipient_xpub, xprv: my_recipient_xprv_1 });
                        var shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
                        var encrypted_profile_key = encrypt(crypto.createHash('sha256').update(new_profile_key_1.xprv).digest('hex'), shared_secret);
                        decryption_keys_1.push({
                            key: encrypted_profile_key,
                            id: item.username
                        });
                    });
                    _b.label = 5;
                case 5: return [4 /*yield*/, apiRevoke(store.getToken(), revoke_profile.profile.username, decryption_keys_1, derivation_scheme_update, updated_cipher_info)];
                case 6:
                    updated = _b.sent();
                    if (updated instanceof Error) {
                        console.error({ updated: updated });
                        alert("Failed to revoke trust in " + username);
                    }
                    else {
                        //do the right thing
                        store.setMyProfile(updated);
                        alert("Revoked trust in " + username);
                        window.location.reload();
                        return [2 /*return*/, true];
                    }
                    return [3 /*break*/, 8];
                case 7:
                    console.log("Decided not to revoke trust!");
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function displayProfile(my_profile, my_keys, username) {
    return __awaiter(this, void 0, void 0, function () {
        var other_profile, my_trusted_by, my_trusting, other_trusted_by, trust_intersection, encrypted_contact_decryption_key_array, encrypted_contact_decryption_key, my_recipient_xprv, other_recipient_xpub, ecdsa_grouped, shared_secret, decryption_key, contact_info, trusted_by_item, is_muted_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiGetUserProfile(store.getToken(), username)];
                case 1:
                    other_profile = _a.sent();
                    if (other_profile instanceof Error) {
                        console.error({ other_profile: other_profile });
                        return [2 /*return*/, false];
                    }
                    ;
                    store.setUserProfile(username, other_profile);
                    my_trusted_by = my_profile.trusted_by.map(function (item) { return item.username; });
                    my_trusting = my_profile.trusting.map(function (item) { return item.username; });
                    other_trusted_by = other_profile.profile.trusted_by.map(function (item) { return item.username; });
                    trust_intersection = my_trusting.filter(function (username) { if (other_trusted_by.includes(username))
                        return username; });
                    // populate
                    document.getElementById("network_profile_nickname").textContent = other_profile.profile.nickname;
                    document.getElementById("network_profile_username").textContent = other_profile.profile.username;
                    document.getElementById("network_profile_status").textContent = other_profile.profile.status;
                    document.getElementById("network_profile_trust_intersection").textContent = trust_intersection.length;
                    document.getElementById('trust_intersection_list').textContent = "";
                    trust_intersection.map(function (username, i, array) {
                        if (array.length - 1 < 0)
                            return;
                        if (i === 0)
                            document.getElementById('trust_intersection_list').textContent += "Trusted By ";
                        else if (array.length - 1 === i)
                            document.getElementById('trust_intersection_list').textContent += username + ".";
                        else if (array.length - 2 === i)
                            document.getElementById('trust_intersection_list').textContent += username + " & ";
                        else
                            document.getElementById('trust_intersection_list').textContent += username + ", ";
                    });
                    console.log({ my_trusted_by: my_profile.trusted_by });
                    if (my_trusted_by.includes(username)) {
                        encrypted_contact_decryption_key_array = my_keys.profile_keys.filter(function (item) {
                            if (item.id === username)
                                return item;
                        });
                        encrypted_contact_decryption_key = (encrypted_contact_decryption_key_array.length > 0) ? encrypted_contact_decryption_key_array[0]['key'] : null;
                        my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
                        other_recipient_xpub = other_profile.recipient_xpub;
                        ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
                        shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped.private_key, ecdsa_grouped.public_key);
                        decryption_key = (encrypted_contact_decryption_key) ? decrypt(encrypted_contact_decryption_key, shared_secret) : null;
                        contact_info = (decryption_key) ? decrypt(other_profile.profile.cipher_info, decryption_key) : other_profile.profile.cipher_info;
                        // console.log({shared_secret})
                        document.getElementById("network_profile_contact").textContent = contact_info;
                        trusted_by_item = my_profile.trusted_by.filter(function (item) {
                            if (item.username === username)
                                return item;
                        });
                        is_muted_1 = trusted_by_item[0].mute;
                        if (is_muted_1) {
                            document.getElementById("network_profile_mute_button").innerHTML = "<div class=\"col-8\"></div><div class=\"col-4\"><button id=\"unmute_" + username + "\" class=\"btn-sm centerme\" type=\"button\">Unmute</button></div>";
                            document.getElementById("unmute_" + username).addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                                var updated;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            event.preventDefault();
                                            return [4 /*yield*/, apiMuteUser(store.getToken(), username, !is_muted_1)];
                                        case 1:
                                            updated = _a.sent();
                                            console.log({ updated: updated });
                                            alert("Unmuted");
                                            displayProfile(updated, store.getMyKeys(), username);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        else {
                            document.getElementById("network_profile_mute_button").innerHTML = "<div class=\"col-8\"></div><div class=\"col-4\"><button id=\"mute_" + username + "\" class=\"btn-sm centerme\" type=\"button\">Mute</button></div>";
                            document.getElementById("mute_" + username).addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                                var updated;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            event.preventDefault();
                                            return [4 /*yield*/, apiMuteUser(store.getToken(), username, !is_muted_1)];
                                        case 1:
                                            updated = _a.sent();
                                            console.log({ updated: updated });
                                            alert("Muted");
                                            displayProfile(updated, store.getMyKeys(), username);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                    }
                    else {
                        document.getElementById("network_profile_contact").textContent = other_profile.profile.cipher_info;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function filterUsernamesByTrust(my_profile, existing_usernames) {
    var index = existing_usernames.indexOf(store.getUsername());
    if (index > -1) {
        existing_usernames.splice(index, 1);
    }
    ;
    trusting_usernames = my_profile["trusting"].map(function (item) { return item.username; });
    trusted_by_usernames = my_profile["trusted_by"].map(function (item) { return item.username; });
    search_usernames = existing_usernames.filter(function (username) {
        if (!trusting_usernames.includes(username)) {
            return username;
        }
    });
    return {
        trusting_usernames: trusting_usernames,
        trusted_by_usernames: trusted_by_usernames,
        search_usernames: search_usernames
    };
}
function loadNetworkEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var my_profile, existing_usernames, _a, trusting_usernames, trusted_by_usernames, search_usernames;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    /**
                     *
                     *
                     * check if my profile exists.
                     * check if existing_usuernames exists
                     * populate network with trusted, trusted by and remaining users
                     *
                     */
                    document.getElementById("exit").addEventListener("click", function (event) {
                        event.preventDefault();
                        exit();
                    });
                    return [4 /*yield*/, apiGetMyProfile(store.getToken())];
                case 1:
                    my_profile = _b.sent();
                    if (my_profile instanceof Error) {
                        console.error(my_profile);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, apiGetUsernames(true, store.getToken())];
                case 2:
                    existing_usernames = _b.sent();
                    if (existing_usernames instanceof Error) {
                        console.error(existing_usernames);
                        return [2 /*return*/];
                    }
                    store.setMyProfile(my_profile.profile);
                    store.setMyKeys(my_profile.keys);
                    store.setExistingUsernames(existing_usernames);
                    _a = filterUsernamesByTrust(store.getMyProfile(), store.getExistingUsernames()), trusting_usernames = _a.trusting_usernames, trusted_by_usernames = _a.trusted_by_usernames, search_usernames = _a.search_usernames;
                    search_usernames.map(function (username) {
                        document.getElementById('search_userlist').innerHTML += "<div id=\"search_item_" + username + "\" class=\"row\"><div class=\"col-8 outline leftme\">" + username + "</div><div class=\"col-4 outline\"><button id=\"trust_" + username + "\" class=\"btn-sm centerme\" type=\"submit\">Trust</button></div></div><hr>";
                    });
                    search_usernames.map(function (username) {
                        document.getElementById("trust_" + username).addEventListener("click", function (event) {
                            event.preventDefault();
                            trust(username);
                        });
                        document.getElementById("search_item_" + username).addEventListener("click", function (event) {
                            event.preventDefault();
                            displayProfile(store.getMyProfile(), store.getMyKeys(), username);
                        });
                    });
                    trusting_usernames.map(function (username) {
                        document.getElementById('trusting_userlist').innerHTML += "<div id=\"trusting_item_" + username + "\" class=\"row\"><div class=\"col-8 outline leftme\">" + username + "</div><div class=\"col-4 outline\"><button id=\"trusting_revoke_" + username + "\" class=\"btn-sm centerme\" type=\"submit\">Trusting</button></div></div><hr>";
                    });
                    trusting_usernames.map(function (username) {
                        document.getElementById("trusting_revoke_" + username).addEventListener("click", function (event) {
                            event.preventDefault();
                            revoke(username);
                        });
                        document.getElementById("trusting_item_" + username).addEventListener("click", function (event) {
                            event.preventDefault();
                            displayProfile(store.getMyProfile(), store.getMyKeys(), username);
                        });
                    });
                    trusted_by_usernames.map(function (username) {
                        /**
                         *
                         * Check if the user is already trusted by the current user
                         * Accordingly change button text
                         *
                         */
                        if (trusting_usernames.includes(username))
                            document.getElementById('trusted_by_userlist').innerHTML += "<div id=\"trusted_by_item_" + username + "\" class=\"row\"><div class=\"col-8 outline leftme\">" + username + "</div><div class=\"col-4 outline\"><button id=\"trusted_by_revoke_" + username + "\" class=\"btn-sm centerme\" type=\"submit\">Trusting</button></div></div><hr>";
                        else
                            document.getElementById('trusted_by_userlist').innerHTML += "<div id=\"trusted_by_item_" + username + "\" class=\"row\"><div class=\"col-8 outline leftme\">" + username + "</div><div class=\"col-4 outline\"><button id=\"trusted_by_" + username + "\" class=\"btn-sm centerme\" type=\"submit\">Trust</button></div></div><hr>";
                    });
                    trusted_by_usernames.map(function (username) {
                        if (trusting_usernames.includes(username))
                            document.getElementById("trusted_by_revoke_" + username).addEventListener("click", function (event) {
                                event.preventDefault();
                                revoke(username);
                            });
                        else
                            document.getElementById("trusted_by_" + username).addEventListener("click", function (event) {
                                event.preventDefault();
                                trust(username);
                            });
                        document.getElementById("trusted_by_item_" + username).addEventListener("click", function (event) {
                            event.preventDefault();
                            displayProfile(store.getMyProfile(), store.getMyKeys(), username);
                        });
                    });
                    document.getElementById("network_trusting_menu").addEventListener("click", function (event) {
                        event.preventDefault();
                        document.getElementById("network_trusting").classList.remove("hidden");
                        document.getElementById("network_trusted_by").classList.add("hidden");
                        document.getElementById("network_search").classList.add("hidden");
                        // document.getElementById("network_trust_intersection").classList.add("hidden");
                    });
                    document.getElementById("network_trusted_by_menu").addEventListener("click", function (event) {
                        event.preventDefault();
                        document.getElementById("network_trusting").classList.add("hidden");
                        document.getElementById("network_trusted_by").classList.remove("hidden");
                        document.getElementById("network_search").classList.add("hidden");
                        // document.getElementById("network_trust_intersection").classList.add("hidden");
                    });
                    document.getElementById("network_search_menu").addEventListener("click", function (event) {
                        event.preventDefault();
                        document.getElementById("network_trusting").classList.add("hidden");
                        document.getElementById("network_trusted_by").classList.add("hidden");
                        document.getElementById("network_search").classList.remove("hidden");
                        // document.getElementById("network_trust_intersection").classList.add("hidden");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
window.onload = loadNetworkEvents();
// harbor where mask emotion bubble eye measure canoe detail swing inmate observe
// bala-test
// solve same across violin fox tribe beef ridge kid humor breeze before
// ishi
// spike afford eagle pull analyst dust version surface metal page brave vacuum
// dust
//# sourceMappingURL=network.js.map