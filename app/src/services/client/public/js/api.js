/**
 * sushi
 * arrange super clinic creek twenty joke gossip order type century photo ahead
 */
const crypto = require("crypto");
const store = require('./store');
const { request } = require('./request');

const api_url = (document.domain === 'localhost') ? "http://localhost/api/v1" : `https://cypherpost.io/api/v1`;
const web_url = (document.domain === 'localhost') ? "http://localhost" : `https://cypherpost.io`;

async function apiRegister(username, password, confirm) {

  if (store.getExistingUsernames().includes(username)) {
    alert("Username taken!");
    return false;
  }
  if (password !== confirm) {
    alert("Passwords do not match!");
    return false;
  }

  const username_regex = /^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/;
  if (!username_regex.test(username)) {
    alert("Invalid Username. Must be alphanumeric with only _. and maximum 15 characters.");
    return false;
  }

  const pass256 = crypto.createHash('sha256')
    .update(password)
    .digest('hex');

  const seed256 = store.getSeed256();
  const invitation = store.getInvitation();

  const end_point = "/auth/register";
  const url = api_url + end_point;
  const method = "POST";
  const body = {
    username,
    pass256,
    seed256,
    invited_by: invitation.invited_by,
    invite_code: invitation.invite_code,
  };

  const response = await request(method, url, body);
  if (response instanceof Error)  return response;
  
  return response.token;

}

async function apiLogin(username, password) {

  // alert(({parent_128_plain:JSON.parse(parent_128_plain).xpub}));
  const username_regex = /^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/;

  if (!username_regex.test(username)) {
    return "Invalid Username. Must be alphanumeric with only _.";
  }

  const pass256 = crypto.createHash('sha256')
    .update(password)
    .digest('hex');

  const end_point = "/auth/login/";
  const url = api_url + end_point;
  const method = "POST";
  const body = {
    username,
    pass256,
  }

  const response = await request(method, url, body);
  if (response instanceof Error) return response;

  return response.token;

}

async function apiReset(seed, password, confirm) {

  const seed256 = crypto.createHash('sha256')
    .update(seed)
    .digest('hex');

  if (password !== confirm) {
    alert("Passwords do not match!");
    return false;
  }

  const pass256 = crypto.createHash('sha256')
    .update(password)
    .digest('hex');


  const end_point = "/auth/reset/";
  let url = api_url + end_point;
  const method = "POST";

  const body = {
    seed256,
    pass256,
  };

  const response = await request(method, url, body);
  if (response instanceof Error) return response;
  return response.token;

}

async function apiCheckSeed256(token, seed) {

  const end_point = "/auth/check/seed256";

  const url = api_url + end_point;
  const method = "POST";

  const body = {
    seed256: crypto.createHash('sha256')
      .update(seed)
      .digest('hex')
  };

  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.status;

}
async function apiInvite(username, token) {

  const end_point = "/auth/invite/";
  const url = api_url + end_point;
  const method = "GET";


  const response = await request(method, url, {}, token);
  if (response instanceof Error) return response;

  const invite_code = response.invite_code;
  const invite_link = `${web_url}/invitation?invited_by=${username}&invite_code=${invite_code}`;
  return invite_link;

}

// if not registered use invite_code as token
async function apiGetUsernames(is_registered, token, invited_by) {
  const end_point = (is_registered) ? `/profile/usernames` : `/profile/usernames?invited_by=${invited_by}&invite_code=${token}`;
  token = (is_registered) ? token : null;
  const url = api_url + end_point;
  const method = "GET";
  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.usernames;

}
async function apiGetMyProfile(token) {
  const end_point = "/profile/";
  const url = api_url + end_point;
  const method = "GET";


  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;
  }

  return response;


}
async function apiDeleteMyProfile(token) {
  const end_point = "/profile/";
  const url = api_url + end_point;
  const method = "DELETE";


  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;
  }

  alert("Profile Deleted!")
  window.location.href = web_url;
  return response;


}
async function apiGetUserProfile(token, username) {
  const end_point = `/profile?username=${username}`;
  const method = "GET";
  const url = api_url + end_point;

  console.log(url);
  const response = await request(method, url, {}, token);
  // console.log({response})
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;
  }

  return response;


}
async function apiGetManyProfiles(token, usernames) {
  const end_point = `/profile/find_many`;
  const url = api_url + end_point;
  const method = "POST";
  const body = {
    usernames
  };

  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;
  }
  return response;
}
async function apiEditProfile(nickname, cipher_info, status, token) {

  const end_point = "/profile/";
  const method = "POST";

  const url = api_url + end_point;

  const body = {
    nickname,
    cipher_info,
    status,
  }

  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response;

}
async function apiProfileGenesis(recipient_xpub, token) {

  const method = "POST";
  const end_point = "/profile/genesis";

  const url = api_url + end_point;

  const body = {
    recipient_xpub,
    derivation_scheme: "m/0'/0'"
  }

  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response;
}

async function apiMuteUser(token,trusted_by,toggle_mute) {

  const method = "POST";
  const end_point = "/profile/mute";

  const url = api_url + end_point;

  const body = {
    trusted_by,
    toggle_mute
  }

  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.profile;
}


async function apiCreatePost(token, expiry, decryption_keys, derivation_scheme, cipher_json) {
  //   const message = document.getElementById("post_message_input").value;
  //   const expiry_string = document.getElementById("post_expiry_input").value;

  const end_point = "/posts";


  const url = api_url + end_point;
  const method = "PUT";

  const body = {
    expiry,
    decryption_keys,
    derivation_scheme,
    cipher_json,
  };


  const response = await request(method, url, body, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.post;

}
async function apiDeletePost(token, post_id) {
  //   const message = document.getElementById("post_message_input").value;
  //   const expiry_string = document.getElementById("post_expiry_input").value;

  const end_point = `/posts/${post_id}`;

  const url = api_url + end_point;
  const method = "DELETE";
  
  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.status;

}
async function apiGetMyPosts(token) {
  const end_point = "/posts/self";
  const url = api_url + end_point;
  const method = "GET";

  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.posts;
}
async function apiGetOthersPosts(token) {
  const end_point = "/posts/others";
  const url = api_url + end_point;
  const method = "GET";

  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    if (response.name === "401")
      window.location.href = web_url + "/login";
    else
      return response;

  }

  return response.posts;
}

async function apiTrust(token, trusting, decryption_key, signature) {

  const end_point = "/profile/trust";

  const url = api_url + end_point;

  const method = "POST";

  const body = {
    trusting,
    decryption_key,
    signature,
  };


  const response = await request(method, url, body, token);
  if (response instanceof Error) return response;

  return response.profile;
};
async function apiRevoke(token, revoking, decryption_keys, derivation_scheme, cipher_info) {

  const end_point = "/profile/revoke";

  const url = api_url + end_point;

  const method = "POST";

  const body = {
    revoking,
    decryption_keys,
    derivation_scheme,
    cipher_info
  };

  const response = await request(method, url, body, token);
  if (response instanceof Error) return response;

  return response.profile;
};
module.exports = {
  apiRegister,
  apiLogin,
  apiReset,
  apiInvite,
  apiCheckSeed256,
  apiGetMyProfile,
  apiEditProfile,
  apiGetUsernames,
  apiGetUserProfile,
  apiGetManyProfiles,
  apiProfileGenesis,
  apiDeleteMyProfile,
  apiTrust,
  apiRevoke,
  apiMuteUser,
  apiCreatePost,
  apiDeletePost,
  apiGetMyPosts,
  apiGetOthersPosts,

}