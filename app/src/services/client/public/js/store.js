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


function getIdentities() {
  const identities = sessionStorage.getItem("all_identities");
  return (identities) ? JSON.parse(identities) : [];
}

function setIdentities(identities) {
  const existing = getIdentities();

  if (existing.length === 0)
    sessionStorage.setItem(`all_identities`, JSON.stringify(identities));
  else {
    const updates = identities.filter((id => {
      const in_existing = existing.find((existing_id) => existing_id.pubkey === id.pubkey);
      if (!in_existing) return id;
      else return;
    }));
    updates.map((update) => {
      existing.push(update);
    })
    sessionStorage.setItem(`all_identities`, JSON.stringify(existing));
  }
  return true;
}


function getAllBadges() {
  const all_badges = sessionStorage.getItem("all_badges");
  return (all_badges) ? JSON.parse(all_badges) : []
}

function setAllBadges(all_badges) {
  const existing = getAllBadges();

  if (existing.length === 0)
    sessionStorage.setItem(`all_badges`, JSON.stringify(all_badges));
  else {
    const updates = all_badges.filter((badge => {
      const in_existing = existing.find((existing_badge) => existing_badge.hash === badge.hash);
      if (!in_existing) return badge;
      else return;
    }));
    updates.map((update) => {
      existing.push(update);
    })
    sessionStorage.setItem(`all_badges`, JSON.stringify(existing));
  }
  return true;
}

function getMyBadges(my_badges) {
  sessionStorage.getItem(`my_badges`, JSON.stringify(my_badges));
  return (my_badges) ? JSON.parse(my_badges) : {given: [], recieved: []}
}

function setMyBadges(my_badges) {
  const existing = getMyBadges();

  if (existing.given.length===0 && existing.recieved.length === 0)
    sessionStorage.setItem(`my_badges`, JSON.stringify(my_badges));
  else {
    const given_updates = my_badges.given.filter((badge => {
      const in_existing = existing.given.find((existing_badge) => existing_badge.hash === badge.hash);
      if (!in_existing) return badge;
      else return;
    }));

    const recieved_updates = my_badges.recieved.filter((badge => {
      const in_existing = existing.recieved.find((existing_badge) => existing_badge.hash === badge.hash);
      if (!in_existing) return badge;
      else return;
    }));

    given_updates.map((update) => {
      existing.given.push(update);
    });

    recieved_updates.map((update) => {
      existing.recieved.push(update);
    });
    sessionStorage.setItem(`my_badges`, JSON.stringify(existing));
  }
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

function getMyTrades() {
  const posts = sessionStorage.getItem("my_trades");
  return (posts) ? JSON.parse(posts) : [];

}

function setMyTrades(trades) {
  const existing = getMyTrades();

  if (existing.length === 0)
    sessionStorage.setItem(`my_trades`, JSON.stringify(trades));
  else {
    const updates = trades.filter((trade => {
      const in_existing = existing.find((existing_trade) => existing_trade.id === trade.id);
      if (!in_existing) return trade;
      else return;
    }));
    updates.map((update) => {
      existing.push(update);
    })
    sessionStorage.setItem(`my_trades`, JSON.stringify(existing));
  }
  return true;
}

function getOthersTrades() {
  const trades = sessionStorage.getItem("others_trades");
  return (trades) ? JSON.parse(trades) : [];
}

function setOthersTrades(trades) {
  const existing = getOthersTrades();

  if (existing.length === 0)
    sessionStorage.setItem(`others_trades`, JSON.stringify(trades));
  else {
    const updates = trades.filter((trade => {
      const in_existing = existing.find((existing_trade) => existing_trade.id === trade.id);
      if (!in_existing) return trade;
      else return;
    }));
    updates.map((update) => {
      existing.push(update);
    })
    sessionStorage.setItem(`others_trades`, JSON.stringify(existing));
  }
  return true;
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

// function setOthersProfiles(profiles) {
//   sessionStorage.setItem(`others_profiles`, JSON.stringify(profiles));
//   return true;
// }

// function getOthersProfiles() {
//   const profiles = sessionStorage.getItem("others_profiles");
//   return (profiles) ? JSON.parse(profiles) : null;

// }

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
  // setOthersProfiles,
  // getOthersProfiles,
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
  setLocalPrice,
  getMyBadges
}