const crypto = require("crypto");
const { loadInitialState } = require('./init');
const store = require("./store");
const bitcoin = require("./bitcoin");
const {
  apiIdentityRegistration,
  apiIdentityAll,
} = require("./api");
const web_url = (document['domain'] === 'localhost') ? "http://localhost" : `https://cypherpost.io`;

function  displayMnemonic(mnemonic) {
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
  if (password === confirm){
    const seed_root = await bitcoin.seed_root(mnemonic);
    const cypherpost_parent = bitcoin.derive_parent_128(seed_root);
    const keys = {
      identity: bitcoin.derive_identity_parent(cypherpost_parent['xprv']),
      profile: bitcoin.derive_hardened_str(cypherpost_parent['xprv'],"m/1'/0'/0'"),
      preference: bitcoin.derive_preference_parent(cypherpost_parent['xprv']),
      post: bitcoin.derive_hardened_str(cypherpost_parent['xprv'],"m/3'/0'/0'"),
    };
    store.setMyKeys(keys);
    const identities = await getAllIdentities(keys.identity);
    if(identities instanceof Error){
      alert("Error getting identities!")
    };
    if(identities)
    return store.setMnemonic(mnemonic, password);
    else return identities;
  } else {
    alert("Passwords do not match!");
    return false;
  }
}

// GLOBAL
async function exit() {
  sessionStorage.clear();
  window.location.href = web_url;
}
// COMPOSITES
async function registerComposite() {
  const username = document.getElementById("register_username").value.toLowerCase();
  const result = store.getIdentities().filter((identity)=>{
    if(identity.username === username){
      alert("Username already exists!");
      return username;
    }
  });
  if(result.length>0) return false;
  const keys = store.getMyKeys();
  const response = await apiIdentityRegistration(keys.identity,username);
  if (response instanceof Error) {
    alert(response.message);
    return false;
  }
  else {
    alert("SAUCE! You are now registered!");
    const status = await loadInitialState(token, username, password);
    if (!status) alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
    window.location.href = "profile";
  }
  return true;
}
async function resetComposite() {
  const seed = document.getElementById("reset_seed").value;
  const password = document.getElementById("reset_pass").value;
  const confirm = document.getElementById("reset_confirm_pass").value;
  document.getElementById("reset_seed").value = "";
  document.getElementById("reset_pass").value = "";
  document.getElementById("reset_confirm_pass").value = "";
  const token = await apiReset(seed, password, confirm);
  if (token instanceof Error) {
    alert(token.message)
    return false;
  }
  const username = decodeJWTUser(token);
  updateParentStorage(username, password);
  const status = await loadInitialState(token, username, password);
  if (!status) alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
  else window.location.href = "posts";

}
async function loginComposite() {
  const username = document.getElementById("login_username").value.toLowerCase();
  const password = document.getElementById("login_pass").value;
  document.getElementById("login_pass").value = "";
  const token = await apiLogin(username, password);
  if (token instanceof Error) {
    alert(token.message)
    return false;
  }
  const status = await loadInitialState(token, username, password);
  if (!status) alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
  else if (status === "import_seed") window.location.href = "profile";
  else window.location.href = "posts";
}
async function getAllIdentities(identity_parent){
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
      getAllIdentities();
      break;
    case "login":
      document.getElementById("login_button").addEventListener("click", async (event) => {
        event.preventDefault();
        loginComposite();
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
        registerComposite()
      });
      break;
    case "reset":
      document.getElementById("reset_button").addEventListener("click", async (event) => {
        event.preventDefault();
        resetComposite()
      });
      break;
    default:
      break;
  }
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