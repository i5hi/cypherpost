// const bitcoin = require('./bitcoin.js');
// const {apiIdentityRegistration} = require('./api');
// const crypto = require("crypto");

// const assert = require('assert');

// let identity_parent;

// describe('Cypherpost Identity Registration', function () {
//   it('INIT: should generate 12 mnemonic words by BIP39 standard & derive identity_parent', async function () {
//     const mnemonic = bitcoin.generate_mnemonic();
//     console.log(mnemonic)
//     const root = await bitcoin.seed_root(mnemonic);
//     const cypherpost_parent = bitcoin.derive_parent_128(root);
//     identity_parent = bitcoin.derive_identity_parent(cypherpost_parent.xprv, 0);
//     assert.equal(identity_parent.xprv.length, 111);

//   });
//   it("REGISTER: should register identity",async function(){
//     const username = `test_${crypto.randomBytes(4).toString('hex')}`;
//     console.log({username})
//     const response = await apiIdentityRegistration(identity_parent,username);
//     console.log({response});
//     assert(response.status);
//   })
// });