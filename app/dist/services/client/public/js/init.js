// init function that runs on successful login/register/reset
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
// this function will not affect the display of any pages
// it will only affect the storage state of the application
// it will:
/**
 * get a users profile
 * get list of existing usernames for network search
 * get a list of all posts visibile to the user based on profile.keys.posts_keys
 *
 */
var store = require("./store");
var bitcoin = require("./bitcoin");
var _a = require("./api"), apiGetUsernames = _a.apiGetUsernames, apiProfileGenesis = _a.apiProfileGenesis, apiGetMyProfile = _a.apiGetMyProfile, apiGetMyPosts = _a.apiGetMyPosts, apiGetOthersPosts = _a.apiGetOthersPosts;
function loadInitialState(token, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var my_profile_and_keys, my_recipient_xpub, new_profile_and_keys, e_1, usernames, e_2, others_posts, e_3, my_posts, e_4, parent_128;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    store.setToken(token);
                    store.setUsername(username);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, apiGetMyProfile(token)];
                case 2:
                    my_profile_and_keys = _a.sent();
                    if (!(my_profile_and_keys instanceof Error)) return [3 /*break*/, 6];
                    if (!(my_profile_and_keys.name === "404" && my_profile_and_keys.message.startsWith("No profile"))) return [3 /*break*/, 4];
                    my_recipient_xpub = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']["xprv"], 0, 0).xpub;
                    return [4 /*yield*/, apiProfileGenesis(my_recipient_xpub, token)];
                case 3:
                    new_profile_and_keys = _a.sent();
                    if (new_profile_and_keys instanceof Error) {
                        console.error("ERROR AT loadInitialState - profile.apiProfileGenesis");
                        console.error({ e: e });
                        return [2 /*return*/, false];
                    }
                    console.log({ profile: new_profile_and_keys.profile, keys: new_profile_and_keys.keys });
                    store.setMyProfile(new_profile_and_keys.profile);
                    store.setMyKeys(new_profile_and_keys.keys);
                    store.setUsername(new_profile_and_keys.profile.username);
                    return [3 /*break*/, 5];
                case 4:
                    console.error("ERROR AT loadInitialState - getProfile");
                    console.error({ e: e });
                    return [2 /*return*/, false];
                case 5: return [3 /*break*/, 7];
                case 6:
                    store.setMyProfile(my_profile_and_keys['profile']);
                    store.setMyKeys(my_profile_and_keys['keys']);
                    store.setUsername(my_profile_and_keys['profile']['username']);
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    console.error("BROKE AT loadInitialState - getProfile");
                    console.error({ e: e_1 });
                    return [2 /*return*/, false];
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, apiGetUsernames(true, token)];
                case 10:
                    usernames = _a.sent();
                    store.setExistingUsernames(usernames);
                    return [3 /*break*/, 12];
                case 11:
                    e_2 = _a.sent();
                    console.error("BROKE AT loadInitialState - getUsernames");
                    console.error({ e: e_2 });
                    return [2 /*return*/, false];
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, apiGetOthersPosts(token)];
                case 13:
                    others_posts = _a.sent();
                    store.setOthersPosts(others_posts);
                    return [3 /*break*/, 15];
                case 14:
                    e_3 = _a.sent();
                    console.error("BROKE AT loadInitialState - getOthersPosts");
                    console.error({ e: e_3 });
                    return [2 /*return*/, false];
                case 15:
                    _a.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, apiGetMyPosts(token)];
                case 16:
                    my_posts = _a.sent();
                    store.setMyPosts(my_posts);
                    return [3 /*break*/, 18];
                case 17:
                    e_4 = _a.sent();
                    console.error("BROKE AT loadInitialState - getMyPosts");
                    console.error({ e: e_4 });
                    return [2 /*return*/, false];
                case 18:
                    parent_128 = store.getParent128(store.getUsername(), password);
                    if (parent_128) {
                        store.setParentKeys(parent_128['xprv']);
                    }
                    else {
                        alert("Need to reimport seed");
                        return [2 /*return*/, "import_seed"];
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
module.exports = {
    loadInitialState: loadInitialState
};
//# sourceMappingURL=init.js.map