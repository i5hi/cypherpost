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
  sessionStorage.setItem("all_identities", JSON.stringify(identities));
  return true;

}
function getIdentities() {
  const identities = sessionStorage.getItem("all_identities");
  return (identities) ? JSON.parse(identities) : null
}


function setAllBadges(all_badges) {
  sessionStorage.setItem("all_badges", JSON.stringify(all_badges));
  return true;
}
function getAllBadges() {
  const all_badges = sessionStorage.getItem("all_badges");
  return (all_badges) ? JSON.parse(all_badges) : null
}

function setMyBadges(my_badges){
  sessionStorage.setItem(`my_badges`, JSON.stringify(profile));
  return true;
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


function setMyPreferences(preferences) {
  sessionStorage.setItem(`my_preferences`, JSON.stringify(preferences));
  return true;
}

function getMyPreferences() {
  const preferences = sessionStorage.getItem("my_preferences");
  return (preferences) ? JSON.parse(preferences) : null;

}

function setMyTrades(posts) {
  sessionStorage.setItem(`my_posts`, JSON.stringify(posts));
  return true;
}

function getMyTrades() {
  const posts = sessionStorage.getItem("my_posts");
  return (posts) ? JSON.parse(posts) : null;

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

function setOthersTrades(trades) {
  sessionStorage.setItem(`others_trades`, JSON.stringify(trades));
  return true;
}

function getOthersTrades() {
  const trades = sessionStorage.getItem("others_trades");
  return (trades) ? JSON.parse(trades) : null;

}
function setOthersProfiles(profiles) {
  sessionStorage.setItem(`others_profiles`, JSON.stringify(profile));
  return true;
}

function getOthersProfiles() {
  const profiles = sessionStorage.getItem("others_profiles");
  return (profiles) ? JSON.parse(profiles) : null;

}


module.exports = {
  setIdentities,
  getIdentities,
  setAllBadges,
  getAllBadges,
  setMyProfile,
  getMyProfile,
  setMyKeyChain,
  getMyKeyChain,
  setOthersProfiles,
  getOthersProfiles,
  setMyTrades,
  getMyTrades,
  setOthersTrades,
  getOthersTrades,
  setMnemonic,
  getMnemonic,
  setMyPreferences,
  getMyPreferences,
  setMyBadges
}