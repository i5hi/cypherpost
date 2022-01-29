const crypto = require("crypto");
const store = require("./store");
const comps = require("./composites");
const util = require("./util");
const api = require("./api");



const INIT_DERIVATION_PATH = "m/1h/0h/0h";


// DISPLAY
function displayProfile() {


  document.getElementById("profile_username").textContent = store.getMyUsername();
  document.getElementById("profile_pubkey").textContent = store.getMyKeyChain().identity.pubkey;
 
  const my_badges = comps.getBadgesByPubkey(store.getMyKeyChain().identity.pubkey);

  const my_given_pubkeys = my_badges.given.map((badge)=>badge.reciever);
  const my_given_identities = my_given_pubkeys.map((pubkey)=>store.getIdentities().find(id=>id.pubkey===pubkey));
  const my_recieved_pubkeys = my_badges.recieved.map((badge)=>badge.giver);
  const my_recieved_identities = my_recieved_pubkeys.map((pubkey)=>store.getIdentities().find(id=>id.pubkey===pubkey));
  
  console.log({my_recieved_identities,my_given_pubkeys})
  // document.getElementById("profile_badges_given").textContent = my_given_pubkeys.length;
  
  const hover_given = my_given_pubkeys.length===0
    ?"None"
    :`${my_given_identities.map((id)=>id.username).toString()}`;
  document.getElementById("profile_list_of_trusting").innerHTML = `Trusting: <span class="contact_info">${hover_given}</span>`


  // document.getElementById("profile_badges_recieved").textContent = selected_id_badges.recieved.length;

  const hover_recieved = my_recieved_pubkeys.length===0
    ?"None"
    :`${my_recieved_identities.map((id)=>id.username).toString()}`;

  document.getElementById("profile_list_of_trusted_by").innerHTML = `Trusted By: <span class="contact_info">${hover_recieved}</span>`;

  const trust_intersection_pubkeys = my_given_pubkeys.filter((pubkey)=>my_recieved_pubkeys.includes(pubkey));

  console.log({trust_intersection_pubkeys});
  const trust_intersection_ids = my_recieved_identities.filter((trusted_by)=>
    trust_intersection_pubkeys.includes(trusted_by.pubkey));

  console.log({trust_intersection_ids});

  const populate_trust_intersection = trust_intersection_ids.length === 0
  ? "None"
  :`${trust_intersection_ids.map((id)=>id.username).toString()}`;

  document.getElementById("profile_trust_intersection").innerHTML = `Trust Intersection: <span class="contact_info">${populate_trust_intersection}</span>`;

  const mute_list = store.getMyPreferences()['plain_json']['mute_list'];
  document.getElementById("profile_mute_list").innerHTML = "";

  if(!mute_list || mute_list.length===0){
    document.getElementById("profile_mute_list").innerHTML = `<div id="muted_none" class="col-4 outline centerme liquid-color">No users muted.</div>`;
    return;
  }

  else
  mute_list.map((muted)=>{
    const muted_id = store.getIdentities().find((id)=>id.pubkey===muted);
    document.getElementById("profile_mute_list").innerHTML += `<div id="muted_${muted}" class="col-4 outline centerme warning-color">${muted_id.username}</div>`;
    document.getElementById(`muted_${muted}`).addEventListener("click", async (event) => {
      event.preventDefault();
      const confirmation = confirm(`Unmute ${muted_id.username}?`);
      if (!confirmation) return false;

      const new_mute_list = mute_list.filter((pubkey)=>pubkey!==muted);
      const status = await comps.createCypherPreferencePost(new_mute_list,store.getMyPreferences().plain_json.last_trade_derivation_scheme);
      if(status instanceof Error) console.error({status});

      document.location.reload();
    });
  })

  return;
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
  displayProfile();
  return true;
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
    case "preferences":

      document.getElementById("exit").addEventListener("click", (event) => {
        event.preventDefault();
        util.exit();
      });

      const reload = await comps.downloadAllMyPosts(store.getMyKeyChain().identity);
      if(reload instanceof Error) console.error({reload});

      const init_profile = await initProfileState();
      if (init_profile instanceof Error) {
        console.error({ init_profile });
        alert("Error initializing profile state")
      }

      /***
       * 
       * 
       * BUTTONS 
       * 
       * 
       * 
       */

      document.getElementById("peek_seed_button").addEventListener("click", async (event) => {
        event.preventDefault();
        alert("Peeking into seed.");
      });

      document.getElementById("peek_seed_execute").addEventListener("click", async (event) => {
        event.preventDefault();
        alert(peekSeed());
        document.getElementById("close_peek_seed_modal").click();
      });
      /**
       * MODAL EXECUTE BUTTON
       */

      document.getElementById("profile_delete_button").addEventListener("click", async (event) => {
        event.preventDefault();
        if (confirm(`Deleting your identity is irreversible!\nYou will lose all data associated with this identity.\nAre you sure?`)) {
          const status = await api.deleteMyIdentity(store.getMyKeyChain().identity);
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

