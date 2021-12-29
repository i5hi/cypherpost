// /**
//  * attitude beef fault floor script hurdle demand sell glow exact raise such
//  * lucy
//  */
const crypto = require("crypto");
const bitcoin = require("./bitcoin");
const { encrypt, decrypt } = require("./aes");
const {checkInitialState} = require("./init");
const { exit } = require("./auth");
const {  } = require("./api");
const store = require("./store");

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

async function loadNotificationsEvents() {
  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    exit();
  });

  document.getElementById("profile_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="profile";
  });

  document.getElementById("network_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="network";
  });

  document.getElementById("posts_notification").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href="posts";
  });

  // hide and show based on check init state
  const init_state = await checkInitialState();
  if(init_state instanceof Error) {
    console.error({init_state});
  }

  const notifications = await checkInitialState();
  if(notifications instanceof Error){
    console.error({notifications});
  }

  document.getElementById("notifications_page_spinner").classList.add("hidden");

  document.getElementById("profile_notification_msg").textContent = notifications.profile.msg;
  document.getElementById("network_notification_msg").textContent = notifications.network.msg;
  document.getElementById("posts_notification_msg").textContent = notifications.posts.msg;
}

window.onload = loadNotificationsEvents();