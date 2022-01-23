const PROFILE = "PROFILE";
const PREFERENCES = "PREFERENCES";
const TRADE = "BITCOIN-TRADE";

const TRUST = "TRUST";
const SCAMMER = "SCAMMER";

const PREFERENCES_DS = "m/2h/0h/0h";

const api = require("./api");
const util = require("./util");
const store = require("./store");


async function downloadAllIdentitiesAndBadges(identity_parent) {
  const identities = await api.getAllIdentities(identity_parent)
  if (identities instanceof Error) return identities;
  const id_store = store.setIdentities(identities);

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

  const plain_json_posts = util.decryptMyCypherPosts(store.getMyKeyChain().cypherpost, posts);
  if (plain_json_posts instanceof Error) return plain_json_posts;

  const segregated = util.segregateMyPlainPosts(plain_json_posts);

  const profile = store.setMyProfile(segregated.profile);
  const trades = store.setMyTrades(segregated.trades);
  const preferences = store.setMyPreferences(segregated.preferences);

  return profile && trades && preferences;
}

async function downloadAllPostsForMe(identity_parent) {
  const posts = await api.getPostsForMe(identity_parent);
  if (posts instanceof Error) return posts;

  const plain_json_posts = util.decryptCypherPostsForMe(store.getMyKeyChain().cypherpost, posts);
  if (plain_json_posts instanceof Error) return plain_json_posts;

  const segregated = util.segregatePlainPostsForMe(plain_json_posts);

  const profiles = store.setOthersProfiles(segregated.profiles);
  const trades = store.setOthersTrades(segregated.trades);

  return profiles && trades;
}

async function createCypherProfilePost(
  nickname, 
  status, 
  contact, 
  rotate
  ){
  const derivation_scheme = (rotate)
    ? util.rotatePath(store.getMyProfile().derivation_scheme)
    : store.getMyProfile().derivation_scheme;

  const cypher_profile = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    derivation_scheme,
    {
      type: PROFILE,
      nickname,
      status,
      contact
    }
  );
  const reference = "none";
  const profile_id = await api.createPost(store.getMyKeyChain().identity_parent, cypher_profile, derivation_scheme, 0, reference);
  return profile_id;
};

async function createCypherPreferencePost(
  mute_list,
  last_trade_derivation_scheme
  ){
  const cypher_preferences = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    derivation_scheme,
    {
      type: PREFERENCES,
      mute_list,
      last_trade_derivation_scheme
    }
  );
  const reference = "allowonlyexistingpostids";
  const preferences_id = await api.createPost(store.getMyKeyChain.identity_parent, cypher_preferences, PREFERENCES_DS, 0, reference);
  return preferences_id;
};

async function createCypherTradePost(
  expiry,
  message,
  network,
  order,
  minimum,
  maximum,
  fiat_currency,
  payment_method,
  rate_type,
  fixed_rate,
  reference_exchange,
  reference_percent) {

  const preferences = store.getMyPreferences();
  const trade_derivation_scheme = util.rotatePath(preferences.last_trade_derivation_scheme);

  const cypher_trade = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    trade_derivation_scheme,
    {
      type: TRADE,
      message,
      network,
      order,
      minimum,
      maximum,
      fiat_currency,
      payment_method,
      rate_type,
      fixed_rate,
      reference_exchange,
      reference_percent
    }
  );
  const reference = "onlyallowreferenceexistingid";
  const trade_id = await api.createPost(store.getMyKeyChain.identity_parent, cypher_trade, trade_derivation_scheme, expiry, reference);
  if (trade_id instanceof Error) return trade_id;

  preferences.last_trade_derivation_scheme = trade_derivation_scheme;
  store.setMyPreferences(preferences);

  const cypher_preferences = util.createCypherJSON(
    store.getMyKeyChain().cypherpost,
    preferences_derivation_scheme,
    {
      type: PREFERENCES,
      preferences
    }
  );
  const preferences_id = await api.createPost(store.getMyKeyChain.identity_parent, cypher_preferences, PREFERENCES_DS, 0, reference);
  if (preferences_id instanceof Error) return preferences_id;

  return trade_id;
};

function getMyTrustedIdentities(){
  const trusted_badges = store
  .getMyBadges()['given']
  .filter((badge_given)=>{
    if (badge_given.type === TRUST){
      return badge_given;
    }
  });
  const trusted_pubkeys = trusted_badges.map((badge)=>badge.reciever);

  const trusted_identities = [];
  trusted_pubkeys.map((pubkey)=>{
      const identity = store.getAllIdentities.find( (identity) => identity.pubkey === pubkey );
      trusted_identities.push(identity);
  });

  return trusted_identities;
};

function getMyTrustByOneDegree(){
  const trusted_identities = getMyTrustedIdentities();
  let one_degree_trusted = [];
  trusted_identities.map((identity)=>{
    const pubkeys_one_degree = store.getAllBadges.filter( (badge) => {
      if (badge.giver === identity.pubkey && badge.type === TRUST){
        return badge.reciever
      };
    });
    one_degree_trusted.push({...identity, trusting: pubkeys_one_degree});
  });

  return one_degree_trusted;

}

function getAllScammers(){
  return store
  .getAllBadges()
  .filter((badge)=>badge.type === SCAMMER);
};

module.exports = {
  downloadAllIdentitiesAndBadges,
  downloadAllMyPosts,
  downloadAllPostsForMe,
  createCypherProfilePost,
  createCypherPreferencePost,
  createCypherTradePost
}

