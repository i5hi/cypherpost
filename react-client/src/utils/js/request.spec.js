const { request } = require('./request.js');

const assert = require('assert');

const api_url = "http://localhost/api/v1";

describe('request', function () {
  describe('api_url', function () {
    it('should return 401', async function () {
      const response = await request(
        "POST",
        api_url + "/auth/login",
        { pass256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08", username: "adm1n" },
        null
      );
      assert.equal(response instanceof Error, true);
      assert.equal(response.message, "Wrong Password");
      assert.equal(response.name, "401");
    });
  });
});