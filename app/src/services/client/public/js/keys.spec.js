const bitcoin = require('./keys.js');
const { encrypt, decrypt } = require("./aes");
const crypto = require("crypto");

const assert = require('assert');

describe('Cypherpost Key Derivation Flow', function () {
  // The following tests simulate two users, Alice and Bob
  // Each step is written in a separate test for Alice (to understand the flow)
  // One composite tests is used to derive keys for Bob (for simplicity)

  it('INIT: should generate a 32 digit access code', function () {
    const access_code = bitcoin.generateAccessCode();
    console.log(access_code)
    assert.equal(access_code.split(" ").length, 4);
  });

  it('INIT: should be able to derive bitcoin keys from an access code', async function () {
    const access_code = bitcoin.generateAccessCode();
    const root = await bitcoin.seed_root_alt(access_code);
    assert(root.startsWith('xprv'))
  });

  
});