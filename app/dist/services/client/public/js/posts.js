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
 * attitude beef fault floor script hurdle demand sell glow exact raise such
 * lucy
 */
var crypto = require("crypto");
var bitcoin = require("./bitcoin");
var _a = require("./aes"), encrypt = _a.encrypt, decrypt = _a.decrypt;
var exit = require("./auth").exit;
var _b = require("./api"), apiGetOthersPosts = _b.apiGetOthersPosts, apiGetMyProfile = _b.apiGetMyProfile, apiGetManyProfiles = _b.apiGetManyProfiles, apiGetMyPosts = _b.apiGetMyPosts, apiCreatePost = _b.apiCreatePost, apiGetUserProfile = _b.apiGetUserProfile, apiDeletePost = _b.apiDeletePost;
var store = require("./store");
function populateOthersPosts(others_posts) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            document.getElementById('others_posts_list').innerHTML = "";
            if (others_posts.length > 0) {
                others_posts.map(function (post) { return __awaiter(_this, void 0, void 0, function () {
                    var my_keys, other_profile, _a, my_recipient_xprv, other_recipient_xpub, ecdsa_grouped, shared_secret, this_posts_cipher_key, this_posts_plain_key, this_post_plain_json, message, matching_profile_keys, contact_cipher_key, contact_info, contact_plain_key, expiry_time;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                // get your post_keys from my_profile
                                // compute shared_secret for this posts user
                                console.log("CONDITION", trusted_by_usernames.includes(post.username));
                                if (post.expiry < Date.now())
                                    return [2 /*return*/];
                                // temporary fix to not show posts by trusted_by
                                if (!trusted_by_usernames.includes(post.username))
                                    return [2 /*return*/];
                                my_keys = store.getMyKeys();
                                if (!(store.getUserProfile(post.username))) return [3 /*break*/, 1];
                                _a = store.getUserProfile(post.username);
                                return [3 /*break*/, 3];
                            case 1: return [4 /*yield*/, apiGetUserProfile(store.getToken(), post.username)];
                            case 2:
                                _a = _b.sent();
                                _b.label = 3;
                            case 3:
                                other_profile = _a;
                                if (other_profile instanceof Error) {
                                    console.error({ other_profile: other_profile });
                                    return [2 /*return*/];
                                }
                                store.setUserProfile(post.username, other_profile);
                                console.log({ other_profile: other_profile });
                                my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
                                other_recipient_xpub = other_profile.recipient_xpub;
                                console.log({ other_recipient_xpub: other_recipient_xpub });
                                ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
                                shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped.private_key, ecdsa_grouped.public_key);
                                console.log({ shared_secret: shared_secret });
                                this_posts_cipher_key = my_keys['post_keys'].filter(function (item) { if (item.id === post.id)
                                    return item; })[0]['key'];
                                console.log({ this_posts_cipher_key: this_posts_cipher_key });
                                this_posts_plain_key = decrypt(this_posts_cipher_key, shared_secret);
                                console.log({ this_posts_plain_key: this_posts_plain_key });
                                this_post_plain_json = decrypt(post.cipher_json, this_posts_plain_key);
                                message = JSON.parse(this_post_plain_json)['message'];
                                matching_profile_keys = my_keys['profile_keys'].filter(function (item) { if (item.id === post.username)
                                    return item; });
                                contact_cipher_key = (matching_profile_keys.length === 1) ? matching_profile_keys[0].key : "none";
                                console.log({ contact_cipher_key: contact_cipher_key });
                                contact_info = other_profile['profile']['cipher_info'];
                                if (contact_cipher_key !== "none") {
                                    contact_plain_key = decrypt(contact_cipher_key, shared_secret);
                                    contact_info = (other_profile['profile']['cipher_info']) ? decrypt(other_profile['profile']['cipher_info'], contact_plain_key) : "No Contact Info Added.";
                                }
                                if (post.expiry !== 0) {
                                    expiry_time = void 0;
                                    if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
                                        expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24)) + " days";
                                    else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
                                        expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60 * 60)) + " hours";
                                    else
                                        expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60)) + " minutes";
                                    document.getElementById('others_posts_list').innerHTML += "<div class=\"container border outline\"><br><div class=\"container\"><div class=\"row\"><div class=\"container\"><div id=\"my_post_username_" + post.id + "\" class=\"row post_username\">@" + post.username + "</div><div id=\"my_post_message_" + post.id + "\" class=\"row post_message\"><div>" + message + "</div></div><div id=\"my_post_contact_" + post.id + "\" class=\"row contact_info\"><div class=\"container\">" + contact_info + "</div></div><hr><div id=\"my_post_genesis_" + post.id + "\" class=\"row contact_info\">Genesis: " + new Date(post.genesis) + "</div><div id=\"my_post_expiry_" + post.id + "\" class=\"row contact_info\">Expiry: " + expiry_time + "</div></div></div><div class=\"row\"><div class=\"col-8\"></div><div class=\"col-4\"></div></div><br></div></div><br>";
                                }
                                else
                                    document.getElementById('others_posts_list').innerHTML += "<div class=\"container border outline\"><br><div class=\"container\"><div class=\"row\"><div class=\"container\"><div id=\"my_post_username_" + post.id + "\" class=\"row post_username\">@" + post.username + "</div><div id=\"my_post_message_" + post.id + "\" class=\"row post_message\"><div>" + message + "</div></div><div id=\"my_post_contact_" + post.id + "\" class=\"row contact_info\"><div class=\"container\">" + contact_info + "</div></div><hr><div id=\"my_post_genesis_" + post.id + "\" class=\"row contact_info\">Genesis: " + new Date(post.genesis) + "</div><div id=\"my_post_expiry_" + post.id + "\" class=\"row contact_info\">Expiry: Never</div></div></div><div class=\"row\"><div class=\"col-8\"></div><div class=\"col-4\"></div></div><br></div></div><br>";
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
            else
                document.getElementById('others_posts_list').innerHTML += "No one in your network has posted yet.";
            return [2 /*return*/];
        });
    });
}
function populateMyPosts(my_posts) {
    document.getElementById('my_posts_list').innerHTML = "";
    var my_profile = store.getMyProfile();
    if (my_posts.length > 0) {
        my_posts.map(function (post) {
            if (post.expiry < Date.now())
                return;
            var post_index = parseInt(post.derivation_scheme.split("/")[1].replace("'", ""));
            var post_revoke = parseInt(post.derivation_scheme.split("/")[2].replace("'", ""));
            var post_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['posts_parent']['xprv'], post_index, post_revoke);
            var plain_json = decrypt(post.cipher_json, crypto.createHash('sha256').update(post_encryption_pair['xprv']).digest('hex'));
            var message = JSON.parse(plain_json).message;
            var current_profile_ds = my_profile.derivation_scheme;
            var profile_revoke = parseInt(current_profile_ds.split("/")[2].replace("'", ""));
            var profile_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, profile_revoke);
            var contact_info = (my_profile.cipher_info) ? decrypt(my_profile.cipher_info, crypto.createHash('sha256').update(profile_encryption_pair['xprv']).digest('hex')) : "No Contact Info Added.";
            if (post.expiry !== 0) {
                var expiry_time = void 0;
                if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
                    expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24)) + " days";
                else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
                    expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60 * 60)) + " hours";
                else
                    expiry_time = Math.round((post.expiry - Date.now()) / (1000 * 60)) + " minutes";
                document.getElementById('my_posts_list').innerHTML += "<div class=\"container border outline\"><br><div class=\"container\"><div class=\"row\"><div class=\"container\"><div id=\"my_post_username_" + post.id + "\" class=\"row post_username\">@" + post.username + "</div><div id=\"my_post_message_" + post.id + "\" class=\"row post_message\"><div>" + message + "</div></div><div id=\"my_post_contact_" + post.id + "\" class=\"row contact_info\"><div><div class=\"container\">" + contact_info + "</div></div></div><hr><div id=\"my_post_genesis_" + post.id + "\" class=\"row contact_info\">Genesis: " + new Date(post.genesis) + "</div><div id=\"my_post_expiry_" + post.id + "\" class=\"row contact_info\">Expiry: In " + expiry_time + "</div></div></div><div class=\"row\"><div class=\"col-8\"></div><div class=\"col-4\"><button id=\"delete_post_" + post.id + "\" class=\"btn-sm centerme\" type=\"button\"><i class=\"far fa-trash-alt\"></i></button></div></div><br></div></div><br>";
            }
            else {
                document.getElementById('my_posts_list').innerHTML += "<div class=\"container border outline\"><br><div class=\"container\"><div class=\"row\"><div class=\"container\"><div id=\"my_post_username_" + post.id + "\" class=\"row post_username\">@" + post.username + "</div><div id=\"my_post_message_" + post.id + "\" class=\"row post_message\"><div>" + message + "</div></div><div id=\"my_post_contact_" + post.id + "\" class=\"row contact_info\"><div><div class=\"container\">" + contact_info + "</div></div></div><hr><div id=\"my_post_genesis_" + post.id + "\" class=\"row contact_info\">Genesis: " + new Date(post.genesis) + "</div><div id=\"my_post_expiry_" + post.id + "\" class=\"row contact_info\">Expiry: Never</div></div></div><div class=\"row\"><div class=\"col-8\"></div><div class=\"col-4\"><button id=\"delete_post_" + post.id + "\"\" class=\"btn-sm centerme\" type=\"button\"><i class=\"far fa-trash-alt\"></i></button></div></div><br></div></div><br>";
            }
            document.getElementById("delete_post_" + post.id).addEventListener("click", function (event) {
                event.preventDefault();
                apiDeletePost(store.getToken(), post.id);
                alert("Deleted Post");
                document.getElementById("my_posts_menu").click();
            });
        });
    }
    else
        document.getElementById('my_posts_list').innerHTML += "You have not made any posts yet.";
}
function sortProperties(obj, sortedBy, isNumericSort, reverse) {
    sortedBy = sortedBy || 1; // by default first key
    isNumericSort = isNumericSort || false; // by default text sort
    reverse = reverse || false; // by default no reverse
    var reversed = (reverse) ? -1 : 1;
    var sortable = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
    }
    if (isNumericSort)
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    else
        sortable.sort(function (a, b) {
            var x = a[1][sortedBy].toLowerCase(), y = b[1][sortedBy].toLowerCase();
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}
function expiryStringtoTimestamp(expiry_string) {
    switch (expiry_string) {
        case "1hr":
            return Date.now() + 60 * 60 * 1000;
        case "12hr":
            return Date.now() + 12 * 60 * 60 * 1000;
        case "1d":
            return Date.now() + 24 * 60 * 60 * 1000;
        case "1w":
            return Date.now() + 7 * 24 * 60 * 60 * 1000;
        case "1m":
            return Date.now() + 30 * 24 * 60 * 60 * 1000;
        case "never":
            return 0;
        default:
            return 0;
    }
}
function createPost(message, expiry_string) {
    return __awaiter(this, void 0, void 0, function () {
        var expiry, plain_json, decryption_keys, my_posts, current_posts_ds, index, derivation_scheme, post_encryption_key, cipher_json, my_recipient_xprv, trusting_usernames, trusting_profiles, post;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expiry = expiryStringtoTimestamp(expiry_string);
                    plain_json = JSON.stringify({
                        message: message
                    });
                    decryption_keys = [];
                    return [4 /*yield*/, apiGetMyPosts(store.getToken())];
                case 1:
                    my_posts = _a.sent();
                    if (my_posts instanceof Error) {
                        // handle
                        alert("Error in api call");
                        console.error({ my_posts: my_posts });
                        return [2 /*return*/];
                    }
                    console.log({ my_posts: my_posts });
                    current_posts_ds = (my_posts.length === 0) ? "m/0'/0'" : sortProperties(my_posts, 'genesis', true, true)[0][1]['derivation_scheme'];
                    // console.log(sortProperties(my_posts, 'genesis', true, true)[0][1]['derivation_scheme'])
                    console.log(current_posts_ds);
                    index = parseInt(current_posts_ds.split("/")[1].replace("'", ""));
                    derivation_scheme = "m/" + index + "/0'";
                    post_encryption_key = bitcoin.derive_child_indexes(store.getParentKeys()['posts_parent']["xprv"], index, 0);
                    cipher_json = encrypt(plain_json, crypto.createHash('sha256').update(post_encryption_key.xprv).digest('hex'));
                    my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
                    trusting_usernames = store.getMyProfile().trusting.map(function (item) { return item.username; });
                    return [4 /*yield*/, apiGetManyProfiles(store.getToken(), trusting_usernames)];
                case 2:
                    trusting_profiles = _a.sent();
                    console.log({ trusting_profiles: trusting_profiles });
                    trusting_profiles.keys.map(function (item) {
                        var ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: item.recipient_xpub, xprv: my_recipient_xprv });
                        var shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
                        var encrypted_posts_key = encrypt(crypto.createHash('sha256').update(post_encryption_key.xprv).digest('hex'), shared_secret);
                        decryption_keys.push({
                            key: encrypted_posts_key,
                            id: item.username
                        });
                    });
                    return [4 /*yield*/, apiCreatePost(store.getToken(), expiry, decryption_keys, derivation_scheme, cipher_json)];
                case 3:
                    post = _a.sent();
                    if (post instanceof Error) {
                        // handle
                        console.error({ post: post });
                        alert("Failed to create post");
                    }
                    else {
                        document.getElementById("my_posts_menu").click();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function displayNewPost(post) {
    document.getElementById('my_posts_list').innerHTML += "<div class=\"container border outline\"><br><div class=\"container\"><div class=\"row\"><div class=\"container\"><div id=\"my_post_username_" + post.id + "\" class=\"row post_username\">" + post.username + "</div><div id=\"post_message_" + post.cipher_json + "\" class=\"row\">This is a test MY post</div><div id=\"post_contact_" + post.id + "\" class=\"row contact_info\"><div>" + store.getMyProfile().cipher_info + "</div></div><hr><div id=\"post_genesis_" + post.id + "\" class=\"row contact_info\">Saturday, 2nd January. 10:30 PM.</div><div id=\"post_expiry_" + post.id + "\" class=\"row post_message\">Exipres in 2 hours</div></div></div><div class=\"row\"><div class=\"col-8\"></div><div class=\"col-4\"><button id=\"delete_post_" + post.id + "\"\" class=\"btn-sm centerme\" type=\"button\"><i class=\"far fa-trash-alt\"></i></button></div></div><br></div></div><br>";
    document.getElementById("my_posts_list").classList.remove("hidden");
    document.getElementById("others_posts_list").classList.add("hidden");
}
function updatePage() {
    return __awaiter(this, void 0, void 0, function () {
        var others_posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiGetOthersPosts(store.getToken())];
                case 1:
                    others_posts = _a.sent();
                    // console.log("\nAT UPDATE\n");
                    // console.log({ my_posts });
                    console.log({ others_posts: others_posts });
                    // store.setMyPosts(my_posts);
                    store.setOthersPosts(others_posts);
                    // populateMyPosts(my_posts);
                    populateOthersPosts(others_posts);
                    return [2 /*return*/];
            }
        });
    });
}
function loadPostsEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var my_profile, many_profiles, others_posts;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    document.getElementById("exit").addEventListener("click", function (event) {
                        event.preventDefault();
                        exit();
                    });
                    document.getElementById("my_posts_menu").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var my_posts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.preventDefault();
                                    document.getElementById("my_posts_list").classList.remove("hidden");
                                    document.getElementById("others_posts_list").classList.add("hidden");
                                    return [4 /*yield*/, apiGetMyPosts(store.getToken())];
                                case 1:
                                    my_posts = _a.sent();
                                    store.setMyPosts(my_posts);
                                    return [4 /*yield*/, populateMyPosts(my_posts)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    document.getElementById("others_posts_menu").addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                        var others_posts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    event.preventDefault();
                                    document.getElementById("others_posts_list").classList.remove("hidden");
                                    document.getElementById("my_posts_list").classList.add("hidden");
                                    return [4 /*yield*/, apiGetOthersPosts(store.getToken())];
                                case 1:
                                    others_posts = _a.sent();
                                    console.log({ others_posts: others_posts });
                                    store.setOthersPosts(others_posts);
                                    populateOthersPosts(others_posts);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    document.getElementById("create_post_execute").addEventListener("click", function (event) {
                        event.preventDefault();
                        var message = document.getElementById("post_message_input").value;
                        var expiry_string = document.getElementById("post_expiry_input").value;
                        createPost(message, expiry_string);
                    });
                    return [4 /*yield*/, apiGetMyProfile(store.getToken())];
                case 1:
                    my_profile = _a.sent();
                    store.setMyProfile(my_profile.profile);
                    store.setMyKeys(my_profile.keys);
                    trusted_by_usernames = my_profile.profile.trusted_by.map(function (item) { return item.username; });
                    return [4 /*yield*/, apiGetManyProfiles(store.getToken(), trusted_by_usernames)];
                case 2:
                    many_profiles = _a.sent();
                    if (many_profiles instanceof Error) {
                        console.log({ many_profiles: many_profiles });
                    }
                    many_profiles.profiles.map(function (profile) {
                        store.setUserProfile(profile);
                    });
                    many_profiles.keys.map(function (key) {
                        store.setUserKeys(key);
                    });
                    return [4 /*yield*/, apiGetOthersPosts(store.getToken())];
                case 3:
                    others_posts = _a.sent();
                    console.log({ others_posts: others_posts });
                    store.setOthersPosts(others_posts);
                    populateOthersPosts(others_posts);
                    return [2 /*return*/];
            }
        });
    });
}
window.onload = loadPostsEvents();
//# sourceMappingURL=posts.js.map