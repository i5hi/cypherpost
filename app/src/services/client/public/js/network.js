
const crypto = require("crypto");

const bitcoin = require("./bitcoin");
const { encrypt, decrypt } = require("./aes");
const store = require("./store");

const { exit } = require("./auth");
const { apiRevoke, apiTrust, apiGetMyProfile, apiGetUsernames, apiGetUserProfile, apiGetManyProfiles, apiMuteUser } = require('./api');



// console.log({ existing_usernames });
// console.log({ trusting_usernames });
// console.log({ search_usernames });

async function trust(username) {

  const other_profile = (store.getUserProfile(username)) ? store.getUserProfile(username) : await apiGetUserProfile(store.getToken(), username);

  store.setUserProfile(username, other_profile);


  const other_recipient_xpub = other_profile.recipient_xpub;
  const my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
  // console.log({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });

  const ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
  const shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
  // console.log(shared_secret);
  // check derivation scheme first
  const derivation_scheme = store.getMyProfile()['derivation_scheme'];
  const revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
  // console.log(revoke);

  const profile_encryption_key = crypto.createHash('sha256')
    .update(bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, revoke)['xprv'])
    .digest('hex');

  // console.log(profile_encryption_key);

  const encrypted_pek = encrypt(profile_encryption_key, shared_secret);
  const signature = ".signLater.";

  const updated = await apiTrust(store.getToken(), username, encrypted_pek, signature);
  if (updated instanceof Error) {
    console.error({ trusting: updated });
    alert(`Failed to trust ${username}`);

  }
  else {
    // do the right thing
    store.setMyProfile(updated);
    alert(`Trusting ${username}`);
    window.location.reload();
    return true;
  }

}

async function revoke(username) {
  if (confirm(`Revoke Trust for ${username}?`)) {
    const revoke_profile = (store.getUserProfile(username)) ? store.getUserProfile(username) : await apiGetUserProfile(store.getToken(), username);

    store.setUserProfile(username, revoke_profile);

    // console.log(revoke_profile.profile.username);

    const index = trusting_usernames.indexOf(username);
    if (index > -1) {
      trusting_usernames.splice(index, 1);
    }

    // console.log(index);

    let decryption_keys = [];

    const my_profile = store.getMyProfile();
    const current_profile_ds = my_profile.derivation_scheme;
    const revoke = parseInt(current_profile_ds.split("/")[2].replace("'", ""));
    const derivation_scheme_update = "m/0'/" + (revoke + 1) + "'";

    // console.log(derivation_scheme_update);
    // console.log(trusting_usernames);

    const contact_decryption_key = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']["xprv"], 0, revoke);

    const contact_info = decrypt(my_profile.cipher_info, crypto.createHash('sha256').update(contact_decryption_key.xprv).digest('hex'));

    const new_profile_key = bitcoin.derive_child_indexes(store.getParentKeys()['profile_parent']['xprv'], 0, revoke + 1);
    const updated_cipher_info = encrypt(contact_info, crypto.createHash('sha256').update(new_profile_key.xprv).digest('hex'));

    // console.log(updated_cipher_info)

    if (trusting_usernames.length > 0) {
      const trusting_profiles = await apiGetManyProfiles(store.getToken(), trusting_usernames);
      const my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
      trusting_profiles.keys.map((item) => {
        const ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: item.recipient_xpub, xprv: my_recipient_xprv });
        const shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped['private_key'], ecdsa_grouped['public_key']);
        const encrypted_profile_key = encrypt(crypto.createHash('sha256').update(new_profile_key.xprv).digest('hex'), shared_secret);
        decryption_keys.push({
          key: encrypted_profile_key,
          id: item.username
        });
      });
    }
    // console.log({ decryption_keys });
    const updated = await apiRevoke(store.getToken(), revoke_profile.profile.username, decryption_keys, derivation_scheme_update, updated_cipher_info);
    if (updated instanceof Error) {
      console.error({ updated });
      alert(`Failed to revoke trust in ${username}`);
    }
    else {
      //do the right thing
      store.setMyProfile(updated);
      alert(`Revoked trust in ${username}`);
      window.location.reload();
      return true;
    }
  }
  else {
    console.log("Decided not to revoke trust!");
  }
}

