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

function populateMyNotifications() {
//   document.getElementById('my_notifications_list').innerHTML = ``;
//   const my_profile = store.getMyProfile();
//   if (my_notifications.length > 0) {
//     my_notifications.map((post) => {
//       const post_index = parseInt(post.derivation_scheme.split("/")[1].replaceAll("'", ""));
//       const post_revoke = parseInt(post.derivation_scheme.split("/")[2].replaceAll("'", ""));
//       const post_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['notifications_parent']['xprv'], post_index, post_revoke);
//       const plain_json = decrypt(post.cipher_json, crypto.createHash('sha256').update(post_encryption_pair['xprv']).digest('hex'));
//       const message = JSON.parse(plain_json).message;

//       const current_profile_ds = my_profile.derivation_scheme;
//       const profile_revoke = parseInt(current_profile_ds.split("/")[2].replaceAll("'", ""));

//       const profile_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, profile_revoke);
//       const contact_info = (my_profile.cipher_info) ? decrypt(my_profile.cipher_info, crypto.createHash('sha256').update(profile_encryption_pair['xprv']).digest('hex')) : "No Contact Info Added.";

//       if (post.expiry != 0) {
//         let expiry_time;
//         if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
//           expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24))} days`
//         else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
//           expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60))} hours`;
//         else
//           expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60))} minutes`;

//         document.getElementById('my_notifications_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div><div class="container">${contact_info}</div></div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: In ${expiry_time}</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"><button id="delete_post_${post.id}" class="btn-sm centerme" type="button"><i class="far fa-trash-alt"></i></button></div></div><br></div></div><br>`;

//       }
//       else {
//         document.getElementById('my_notifications_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div><div class="container">${contact_info}</div></div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: Never</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"><button id="delete_post_${post.id}"" class="btn-sm centerme" type="button"><i class="far fa-trash-alt"></i></button></div></div><br></div></div><br>`;
//       }

//     });
//   }
//   else
//     document.getElementById('my_notifications_list').innerHTML += "You have not made any notifications yet."
return true;
}

// HELPERS
function sortProperties(obj, sortedBy, isNumericSort, reverse) {
  sortedBy = sortedBy || 1; // by default first key
  isNumericSort = isNumericSort || false; // by default text sort
  reverse = reverse || false; // by default no reverse

  var reversed = (reverse) ? -1 : 1;

  var sortable = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      sortable.push([key, obj[key]]);
    }
  }
  if (isNumericSort)
    sortable.sort(function (a, b) {
      return reversed * (a[1][sortedBy] - b[1][sortedBy]);
    });
  else
    sortable.sort(function (a, b) {
      var x = a[1][sortedBy].toLowerCase(),
        y = b[1][sortedBy].toLowerCase();
      return x < y ? reversed * -1 : x > y ? reversed : 0;
    });
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}
function expiryStringtoTimestamp(expiry_string) {

  switch (expiry_string) {
    case "1hr":
      return Date.now() + 60 * 60 * 1000;
    case "12hr":
      return Date.now() + 12 * 60 * 60 * 1000;
    case "1d":
      return Date.now() + 24 * 60 * 60 * 1000;
    case "1w":
      return Date.now() + 7 * 24 * 60 * 60 * 1000;
    case "1m":
      return Date.now() + 30 * 24 * 60 * 60 * 1000;
    case "never":
      return 0;
    default:
      return 0;
  }
}
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
  })

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