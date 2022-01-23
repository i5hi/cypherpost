const PROFILE = "PROFILE";
const PREFERENCES = "PREFERENCES";
const TRADE = "BITCOIN-TRADE";

const store = require("./store");
const comps = require("./composites");

async function loadInitialState() {
  // IDENTITIES
  try {
    const keys = store.getMyKeyChain();
    const ids_badges = await comps.downloadAllIdentitiesAndBadges(keys.identity);
    const posts_from_others = await comps.downloadAllPostsForMe(keys.identity);
    const my_posts = await comps.downloadAllMyPosts(keys.identity);
    if (ids_badges && posts_from_others && my_posts) return true;
    else{
      alert("Something didnt download fully.");
      return false;
    }
  }
  catch (e) {
    console.error("BROKE AT loadInitialState");
    console.error({ e });
    return false;
  }

}

async function checkInitialState() {
  const keys = store.getMyKeyChain();
  const ids = store.getIdentities();
  const badges = store.getAllBadges();
  if (badges instanceof Error || !badges) {
    console.error({ badges });
  }

  console.log({ badges });

  const my_network = badges.badges.filter((badge) => {
    if (badge.to === keys.identity.pubkey || badge.from === keys.identity.pubkey) {
      return badge;
    };
  })
  console.log({ my_network })

  const my_profile = store.getMyProfile();
  const my_trades = store.getMyTrades();
  const others_trades = store.getOthersTrades();

  const has_profile = (my_profile.type === PROFILE);
  const has_trades = (my_trades.length > 0);
  const has_others_trades = (others_trades.length > 0);
  const has_network = (my_network.length > 0);
  // const has others_profile = (others_profile.profiles.length);
  let notifications = {
    profile: {
      msg: "Profile complete.",
    },
    network: {
      msg: "Network.",
    },
    posts: {
      msg: "No Post updates.",
    }
  };

  if (!has_network) {
    notifications.network.msg = "You are not connected to anyone yet.";
  }
  if (!has_trades && !has_others_trades) {
    notifications.posts.msg = "You have 0 live posts.";
  }
  if (!has_profile) {
    notifications.profile.msg = "You have not created a profile yet.";
  }
  return notifications;

}

module.exports = {
  loadInitialState,
  checkInitialState
}