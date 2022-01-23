/**
 * sushi
 * arrange super clinic creek twenty joke gossip order type century photo ahead
 */
const crypto = require("crypto");
const store = require('./store');
const bitcoin = require("./bitcoin");
const { request } = require('./request');

const VERSION_PREFIX = "/api/v2";
const api_url = ((document.domain === 'localhost') ? "http://localhost" : `https://cypherpost.io`) + VERSION_PREFIX;

async function createRequestSignature(method, resource, body, identity_parent, nonce) {
  const message = `${method} ${VERSION_PREFIX}${resource} ${JSON.stringify(body)} ${nonce}`;
  console.log({ message })
  return await bitcoin.sign(message, identity_parent.privkey);
};

function createRequestHeaders(identity_parent, nonce, signature) {
  return {
    "x-client-pubkey": identity_parent['pubkey'],
    "x-nonce": nonce,
    "x-client-signature": signature,
  };
}


async function registerIdentity(identity_parent, username) {
  const nonce = Date.now();
  const resource = "/identity";
  const url = api_url + resource;
  const method = "POST";
  const body = {
    username
  };

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  console.log({ headers, body, signature });
  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.status;
}
async function getAllIdentities(identity_parent) {
  const nonce = Date.now();
  const resource = "/identity/all";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  console.log({headers});
  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.identities;

}
async function deleteMyIdentity(identity_parent) {
  const nonce = Date.now();
  const resource = "/identity";
  const url = api_url + resource;
  const method = "DELETE";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.status;

}
async function getAllBadges(identity_parent) {
  const nonce = Date.now();
  const resource = "/badges/all";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.badges;
}
async function getMyBadges(identity_parent){
  const nonce = Date.now();
  const resource = "/badges/self";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response;
}
async function createBadgeSignature(identity_parent, reciever_pubkey, type, nonce) {
  const ecdsa_keys = bitcoin.extract_ecdsa_pair(identity_parent);
  const message = `${ecdsa_keys.pubkey}:${reciever_pubkey}${type}:${nonce}`;
  console.log({ message })
  return await bitcoin.sign(message, ecdsa_keys.privkey);
}
async function giveBadge(identity_parent, reciever, badge_type) {
  let nonce = Date.now();
  const badge_signature = await createBadgeSignature(key_set.identity_private, reciever, badge_type.toUpperCase(), nonce);
  const resource = "/badges" + badge_type;
  const url = api_url + resource;
  const method = "POST";

  const body = {
    trusting: reciever,
    nonce,
    signature: badge_signature
  };

  nonce = Date.now();
  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.status;
}
async function createPost(identity_parent, cypher_json, derivation_scheme, expiry, reference) {
  const nonce = Date.now();
  const resource = "/posts";
  const url = api_url + resource;
  const method = "PUT";
  const body = {
    cypher_json,
    derivation_scheme,
    expiry,
    reference
  };

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  // console.log({headers,body,signature});
  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.id;
}
async function setPostVisibility(identity_parent, post_id, decryption_keys) {
  const nonce = Date.now();
  const resource = "/posts/keys";
  const url = api_url + resource;
  const method = "PUT";
  const body = {
    post_id,
    decryption_keys
  };

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.status;
}
async function getMyPosts(identity_parent) {
  const nonce = Date.now();
  const resource = "/posts/self";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.posts;
}
async function getPostsForMe(identity_parent) {
  const nonce = Date.now();
  const resource = "/posts/others";
  const url = api_url + resource;
  const method = "GET";
  const body = {};

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.posts;
}
async function deletePost(identity_parent, post_id) {
  const nonce = Date.now();
  const resource = "/posts/" + post_id;
  const url = api_url + resource;
  const method = "DELETE";
  const body = {
    post_id,
    decryption_keys
  };

  const signature = await createRequestSignature(method, resource, body, identity_parent, nonce);
  const headers = createRequestHeaders(identity_parent, nonce, signature);

  const response = await request(method, url, headers, body);
  if (response instanceof Error) return response;

  return response.status;
}


module.exports = {
  registerIdentity,
  getAllIdentities,
  getMyPosts,
  getPostsForMe,
  getAllBadges,
  giveBadge,
  deleteMyIdentity,
  createPost,
  setPostVisibility,
  deletePost,
  getMyBadges
}