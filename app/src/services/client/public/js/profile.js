const crypto = require("crypto");
const axios = require('axios');
const bitcoin = require("./bitcoin");
const { encrypt, decrypt } = require("./aes");
const { exit } = require("./auth");
const store = require("./store");
const { 
  apiInvite, 
  apiCheckSeed256, 
  apiEditProfile, 
  apiGetMyProfile, 
  apiProfileGenesis,
  apiDeleteMyProfile
} = require("./api");



// DISPLAY
function displayProfile(profile, contact_info) {
  document.getElementById("profile_nickname").textContent = profile.nickname;
  document.getElementById("profile_username").textContent = profile.username;
  document.getElementById("profile_status").textContent = profile.status;
  document.getElementById("profile_trusting").textContent = profile.trusting.length;
  document.getElementById("profile_trusted_by").textContent = profile.trusted_by.length;
  document.getElementById("profile_contact").textContent = contact_info;
}


// HELPERS

function createCipherInfo(contact_info, derivation_scheme, profile_parent_xprv) {
  const revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
  const contact_encryption_key = bitcoin.derive_child_indexes(profile_parent_xprv, 0, revoke);
  return encrypt(contact_info, crypto.createHash('sha256').update(contact_encryption_key["xprv"]).digest('hex'));
}
function createContactInfo(cipher_info, derivation_scheme, profile_parent_xprv) {
  const revoke = parseInt(derivation_scheme.split("/")[2].replace("'", ""));
  const contact_encryption_key = bitcoin.derive_child_indexes(profile_parent_xprv, 0, revoke);
  return decrypt(cipher_info, crypto.createHash('sha256').update(contact_encryption_key["xprv"]).digest('hex'));
}


// COMPOSITES
async function initProfileState() {
  const my_profile_and_keys = (store.getMyProfile() && store.getMyKeys()) ? { profile: store.getMyProfile(), keys: store.getMyKeys() } : await apiGetMyProfile(store.getToken());

  if (my_profile_and_keys instanceof Error) {
    if (my_profile_and_keys.name === "404" && my_profile_and_keys.message.startsWith("No profile")) {
      // create new profile
      const my_recipient_xpub = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']["xprv"], 0, 0)['xpub'];
      const new_profile_and_keys = await apiProfileGenesis(my_recipient_xpub, token);
      if (new_profile_and_keys instanceof Error) {
        console.error("ERROR AT initProfileState - apiProfileGenesis");
        console.error({ e });
      }
      return new_profile_and_keys;
    }
    else {
      console.error("ERROR at initProfileState");
      console.error({ my_profile_and_keys });
    }
  }

  return my_profile_and_keys;
}
async function editComposite() {
  const nickname = document.getElementById("nickname_input").value;
  const status = document.getElementById("status_input").value;
  const contact_info = document.getElementById("contact_input").value;
  const cipher_info = (contact_info) ? createCipherInfo(contact_info, store.getMyProfile()['derivation_scheme'], store.getParentKeys()["profile_parent"]['xprv']) : null;
  const new_profile = await apiEditProfile(nickname, cipher_info, status, store.getToken());
  if (new_profile instanceof Error) {
    console.error({ e: new_profile })
  }
  else {
    store.setMyProfile(new_profile.profile);
    displayProfile(new_profile.profile, createContactInfo(new_profile["profile"]["cipher_info"], new_profile["profile"]['derivation_scheme'], store.getParentKeys()["profile_parent"]['xprv']));
  }
  window.location.reload()
}
async function importKeys() {
  const seed = document.getElementById("import_keys_input").value;
  document.getElementById("import_keys_input").value = "";
  const password = document.getElementById("import_keys_password_input").value;
  document.getElementById("import_keys_password_input").value = "";

  const status = await apiCheckSeed256(store.getToken(), seed, store.getUsername(), password);
  if (status instanceof Error) {
    console.error({ apiCheckSeed256: status })
  }
  else if (status) {
    const root = await bitcoin.seed_root(seed);
    const parent_128 = bitcoin.derive_parent_128(root);

    if (!store.setParent128(parent_128, store.getUsername(), password)) {
      console.error("Error setting parent_128 key.")
      return false;
    }
    if (!store.setParentKeys(parent_128['xprv'])) {
      console.error("Error setting parent usecase keys.")
      return false;
    }
    else {
      alert("Successfully Imported Keys");
    }
  }
  else {
    alert("Incorrect Seed!!!");
  }
  window.location.reload();

}

// EVENT LISTENERS
async function loadProfileEvents() {

  const path = window.location.href.split("/");
  let endpoint = path[path.length - 1];
  if (endpoint.startsWith('invitation')) endpoint = "invitation";
  if (endpoint === '') endpoint = "home";
  else endpoint = endpoint.split(".")[0];

  switch (endpoint) {
    case "profile":
      document.getElementById("profile_username").textContent = store.getUsername();

      if (!localStorage.getItem(`${store.getUsername()}_parent_128`)) {
        document.getElementById("import_keys_button").click();
      }
      if (!store.getMyProfile()['cipher_info']) {
        alert("Add come cypher contact info!")
        document.getElementById("edit_button").click();
      }

      document.getElementById("exit").addEventListener("click", (event) => {
        event.preventDefault();
        exit();
      });

      const init_profile = await initProfileState();
      if (init_profile instanceof Error) {
        alert("Error initializing profile state")
      }
      store.setMyProfile(init_profile['profile']);
      store.setMyKeys(init_profile['keys']);
      
      const contact_info = (store.getParentKeys() && init_profile['profile']['cipher_info']) ? 
        createContactInfo(init_profile['profile']['cipher_info'], init_profile['profile']['derivation_scheme'], store.getParentKeys()['profile_parent']['xprv']) :
        (init_profile['profile']['cipher_info']) ? 
          init_profile['profile']['cipher_info'] : 
          "No contact info added.";
      
      displayProfile(init_profile['profile'], contact_info);


      /***
       * 
       * 
       * BUTTONS 
       * 
       * 
       * 
       */
      document.getElementById("edit_profile_execute").addEventListener("click", async (event) => {
        event.preventDefault();
        editComposite();
      });

      /**
       * MODAL EXECUTE BUTTON
       */
      document.getElementById("import_keys_execute").addEventListener("click", async (event) => {
        event.preventDefault();
        importKeys();
      });

      document.getElementById("invite_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const invite_link = await apiInvite(store.getUsername(), store.getToken());
        if (invite_link instanceof Error) {
          console.error({ invite_link })
        }
        else {
          document.getElementById("invite_link_space").textContent = invite_link;
        }
      });
      document.getElementById("invite_link_space").addEventListener("click", (event) => {
        event.preventDefault();
        var copyText = document.getElementById("invite_link_space");
        navigator.clipboard.writeText(copyText.textContent);
        alert("Copied invitation link to clipboard.")
      });

      document.getElementById("profile_delete_button").addEventListener("click", (event) => {
        event.preventDefault();
        if (confirm(`Deleting your profile is irreversible!\n Are you sure?`)) {
          apiDeleteMyProfile(store.getToken());
        }
        else{
          return; 
        }
      });


     
      break;

    default:
      break;
  }

}

window.onload = loadProfileEvents();


module.exports = {
 
}

/**
 *
 * ishi9
 * hawk injury roast shy market vendor alone combine wasp pledge gadget appear
 * test
 *
 *
 * bwij
 * sing frost length wait group salon man area reduce snap betray moral
 * test
 *
 *
 * bob
 * glow spot next melt purity music magnet axis business observe galaxy all
 *
 *
 *
 * ishi
 *
 */

