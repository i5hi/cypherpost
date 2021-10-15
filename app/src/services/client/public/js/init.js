// init function that runs on successful login/register/reset

// this function will not affect the display of any pages
// it will only affect the storage state of the application
// it will:
/**
 * get a users profile
 * get list of existing usernames for network search
 * get a list of all posts visibile to the user based on profile.keys.posts_keys
 * 
 */
const store = require("./store");
const bitcoin = require("./bitcoin");
const {
  apiGetUsernames,
  apiProfileGenesis,
  apiGetMyProfile,
  apiGetMyPosts,
  apiGetOthersPosts
} = require("./api");

async function loadInitialState(token, username, password) {
  store.setToken(token);
  store.setUsername(username);
  store.setTriplePass256(password);
  // MY PROFILE
  try {
    const my_profile_and_keys = await apiGetMyProfile(token);
    if (my_profile_and_keys instanceof Error) {
      if (my_profile_and_keys.name === "404" && my_profile_and_keys.message.startsWith("No profile")) {
        // create new profile
        const my_recipient_xpub = bitcoin.derive_child_indexes(store.getParentKeys()['recipient_parent']["xprv"], 0, 0).xpub;
        const new_profile_and_keys = await apiProfileGenesis(my_recipient_xpub, token);
        if (new_profile_and_keys instanceof Error) {
          console.error("ERROR AT loadInitialState - profile.apiProfileGenesis");
          console.error({ e });
          return false;
        }
        console.log({ profile: new_profile_and_keys.profile, keys: new_profile_and_keys.keys });
        store.setMyProfile(new_profile_and_keys.profile);
        store.setMyKeys(new_profile_and_keys.keys)
        store.setUsername(new_profile_and_keys.profile.username);
      }
      else {
        console.error("ERROR AT loadInitialState - getProfile");
        console.error({ e });
        return false;
      }
    }
    else {
      store.setMyProfile(my_profile_and_keys['profile']);
      store.setMyKeys(my_profile_and_keys['keys']);
      store.setUsername(my_profile_and_keys['profile']['username']);

    }
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getProfile");
    console.error({ e });
    return false;
  }

  // USER LIST
  try {
    const usernames = await apiGetUsernames(true, token);
    store.setExistingUsernames(usernames);
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getUsernames");
    console.error({ e });
    return false;
  }

  // OTHERS POSTS

  try {
    const others_posts = await apiGetOthersPosts(token);
    store.setOthersPosts(others_posts);
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getOthersPosts");
    console.error({ e });
    return false;
  }

  // MY POSTS

  try {
    const my_posts = await apiGetMyPosts(token);
    store.setMyPosts(my_posts);

  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getMyPosts");
    console.error({ e });
    return false;
  }

  const parent_128 = store.getParent128(store.getUsername(), password);
  if (parent_128) {
    store.setParentKeys(parent_128['xprv']);
  }
  else {
    alert("Need to reimport seed");
    return "import_seed"
  }
  return true;

}

module.exports = {
  loadInitialState
}