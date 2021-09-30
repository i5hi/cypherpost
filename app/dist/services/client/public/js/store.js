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
 *  $username_profile:profile
 *  posts
 */
var _a = require("./aes"), encrypt = _a.encrypt, decrypt = _a.decrypt;
var crypto = require("crypto");
var bitcoin = require("./bitcoin");
function setSeed256(seed256) {
    sessionStorage.setItem("seed256", seed256);
    return true;
}
;
function getSeed256() {
    return sessionStorage.getItem("seed256");
}
function setToken(token) {
    sessionStorage.setItem("token", token);
    return true;
}
;
function getToken() {
    return sessionStorage.getItem("token");
}
function setUsername(username) {
    sessionStorage.setItem("username", username);
    return true;
}
function getUsername() {
    return sessionStorage.getItem("username");
}
function setInvitation(invited_by, invite_code) {
    sessionStorage.setItem("invitation", JSON.stringify({ invite_code: invite_code, invited_by: invited_by }));
    return true;
}
function getInvitation() {
    var invitation = sessionStorage.getItem("invitation");
    return (invitation) ? JSON.parse(invitation) : null;
}
function setExistingUsernames(usernames) {
    sessionStorage.setItem("existing_usernames", JSON.stringify(usernames));
    return true;
}
function getExistingUsernames() {
    var existing_usernames = sessionStorage.getItem("existing_usernames");
    return (existing_usernames) ? JSON.parse(existing_usernames) : null;
}
function setParent128(parent_128, username, password) {
    var encryption_key = crypto.createHash("sha256")
        .update(username + ":" + password)
        .digest("hex");
    localStorage.setItem(username + "_parent_128", encrypt(JSON.stringify(parent_128), encryption_key));
    return true;
}
function getParent128(username, password) {
    var decryption_key = crypto.createHash("sha256")
        .update(username + ":" + password)
        .digest("hex");
    var cipher_parent_128 = localStorage.getItem(username + "_parent_128");
    return cipher_parent_128 ? JSON.parse(decrypt(cipher_parent_128, decryption_key)) : null;
}
function setParentKeys(parent_128_xprv) {
    var recipient_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 0);
    var profile_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 1);
    var posts_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 2);
    sessionStorage.setItem("recipient_parent", JSON.stringify(recipient_parent));
    sessionStorage.setItem("profile_parent", JSON.stringify(profile_parent));
    sessionStorage.setItem("posts_parent", JSON.stringify(posts_parent));
    return true;
}
function getParentKeys() {
    var recipient_parent = sessionStorage.getItem("recipient_parent");
    var profile_parent = sessionStorage.getItem("profile_parent");
    var posts_parent = sessionStorage.getItem("posts_parent");
    if (recipient_parent && profile_parent && posts_parent) {
        return {
            recipient_parent: JSON.parse(recipient_parent),
            profile_parent: JSON.parse(profile_parent),
            posts_parent: JSON.parse(posts_parent)
        };
    }
    else {
        return null;
    }
}
function setMyProfile(profile) {
    sessionStorage.setItem("my_profile", JSON.stringify(profile));
    return true;
}
function getMyProfile() {
    var profile = sessionStorage.getItem("my_profile");
    return (profile) ? JSON.parse(profile) : null;
}
function setMyKeys(keys) {
    sessionStorage.setItem("my_keys", JSON.stringify(keys));
    return true;
}
function getMyKeys() {
    var keys = sessionStorage.getItem("my_keys");
    return (keys) ? JSON.parse(keys) : null;
}
function setUserProfile(username, profile) {
    sessionStorage.setItem(username + "_profile", JSON.stringify(profile));
    return true;
}
function getUserProfile(username) {
    return sessionStorage.getItem(username + "_profile") ? JSON.parse(sessionStorage.getItem("" + username)) : null;
}
function setUserKeys(username, keys) {
    sessionStorage.setItem(username + "_keys", JSON.stringify(keys));
    return true;
}
function getUserKeys(username) {
    return sessionStorage.getItem(username + "_keys") ? JSON.parse(sessionStorage.getItem("" + username)) : null;
}
function setMyPosts(posts) {
    sessionStorage.setItem("my_posts", JSON.stringify(posts));
    return true;
}
function getMyPosts() {
    var posts = sessionStorage.getItem("my_posts");
    return (posts) ? JSON.parse(posts) : null;
}
function setOthersPosts(posts) {
    sessionStorage.setItem("others_posts", JSON.stringify(posts));
    return true;
}
function getOthersPosts() {
    var posts = sessionStorage.getItem("others_posts");
    return (posts) ? JSON.parse(posts) : null;
}
module.exports = {
    setSeed256: setSeed256,
    getSeed256: getSeed256,
    setToken: setToken,
    getToken: getToken,
    setUsername: setUsername,
    getUsername: getUsername,
    setInvitation: setInvitation,
    getInvitation: getInvitation,
    setExistingUsernames: setExistingUsernames,
    getExistingUsernames: getExistingUsernames,
    setParent128: setParent128,
    getParent128: getParent128,
    setParentKeys: setParentKeys,
    getParentKeys: getParentKeys,
    setMyProfile: setMyProfile,
    getMyProfile: getMyProfile,
    setMyKeys: setMyKeys,
    getMyKeys: getMyKeys,
    setUserKeys: setUserKeys,
    getUserKeys: getUserKeys,
    setUserProfile: setUserProfile,
    getUserProfile: getUserProfile,
    setMyPosts: setMyPosts,
    getMyPosts: getMyPosts,
    setOthersPosts: setOthersPosts,
    getOthersPosts: getOthersPosts,
};
//# sourceMappingURL=store.js.map