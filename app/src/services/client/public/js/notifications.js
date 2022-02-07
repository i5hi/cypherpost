// /**
//  * attitude beef fault floor script hurdle demand sell glow exact raise such
//  * lucy
//  */
const PROFILE = "PROFILE";
const PREFERENCES = "PREFERENCES";
const TRADE = "BITCOIN-TRADE";

const util = require("./util");
const api = require("./api");
const store = require("./store");
const comps = require("./composites");


async function loadInitialState() {
  // IDENTITIES
  try {
    const keys = store.getMyKeyChain();
    const ids_badges = await comps.downloadAllIdentitiesAndBadges(keys.identity);
    if(ids_badges instanceof Error){
      console.error({ids_badges});
    }
    const posts_from_others = await comps.downloadAllPostsForMe(keys.identity);
    if(posts_from_others instanceof Error){
      console.error({posts_from_others});
    }
    const my_posts = await comps.downloadAllMyPosts(keys.identity);
    if(my_posts instanceof Error){
      console.error({my_posts});
    }
    if (ids_badges && posts_from_others && my_posts){
      return true;
    }
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
  const badges = store.getAllBadges();
  if (badges instanceof Error || !badges) {
    console.error({ badges });
  }

  const my_network = badges.filter((badge) => {
    if (badge.giver === keys.identity.pubkey) 
    return badge.reciever;

    if(badge.reciever === keys.identity.pubkey) 
    return badge.giver;
  });

  const my_profile = store.getMyProfile();
  const my_trades = store.getMyTrades();
  const others_trades = store.getOthersTrades();

  const has_profile = (my_profile && my_profile.type === PROFILE);
  const has_trades = (my_trades && my_trades.length > 0);
  const has_others_trades = (others_trades && others_trades.length > 0);
  const has_network = (my_network.length > 0);
  // const has others_profile = (others_profile.profiles.length);
  let notifications = {
    profile: {
      msg: "You are using default settings.",
    },
    network: {
      msg: `You are connected to ${my_network.length} users.`,
    },
    trades: {
      msg: `You have ${others_trades.length} live posts.`,
    }
  };

  if (!has_network) {
    notifications.network.msg = "You are not connected to anyone yet.";
  }
  if (!has_trades && !has_others_trades) {
    notifications.trades.msg = "You have 0 live trades.";
  }
  if (!has_profile) {
    notifications.profile.msg = "You are using default settings.";
  }
  return notifications;

}


async function loadNotificationsEvents() {

  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    util.exit();
  });

  document.getElementById("profile_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="preferences";
  });

  document.getElementById("network_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="network";
  });

  document.getElementById("trade_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="posts";
  });

  const status = await loadInitialState();
  if(status instanceof Error){
    console.error({status});
  };

  const init_state = await checkInitialState();
  console.log({init_state});
  if(init_state instanceof Error){
    console.error({init_state});
  }

  document.getElementById("notifications_page_spinner").classList.add("hidden");

  document.getElementById("profile_notification_msg").textContent = init_state.profile.msg;
  document.getElementById("network_notification_msg").textContent = init_state.network.msg;
  document.getElementById("trade_notification_msg").textContent = init_state.trades.msg;
}

window.onload = loadNotificationsEvents();