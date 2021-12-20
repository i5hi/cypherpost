/**
 * sushi
 * arrange super clinic creek twenty joke gossip order type century photo ahead
 */
const crypto = require("crypto");
const store = require('./store');
const bitcoin = require("./bitcoin");
const { request } = require('./request');

const RESOURCE_PREFIX = "/api/v2";
// var document = {
//   domain: "https://cypherpost.io/api/v2"
// };
const api_url = (document.domain === 'localhost') ? "http://localhost/api/v2" : `https://cypherpost.io/api/v2`;
const web_url = (document.domain === 'localhost') ? "http://localhost" : `https://cypherpost.io`;

function createRequestSignature(method,resource,body,identity_parent,nonce){
  const message = `${method} ${RESOURCE_PREFIX}${resource} ${JSON.stringify(body)} ${nonce}`;
  const ecdsa_keys = bitcoin.extract_ecdsa_pair(identity_parent);
  console.log({message})
  return bitcoin.sign(message,ecdsa_keys.private_key);
};

function createRequestHeaders(xpub,nonce,signature){
  return {
    "x-client-xpub": xpub,
    "x-nonce": nonce,
    "x-client-signature": signature,
  };
}

async function apiIdentityRegistration(identity_parent,username){
  const nonce = Date.now();
  const resource = "/identity/registration";
  const url = api_url + resource;
  const method = "POST";
  const body = {
    username
  };

  const signature = createRequestSignature(method,resource,body,identity_parent,nonce);
  const headers = createRequestHeaders(identity_parent['xpub'],nonce,signature);

  console.log({headers,body,signature});
  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response;
}

async function apiIdentityAll(identity_parent){
  const nonce = Date.now();
  const resource = "/identity/all";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = createRequestSignature(method,resource,body,identity_parent,nonce);
  const headers = createRequestHeaders(identity_parent,nonce,signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response;

}

async function apiRegister(username, password, confirm) {

  if (store.getExistingUsernames().includes(username)) {
    alert("Username taken!");
    return new Error("Username is taken");
  }
  if (password !== confirm) {
    alert("Passwords do not match!");
    return new Error("Passwords Do Not Match");
  }

  const username_regex = /^(?=.{1,15}$)(?![_.])(?!.*[_.]{2})[a-z][a-z0-9_.]+$/;
  if (!username_regex.test(username)) {
    alert("Invalid Username. Must be alphanumeric with only _. and maximum 15 characters.");
    return new Error("Invalid characters in username");
  }

  const pass256 = crypto.createHash('sha256')
    .update(password)
    .digest('hex');

  const seed256 = store.getSeed256();
  const invitation = store.getInvitation();

  const resource = "/auth/register";
  const url = api_url + resource;
  const method = "POST";
  const body = {
    username,
    pass256,
    seed256,
    invited_by: invitation.invited_by,
    invite_code: invitation.invite_code,
  };

  const response = await request(method, url, body);
  if (response instanceof Error) return response;

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

  const resource = "/auth/login/";
  const url = api_url + resource;
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


  const resource = "/auth/reset/";
  let url = api_url + resource;
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

  const resource = "/auth/check/seed256";

  const url = api_url + resource;
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

  const resource = "/auth/invite/";
  const url = api_url + resource;
  const method = "GET";


  const response = await request(method, url, {}, token);
  if (response instanceof Error) return response;

  const invite_code = response.invite_code;
  const invite_link = `${web_url}/invitation?invited_by=${username}&invite_code=${invite_code}`;
  return invite_link;

}

// if not registered use invite_code as token
async function apiGetUsernames(is_registered, token, invited_by) {
  const resource = (is_registered) ? `/profile/usernames` : `/profile/usernames?invited_by=${invited_by}&invite_code=${token}`;
  token = (is_registered) ? token : null;
  const url = api_url + resource;
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
  const resource = "/profile/";
  const url = api_url + resource;
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
  const resource = "/profile/";
  const url = api_url + resource;
  const method = "DELETE";

  const response = await request(method, url, {}, token);
  if (response instanceof Error) {
    // no redirect on 401 since used in invitation
    return response;
  }

  alert("Profile Deleted!")
  window.location.href = web_url;
  return response;


}
async function apiGetUserProfile(token, username) {
  const resource = `/profile?username=${username}`;
  const method = "GET";
  const url = api_url + resource;

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
  const resource = `/profile/find_many`;
  const url = api_url + resource;
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

  const resource = "/profile/";
  const method = "POST";

  const url = api_url + resource;

  const body = {
    nickname,
    cipher_info,
    status,
  }

  if(!cipher_info) delete body['cipher_info'];
  if(!nickname) delete body['nickname'];
  if(!status) delete body['status'];

  console.log({body});
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
  const resource = "/profile/genesis";

  const url = api_url + resource;

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

async function apiMuteUser(token, trusted_by, toggle_mute) {

  const method = "POST";
  const resource = "/profile/mute";

  const url = api_url + resource;

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

  const resource = "/posts";


  const url = api_url + resource;
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

  const resource = `/posts/${post_id}`;

  const url = api_url + resource;
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
  const resource = "/posts/self";
  const url = api_url + resource;
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
  const resource = "/posts/others";
  const url = api_url + resource;
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

  const resource = "/profile/trust";

  const url = api_url + resource;

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

  const resource = "/profile/revoke";

  const url = api_url + resource;

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
  apiIdentityRegistration,
  apiIdentityAll,
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