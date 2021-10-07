const axios = require('axios');

async function request(method, url, body, token) {
  const options = (method === "GET") ?
    {
      url,
      method: method.toUpperCase(),
      json: true
    } : {
      url,
      method: method.toUpperCase(),
      data: body,
      json: true
    };

  if (token) {
    options['headers'] = { "Authorization": `Bearer ${token}` };
  }

  try {
    const response = await axios(options);
    return response.data;
  }
  catch (e) {
    console.error({ e });
    if (e.response) {
      const err = new Error(e.response.data.error);
      err.name = e.response.status.toString();
      return err;
    }
    else{
      return new Error("BAD NEWS!");
    }

  }

}

module.exports = {
  request
}