const PROFILE = "PROFILE";
const PREFERENCES = "PREFERENCES";
const TRADE = "BITCOIN-TRADE";

const TRUST = "TRUST";
const SCAMMER = "SCAMMER";

const PROFILE_DS = "m/1h/0h/0h";
const PREFERENCES_DS = "m/2h/0h/0h";

const api = require("./api");
const util = require("./util");
const store = require("./store");
const { stat } = require("fs");


async function downloadAllIdentities(identity_parent) {
  const response = await api.getAllIdentities(identity_parent);
  if (response instanceof Error) {
    return response;
  }
  else {
    return store.setIdentities(response);
  }
}

async function downloadAllIdentitiesAndBadges(identity_parent) {
  const identities = await api.getAllIdentities(identity_parent)
  if (identities instanceof Error) return identities;
  const id_store = store.setIdentities(identities);

  const my_identity = identities.find((identity) => identity.pubkey == identity_parent.pubkey);
  store.setMyUsername(my_identity.username);

  const all_badges = await api.getAllBadges(identity_parent);
  if (all_badges instanceof Error) return all_badges;
  const all_badges_store = store.setAllBadges(all_badges);

  const my_badges = await api.getMyBadges(identity_parent);
  if (my_badges instanceof Error) return my_badges;
  const my_badges_store = store.setMyBadges(my_badges);

  return my_badges_store && all_badges_store && id_store;
}

async function downloadAllMyPosts(identity_parent) {
  const posts = await api.getMyPosts(identity_parent);
  if (posts instanceof Error) return posts;

  console.log({ posts })
  const plain_json_posts = util.decryptMyCypherPosts(store.getMyKeyChain().cypherpost, posts);
  if (plain_json_posts instanceof Error) return plain_json_posts;
  console.log({ plain_json_posts })

  const segregated = util.segregateMyPlainPosts(plain_json_posts);
  console.log({ segregated })

  const latest_preference = removeDuplicatePreferences(identity_parent, segregated.preferences);

  const profile = store.setMyProfile(segregated.profile);
  const trades = store.setMyTrades(segregated.trades);
  const preferences = store.setMyPreferences(latest_preference);

  return profile && trades && preferences;
}

async function downloadAllPostsForMe(identity_parent) {
  const posts = await api.getPostsForMe(identity_parent);
  if (posts instanceof Error) return posts;

  const plain_json_posts = util.decryptCypherPostsFromOthers(identity_parent, posts);
  if (plain_json_posts instanceof Error) return plain_json_posts;

  const segregated = util.segregatePlainPostsForMe(plain_json_posts);
  const profiles = store.setOthersProfiles(segregated.profiles);
  const trades = store.setOthersTrades(segregated.trades);

  return profiles && trades;
}

function removeDuplicatePreferences(identity_parent, prefs) {
  // const sorted_prefs = util.sortObjectByProperty(prefs,"genesis",false,true);
  // console.log({sorted_prefs});


  const latest_preference = prefs.pop();
  const prefs_delete_statuses = prefs.map(async (preference) => {
    const status = await api.deletePost(identity_parent, preference.id);
    if (status instanceof Error) return status;
  });
  console.error({ prefs_delete_statuses })

  return latest_preference;
}
async function createCypherProfilePost(
  nickname,
  status,
  contact,
) {

  const plain_profile = {
    type: PROFILE,
    nickname,
    status,
    contact
  };

  const cypher_profile = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    (store.getMyProfile()) ? store.getMyProfile().derivation_scheme : PROFILE_DS,
    plain_profile
  );
  const reference = "none";
  const profile_id = await api.createPost(store.getMyKeyChain().identity, cypher_profile.cypher_json, derivation_scheme, 0, reference);
  return profile_id;

  // use cypher_profile.primary_key and share keys
};

async function createCypherPreferencePost(
  mute_list,
  last_trade_derivation_scheme
) {
  const keys = store.getMyKeyChain();
  const plain_preferences = {
    type: PREFERENCES,
    mute_list,
    last_trade_derivation_scheme
  };
  const cypher_preferences = util.createCypherJSON(
    keys.cypherpost,
    PREFERENCES_DS,
    plain_preferences,
  );
  const reference = "allowonlyexistingpostids";
  const preferences_id = await api.createPost(keys.identity, cypher_preferences.cypher_json, PREFERENCES_DS, 0, reference);
  if (preferences_id instanceof Error) return preferences_id;

  if (!store.getMyPreferences()) console.log("INIT PREFS");
  else {
    const removeOldPrefs = await api.deletePost(keys.identity, store.getMyPreferences().id);
    if (removeOldPrefs instanceof Error) return removeOldPrefs;
  }

  return preferences_id;
};

