/**
 * attitude beef fault floor script hurdle demand sell glow exact raise such
 * lucy
 */
const crypto = require("crypto");
const bitcoin = require("./bitcoin");
const { encrypt, decrypt } = require("./aes");
const { exit } = require("./auth");
const { apiGetOthersPosts, apiGetMyProfile, apiGetManyProfiles, apiGetMyPosts, apiCreatePost, apiGetUserProfile, apiDeletePost } = require("./api");
const store = require("./store");

async function populateOthersPosts(others_posts) {

  document.getElementById('others_posts_list').innerHTML = ``;
  if (others_posts.length > 0) {

    others_posts.map(async (post) => {
      // get your post_keys from my_profile
      // compute shared_secret for this posts user
      // console.log("CONDITION", trusted_by_usernames.includes(post.username));

      if (post.expiry < Date.now()) return;

      // temporary fix to not show posts by trusted_by
      if (!trusted_by_usernames.includes(post.username)) return;

      const my_keys = store.getMyKeys();
      const other_profile = (store.getUserProfile(post.username)) ? store.getUserProfile(post.username) : await apiGetUserProfile(store.getToken(), post.username);
      if (other_profile instanceof Error) {
        console.error({ other_profile })
        return;
      }
      store.setUserProfile(post.username, other_profile);

      // console.log({ other_profile });
      const my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
      const other_recipient_xpub = other_profile.recipient_xpub;
      // console.log({ other_recipient_xpub })
      const ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
      const shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped.private_key, ecdsa_grouped.public_key);

      // console.log({ shared_secret });
      const this_posts_cipher_key = my_keys['post_keys'].filter((item) => { if (item.id === post.id) return item; })[0]['key'];
      // console.log({ this_posts_cipher_key });

      const this_posts_plain_key = decrypt(this_posts_cipher_key, shared_secret);
      // console.log({ this_posts_plain_key });

      const this_post_plain_json = decrypt(post.cipher_json, this_posts_plain_key);

      const message = JSON.parse(this_post_plain_json)['message'];

      /***
       * 
       * THERE IS A CASE WHERE TRUST IS REVOKED AND A USER STIL HAS POST KEYS BUT NOT PROFILE KEYS
       */
      const matching_profile_keys = my_keys['profile_keys'].filter((item) => { if (item.id === post.username) return item });
      const contact_cipher_key = (matching_profile_keys.length === 1) ? matching_profile_keys[0].key : "none";

      // console.log({ contact_cipher_key });
      let contact_info = other_profile['profile']['cipher_info'];

      if (contact_cipher_key !== "none") {
        const contact_plain_key = decrypt(contact_cipher_key, shared_secret);
        contact_info = (other_profile['profile']['cipher_info'])?decrypt(other_profile['profile']['cipher_info'], contact_plain_key): "No Contact Info Added.";

      }

      if (post.expiry !== 0) {
        let expiry_time;
        if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24))} days`
        else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60))} hours`;
        else
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60))} minutes`;

        document.getElementById('others_posts_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div class="container">${contact_info}</div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: ${expiry_time}</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"></div></div><br></div></div><br>`;
      }
      else
        document.getElementById('others_posts_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div class="container">${contact_info}</div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: Never</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"></div></div><br></div></div><br>`;

    });
  }
  else
    document.getElementById('others_posts_list').innerHTML += "No one in your network has posted yet."

}


