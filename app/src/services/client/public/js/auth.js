const INIT_TRADE_DS = "m/3h/0h/0h";
const {
  generateAccessKey,
  addSpaces,
  removeSpaces,
} = require("./keys");
const {
  registerIdentity,
  getServerIdentity
} = require("./api");
const store = require("./store");
const util = require("./util");
const comps = require("./composites");
const crypto = require("crypto");

function displayAccessCode(code) {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("seedgen").classList.remove("hidden");
  document.getElementById('mnemonic_l1').textContent = addSpaces(code.substring(0,16));
  document.getElementById('mnemonic_l2').textContent = addSpaces(code.substring(16,32));

  return true;
}
function displayRegistration() {
  document.getElementById("seedgen").classList.add("hidden");
  document.getElementById("registration").classList.remove("hidden");
  return true;
}
function displayInvitation(){
  document.getElementById("invite_code").classList.remove("hidden");
  return true;
}

// Final Action Button Handlers
async function completeRegistration() {
  const username = document.getElementById("register_username").value.toLowerCase();
  const username_availability = store.getIdentities().filter((identity) => {
    if (identity.username === username) {
      alert("Username already exists!");
      return username;
    }
  });
  if (username_availability.length > 0) return false;
  const keys = store.getMyKeyChain();
  const server_identity = store.getServerIdentity();
  const invite_code = (server_identity.type==="priv")?document.getElementById('invite_code').value:null;
  console.log({invite_code})
  const response = await registerIdentity(keys.identity, username.toLowerCase(),invite_code);
  if (response instanceof Error) {
    console.error(response.message);
    return false;
  }
  else {
    alert("SUCCESS! You are now registered!");
    return true;
  }
}
async function completeReset() {
  const access_key = document.getElementById("reset_seed").value;
  const passphrase = document.getElementById("reset_passphrase").value;

  const password = document.getElementById("reset_pass").value;
  const confirm = document.getElementById("reset_confirm_pass").value;

  document.getElementById("reset_seed").value = "";
  document.getElementById("reset_passphrase").value = "";
  
  document.getElementById("reset_pass").value = "";
  document.getElementById("reset_confirm_pass").value = "";

  if (password === confirm) {
    const keys = await initKeyChain(access_key, passphrase);
    if (keys instanceof Error) {
      console.error({status: keys});
      return false;
    }
    const status = await comps.downloadAllIdentities(keys.identity);
    if (status instanceof Error) {
      console.error({status});
      return false;
    };
    const identity_matches = store
      .getIdentities()
      .filter(identity => identity.pubkey === keys.identity['pubkey']);

    if (identity_matches.length === 1){
      const full = removeSpaces(access_key) + (passphrase.length>0?`-${passphrase}`:"");
      return store.setAccessCode(full, password);
    }
    else console.error({ identity_matches })
    alert("No identity matches! Redirecting to Register...");
    window.location.href = "registration"
    return false;
  } else {
    alert("Passwords do not match!");
    return false;
  }
}
async function completeLogin() {
  const password = document.getElementById("login_pass").value;
  document.getElementById("login_pass").value = "";
  const access_key = store.getAccessCode(password);
  if (access_key instanceof Error) {
    console.error({status: access_key});
    return false;
  }
  if (access_key) {
    const keys = await initKeyChain(access_key);
    if (keys instanceof Error) {
      console.error({status: keys});
      return false;
    }
    return true;
  }
  else {
    alert("No encrypted access key found. Import access key through reset.");
    return false;
  };
}

// HELPERS
async function initKeyChain(access_code, passphrase) {
  const keys = await util.createRootKeyChain(access_code,passphrase);
  
  if (keys instanceof Error)
    alert("Could not initialize Key Chain! Re-enter access_code.")
  else
    store.setMyKeyChain(keys);
  return keys;
}
async function confirmAndStoreAccessCode() {
  const access_key = document.getElementById("mnemonic_l1").textContent + document.getElementById("mnemonic_l2").textContent;
  const key_nonce = document.getElementById("mnemonic_nonce").value || "";
  const key_nonce_confirm = document.getElementById("mnemonic_nonce_confirm").value || "";
  const password = document.getElementById("mnemonic_pass").value;
  const confirm = document.getElementById("mnemonic_confirm_pass").value;
  document.getElementById("mnemonic_pass").value = "";
  document.getElementById("mnemonic_confirm_pass").value = "";
  if (password === confirm) {
    if(key_nonce!==key_nonce_confirm){
      alert("Passphrases do not match!")
      // window.location.href = "registration";
      return false;
    }
    const keys = await initKeyChain(access_key,key_nonce);
    const full = removeSpaces(access_key) + (key_nonce.length>0?`-${key_nonce}`:"");
    store.setAccessCode(full, password);
    document.getElementById("mnemonic_l1").textContent = "";
    document.getElementById("mnemonic_l2").textContent = "";
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
      // this has to go outside
      const status = store.checkMnemonic();
      if (!status) {
        alert("COULD NOT FIND LOCALLY ENCRYPTED MNEMONIC.\nREDIRECTING TO RESET PAGE.")
        window.location.href = "reset";
      }

      document.getElementById("login_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await completeLogin();
        if (status) {
          window.location.href = "notifications"
        }
        else alert("Login failed!");
      });
      break;
    case "registration":
      document.getElementById("show_mnemonic_button").addEventListener("click", async (event) => {
        event.preventDefault();
        displayAccessCode(generateAccessKey(crypto.randomBytes(512)));
      });
      
      document.getElementById("mnemonic_confirm_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const keys = await confirmAndStoreAccessCode();
        if (!keys) {
          return false;
        }
        else {
          const server = await getServerIdentity(keys.identity);
          console.log(server)
          store.setServerIdentity(server);
          console.log(store.getServerIdentity());

          const status = await comps.downloadAllIdentities(keys.identity);
          if (status instanceof Error) {
            alert("Error getting identities!")
            return false;
          };
          displayRegistration();
          if (server.type==="priv") displayInvitation();

        }
      });

      document.getElementById("register_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await completeRegistration();
        if (status) {
          const preference_update = await comps.createCypherPreferencePost([],INIT_TRADE_DS);
          if(preference_update instanceof Error) return preference_update;
          window.location.href = "notifications"
        }
        else alert("Registration failed!");

      });
      break;
    case "reset":
      document.getElementById("reset_button").addEventListener("click", async (event) => {
        event.preventDefault();
        const status = await completeReset();
        if (status) {
          window.location.href = "notifications"
        }
        else alert("Reset failed!");
      });
      break;
    default:
      break;
  }
}

window.onload = loadAuthEvents();

/**
 * test user
 * ishi9
 * hawk injury roast shy market vendor alone combine wasp pledge gadget appear
 * test
 */