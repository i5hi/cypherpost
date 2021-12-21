const axios = require('axios');

async function request(method, url, headers, body) {

  const options = {
    url,
    method: method.toUpperCase(),
    headers,
    data:body,
    json: true
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
      return new Error("BAD NEWS!");
    }
  }
}

module.exports = {
  request
}