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
 * sushi
 * arrange super clinic creek twenty joke gossip order type century photo ahead
 */
var crypto = require("crypto");
var store = require('./store');
var request = require('./request').request;
var api_url = (document.domain === 'localhost') ? "http://localhost/api/v1" : "https://lionbit.network/api/v1";
var web_url = (document.domain === 'localhost') ? "http://localhost" : "https://lionbit.network";
function apiRegister(username, password, confirm) {
    return __awaiter(this, void 0, void 0, function () {
        var username_regex, pass256, seed256, invitation, end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (store.getExistingUsernames().includes(username)) {
                        alert("Username taken!");
                        return [2 /*return*/, false];
                    }
                    if (password !== confirm) {
                        alert("Passwords do not match!");
                        return [2 /*return*/, false];
                    }
                    username_regex = /^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/;
                    if (!username_regex.test(username)) {
                        alert("Invalid Username. Must be alphanumeric with only _. and maximum 15 characters.");
                        return [2 /*return*/, false];
                    }
                    pass256 = crypto.createHash('sha256')
                        .update(password)
                        .digest('hex');
                    seed256 = store.getSeed256();
                    invitation = store.getInvitation();
                    end_point = "/auth/register";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        username: username,
                        pass256: pass256,
                        seed256: seed256,
                        invited_by: invitation.invited_by,
                        invite_code: invitation.invite_code,
                    };
                    return [4 /*yield*/, request(method, url, body)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.token];
            }
        });
    });
}
function apiLogin(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var username_regex, pass256, end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    username_regex = /^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/;
                    if (!username_regex.test(username)) {
                        return [2 /*return*/, "Invalid Username. Must be alphanumeric with only _."];
                    }
                    pass256 = crypto.createHash('sha256')
                        .update(password)
                        .digest('hex');
                    end_point = "/auth/login/";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        username: username,
                        pass256: pass256,
                    };
                    return [4 /*yield*/, request(method, url, body)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error)
                        return [2 /*return*/, response];
                    return [2 /*return*/, response.token];
            }
        });
    });
}
function apiReset(seed, password, confirm) {
    return __awaiter(this, void 0, void 0, function () {
        var seed256, pass256, end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    seed256 = crypto.createHash('sha256')
                        .update(seed)
                        .digest('hex');
                    if (password !== confirm) {
                        alert("Passwords do not match!");
                        return [2 /*return*/, false];
                    }
                    pass256 = crypto.createHash('sha256')
                        .update(password)
                        .digest('hex');
                    end_point = "/auth/reset/";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        seed256: seed256,
                        pass256: pass256,
                    };
                    return [4 /*yield*/, request(method, url, body)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error)
                        return [2 /*return*/, response];
                    return [2 /*return*/, response.token];
            }
        });
    });
}
function apiCheckSeed256(token, seed) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/auth/check/seed256";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        seed256: crypto.createHash('sha256')
                            .update(seed)
                            .digest('hex')
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.status];
            }
        });
    });
}
function apiInvite(username, token) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response, invite_code, invite_link;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/auth/invite/";
                    url = api_url + end_point;
                    method = "GET";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error)
                        return [2 /*return*/, response];
                    invite_code = response.invite_code;
                    invite_link = web_url + "/invitation?invited_by=" + username + "&invite_code=" + invite_code;
                    return [2 /*return*/, invite_link];
            }
        });
    });
}
// if not registered use invite_code as token
function apiGetUsernames(is_registered, token, invited_by) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = (is_registered) ? "/profile/usernames" : "/profile/usernames?invited_by=" + invited_by + "&invite_code=" + token;
                    token = (is_registered) ? token : null;
                    url = api_url + end_point;
                    method = "GET";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.usernames];
            }
        });
    });
}
function apiGetMyProfile(token) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile/";
                    url = api_url + end_point;
                    method = "GET";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function apiGetUserProfile(token, username) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, method, url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile?username=" + username;
                    method = "GET";
                    url = api_url + end_point;
                    console.log(url);
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    // console.log({response})
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function apiGetManyProfiles(token, usernames) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile/find_many";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        usernames: usernames
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function apiEditProfile(nickname, cipher_info, status, token) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, method, url, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile/";
                    method = "POST";
                    url = api_url + end_point;
                    body = {
                        nickname: nickname,
                        cipher_info: cipher_info,
                        status: status,
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function apiProfileGenesis(recipient_xpub, token) {
    return __awaiter(this, void 0, void 0, function () {
        var method, end_point, url, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = "POST";
                    end_point = "/profile/genesis";
                    url = api_url + end_point;
                    body = {
                        recipient_xpub: recipient_xpub,
                        derivation_scheme: "m/0'/0'"
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response];
            }
        });
    });
}
function apiMuteUser(token, trusted_by, toggle_mute) {
    return __awaiter(this, void 0, void 0, function () {
        var method, end_point, url, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = "POST";
                    end_point = "/profile/mute";
                    url = api_url + end_point;
                    body = {
                        trusted_by: trusted_by,
                        toggle_mute: toggle_mute
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.profile];
            }
        });
    });
}
function apiCreatePost(token, expiry, decryption_keys, derivation_scheme, cipher_json) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/posts";
                    url = api_url + end_point;
                    method = "PUT";
                    body = {
                        expiry: expiry,
                        decryption_keys: decryption_keys,
                        derivation_scheme: derivation_scheme,
                        cipher_json: cipher_json,
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.post];
            }
        });
    });
}
function apiDeletePost(token, post_id) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/posts/" + post_id;
                    url = api_url + end_point;
                    method = "DELETE";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.status];
            }
        });
    });
}
function apiGetMyPosts(token) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/posts/self";
                    url = api_url + end_point;
                    method = "GET";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.posts];
            }
        });
    });
}
function apiGetOthersPosts(token) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/posts/others";
                    url = api_url + end_point;
                    method = "GET";
                    return [4 /*yield*/, request(method, url, {}, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error) {
                        if (response.name === "401")
                            window.location.href = web_url + "/login";
                        else
                            return [2 /*return*/, response];
                    }
                    return [2 /*return*/, response.posts];
            }
        });
    });
}
function apiTrust(token, trusting, decryption_key, signature) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile/trust";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        trusting: trusting,
                        decryption_key: decryption_key,
                        signature: signature,
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error)
                        return [2 /*return*/, response];
                    return [2 /*return*/, response.profile];
            }
        });
    });
}
;
function apiRevoke(token, revoking, decryption_keys, derivation_scheme, cipher_info) {
    return __awaiter(this, void 0, void 0, function () {
        var end_point, url, method, body, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    end_point = "/profile/revoke";
                    url = api_url + end_point;
                    method = "POST";
                    body = {
                        revoking: revoking,
                        decryption_keys: decryption_keys,
                        derivation_scheme: derivation_scheme,
                        cipher_info: cipher_info
                    };
                    return [4 /*yield*/, request(method, url, body, token)];
                case 1:
                    response = _a.sent();
                    if (response instanceof Error)
                        return [2 /*return*/, response];
                    return [2 /*return*/, response.profile];
            }
        });
    });
}
;
module.exports = {
    apiRegister: apiRegister,
    apiLogin: apiLogin,
    apiReset: apiReset,
    apiInvite: apiInvite,
    apiCheckSeed256: apiCheckSeed256,
    apiGetMyProfile: apiGetMyProfile,
    apiEditProfile: apiEditProfile,
    apiGetUsernames: apiGetUsernames,
    apiGetUserProfile: apiGetUserProfile,
    apiGetManyProfiles: apiGetManyProfiles,
    apiProfileGenesis: apiProfileGenesis,
    apiTrust: apiTrust,
    apiRevoke: apiRevoke,
    apiMuteUser: apiMuteUser,
    apiCreatePost: apiCreatePost,
    apiDeletePost: apiDeletePost,
    apiGetMyPosts: apiGetMyPosts,
    apiGetOthersPosts: apiGetOthersPosts,
};
//# sourceMappingURL=api.js.map