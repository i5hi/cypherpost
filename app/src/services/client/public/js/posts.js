// /**
//  * attitude beef fault floor script hurdle demand sell glow exact raise such
//  * lucy
//  */
const TRUST = "TRUST";
const SCAMMER = "SCAMMER";

const TRADE = "BITCOIN-TRADE";

const BUY = "BUY";
const SELL =  "SELL";

const LOCAL = "LocalBitcoins";
const LOCAL_DEFAULT_PRICE = 3000000;

const api = require("./api");
const comps = require("./composites");
const store = require("./store");
const util = require("./util");

const {getLocalPrice} = require("./local");

// // DISPLAY

function populateOthersMessages(others_posts) {
  let preferences = store.getMyPreferences();
  let mute_list = [];
  if (preferences){
    preferences = preferences.plain_json;
    mute_list  = preferences.mute_list?preferences.mute_list:[];
  }

  document.getElementById('others_posts_list').innerHTML = ``;
  if (others_posts.length > 0) {
    others_posts.map((post) => {
      if(mute_list.includes(post.owner)) return;

      const owner_username = store.getIdentities().find((id)=>id.pubkey === post.owner).username;
  
      if (post.expiry != 0) {
        let expiry_time;
        if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24))} days`
        else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60))} hours`;
        else
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60))} minutes`;

        document.getElementById('others_posts_list').innerHTML += `<div class="outline container border outline"><br><div class=" outline container"><div class=" outline row"><div class=" outline col-8"><div id="post_nickname_${post.id}" class=" outline cypherpost-color row post_nickname">@${owner_username}</div><div id="post_message_${post.id}" class=" outline  row post_price">${post.plain_json.message}</div><div id="post_message_${post.id}" class=" outline row post_minmax"></div><div id="post_payment_method_${post.id}" class=" outline row post_payment_method"></div><div id="post_networks_${post.id}" class="post_networks outline row"></div><div id="post_price_${post.id}" class=" outline row post_price"></div><div id="post_reference_percent_${post.id}" class=" outline row post_reference_percent"></div><hr><div id="post_genesis_${post.id}" class=" outline row post_genesis">Created on: ${new Date(post.genesis)}</div><div id="post_expiry_${post.id}" class=" outline row post_expiry">Expires in: ${expiry_time}</div></div><div class=" outline col-4"><div id="post_type_${post.id}" class=" outline row post_order centerme liquid-color">x</div></div></div><div class=" outline row"><div class=" outline col-8"></div><div class=" outline col-4"><div id="mute_post_${post.id}" class="outline delete-color centerme">Mute</div></div><br></div></div><br>`;
      }
      else {
        document.getElementById('others_posts_list').innerHTML += `<div class="outline container border outline"><br><div class=" outline container"><div class=" outline row"><div class=" outline col-8"><div id="post_nickname_${post.id}" class=" outline cypherpost-color row post_nickname">@${owner_username}</div><div id="post_message_${post.id}" class=" outline  row post_price">${post.plain_json.message}</div><div id="post_message_${post.id}" class=" outline row post_minmax"></div><div id="post_payment_method_${post.id}" class=" outline row post_payment_method"></div><div id="post_networks_${post.id}" class="post_networks outline row"></div><div id="post_price_${post.id}" class=" outline row post_price"></div><div id="post_reference_percent_${post.id}" class=" outline row post_reference_percent"></div><hr><div id="post_genesis_${post.id}" class=" outline row post_genesis">Created on: ${new Date(post.genesis)}</div><div id="post_expiry_${post.id}" class=" outline row post_expiry">Never Expires.</div></div><div class=" outline col-4"><div id="post_type_${post.id}" class=" outline row post_order centerme liquid-color">x</div></div></div><div class=" outline row"><div class=" outline col-8"></div><div class=" outline col-4"><div id="mute_post_${post.id}" class="outline delete-color centerme">Mute</div></div><br></div></div><br>`;
      }
    });
  }
  else
    document.getElementById('others_posts_list').innerHTML += `<div class=" outline centerme">Others have not made any posts for you yet.</div>`

}

function populateMyMessages(my_posts) {

  const owner_username = store.getMyUsername();
  document.getElementById('my_posts_list').innerHTML = ``;
  if (my_posts.length > 0) {
    my_posts.map((post) => {

      if (post.expiry != 0) {
        let expiry_time;
        if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24))} days`
        else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60))} hours`;
        else
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60))} minutes`;
        console.log({post});
          document.getElementById('my_posts_list').innerHTML += `<div class=" outline container border outline"><br><div class=" outline container"><div class=" outline row"><div class=" outline col-8"><div id="post_nickname_${post.id}" class=" outline cypherpost-color row post_nickname">@${owner_username}</div><div id="post_message_${post.id}" class=" outline row post_price">${post.plain_json.message}</div><div id="post_message_${post.id}" class=" outline row post_minmax"></div><div id="post_payment_method_${post.id}" class=" outline row post_payment_method"></div><div id="post_networks_${post.id}" class="post_networks outline row"></div><div id="post_price_${post.id}" class=" outline row post_price"></div><div id="post_reference_percent_${post.id}" class=" outline row post_reference_percent">Don't trust verify.</div><hr><div id="post_genesis_${post.id}" class=" outline row post_genesis">Created on: ${new Date(post.genesis)}</div><div id="post_expiry_${post.id}" class=" outline row post_expiry">Expires in: ${expiry_time}</div></div><div class=" outline col-4"><div id="post_type_${post.id}" class=" outline row post_order centerme>x</div></div></div><div class=" outline row"><div class=" outline col-8"></div><div class=" outline col-4"><div id="delete_post_${post.id}" class="outline delete-color centerme">x</div></div><br></div></div></div><br>`;
        }
      else {
        document.getElementById('my_posts_list').innerHTML += `<div class=" outline container border outline"><br><div class=" outline container"><div class=" outline row"><div class=" outline col-8"><div id="post_nickname_${post.id}" class=" outline cypherpost-color row post_nickname">@${owner_username}</div><div id="post_message_${post.id}" class=" outline row post_price">${post.plain_json.message}</div><div id="post_message_${post.id}" class=" outline row post_minmax"></div><div id="post_payment_method_${post.id}" class=" outline row post_payment_method"></div><div id="post_networks_${post.id}" class="post_networks outline row"></div><div id="post_price_${post.id}" class=" outline row post_price"></div><div id="post_reference_percent_${post.id}" class=" outline row post_reference_percent"></div><hr><div id="post_genesis_${post.id}" class=" outline row post_genesis">Created on: ${new Date(post.genesis)}</div><div id="post_expiry_${post.id}" class=" outline row post_expiry">Never Expires.</div></div><div class=" outline col-4"><div id="post_type_${post.id}" class=" outline row post_order centerme>X</div></div></div><div class=" outline row"><div class=" outline col-8"></div><div class=" outline col-4"><div id="delete_post_${post.id}" class="outline delete-color centerme">x</div></div><br></div></div></div><br>`;
      }
    });
  }
  else
    document.getElementById('my_posts_list').innerHTML += `<div class=" outline centerme">You have not made any posts yet.</div>`

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