async function displayProfile(my_profile,my_keys,username) {
  // alert(`Showing profile for ${username}`);
  // check if user profile exists in local storage
  
  const other_profile =  await apiGetUserProfile(store.getToken(), username);
  if (other_profile instanceof Error) {
    console.error({ other_profile });
    return false;
  };


  store.setUserProfile(username, other_profile);

  // console.log(other_profile);
  const my_trusted_by = my_profile.trusted_by.map((item) => item.username);
  const my_trusting = my_profile.trusting.map((item) => item.username);
  const other_trusting = other_profile.profile.trusting.map((item) => item.username);
  const other_trusted_by = other_profile.profile.trusted_by.map((item) => item.username);
  const trust_intersection = my_trusting.filter(username => { if (other_trusted_by.includes(username)) return username });

  // populate
  document.getElementById("network_profile_nickname").textContent = other_profile.profile.nickname;
  document.getElementById("network_profile_username").textContent = other_profile.profile.username;
  document.getElementById("network_profile_status").textContent = other_profile.profile.status;
  document.getElementById("network_profile_trust_intersection").textContent = trust_intersection.length;
  document.getElementById("network_profile_trusting_list").innerHTML = `Trusting : <span class="contact_info">${other_trusting.toString()}</span>`;
  document.getElementById("network_profile_trusted_by_list").innerHTML = `Trusted By : <span class="contact_info">${other_trusted_by.toString()}</span>`;


  document.getElementById('trust_intersection_list').innerHTML = `Trust Intersection: <span class="contact_info">${trust_intersection.toString()}</span>`;

  // trust_intersection.map((username, i, array) => {
  //   if (array.length - 1 < 0) return;
  //   if (i === 0) document.getElementById('trust_intersection_list').textContent += "Trusted By ";
  //   else if (array.length - 1 === i) document.getElementById('trust_intersection_list').textContent += `${username}.`
  //   else if (array.length - 2 === i) document.getElementById('trust_intersection_list').textContent += `${username} & `
  //   else document.getElementById('trust_intersection_list').textContent += `${username}, `
  // });

  console.log({my_trusted_by:my_profile.trusted_by});
  if (my_trusted_by.includes(username)) {

    const encrypted_contact_decryption_key_array = my_keys.profile_keys.filter((item) => {
      if (item.id === username)
        return item
    });
    const encrypted_contact_decryption_key = (encrypted_contact_decryption_key_array.length > 0) ? encrypted_contact_decryption_key_array[0]['key'] : null;

    // console.log({ encrypted_contact_decryption_key })

    const my_recipient_xprv = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']['xprv'], 0, 0)['xprv'];
    const other_recipient_xpub = other_profile.recipient_xpub;

    const ecdsa_grouped = bitcoin.extract_ecdsa_pair({ xpub: other_recipient_xpub, xprv: my_recipient_xprv });
    const shared_secret = bitcoin.calculate_shared_secret(ecdsa_grouped.private_key, ecdsa_grouped.public_key);

    // console.log({ shared_secret })

    const decryption_key = (encrypted_contact_decryption_key) ? decrypt(encrypted_contact_decryption_key, shared_secret) : null;
    // console.log({ decryption_key })
    const contact_info = (decryption_key) ? decrypt(other_profile.profile.cipher_info, decryption_key) : other_profile.profile.cipher_info;
    // console.log({shared_secret})
    document.getElementById("network_profile_contact").textContent = contact_info;

    const trusted_by_item = my_profile.trusted_by.filter((item) => {
      if (item.username === username)
        return item;
    });
    const is_muted = trusted_by_item[0].mute;
    if (is_muted) {
      document.getElementById("network_profile_mute_button").innerHTML = `<div class="col-8"></div><div class="col-4"><button id="unmute_${username}" class="btn-sm centerme" type="button">Unmute</button></div>`
      document.getElementById(`unmute_${username}`).addEventListener("click", async (event) => {
        event.preventDefault();
        const updated = await apiMuteUser(store.getToken(),username,!is_muted);
        console.log({updated})

        alert("Unmuted")
        displayProfile(updated,store.getMyKeys(),username);
      });
    }
    else {
      document.getElementById("network_profile_mute_button").innerHTML = `<div class="col-8"></div><div class="col-4"><button id="mute_${username}" class="btn-sm centerme" type="button">Mute</button></div>`
      document.getElementById(`mute_${username}`).addEventListener("click", async (event) => {
        event.preventDefault();
        const updated = await apiMuteUser(store.getToken(),username,!is_muted);
        console.log({updated})

        alert("Muted")
        displayProfile(updated,store.getMyKeys(),username);
      });
    }


  }
  else {
    document.getElementById("network_profile_contact").textContent = other_profile.profile.cipher_info;
  }

}

function filterUsernamesByTrust(my_profile, existing_usernames) {
  const index = existing_usernames.indexOf(store.getUsername());
  if (index > -1) {
    existing_usernames.splice(index, 1);
  };

  trusting_usernames = my_profile["trusting"].map((item) => item.username);
  trusted_by_usernames = my_profile["trusted_by"].map((item) => item.username);
  search_usernames = existing_usernames.filter(username => {
    if (!trusting_usernames.includes(username)) {
      return username;
    }
  });
  return {
    trusting_usernames,
    trusted_by_usernames,
    search_usernames
  }
}