function populateMyPosts(my_posts) {
  document.getElementById('my_posts_list').innerHTML = ``;
  const my_profile = store.getMyProfile();
  if (my_posts.length > 0) {
    my_posts.map((post) => {
      const post_index = parseInt(post.derivation_scheme.split("/")[1].replace("'", ""));
      const post_revoke = parseInt(post.derivation_scheme.split("/")[2].replace("'", ""));
      const post_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['posts_parent']['xprv'], post_index, post_revoke);
      const plain_json = decrypt(post.cipher_json, crypto.createHash('sha256').update(post_encryption_pair['xprv']).digest('hex'));
      const message = JSON.parse(plain_json).message;

      const current_profile_ds = my_profile.derivation_scheme;
      const profile_revoke = parseInt(current_profile_ds.split("/")[2].replace("'", ""));

      const profile_encryption_pair = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, profile_revoke);
      const contact_info = (my_profile.cipher_info)?decrypt(my_profile.cipher_info, crypto.createHash('sha256').update(profile_encryption_pair['xprv']).digest('hex')):"No Contact Info Added.";

      if (post.expiry !== 0) {
        let expiry_time;
        if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 24)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60 * 24))} days`
        else if ((post.expiry - Date.now()) / (1000 * 60 * 60) >= 1)
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60 * 60))} hours`;
        else
          expiry_time = `${Math.round((post.expiry - Date.now()) / (1000 * 60))} minutes`;

        document.getElementById('my_posts_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div><div class="container">${contact_info}</div></div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: In ${expiry_time}</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"><button id="delete_post_${post.id}" class="btn-sm centerme" type="button"><i class="far fa-trash-alt"></i></button></div></div><br></div></div><br>`;
        
      }
      else {
        document.getElementById('my_posts_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">@${post.username}</div><div id="my_post_message_${post.id}" class="row post_message"><div>${message}</div></div><div id="my_post_contact_${post.id}" class="row contact_info"><div><div class="container">${contact_info}</div></div></div><hr><div id="my_post_genesis_${post.id}" class="row contact_info">Genesis: ${new Date(post.genesis)}</div><div id="my_post_expiry_${post.id}" class="row contact_info">Expiry: Never</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"><button id="delete_post_${post.id}"" class="btn-sm centerme" type="button"><i class="far fa-trash-alt"></i></button></div></div><br></div></div><br>`;
      }
      document.getElementById(`delete_post_${post.id}`).addEventListener("click", (event) => {
        event.preventDefault();
        apiDeletePost(store.getToken(), post.id);
        alert("Deleted Post")
        document.getElementById("my_posts_menu").click();
      });
      
    });
    
  }
  else
    document.getElementById('my_posts_list').innerHTML += "You have not made any posts yet."

}

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
async function createPost(message, expiry_string) {

  const expiry = expiryStringtoTimestamp(expiry_string);

  const plain_json = JSON.stringify({
    message
  });

  let decryption_keys = [];

  const my_posts = await apiGetMyPosts(store.getToken());
  if (my_posts instanceof Error) {
    // handle
    alert("Error in api call");
    console.error({ my_posts })
    return;
  }
  // console.log({ my_posts });

  const current_posts_ds = (my_posts.length === 0) ? "m/0'/0'" : sortProperties(my_posts, 'genesis', true, true)[0][1]['derivation_scheme'];
  // console.log(sortProperties(my_posts, 'genesis', true, true)[0][1]['derivation_scheme'])
  // console.log(current_posts_ds);
  const index = parseInt(current_posts_ds.split("/")[1].replace("'", ""));
  const derivation_scheme = "m/" + index + "/0'";

  // console.log(derivation_scheme_update);

  const post_encryption_key = bitcoin.derive_child_indexes(store.getParentKeys()['posts_parent']["xprv"], index, 0);

  const cipher_json = encrypt(plain_json, crypto.createHash('sha256').update(post_encryption_key.xprv).digest('hex'));

  const my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
  const trusting_usernames = store.getMyProfile().trusting.map(item => item.username);
  const trusting_profiles = await apiGetManyProfiles(store.getToken(), trusting_usernames);

  // console.log({ trusting_profiles });

  trusting_profiles.keys.map((item) => {
    const ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: item.recipient_xpub, xprv: my_recipient_xprv });
    const shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
    const encrypted_posts_key = encrypt(crypto.createHash('sha256').update(post_encryption_key.xprv).digest('hex'), shared_secret);
    decryption_keys.push({
      key: encrypted_posts_key,
      id: item.username
    });
  });

  const post = await apiCreatePost(store.getToken(), expiry, decryption_keys, derivation_scheme, cipher_json);
  if (post instanceof Error) {
    // handle
    console.error({ post });
    alert(`Failed to create post`);
  }
  else {
    document.getElementById("my_posts_menu").click();
  }
}

