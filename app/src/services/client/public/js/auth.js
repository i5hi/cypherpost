/**
 * 
 * localStorage:
 *  ${username}_parent_128
 * 
 * sessionStorage:
 *  existing_usernames
 *  token
 *  username
 *  inivited_by
 *  invite_code
 *  seed256
 *  recipient_parent
 *  profile_parent
 *  posts_parent
 */
const crypto = require("crypto");

const { loadInitialState } = require('./init');
const store = require("./store");
const bitcoin = require("./bitcoin");
const {
  apiLogin,
  apiRegister,
  apiReset,
  apiGetUsernames
} = require("./api");

const web_url = (document.domain === 'localhost') ? "http://localhost" : `https://cypherpost.io`;

// DISPLAY
function displayInvitation(valid, invited_by) {
  if (valid) {
    document.getElementById('invitation').textContent = `You have been invited by ${invited_by}.`;
  }
  else {
    document.getElementById('invitation').textContent = `Your invitation is invalid or expired.`;
    document.getElementById("seed_note_0").classList.add("hidden");
    document.getElementById("seed_note_1").classList.add("hidden");
  }
}
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


// STORAGE
function storeInvitation() {
  const params = new URLSearchParams(window.location.search)
  if (params.has('invited_by') && params.has('invite_code')) {
    if (!store.setInvitation(params.get('invited_by'), params.get('invite_code'))) return false;
    else return true;
  }
  else {
    return false;
  };
}

async function tempParentAndSeed256Storage(seed) {

  const root = await bitcoin.seed_root(seed);
  const parent_128 = bitcoin.derive_parent_128(root);
  if (!store.setParentKeys(parent_128['xprv'])) {
    console.error("Error setting parent keys.")
    return false;
  }

  // temp encryption
  store.setParent128(parent_128, "temp", "temp");

  const seed256 = crypto.createHash('sha256')
    .update(seed)
    .digest('hex');

  return store.setSeed256(seed256);

}

function updateParentStorage(username, password) {

  const parent_128_plain = store.getParent128("temp", "temp");
  // update encryption
  return store.setParent128(parent_128_plain, username, password);
}

// GLOBAL
async function exit() {
  sessionStorage.clear();
  window.location.href = web_url;
}

async function decodeJWTUser(token){
  const split_token = token.split(".");
  const header = JSON.parse(Buffer.from(split_token[0],"base64"));
  const payload = JSON.parse(Buffer.from(split_token[1],"base64"));
  // console.log(header, payload['payload']);
  return payload['payload']['user'];
}
// COMPOSITES

async function registerComposite() {
  const username = document.getElementById("register_username").value.toLowerCase();
  const password = document.getElementById("register_pass").value;
  const confirm = document.getElementById("register_confirm_pass").value;
  document.getElementById("register_pass").value = "";
  document.getElementById("register_confirm_pass").value = "";


  const token = await apiRegister(username, password, confirm);
  if (token instanceof Error) {
    alert(e.message)
    return false;
  }
  else {
    updateParentStorage(username, password);
    const status = await loadInitialState(token, username, password);
    if (!status) alert("Error in loading initial state. App might be buggy!\n Check logs and report to admin.");
    window.location.href = "profile";
  }
  return;
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
// EVENT LISTENERS
async function loadAuthEvents() {
  const path = window.location.href.split("/");
  let endpoint = path[path.length - 1];
  if (endpoint.startsWith('invitation')) endpoint = "invitation";
  if (endpoint === '') endpoint = "home";
  else endpoint = endpoint.split(".")[0];

  switch (endpoint) {
    case "home":
      document.getElementById("home_login").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "login";
      });
      document.getElementById("home_reset").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "reset";
      });
      document.getElementById("home_signup").addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = "invitation?invited_by=ravi&invite_code=foo";
      });
      break;

    case "login":
      document.getElementById("login_button").addEventListener("click", async (event) => {
        event.preventDefault();
        loginComposite();
      });

      break;

    case "invitation":

      document.getElementById("show_mnemonic_button").addEventListener("click", async (event) => {
        event.preventDefault();
        displayMnemonic(bitcoin.generate_mnemonic());
      });
      document.getElementById("setup_access_button").addEventListener("click", async (event) => {
        event.preventDefault();
        await tempParentAndSeed256Storage(document.getElementById("mnemonic").textContent);
        document.getElementById("mnemonic").textContent = "";
        displayRegistration();
      });
      document.getElementById("register_button").addEventListener("click", async (event) => {
        event.preventDefault();
        registerComposite()
      });

      const params = new URLSearchParams(window.location.search)
      const invited_by = params.get('invited_by');
      const invite_code = params.get('invite_code');

      // getUsernames doubles up as a check for a valid invite code
      const usernames = await apiGetUsernames(false, invite_code, invited_by);
      if (usernames && usernames.includes(invited_by)) {
        storeInvitation();
        // displayInvitation(true, invited_by);
        store.setExistingUsernames(usernames);
      }
      else displayInvitation(false);

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