async function loadNetworkEvents() {

  /**
   * 
   * 
   * check if my profile exists.
   * check if existing_usuernames exists
   * populate network with trusted, trusted by and remaining users
   * 
   */
  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    exit();
  });

  const my_profile = await apiGetMyProfile(store.getToken());
  if (my_profile instanceof Error) {
    console.error(my_profile);
    return;
  }
  const existing_usernames = await apiGetUsernames(true, store.getToken());
  if (existing_usernames instanceof Error) {
    console.error(existing_usernames);
    return;
  }
  store.setMyProfile(my_profile.profile);
  store.setMyKeys(my_profile.keys);

  store.setExistingUsernames(existing_usernames);


  const { trusting_usernames, trusted_by_usernames, search_usernames } = filterUsernamesByTrust(store.getMyProfile(), store.getExistingUsernames());

  document.getElementById("network_page_spinner").classList.add("hidden");
  document.getElementById("network_page").classList.remove("hidden");

  search_usernames.map((username) => {
    document.getElementById('search_userlist').innerHTML += `<div id="search_item_${username}" class="row"><div class="col-8 outline leftme">${username}</div><div class="col-4 outline"><button id="trust_${username}" class="btn-sm centerme" type="submit">Trust</button></div></div><hr>`
  });

  search_usernames.map((username) => {
    document.getElementById(`trust_${username}`).addEventListener("click", (event) => {
      event.preventDefault();
      trust(username);
    });
    document.getElementById(`search_item_${username}`).addEventListener("click", (event) => {
      event.preventDefault();
      displayProfile(store.getMyProfile(),store.getMyKeys(),username);
    });
  });

  trusting_usernames.map((username) => {
    document.getElementById('trusting_userlist').innerHTML += `<div id="trusting_item_${username}" class="row"><div class="col-8 outline leftme">${username}</div><div class="col-4 outline"><button id="trusting_revoke_${username}" class="btn-sm centerme" type="submit">Trusting</button></div></div><hr>`
  });

  trusting_usernames.map((username) => {
    document.getElementById(`trusting_revoke_${username}`).addEventListener("click", (event) => {
      event.preventDefault();
      revoke(username);
    });
    document.getElementById(`trusting_item_${username}`).addEventListener("click", (event) => {
      event.preventDefault();
      displayProfile(store.getMyProfile(),store.getMyKeys(),username);
    });
  });

  trusted_by_usernames.map((username) => {
    /**
     * 
     * Check if the user is already trusted by the current user
     * Accordingly change button text
     * 
     */

    if (trusting_usernames.includes(username))
      document.getElementById('trusted_by_userlist').innerHTML += `<div id="trusted_by_item_${username}" class="row"><div class="col-8 outline leftme">${username}</div><div class="col-4 outline"><button id="trusted_by_revoke_${username}" class="btn-sm centerme" type="submit">Trusting</button></div></div><hr>`
    else
      document.getElementById('trusted_by_userlist').innerHTML += `<div id="trusted_by_item_${username}" class="row"><div class="col-8 outline leftme">${username}</div><div class="col-4 outline"><button id="trusted_by_${username}" class="btn-sm centerme" type="submit">Trust</button></div></div><hr>`
  });

  trusted_by_usernames.map((username) => {
    if (trusting_usernames.includes(username))
      document.getElementById(`trusted_by_revoke_${username}`).addEventListener("click", (event) => {
        event.preventDefault();
        revoke(username);
      });
    else
      document.getElementById(`trusted_by_${username}`).addEventListener("click", (event) => {
        event.preventDefault();
        trust(username);
      });

    document.getElementById(`trusted_by_item_${username}`).addEventListener("click", (event) => {
      event.preventDefault();
      displayProfile(store.getMyProfile(),store.getMyKeys(),username);
    });
  });

  document.getElementById(`network_trusting_menu`).addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("network_trusting").classList.remove("hidden");
    document.getElementById("network_trusted_by").classList.add("hidden");
    document.getElementById("network_search").classList.add("hidden");
    // document.getElementById("network_trust_intersection").classList.add("hidden");


  });

  document.getElementById(`network_trusted_by_menu`).addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("network_trusting").classList.add("hidden");
    document.getElementById("network_trusted_by").classList.remove("hidden");
    document.getElementById("network_search").classList.add("hidden");
    // document.getElementById("network_trust_intersection").classList.add("hidden");


  });

  document.getElementById(`network_search_menu`).addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("network_trusting").classList.add("hidden");
    document.getElementById("network_trusted_by").classList.add("hidden");
    document.getElementById("network_search").classList.remove("hidden");
    // document.getElementById("network_trust_intersection").classList.add("hidden");


  });

}

window.onload = loadNetworkEvents();





// harbor where mask emotion bubble eye measure canoe detail swing inmate observe
// bala-test


// solve same across violin fox tribe beef ridge kid humor breeze before
// ishi

// spike afford eagle pull analyst dust version surface metal page brave vacuum
// dust