function displayNewPost(post) {
  document.getElementById('my_posts_list').innerHTML += `<div class="container border outline"><br><div class="container"><div class="row"><div class="container"><div id="my_post_username_${post.id}" class="row post_username">${post.username}</div><div id="post_message_${post.cipher_json}" class="row">This is a test MY post</div><div id="post_contact_${post.id}" class="row contact_info"><div>${store.getMyProfile().cipher_info}</div></div><hr><div id="post_genesis_${post.id}" class="row contact_info">Saturday, 2nd January. 10:30 PM.</div><div id="post_expiry_${post.id}" class="row post_message">Exipres in 2 hours</div></div></div><div class="row"><div class="col-8"></div><div class="col-4"><button id="delete_post_${post.id}"" class="btn-sm centerme" type="button"><i class="far fa-trash-alt"></i></button></div></div><br></div></div><br>`;
  document.getElementById("my_posts_list").classList.remove("hidden");
  document.getElementById("others_posts_list").classList.add("hidden");
}

async function updatePage() {
  // const my_posts = await apiGetMyPosts(store.getToken());
  const others_posts = await apiGetOthersPosts(store.getToken());

  // console.log("\nAT UPDATE\n");
  // console.log({ my_posts });
  // console.log({ others_posts });

  // store.setMyPosts(my_posts);
  store.setOthersPosts(others_posts);
  // populateMyPosts(my_posts);
  populateOthersPosts(others_posts);

}

async function loadPostsEvents() {


  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    exit();
  });


  document.getElementById(`my_posts_menu`).addEventListener("click", async (event) => {
    event.preventDefault();
    document.getElementById("my_posts_list").classList.remove("hidden");
    document.getElementById("others_posts_list").classList.add("hidden");
    const my_posts = await apiGetMyPosts(store.getToken());
    store.setMyPosts(my_posts);
    await populateMyPosts(my_posts);
    
  });

  document.getElementById(`others_posts_menu`).addEventListener("click", async (event) => {
    event.preventDefault();
    document.getElementById("others_posts_list").classList.remove("hidden");
    document.getElementById("my_posts_list").classList.add("hidden");
    const others_posts = await apiGetOthersPosts(store.getToken());
    // console.log({ others_posts });
    store.setOthersPosts(others_posts);
    populateOthersPosts(others_posts);

  });

  document.getElementById("create_post_execute").addEventListener("click", (event) => {
    event.preventDefault();
    const message = document.getElementById("post_message_input").value;
    const expiry_string = document.getElementById("post_expiry_input").value;
    createPost(message, expiry_string);
  });


  const my_profile = await apiGetMyProfile(store.getToken());
  store.setMyProfile(my_profile.profile);
  store.setMyKeys(my_profile.keys);

  trusted_by_usernames = my_profile.profile.trusted_by.map((item) => item.username);
  const many_profiles = await apiGetManyProfiles(store.getToken(), trusted_by_usernames);
  if (many_profiles instanceof Error) {
    // console.log({ many_profiles })
  }
  many_profiles.profiles.map((profile) => {
    store.setUserProfile(profile);
  });

  many_profiles.keys.map((key) => {
    store.setUserKeys(key);
  });

  const others_posts = await apiGetOthersPosts(store.getToken());
  // console.log({ others_posts });
  store.setOthersPosts(others_posts);
  await populateOthersPosts(others_posts);
  
  document.getElementById("posts_page_spinner").classList.add("hidden");
  document.getElementById("posts_page").classList.remove("hidden");

}


window.onload = loadPostsEvents();