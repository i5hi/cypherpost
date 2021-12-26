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
    // IDENTITIES
    try {
      const ids = await apiIdentityAll(keys.identity);
      store.setIdentities(ids);
    }
    catch (e) {
      console.error("BROKE AT loadInitialState - getIdentities");
      console.error({ e });
      return false;
    }

  // MY PROFILE
  try {

    const my_profile = await apiProfileSelf(keys.identity);
    if (my_profile instanceof Error) {
      console.error("ERROR AT loadInitialState - getProfile");
      console.error({ e });
      return false;
    }
    else {
      store.setMyProfile(my_profile);
    }
  }
  catch (e) {
    console.error("BROKE AT loadInitialState - getProfile");
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

async function checkInitialState(){
  const keys = store.getMyKeyChain();
  const ids =  store.getIdentities();

  const my_profile = store.getMyProfile();
  const my_posts = store.getMyPosts();
  const others_posts = store.getOthersPosts();
  
  const has_profile = (my_profile.profile.cypher_json);
  const has_profile_keys = (my_profile.keys.length > 0);
  const has_posts = (my_posts.posts.length > 0);
  const has_others_posts = (others_posts.posts.length > 0);
  // const has others_profile = (others_profile.profiles.length);
  if(!has_posts){
    alert("You have not created any posts.");
  }
  if(!has_others_posts){
    alert("You cannot view anyones posts. Build the trust of other clients to gain visibility of their posts.");
  }
  if (!has_profile){
    alert("You have not initialized a profile.");
  }
  if(!has_profile_keys){
    alert("You cannot view anyones profile. Build the trust of other clients to gain visibility of their posts."); 
  }

}

module.exports = {
  loadInitialState,
  checkInitialState
}