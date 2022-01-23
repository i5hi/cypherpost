const crypto = require("crypto");
const { loadInitialState } = require('./init');
const store = require("./store");
const bitcoin = require("./bitcoin");
const {
  registerIdentity,
  getAllIdentities,
} = require("./api");

const util = require("./util");

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
  const response = await registerIdentity(keys.identity, username.toLowerCase());
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
    const keys = await initKeyChain(mnemonic);
    if (keys instanceof Error) return keys;
    const identities = await downloadAllIdentities(keys.identity);
    if (identities instanceof Error) {
      alert("Error getting identities!")
      return false;
    };
    const identity_matches = store
      .getIdentities()
      .filter(identity => identity.pubkey === keys.identity['pubkey']);

    if (identity_matches.length === 1)
      return store.setMnemonic(mnemonic, password);
    else
      console.error({ identity_matches })
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
    const keys = await initKeyChain(mnemonic);
  }
  else {
    alert("No encrypted mnemonic found. Import mnemonic through reset.");
    return false;
  };
}

// HELPERS
async function downloadAllIdentities(identity_parent) {
  const response = await getAllIdentities(identity_parent);
  if (response instanceof Error) {
    alert(response.message);
    return false;
  }
  else {
    store.setIdentities(response);
    console.log(store.getIdentities());
    return true;
  }
}
async function initKeyChain(mnemonic) {
  const keys = await util.createRootKeyChain(mnemonic);
  if (keys instanceof Error)
    alert("Could not initialize Key Chain! Re-enter mnemonic.")
  else
    store.setMyKeyChain(keys);
  return keys;
}
async function confirmAndStoreMnemonic() {
  const mnemonic = document.getElementById("mnemonic").textContent;
  const password = document.getElementById("mnemonic_pass").value;
  const confirm = document.getElementById("mnemonic_confirm_pass").value;
  console.log({ mnemonic, password, confirm });
  document.getElementById("mnemonic_pass").value = "";
  document.getElementById("mnemonic_confirm_pass").value = "";
  document.getElementById("mnemonic").textContent = "";
  if (password === confirm) {
    const keys = await initKeyChain(mnemonic);
    store.setMnemonic(mnemonic, password);
    return keys;
  } else {
    alert("Passwords do not match!");
    return false;
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
      const status = store.getMnemonic();
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
        const keys = await confirmAndStoreMnemonic();
        if (!keys) {
          return false;
        }
        else {
          const status = await downloadAllIdentities(keys.identity);
          if (status instanceof Error) {
            alert("Error getting identities!")
            return false;
          };
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
        if (status) {
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