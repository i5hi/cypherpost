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


function setIdentities(identities) {
  sessionStorage.setItem("identities", JSON.stringify(identities));
  return true;

}
function getIdentities() {
  const identities = sessionStorage.getItem("identities");
  return (identities) ? JSON.parse(identities) : null
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
  try{
    return mnemonic_crypt ? decrypt(mnemonic_crypt, encryption_key) : null;
  }
  catch(e){
    return new  Error(e);
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

// function setMyProfileKeys(keys) {
//   sessionStorage.setItem(`profile_keys`, JSON.stringify(keys));
//   return true;
// }
// function getMyProfileKeys() {
//   const keys = sessionStorage.getItem("profile_keys");
//   return (keys) ? JSON.parse(keys) : null
// }

function setMyKeyChain(keys) {
  sessionStorage.setItem(`my_keys`, JSON.stringify(keys));
  return true;
}

function getMyKeyChain() {
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
  setMyProfile,
  getMyProfile,
  setMyKeyChain,
  getMyKeyChain,
  setUserKeys,
  getUserKeys,
  setUserProfile,
  getUserProfile,
  setMyPosts,
  getMyPosts,
  setOthersPosts,
  getOthersPosts,
  setMnemonic,
  getMnemonic
}