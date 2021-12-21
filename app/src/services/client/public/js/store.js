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

const { encrypt, decrypt } = require("./aes");
const crypto = require("crypto");
const bitcoin = require("./bitcoin");

function setSeed256(seed256) {
  sessionStorage.setItem("seed256", seed256);
  return true;
};

function getSeed256() {
  return sessionStorage.getItem("seed256");
}

function setTriplePass256(passowrd) {
  const round1 = crypto.createHash("sha256").update(passowrd).digest("hex");
  const round2 = crypto.createHash("sha256").update(round1).digest("hex");
  const round3 = crypto.createHash("sha256").update(round2).digest("hex");
  sessionStorage.setItem("triple_pass256", round3);
  return true;
}
function getTriplePass256(passowrd) {
  return sessionStorage.getItem("triple_pass256");
}

function setToken(token) {
  sessionStorage.setItem("token", token);
  return true;
};

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
  sessionStorage.setItem("invitation", JSON.stringify({ invite_code, invited_by }));
  return true;
}

function getInvitation() {
  const invitation = sessionStorage.getItem("invitation");
  return (invitation) ? JSON.parse(invitation) : null;
}

function setExistingUsernames(usernames) {
  sessionStorage.setItem("existing_usernames", JSON.stringify(usernames));
  return true;

}
function getExistingUsernames() {
  const existing_usernames = sessionStorage.getItem("existing_usernames");
  return (existing_usernames) ? JSON.parse(existing_usernames) : null
}

function setIdentities(identities) {
  sessionStorage.setItem("identities", JSON.stringify(identities));
  return true;

}
function getIdentities() {
  const identities = sessionStorage.getItem("identities");
  return (identities) ? JSON.parse(identities) : null
}

function setParent128(parent_128, username, password) {
  const encryption_key = crypto.createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");

  localStorage.setItem(`${username}_parent_128`, encrypt(JSON.stringify(parent_128), encryption_key));
  return true;

}

function getParent128(username, password) {
  const decryption_key = crypto.createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");

  const cipher_parent_128 = localStorage.getItem(`${username}_parent_128`);
  return cipher_parent_128 ? JSON.parse(decrypt(cipher_parent_128, decryption_key)) : null;

}

function setMnemonic(mnemonic, password) {
  const encryption_key = crypto.createHash("sha256")
    .update(password)
    .digest("hex");
  localStorage.setItem(`my_mnemonic`, encrypt(mnemonic, encryption_key));
  return true;
}

function getMnemonic(password) {
  const encryption_key = crypto.createHash("sha256")
    .update(`${password}`)
    .digest("hex");
  const mnemonic_crypt = localStorage.getItem(`my_mnemonic`);
  return mnemonic_crypt ? decrypt(mnemonic_crypt, encryption_key) : null;
}

function setParentKeys(parent_128_xprv) {
  const recipient_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 0);
  const profile_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 1);
  const posts_parent = bitcoin.derive_parent_usecase(parent_128_xprv, 2);

  sessionStorage.setItem("recipient_parent", JSON.stringify(recipient_parent));
  sessionStorage.setItem("profile_parent", JSON.stringify(profile_parent));
  sessionStorage.setItem("posts_parent", JSON.stringify(posts_parent));

  return true;

}

function getParentKeys() {
  const recipient_parent = sessionStorage.getItem("recipient_parent");
  const profile_parent = sessionStorage.getItem("profile_parent");
  const posts_parent = sessionStorage.getItem("posts_parent");

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
  sessionStorage.setItem(`my_profile`, JSON.stringify(profile));
  return true;
}

function getMyProfile() {
  const profile = sessionStorage.getItem("my_profile");
  return (profile) ? JSON.parse(profile) : null
}

function setMyKeys(keys) {
  sessionStorage.setItem(`my_keys`, JSON.stringify(keys));
  return true;
}

function getMyKeys() {
  const keys = sessionStorage.getItem("my_keys");
  return (keys) ? JSON.parse(keys) : null;
}

function setUserProfile(username, profile) {
  sessionStorage.setItem(`${username}_profile`, JSON.stringify(profile));
  return true;
}

function getUserProfile(username) {
  return sessionStorage.getItem(`${username}_profile`) ? JSON.parse(sessionStorage.getItem(`${username}`)) : null;
}

function setUserKeys(username, keys) {
  sessionStorage.setItem(`${username}_keys`, JSON.stringify(keys));
  return true;
}

function getUserKeys(username) {
  return sessionStorage.getItem(`${username}_keys`) ? JSON.parse(sessionStorage.getItem(`${username}`)) : null;
}

function setMyPosts(posts) {
  sessionStorage.setItem(`my_posts`, JSON.stringify(posts));
  return true;
}

function getMyPosts() {
  const posts = sessionStorage.getItem("my_posts");
  return (posts) ? JSON.parse(posts) : null;

}

function setOthersPosts(posts) {
  sessionStorage.setItem(`others_posts`, JSON.stringify(posts));
  return true;
}

function getOthersPosts() {
  const posts = sessionStorage.getItem("others_posts");
  return (posts) ? JSON.parse(posts) : null;

}

module.exports = {
  setIdentities,
  getIdentities,
  setUsername,
  getUsername,
  setInvitation,
  getInvitation,
  setExistingUsernames,
  getExistingUsernames,
  setParent128,
  getParent128,
  setParentKeys,
  getParentKeys,
  setMyProfile,
  getMyProfile,
  setMyKeys,
  getMyKeys,
  setUserKeys,
  getUserKeys,
  setUserProfile,
  getUserProfile,
  setMyPosts,
  getMyPosts,
  setOthersPosts,
  getOthersPosts,
  setTriplePass256,
  getTriplePass256,
  setMnemonic,
  getMnemonic
}