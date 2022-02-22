const axios = require('axios');


function createRequestHeaders(identity_parent, nonce, signature) {
  return {
    "x-client-pubkey": identity_parent['pubkey'],
    "x-nonce": nonce,
    "x-client-signature": signature,
  };
}

async function createRequestSignature(method, resource, body, identity_parent, nonce) {
  const request_message = `${method} ${VERSION_PREFIX}${resource} ${JSON.stringify(body)} ${nonce}`;
  console.log({ request_message })
  return await bitcoin.sign(request_message, identity_parent.privkey);
};

async function createBadgeSignature(identity_parent, reciever_pubkey, type, nonce) {
  const badge_message = `${identity_parent.pubkey}:${reciever_pubkey}:${type}:${nonce}`;
  console.log({ badge_message })
  return await bitcoin.sign(badge_message, identity_parent.privkey);
}



async function request(method, url, headers, body) {

  const options = {
    url,
    method: method.toUpperCase(),
    headers,
    data:body,
    json:true
  };

  try {
    const response = await axios(options);
    return response.data;
  }
  catch (e) {
    if (e.response) {
      const err = new Error(e.response.data.error);
      err.name = e.response.status.toString();
      return err;
    }
    else {
      console.error({e})
      return new Error("BAD NEWS!");
    }
  }
}

module.exports = {
  request
}