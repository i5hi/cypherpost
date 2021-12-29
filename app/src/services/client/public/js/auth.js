const crypto = require("crypto");
const { loadInitialState } = require('./init');
const store = require("./store");
const bitcoin = require("./bitcoin");
const {
  apiIdentityRegistration,
  apiIdentityAll,
} = require("./api");
const web_url = (document['domain'] === 'localhost') ? "http://localhost" : `https://cypherpost.io`;

function displayMnemonic(mnemonic) {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("seedgen").classList.remove("hidden");
  document.getElementById('mnemonic').textContent = mnemonic;
  return true;
}
function displayRegistration() {
  document.getElementById("seedgen").classList.add("hidden");
  document.getElementById("registration").classList.remove("hidden");
  return true;
}
async function storeMnemonic() {
  const mnemonic = document.getElementById("mnemonic").textContent;
  const password = document.getElementById("mnemonic_pass").value;
  const confirm = document.getElementById("mnemonic_confirm_pass").value;
  console.log({ mnemonic, password, confirm });
  document.getElementById("mnemonic_pass").value = "";
  document.getElementById("mnemonic_confirm_pass").value = "";
  if (password === confirm) {
    const seed_root = await bitcoin.seed_root(mnemonic);
    const cypherpost_parent = bitcoin.derive_parent_128(seed_root);
    const keys = {
      identity: bitcoin.derive_identity_parent(cypherpost_parent['xprv']),
      profile: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/1'/0'/0'"),
      preference: bitcoin.derive_preference_parent(cypherpost_parent['xprv']),
      post: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/3'/0'/0'"),
    };
    store.setMyKeyChain(keys);
    const status = await downloadAllIdentities(keys.identity);
    if (status instanceof Error) {
      alert("Error getting identities!")
      return false;
    };
    if (status)
      return store.setMnemonic(mnemonic, password);
    else return status;
  } else {
    alert("Passwords do not match!");
    return false;
  }
}

// COMPOSITES
async function registerComposite() {
  const username = document.getElementById("register_username").value.toLowerCase();
  const result = store.getIdentities().filter((identity) => {
    if (identity.username === username) {
      alert("Username already exists!");
      return username;
    }
  });
  if (result.length > 0) return false;
  const keys = store.getMyKeyChain();
  const response = await apiIdentityRegistration(keys.identity, username);
  if (response instanceof Error) {
    alert(response.message);
    return false;
  }
  else {
    alert("SUCCESS! You are now registered!");
    return true;
  }
}
async function resetComposite() {
  const mnemonic = document.getElementById("reset_seed").value;
  const password = document.getElementById("reset_pass").value;
  const confirm = document.getElementById("reset_confirm_pass").value;

  document.getElementById("reset_seed").value = "";
  document.getElementById("reset_pass").value = "";
  document.getElementById("reset_confirm_pass").value = "";

  if (password === confirm) {
    const seed_root = await bitcoin.seed_root(mnemonic);
    const cypherpost_parent = bitcoin.derive_parent_128(seed_root);
    const keys = {
      identity: bitcoin.derive_identity_parent(cypherpost_parent['xprv']),
      profile: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/1'/0'/0'"),
      preference: bitcoin.derive_preference_parent(cypherpost_parent['xprv']),
      post: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/3'/0'/0'"),
    };
    store.setMyKeyChain(keys);

    const identities = await downloadAllIdentities(keys.identity);
    if (identities instanceof Error) {
      alert("Error getting identities!")      
      return false;
    };
    const identity_matches = store.getIdentities().filter(identity=>{
      if (identity.xpub === keys.identity['xpub']) {
        return identity;
      }
    });
    // if they are more than 1 something is wrong
    if (identity_matches.length === 1)
      return store.setMnemonic(mnemonic, password);
    else 
      console.error({identity_matches})
      alert("No identity matches! Redirecting to Register...");
      window.location.href = "registration"
      return false;      
  } else {
    alert("Passwords do not match!");
    return false;
  }
}

async function loginComposite() {
  const password = document.getElementById("login_pass").value;
  document.getElementById("login_pass").value = "";
  const mnemonic = store.getMnemonic(password);
  if (mnemonic instanceof Error) {
    alert("Incorrect password!");
    return false;
  }
  if (mnemonic) {
    const seed_root = await bitcoin.seed_root(mnemonic);
    const cypherpost_parent = bitcoin.derive_parent_128(seed_root);
    keys = {
      identity: bitcoin.derive_identity_parent(cypherpost_parent['xprv']),
      profile: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/1'/0'/0'"),
      preference: bitcoin.derive_preference_parent(cypherpost_parent['xprv']),
      post: bitcoin.derive_hardened_str(cypherpost_parent['xprv'], "m/3'/0'/0'"),
    };
    alert("SUCCESS! Decrypted Mnemonic!");
    return store.setMyKeyChain(keys);
  }
  else {
    alert("No encrypted mnemonic found. Import mnemonic through reset.");
    return false;
  };
}

async function downloadAllIdentities(identity_parent) {
  const response = await apiIdentityAll(identity_parent);
  if (response instanceof Error) {
    alert(response.message);
    return false;
  }
  else {
    store.setIdentities(response.identities);
    return true;
  }
}
// EVENT LISTENERS
async function loadAuthEvents() {
  const path = window.location.href.split("/");
  console.log(path);

  let endpoint = path[path.length - 1];
  if (endpoint.startsWith('registration')) endpoint = "registration";
  if (endpoint === '') endpoint = "home";
  else endpoint = endpoint.split(".")[0];
  switch (endpoint) {
    case "home":
      document.getElementById("home_login").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "login";
      });
      document.getElementById("home_register").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "registration";
      });
      document.getElementById("home_reset").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "reset";
      });
      break;
    case "login":
      const status = localStorage.getItem("my_mnemonic");
      if (!status) {
        alert("COULD NOT FIND LOCALLY ENCRYPTED MNEMONIC.\nREDIRECTING TO RESET PAGE.")
        window.location.href = "reset";
      }

      document.getElementById("login_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await loginComposite();
        if (status) {
          await loadInitialState();
          window.location.href = "notifications"
        }
        else alert("Login failed!");
      });
      break;
    case "registration":
      document.getElementById("show_mnemonic_button").addEventListener("click", async (event) => {
        event.preventDefault();
        displayMnemonic(bitcoin.generate_mnemonic());
      });
      document.getElementById("mnemonic_confirm_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await storeMnemonic();
        if (!status) {
          return;
        }
        else {
          document.getElementById("mnemonic").textContent = "";
          displayRegistration();
        }
      });
      document.getElementById("register_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await registerComposite();
        if (status) {
          await loadInitialState();
          window.location.href = "notifications"  
        }
        else alert("Registration failed!");

      });
      break;
    case "reset":
      document.getElementById("reset_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await resetComposite();
        if (status) 
        {
          await loadInitialState();
          window.location.href = "notifications"
        }
        else alert("Reset failed!");
      });
      break;
    default:
      break;
  }
}

// GLOBAL
async function exit() {
  sessionStorage.clear();
  window.location.href = web_url;
}

window.onload = loadAuthEvents();

module.exports = {
 exit
}
/**
 * test user
 * ishi9
 * hawk injury roast shy market vendor alone combine wasp pledge gadget appear
 * test
 */