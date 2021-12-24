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
  apiIdentityAll,
  apiPostsOthers,
  apiPostsSelf,
  apiProfileOthers,
  apiProfileSelf
} = require("./api");

async function loadInitialState() {
  const keys = store.getMyKeyChain();
  // MY PROFILE
  try {

    const my_profile_and_keys = await apiProfileSelf(keys.identity);
    if (my_profile_and_keys instanceof Error) {
      console.error("ERROR AT loadInitialState - getProfile");
      console.error({ e });
      return false;
    }
    else {
      store.setMyProfile(my_profile_and_keys['profile']);
      store.setMyProfileKeys(my_profile_and_keys['keys']);
    }
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getProfile");
    console.error({ e });
    return false;
  }

  // USER LIST
  try {
    const ids = await apiIdentityAll(keys.identity);
    store.setIdentities(ids);
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getIdentities");
    console.error({ e });
    return false;
  }

  // OTHERS POSTS

  try {
    const others_posts = await apiPostsOthers(keys.identity);
    store.setOthersPosts(others_posts);
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getOthersPosts");
    console.error({ e });
    return false;
  }

  // MY POSTS
  try {
    const my_posts = await apiPostsSelf(keys.identity);
    store.setMyPosts(my_posts);
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getMyPosts");
    console.error({ e });
    return false;
  }

  return true;

}

module.exports = {
  loadInitialState
}