function commafy( num ) {
  var str = num.toString().split('.');
  if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}


async function getUpdatedIdsAndBadges() {
  const keys = store.getMyKeyChain();
  const status = await comps.downloadAllIdentitiesAndBadges(keys.identity);
  const merged = util.mergeIdentitiesWithBadges(store.getIdentities(), store.getAllBadges());
  return merged;
}


function savePostContents() {
  const plain_post = {
    message: document.getElementById("post_message_input").value,
  };
  console.log({ plain_post });
  store.setLatestPost(plain_post);
}

function displaySearchIdentities(idbs) {
  document.getElementById('found_userlist').innerHTML = "";
  idbs.map((id_and_badges) => {
    let trusted_badges = [];
    let in_person_badges = [];
    let scammer_badges = [];
    id_and_badges.badges.recieved.map((badge) => {
      if (badge.type === TRUST)
        trusted_badges.push(badge);
      if (badge.type === SCAMMER)
        scammer_badges.push(badge);
    });
    document.getElementById('found_userlist').innerHTML += `<div id="found_user_${id_and_badges.pubkey}" class=" outline row"><div class=" outline col-6 outline leftme">${id_and_badges.username}</div><div id="trust_${id_and_badges.pubkey}" class=" outline col-4 outline"><i class=" outline fas fa-shield-alt n_badges" aria-hidden="true"></i>${trusted_badges.length}</div><div class=" outline col-4 outline"><i class=" outline fas fa-ban n_badges" aria-hidden="true"></i>${scammer_badges.length}</div></div><hr>`
  });
  return;
}

function displaySelectedIdentities(identities) {
  document.getElementById('selected_userlist').innerHTML = "";
  identities.map((identity) => {
    document.getElementById('selected_userlist').innerHTML += `<div id="selected_user_${identity.pubkey}" class="outline leftme">${identity.username}</div>`
    document.getElementById(`selected_user_${identity.pubkey}`).addEventListener("click", (event) => {
      event.preventDefault();
      store.removeSelectedIdentity(identity);
      displaySelectedIdentities(store.getSelectedIdentities());
    });
  })

}

