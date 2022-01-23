const crypto = require("crypto");
const axios = require('axios');
const bitcoin = require("./bitcoin");
const { encrypt, decrypt } = require("./aes");
const { exit } = require("./auth");
const store = require("./store");
const {
  createPost, setPostVisibility, deleteMyIdentity
} = require("./api");


const INIT_DERIVATION_PATH = "m/1h/0h/0h";


// DISPLAY
function displayProfile(plain_json) {
  document.getElementById("profile_nickname").textContent = plain_json.nickname;
  document.getElementById("profile_status").textContent = plain_json.status;
  document.getElementById("profile_contact").textContent = plain_json.contact;


  // document.getElementById("profile_trusting").textContent = plain_json.trusting.length;
  // document.getElementById("profile_trusted_by").textContent = plain_json.trusted_by.length;

  // const my_trusting = profile.trusting.map((item) => (item.username));
  // const my_trusted_by = profile.trusted_by.map((item) => (item.username));

  // (my_trusting.length > 0) ?
  //   document.getElementById("profile_trusting_list").innerHTML = `Trusting : <span class="contact_info">${my_trusting.toString().replaceAll(",", ", ")}.</span>` :
  //   document.getElementById("profile_trusting_list").innerHTML = `Trusting : <span class="contact_info">None</span>`;
  // (my_trusted_by.length > 0) ?
  //   document.getElementById("profile_trusted_by_list").innerHTML = `Trusted By : <span class="contact_info">${my_trusted_by.toString().replaceAll(",", ", ")}.</span>` :
  //   document.getElementById("profile_trusted_by_list").innerHTML = `Trusted By : <span class="contact_info">None</span>`;

}


// HELPERS

// function createCypherJSON(plain_json, encryption_key) {
//   return encrypt(plain_json, crypto.createHash('sha256').encryption_key).digest('hex'));
// }
// function createContactInfo(cipher_info, derivation_scheme, profile_parent_xprv) {
//   const revoke = (derivation_scheme.includes("'")) ? parseInt(derivation_scheme.split("/")[2].replaceAll("'", "")) : parseInt(derivation_scheme.split("/")[2].replaceAll("h", ""));
//   const contact_encryption_key = bitcoin.derive_child_indexes(profile_parent_xprv, 0, revoke);
//   return decrypt(cipher_info, crypto.createHash('sha256').update(contact_encryption_key["xprv"]).digest('hex'));
// }


// COMPOSITES
async function initProfileState() {
  const keys = store.getMyKeyChain();
  console.log({keys});

  const my_profile_and_keys = await apiProfileSelf(keys.identity);
  if (my_profile_and_keys instanceof Error) return my_profile_and_keys;

  store.setMyProfile(my_profile_and_keys);

  console.log({my_profile_and_keys})
  if (my_profile_and_keys.profile.cypher_json) {
    const decryption_key = crypto
    .createHash("sha256")
    .update(
      bitcoin.derive_hardened_str(keys.cypherpost.xprv, my_profile_and_keys.profile.derivation_scheme)['xprv']
    )
    .digest('hex');
    const plain_json = JSON.parse(decrypt(my_profile_and_keys.profile.cypher_json, decryption_key));
    document.getElementById("nickname_input").value = plain_json.nickname || null;
    document.getElementById("status_input").value = plain_json.status || null;
    document.getElementById("contact_input").value = plain_json.contact || null;
    console.log(plain_json);
    displayProfile(plain_json);
  }
  else {
    alert("Add profile data.")
  }

  return true;
}
async function editComposite() {
  const keys = store.getMyKeyChain();
  const derivation_scheme = store.getMyProfile().profile['derivation_scheme'] || INIT_DERIVATION_PATH;

  console.log({derivation_scheme})
  const nickname = document.getElementById("nickname_input").value;
  const status = document.getElementById("status_input").value;
  const contact = document.getElementById("contact_input").value;
  const plain_json = {
    nickname,
    status,
    contact
  };

  const bitcoin_ekey = bitcoin.derive_hardened_str(keys.cypherpost.xprv, derivation_scheme)['xprv'];
  console.log({bitcoin_ekey})

  const encryption_key = crypto
    .createHash("sha256")
    .update(
      bitcoin_ekey
    )
    .digest('hex');

  const cypher_json = encrypt(JSON.stringify(plain_json), encryption_key);
  
  const new_profile = await createPost(keys.identity, cypher_json, derivation_scheme);
  if (new_profile instanceof Error) {
    console.error({ e: new_profile })
  }
  else { 
    window.location.reload()
  }
}

function peekSeed() {
  const pass = document.getElementById("peek_seed_password_input").value;
  document.getElementById("peek_seed_password_input").value = "";
  const mnemonic = store.getMnemonic(pass);
  return mnemonic;
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

      document.getElementById("exit").addEventListener("click", (event) => {
        event.preventDefault();
        exit();
      });

      const my_identity = store.getIdentities().identities.filter(identity => {
        if (identity.xpub === store.getMyKeyChain().identity.xpub) {
          return identity;
        }
      });

      document.getElementById("profile_username").textContent = `@${my_identity[0].username}`;

      const init_profile = await initProfileState();
      if (init_profile instanceof Error) {
        console.error({ init_profile });
        alert("Error initializing profile state")
      }
      // store.setMyProfile(init_profile['profile']);
      // store.setMyKeys(init_profile['keys']);

      // const contact_info = (store.getParentKeys() && init_profile['profile']['cipher_info']) ? 
      //   createContactInfo(init_profile['profile']['cipher_info'], init_profile['profile']['derivation_scheme'], store.getParentKeys()['profile_parent']['xprv']) :
      //   (init_profile['profile']['cipher_info']) ? 
      //     init_profile['profile']['cipher_info'] : 
      //     "No contact info added.";

      // displayProfile(init_profile['profile'], contact_info);

      // if (contact_info === "No contact info added.") {
      //   alert("Add come cypher contact info!")
      //   document.getElementById("edit_button").click();
      // }


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

      document.getElementById("peek_seed_button").addEventListener("click", async (event) => {
        event.preventDefault();
        alert("Peeking into seed.");
      });

      document.getElementById("peek_seed_execute").addEventListener("click", async (event) => {
        event.preventDefault();
        alert("Peeking into seed w/peek_seed_password_input");
        alert(peekSeed());
      });
      /**
       * MODAL EXECUTE BUTTON
       */

      document.getElementById("profile_delete_button").addEventListener("click", async (event) => {
        event.preventDefault();
        if (confirm(`Deleting your identity is irreversible!\nYou will lose all data associated with this identity.\nAre you sure?`)) {
          const status = await deleteMyIdentity(store.getMyKeyChain().identity);
          if(status instanceof Error)
          console.log({status});
          else
          window.location.href = "/";
        }
        else {
          return;
        }
      });


      document.getElementById("profile_page_spinner").classList.add("hidden");
      document.getElementById("profile_page").classList.remove("hidden");


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
  best
  mutual junk opera clever hurt crane garbage airport tennis beyond search expose
*/