async function createCypherTradePost(
  expiry,
  message,
  networks,
  order,
  minimum,
  maximum,
  payment_methods,
  reference_exchange,
  reference_percent,
  selected_pubkeys
) {
  const preferences = store.getMyPreferences().plain_json;
  // USE ONLY LATEST PREFERENCE
  // CURRENTLY ASSUMING
  console.log({ preferences });
  const trade_derivation_scheme = util.rotatePath(preferences.last_trade_derivation_scheme);
  const mute_list = (preferences.mute_list) ? preferences.mute_list : [];
  const plain_trade = {
    type: TRADE,
    message,
    networks: networks.length === 0 ? ["Bitcoin"] : networks,
    order,
    minimum: minimum ? minimum : 0,
    maximum: maximum ? maximum : "No-Limit",
    payment_methods: payment_methods.length === 0 ? ["ANY"] : payment_methods,
    reference_exchange,
    reference_percent: reference_percent ? reference_percent : 0
  };
  const keys = store.getMyKeyChain();
  const cypher_trade = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    trade_derivation_scheme,
    plain_trade
  );
  const reference = "onlyallowreferenceexistingid";
  const trade_id = await api.createPost(keys.identity, cypher_trade.cypher_json, trade_derivation_scheme, expiry, reference);
  if (trade_id instanceof Error) return trade_id;
  // preferences.plain_json.last_trade_derivation_scheme = trade_derivation_scheme;
  // store.setMyPreferences(preferences);
  const plain_preferences = {
    type: PREFERENCES,
    last_trade_derivation_scheme: trade_derivation_scheme,
    mute_list: mute_list,
  };
  const cypher_preferences = util.createCypherJSON(
    keys.cypherpost,
    PREFERENCES_DS,
    plain_preferences
  );
  const preferences_id = await api.createPost(keys.identity, cypher_preferences.cypher_json, PREFERENCES_DS, 0, reference);
  if (preferences_id instanceof Error) return preferences_id;

  const removeOldPrefs = await api.deletePost(keys.identity, preferences.id);
  if (removeOldPrefs instanceof Error) return removeOldPrefs;

  console.log({ selected_pubkeys });
  const decryption_keys = util.createDecryptionKeys(keys.identity, cypher_trade.primary_key, selected_pubkeys);

  const status = await api.setPostVisibility(keys.identity, trade_id, decryption_keys);
  if (status instanceof Error) return status;

  return trade_id;
};

function getMyTrustedIdentities() {
  const trusted_badges = store
    .getMyBadges()['given']
    .filter((badge_given) => {
      if (badge_given.type === TRUST) {
        return badge_given;
      }
    });
  const trusted_pubkeys = trusted_badges.map((badge) => badge.reciever);

  const trusted_identities = [];
  trusted_pubkeys.map((pubkey) => {
    const identity = store.getAllIdentities.find((identity) => identity.pubkey === pubkey);
    trusted_identities.push(identity);
  });

  return trusted_identities;
};

function getMyTrustByOneDegree() {
  const trusted_identities = getMyTrustedIdentities();
  let one_degree_trusted = [];
  trusted_identities.map((identity) => {
    const pubkeys_one_degree = store.getAllBadges.filter((badge) => {
      if (badge.giver === identity.pubkey && badge.type === TRUST) {
        return badge.reciever
      };
    });
    one_degree_trusted.push({ ...identity, trusting: pubkeys_one_degree });
  });

  return one_degree_trusted;

}

function getAllScammers() {
  return store
    .getAllBadges()
    .filter((badge) => badge.type === SCAMMER);
};

function getBadgesByPubkey(pubkey) {
  let given = [];
  let recieved = [];
  store.getAllBadges().filter((badge) => {
    if (badge.giver === pubkey) given.push(badge);
    if (badge.reciever === pubkey) recieved.push(badge);
  });
  return {
    given,
    recieved
  }
}

async function trustPubkey(identity_parent, pubkey) {
  const response = await api.giveBadge(identity_parent, pubkey, TRUST);
  return response;
}
async function revokeTrustPubkey(identity_parent, pubkey) {
  const response = await api.revokeBadge(identity_parent, pubkey, TRUST);
  return response;
}

module.exports = {
  downloadAllIdentities,
  downloadAllIdentitiesAndBadges,
  downloadAllMyPosts,
  downloadAllPostsForMe,
  createCypherProfilePost,
  createCypherPreferencePost,
  createCypherTradePost,
  getBadgesByPubkey,
  trustPubkey,
  revokeTrustPubkey
}