async function addToMuteList(pubkey){
  const preferences = store.getMyPreferences();
  const mute_list = preferences.plain_json.mute_list?preferences.plain_json.mute_list:[];
  mute_list.push(pubkey);
  const new_pref_id = await comps.createCypherPreferencePost(mute_list,preferences.plain_json.last_trade_derivation_scheme);
  if(new_pref_id instanceof Error) return new_pref_id;

  await comps.downloadAllMyPosts(store.getMyKeyChain().identity);
  return new_pref_id;

}
async function loadPostsEvents() {
  const keys = store.getMyKeyChain();

  let localPrice = await getLocalPrice();
  if(localPrice instanceof Error) localPrice = LOCAL_DEFAULT_PRICE;

  store.setLocalPrice(localPrice);

  console.log({localPrice})

  const all_idbs = await getUpdatedIdsAndBadges();
  console.log({ merged_idbs: all_idbs });
  if (all_idbs instanceof Error) {
    alert("Error initializing Network.");
  }

  await comps.downloadAllMyPosts(keys.identity);
  await comps.downloadAllPostsForMe(keys.identity);

  let trusted_identities = all_idbs.filter((idb) => {
    const trusted = idb.badges.recieved.find((badge) =>
      (badge.type === TRUST && badge.giver === keys.identity.pubkey));
    if (trusted) return idb;
  })
  displaySearchIdentities(trusted_identities);

  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    util.exit();
  });


  document.getElementById(`new_post_button`).addEventListener("click", async (event) => {
    event.preventDefault();
    store.removeSelectedIdentities();
    displaySelectedIdentities([]);

    document.getElementById("create_post_modal").classList.remove("hidden");
    document.getElementById("set_visibility_modal").classList.add("hidden");

  });

  document.getElementById(`my_posts_menu`).addEventListener("click", async (event) => {
    event.preventDefault();
    await comps.downloadAllMyPosts(keys.identity);
    populateMyMessages(store.getMyMessages());
    document.getElementById("my_posts_list").classList.remove("hidden");
    document.getElementById("others_posts_list").classList.add("hidden");

    store.getMyMessages().map((post) => {
      document.getElementById(`delete_post_${post.id}`).addEventListener("click", async (event) => {
        event.preventDefault();
        const confirmation = confirm(`Delete Post?`);
        if (!confirmation) return false;

        const status = await api.deletePost(store.getMyKeyChain().identity, post.id);
        if(status instanceof Error) console.error({status});
        document.getElementById("my_posts_menu").click();
      });
    })
  });

  document.getElementById(`others_posts_menu`).addEventListener("click", async (event) => {
    event.preventDefault();
    await comps.downloadAllPostsForMe(keys.identity);
    populateOthersMessages(store.getOthersMessages());
    document.getElementById("others_posts_list").classList.remove("hidden");
    document.getElementById("my_posts_list").classList.add("hidden");
    const preferences = store.getMyPreferences()?store.getMyPreferences().plain_json:{};
    const mute_list = preferences.mute_list?preferences.mute_list:[];
  
    store.getOthersMessages().map((post) => {
      if(mute_list.includes(post.owner)) return;

      document.getElementById(`mute_post_${post.id}`).addEventListener("click", async (event) => {
        event.preventDefault();
        const confirmation = confirm(`Confirm Mute User?`);
        if (!confirmation) return false;

        alert("WILL MUTE ALL POSTS BY OWNER. PENDING.");
        await addToMuteList(post.owner);
        document.getElementById("others_posts_menu").click();
      });
    });
    return;
  });

  document.getElementById("create_post_execute").addEventListener("click", async (event) => {
    event.preventDefault();
    // const message = document.getElementById("post_message_input").value;
    const plain_post = store.getLatestPost();
    const post_id = await comps.createCypherMessagePost(
      expiryStringtoTimestamp(plain_post.expiry),
      plain_post.message,
      store.getSelectedIdentities().map((identity) => { return identity.pubkey })
    );

    console.log({ post_id });
    store.removeLatestPost();
    document.getElementById("close_create_post_modal").click();
    await comps.downloadAllMyPosts(keys.identity);
    document.getElementById("my_posts_menu").click();
    
  });


  document.getElementById("create_post_next").addEventListener("click", (event) => {
    event.preventDefault();
    // const message = document.getElementById("post_message_input").value;
    // const expiry_string = document.getElementById("post_expiry_input").value;
    // createPost(message, expiry_string);

    savePostContents();
    document.getElementById("create_post_modal").classList.add("hidden");
    document.getElementById("set_visibility_modal").classList.remove("hidden");

  });
  document.getElementById(`identity_search_button`).addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("post_visibility_space_username").value;
    if (username === "") {
      document.getElementById('found_userlist').innerHTML = "";
      displaySearchIdentities(trusted_identities);
    }
    else {
      const remnants = trusted_identities.filter(identity => identity.username.includes(username));
      document.getElementById('found_userlist').innerHTML = "";
      displaySearchIdentities(remnants);
    }
  });

  trusted_identities.map((trusted) => {
    document.getElementById(`found_user_${trusted.pubkey}`).addEventListener("click", (event) => {
      event.preventDefault();
      // store.addIdentityToVisibilitySet(identity);
      store.addSelectedIdentity(trusted);
      displaySelectedIdentities(store.getSelectedIdentities());
    });
  })

  document.getElementById("posts_page_spinner").classList.add("hidden");
  document.getElementById("posts_page").classList.remove("hidden");
  document.getElementById("others_posts_menu").click();

}


window.onload = loadPostsEvents();