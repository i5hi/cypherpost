const TRUST = "TRUST";
const SCAMMER = "SCAMMER";

const store = require("./store");
const comps = require("./composites");
const util = require("./util");

// console.log({ existing_usernames });
// console.log({ trusting_usernames });
// console.log({ search_usernames });
async function getUpdatedIdsAndBadges() {
  const keys = store.getMyKeyChain();
  const status = await comps.downloadAllIdentitiesAndBadges(keys.identity);
  const merged = util.mergeIdentitiesWithBadges(store.getIdentities(), store.getAllBadges());
  return merged;
}

async function displayIdentity(identity) {
  // SCROLL TO TOP
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  document.getElementById("network_profile_username").textContent = identity.username;
  document.getElementById("network_profile_pubkey").textContent = identity.pubkey;

  const my_badges = comps.getBadgesByPubkey(store.getMyKeyChain().identity.pubkey);

  const my_given_pubkeys = my_badges.given.map((badge)=>badge.reciever);
  const my_recieved_pubkeys = my_badges.recieved.map((badge)=>badge.giver);

  const selected_id_badges = comps.getBadgesByPubkey(identity.pubkey);
  console.log({badges: selected_id_badges});

  const given_pubkeys = selected_id_badges.given.map((badge)=>badge.reciever);// ensure  only trusted badge
  const given_identities = store.getIdentities(identity).filter(id=>given_pubkeys.includes(id.pubkey));

  const recieved_pubkeys = selected_id_badges.recieved.map((badge)=>badge.giver);// ensure  only trusted badge
  const recieved_identities = store.getIdentities(identity).filter(id=>recieved_pubkeys.includes(id.pubkey));
  
  console.log({given_identities,recieved_identities})
  document.getElementById("network_badges_given").textContent = selected_id_badges.given.length;
  
  const hover_given = selected_id_badges.given.length===0
    ?"None"
    :`${given_identities.map((id)=>id.username).toString()}`;
  document.getElementById("list_of_trusting").innerHTML = `Trusting: <span class="contact_info">${hover_given}</span>`


  document.getElementById("network_badges_recieved").textContent = selected_id_badges.recieved.length;

  const hover_recieved = selected_id_badges.recieved.length===0
    ?"None"
    :`${recieved_identities.map((id)=>id.username).toString()}`;

  document.getElementById("list_of_trusted_by").innerHTML = `Trusted By: <span class="contact_info">${hover_recieved}</span>`;

  const trust_intersection = recieved_identities.filter((trusted_by)=>{
    my_given_pubkeys.includes(trusted_by.pubkey);
  });

  const hover_trust_intersect = trust_intersection.length===0?"None.":`${trust_intersection.map((id)=>id.username).toString()}`;

  document.getElementById("trust_intersection").innerHTML = `Trust Intersection: <span class="contact_info">${hover_trust_intersect}</span>`;

}

function displaySearchIdBs(idbs) {
  document.getElementById('search_userlist').innerHTML = "";
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
    document.getElementById('search_userlist').innerHTML += `<div id="search_item_${id_and_badges.pubkey}" class="row"><div class="col-6 outline leftme">${id_and_badges.username}</div><div id="trust_${id_and_badges.pubkey}" class="col-3 outline"><i class="fas fa-shield-alt n_badges" aria-hidden="true"></i>${trusted_badges.length}</div><div class="col-3 outline"><i class="fas fa-ban n_badges" aria-hidden="true"></i>${scammer_badges.length}</div></div><hr>`
  });
  return;
}


async function loadNetworkEvents() {


  const all_idbs = await getUpdatedIdsAndBadges();
  console.log({ merged_idbs: all_idbs });
  if (all_idbs instanceof Error) {
    alert("Error initializing Network.");
  }
  const keys = store.getMyKeyChain();
  let selected_identity = store.getSelectedIdentity();
  if (!selected_identity)
    selected_identity = store
      .getIdentities()[0];
    
  store.updateSelectedIdentity(selected_identity);

  displayIdentity(selected_identity);
  displaySearchIdBs(all_idbs);

  store.getIdentities().map((identity) => {
    document.getElementById(`search_item_${identity.pubkey}`).addEventListener("click", (event) => {
      event.preventDefault();
      store.updateSelectedIdentity(identity);
      displayIdentity(identity);
    });
  });


  document.getElementById("network_page_spinner").classList.add("hidden");
  document.getElementById("network_page").classList.remove("hidden");

  document.getElementById(`issue_trust`).addEventListener("click", async (event) => {
    event.preventDefault();
    //if already trusting then revoke
    const selected_identity = store.getSelectedIdentity();
    let is_trusted = false;
    comps.getBadgesByPubkey(selected_identity.pubkey).recieved.map((badge) => {
      if (badge.type === TRUST && badge.giver === keys.identity.pubkey) {
        is_trusted = true;
      }
    });
    console.log({ is_trusted });

    if (!is_trusted) {
      const confirmation = confirm(`Trusting ${selected_identity.username}`);
      if (!confirmation) return false;

      const trust_result = await comps.trustPubkey(store.getMyKeyChain().identity, selected_identity.pubkey);
      if (trust_result instanceof Error) {
        console.error({ trust_result })
      }
      document.location.reload();
    }
    else {
      const confirmation = confirm(`Revoking Trust in ${selected_identity.username}`);
      if (!confirmation) return false;

      const revoke_result = await comps.revokeTrustPubkey(store.getMyKeyChain().identity, selected_identity.pubkey);
      if (revoke_result instanceof Error) {
        console.error({ revoke_result })
      }
      document.location.reload();
    }
    return;
  });
  document.getElementById(`issue_scammer`).addEventListener("click", (event) => {
    event.preventDefault();
    alert("Not supported Yet.")
  });
  document.getElementById(`network_search_button`).addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("network_search_username").value;
    if (username === "") {
      displaySearchIdBs(all_idbs);
      store.getIdentities().map((identity) => {
        document.getElementById(`search_item_${identity.pubkey}`).addEventListener("click", (event) => {
          event.preventDefault();
          store.updateSelectedIdentity(identity);
          displayIdentity(identity);
        });
      });
      return;
    }
    else {
      const remnants = all_idbs.filter(identity => identity.username.startsWith(username));
        if(remnants.length===0) {
          return;
        };

      displaySearchIdBs(remnants);
      remnants.map((identity) => {
        document.getElementById(`search_item_${identity.pubkey}`).addEventListener("click", (event) => {
          event.preventDefault();
          store.updateSelectedIdentity(identity);
          displayIdentity(identity);
        });
      });
    }

  });
  document.getElementById("exit").addEventListener("click", (event) => {
    event.preventDefault();
    util.exit();
  });

}

window.onload = loadNetworkEvents();




// harbor where mask emotion bubble eye measure canoe detail swing inmate observe
// bala-test


// solve same across violin fox tribe beef ridge kid humor breeze before
// ishi

// spike afford eagle pull analyst dust version surface metal page brave vacuum
// dust

