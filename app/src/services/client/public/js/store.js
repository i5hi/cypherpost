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

function setMyBadges(my_badges) {
  sessionStorage.setItem(`my_badges`, JSON.stringify(my_badges));
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
  try {
    return mnemonic_crypt ? decrypt(mnemonic_crypt, encryption_key) : null;
  }
  catch (e) {
    return new Error(e);
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
  sessionStorage.setItem(`others_profiles`, JSON.stringify(profiles));
  return true;
}

function getOthersProfiles() {
  const profiles = sessionStorage.getItem("others_profiles");
  return (profiles) ? JSON.parse(profiles) : null;

}

function checkMnemonic() {
  if (localStorage.getItem("my_mnemonic")) return true;
  else return false;
}

function updateSelectedIdentity(identity) {
  sessionStorage.setItem("selected_identity", JSON.stringify(identity));
  return true;
}

function getSelectedIdentity() {
  const selected_identity = sessionStorage.getItem("selected_identity");
  return (selected_identity) ? JSON.parse(selected_identity) : null;
}

function addSelectedIdentity(identity) {
  let selected_ids = sessionStorage.getItem("selected_identities");
  if (selected_ids) {
    selected_ids = JSON.parse(selected_ids);
    const exists = selected_ids.find((id) => id.pubkey === identity.pubkey);
    if (exists) {
      alert("Identity Already Selected");
    }
    else {
      selected_ids.push(identity);
    }
  }
  else {
    selected_ids = [];
    selected_ids.push(identity);
  }

  sessionStorage.setItem("selected_identities", JSON.stringify(selected_ids));
  return true;
}

function removeSelectedIdentity(identity) {
  let selected_ids = sessionStorage.getItem("selected_identities");
  if (selected_ids) {
    selected_ids = JSON.parse(selected_ids);
    selected_ids = selected_ids.filter(selected_id => selected_id.pubkey !== identity.pubkey);
  }
  else {
    selected_ids = [];
  }

  sessionStorage.setItem("selected_identities", JSON.stringify(selected_ids));
  return true;
}
function getSelectedIdentities() {
  const selected_identities = sessionStorage.getItem("selected_identities");
  return (selected_identities) ? JSON.parse(selected_identities) : [];
}
function removeSelectedIdentities() {
  sessionStorage.setItem(`selected_identities`, JSON.stringify([]));
  return true;
}
function setLatestPost(plain_post) {
  sessionStorage.setItem(`latest_post`, JSON.stringify(plain_post));
  return true;
}

function getLatestPost() {
  const plain_post = sessionStorage.getItem("latest_post");
  return (plain_post) ? JSON.parse(plain_post) : null;
}

function removeLatestPost() {
  sessionStorage.setItem(`latest_post`, null);
  return true;
}

function setMyUsername(username) {
  sessionStorage.setItem(`my_username`, username);
  return true;
}

function getMyUsername() {
  const username = sessionStorage.getItem("my_username");
  return (username) ? username : null;
}

function setLocalPrice(price) {
  sessionStorage.setItem("local_price", price);
  return true;
}

function getLocalPrice() {
  return (sessionStorage.getItem("local_price"))
    ? parseInt(sessionStorage.getItem("local_price"))
    : 30000000;
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
  setMyBadges,
  checkMnemonic,
  updateSelectedIdentity,
  getSelectedIdentity,
  addSelectedIdentity,
  removeSelectedIdentity,
  getSelectedIdentities,
  removeSelectedIdentities,
  setLatestPost,
  getLatestPost,
  removeLatestPost,
  setMyUsername,
  getMyUsername,
  getLocalPrice,
  setLocalPrice
}