const bitcoin = require('./bitcoin.js');
const { encrypt, decrypt } = require("./aes");
const crypto = require("crypto");

const assert = require('assert');

describe('Cypherpost Key Derivation Flow', function () {
  // The following tests simulate two users, Alice and Bob
  // Each step is written in a separate test for Alice (to understand the flow)
  // One composite tests is used to derive keys for Bob (for simplicity)

  it('INIT: should generate 12 mnemonic words by BIP39 standard', function () {
    const mnemonic = bitcoin.generate_mnemonic();
    console.log(mnemonic)
    assert.equal(mnemonic.split(" ").length, 12);
  });

  /* 
  
  
  ALICE's KEYS 
  INDIVIDUAL
  
  */


  // Expected keys based on
  // https://iancoleman.io/bip39/
  const alice_mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

  const expected_alice_128_parent = {
    xprv: "xprv9wpPJrQpKw83RsZFwQWhVAr4LNgt1u3AtgPSbis2CTFsTTGgwdrkaWjEvc6NpHMowEjwFZu4mBaoM5g4VMaje4xRkKAqz8hPcwBXwvG8UKQ",
    xpub: "xpub6AojiMwiAJgLeMdj3S3hrJnntQXNRMm2FuK3Q7GdknnrLFbqVBB18K3imsNmHokfkjSznzDeTR58ddQwepLYzE7KSPTwpeBtpUWtjsQZMzK",
  };
  const expected_alice_recipient_parent = {
    xprv: 'xprv9yy7RqEbfXUwUo9XcB54UX8T3WysiEaxZZsdotwhfEfKPEH56NmTYNDQFU8gTR8iCvirVBkFW5RnX1oeNmMisj9vq24Ne7vhD1nKKYmtF1E',
    xpub: 'xpub6CxTqLmVVu3EhHDziCc4qf5BbYpN7hJovnoEcHMKDaCJG2cDdv5i6AXt6jQBBR4N2odeVM3wqtsuUGv5fZNzZnxUtdsF8dkWXnGcbbgqKsE',
  };
  const expected_alice_recipient_child_00 = {
    xprv: 'xprvA4AuVUKrdMn1XbU5aPeToJ9BViUPucNGXG43wgsU9s3bQSYgNQrWZrDs3s28uwDQiWt5Y7Q6YiYHMAM6vmNBTtAn8XxDF8uiX7cN1esqvs9',
    xpub: 'xpub6HAFtyrkTjLJk5YYgRBUAS5v3kJtK567tUyek5H5iCaaHEspuxAm7eYLu98QJ9J3Z7nRRA4T3aJWR8MEUK6ChucUDsTgkxwwgAkWQaTUaff',
  };
  const expected_alice_profile_parent = {
    xprv: 'xprv9yy7RqEbfXUwYtqFSCfSxzheZnaPEX9ByXwuZc3L3pq96Zz9mv84MkrHoMKFVTGnYvW12jEgyAzPG8ZC5zteNRBnx9YMSic5vHymeCzRiv1',
    xpub: 'xpub6CxTqLmVVu3EmNuiYECTL8eP7pQsdys3LksWMzSwcAN7yNKJKTSJuZAmec8kMUfNXvz5fwsRmR61YdXaw4qcxZjZn7nw8ZQpanuS8g7KPah',
  };
  const expected_alice_profile_child_00 = {
    xpub: 'xpub6GyyUM1muvJpo6KMtwSWHcwEHP14GD4eHqbbezasffPC8SQjhtZJBsJLHKU6JxV7nmXh9kFCCBEQBXwRgCDLgz6nPLXcPZSR6fkEuTxZWby',
    xprv: 'xprvA3zd4qUt5YkXacEtnuuVvUzVjMAZrkLnvcfzrcBG7KrDFe5bAMF3e4yrS5CpTmPbSoEWmyJT4Y47XbXQLt6dtau48gyHENCUp8D2aimzkVK'
  };

  // The following global variables would be stored in local/session storage

  let alice_recipient_parent;
  let alice_profile_parent;

  it('ALICE: should import a 12 word menmonic and convert to a root key', async function () {
    const expected_root = "xprv9s21ZrQH143K2ERdvb26bYdh5FNh24fWCB3KDheE8EvYRyFuNnGpqxQFZbDYqBoSEsmSzPaFZ9MzbXtTa9ueeCF2nGDA2C2sHdgM8SRcmSE";
    const root = await bitcoin.seed_root(alice_mnemonic);
    assert.equal(root, expected_root);
  });

  it('ALICE: should convert a root xprv to a parent 128 key pair for local storage', function (done) {
    const root = "xprv9s21ZrQH143K2ERdvb26bYdh5FNh24fWCB3KDheE8EvYRyFuNnGpqxQFZbDYqBoSEsmSzPaFZ9MzbXtTa9ueeCF2nGDA2C2sHdgM8SRcmSE";
    // parent at m/128'/0' denoting
    // purpose: 128 = end-to-end encryption
    // network: 0 = cypherpost

    const parent_128 = bitcoin.derive_parent_128(root);
    assert.equal(parent_128['xprv'], expected_alice_128_parent['xprv']);
    assert.equal(parent_128['xpub'], expected_alice_128_parent['xpub']);
    done()
  });

  it('ALICE: should encrypt the parent_128 key pair with a users password', function (done) {
    // we do not encrypt with the hash256 of the password because the server knows the password hash.
    // the combination of user:password is only known to the user, use the hash of this instead.
    // immediately after register, derive the parent_128 from the seed and encrypt it with the user's username:password and store in persistant storage
    // keep a plain text copy in session storage to use during a session.
    // if the session is closed, notify the user to reenter username:password to decrypt the key.
    // Additionally, store a triple hash value of the users password in local storage to check if the entered password is correct - without needing a server call.
    const username = "sushi";
    const password = "yaa, its the best only.";

    const round1 = crypto.createHash('sha256').update(password).digest('hex');
    const round2 = crypto.createHash('sha256').update(round1).digest('hex');
    const triple_pass256 = crypto.createHash('sha256').update(round2).digest('hex');
    // store username & triple_pass256 in persistant storage, to check password locally before attempting to decrypt parent_128 with it.

    const encryption_key = crypto.createHash("sha256")
      .update(`${username}:${password}`)
      .digest("hex");

    const parent_128 = {
      xprv: "xprv9wpPJrQpKw83RsZFwQWhVAr4LNgt1u3AtgPSbis2CTFsTTGgwdrkaWjEvc6NpHMowEjwFZu4mBaoM5g4VMaje4xRkKAqz8hPcwBXwvG8UKQ",
      xpub: "xpub6AojiMwiAJgLeMdj3S3hrJnntQXNRMm2FuK3Q7GdknnrLFbqVBB18K3imsNmHokfkjSznzDeTR58ddQwepLYzE7KSPTwpeBtpUWtjsQZMzK",
    };

    const encrypted_parent_128 = encrypt(JSON.stringify(parent_128), encryption_key);
    const decrypted_parent_128 = decrypt(encrypted_parent_128, encryption_key);

    assert.equal(JSON.parse(decrypted_parent_128)['xprv'], parent_128['xprv']);
    assert.equal(JSON.parse(decrypted_parent_128)['xpub'], parent_128['xpub']);
    done()
  });

  it("ALICE: should derive Recipient keys", function (done) {
    const parent_128 = {
      xprv: "xprv9wpPJrQpKw83RsZFwQWhVAr4LNgt1u3AtgPSbis2CTFsTTGgwdrkaWjEvc6NpHMowEjwFZu4mBaoM5g4VMaje4xRkKAqz8hPcwBXwvG8UKQ",
      xpub: "xpub6AojiMwiAJgLeMdj3S3hrJnntQXNRMm2FuK3Q7GdknnrLFbqVBB18K3imsNmHokfkjSznzDeTR58ddQwepLYzE7KSPTwpeBtpUWtjsQZMzK",
    };
    const recipient_parent = bitcoin.derive_parent_usecase(parent_128['xprv'], 0);

    // at path m/128'/0'/0'

    assert.equal(recipient_parent['xprv'], expected_alice_recipient_parent['xprv']);
    assert.equal(recipient_parent['xpub'], expected_alice_recipient_parent['xpub']);

    alice_recipient_parent = recipient_parent;

    const alice_recipient_child_00 = bitcoin.derive_child_indexes(recipient_parent.xprv, 0, 0);

    assert.equal(alice_recipient_child_00['xprv'], expected_alice_recipient_child_00['xprv']);
    assert.equal(alice_recipient_child_00['xpub'], expected_alice_recipient_child_00['xpub']);
    done()
  });

  it("ALICE: should derive Profile Keys", function (done) {
    const parent_128 = {
      xprv: "xprv9wpPJrQpKw83RsZFwQWhVAr4LNgt1u3AtgPSbis2CTFsTTGgwdrkaWjEvc6NpHMowEjwFZu4mBaoM5g4VMaje4xRkKAqz8hPcwBXwvG8UKQ",
      xpub: "xpub6AojiMwiAJgLeMdj3S3hrJnntQXNRMm2FuK3Q7GdknnrLFbqVBB18K3imsNmHokfkjSznzDeTR58ddQwepLYzE7KSPTwpeBtpUWtjsQZMzK",
    };
    const profile_parent = bitcoin.derive_parent_usecase(parent_128['xprv'], 1);

    // at path m/128'/0'/0'

    assert.equal(profile_parent['xprv'], expected_alice_profile_parent['xprv']);
    assert.equal(profile_parent['xpub'], expected_alice_profile_parent['xpub']);

    alice_profile_parent = profile_parent;

    const alice_profile_child_00 = bitcoin.derive_child_indexes(profile_parent.xprv, 0, 0);

    assert.equal(alice_profile_child_00['xprv'], expected_alice_profile_child_00['xprv']);
    assert.equal(alice_profile_child_00['xpub'], expected_alice_profile_child_00['xpub']);
    done()
  });

  /* 
  
  
  BOBS KEYS 
  COMPOSITE
  
  */
  // Excpected bob keys
  const bob_mnemonic = "harvest subway shrimp vacant mistake opinion balcony fitness nothing lyrics steel warrior";

  const expected_bob_recipient_parent = {
    xpub: 'xpub6C5Hi1ABVMmshAwz4pKa6SPbNUUttWjNDSRpauBDHTeuwRoknYB9kFFsx4SA7JhfYxYykhDAJFbnEednHZF9fmG8tgxTCak6z3piAzU9bxf',
    xprv: 'xprv9y5wJVdHezDaUgsWxnnZjJSrpSeQV41WrDWDnWmbj87w4dUcEzruCSwQ6k8aHD91NRRiFKzGrgBnFkN7JxSUxUx3M5tgwmt6HQ4PB497dVt'
  };
  const expected_bob_recipient_child_00 = {
    "xprv": "xprvA43FN1SfE2YaEeHoGxnQEDLj8D3yjpsiSwxcyHr8je75gw7uYyXjDen5Jg7KStYBuvWLGeLNPW1APsP2MefBbpmCF4HXobmB7GhrUVBsZy4",
    "xpub": "xpub6H2bmWyZ4Q6sT8NGNzKQbMHTgEtU9HbZpAtDmgFkHye4ZjT46WqymT6Z9yU7afuw94vxYjfD6q4kynbpv84xeqp9HkLUrrg3HuCHitZqBe6"
  };
  const expected_bob_profile_child_00 = {
    "xprv": "xprvA3iQGAMtZZDVJpY77QdQKKcxpPmoajP3mJzoA87bvFdfQvWKpG2DDFPTHUe9E1mmj8Re4TwV8AjpXHsVffbVstsQXotkV6dqzwED2oL78r4",
    "xpub": "xpub6GhkfftnPvmnXJcaDSAQgTZhNRcHzC6u8XvPxWXDUbAeHiqUMoLTm3hw8jqi7dpuTAJ6h9rAqJCCxZbPVpLxzsARy5UeerqHarDvYNCpwzc"
  };

  let bob_recipient_parent;
  let bob_profile_parent;

  it("BOB: imports mnemonic words -> parent_128 -> Recipient/Profile Keys", async function () {
    const root = await bitcoin.seed_root(bob_mnemonic);
    const parent_128 = bitcoin.derive_parent_128(root);
    const recipient_parent = bitcoin.derive_parent_usecase(parent_128['xprv'], 0);
    const recipient_child_00 = bitcoin.derive_child_indexes(recipient_parent['xprv'], 0, 0);

    assert.equal(recipient_child_00['xprv'], expected_bob_recipient_child_00['xprv']);
    assert.equal(recipient_child_00['xpub'], expected_bob_recipient_child_00['xpub']);

    bob_recipient_parent = recipient_parent;

    const profile_parent = bitcoin.derive_parent_usecase(parent_128['xprv'], 1);
    const profile_child_00 = bitcoin.derive_child_indexes(profile_parent['xprv'], 0, 0);

    bob_profile_parent = profile_parent;

    assert.equal(profile_child_00['xprv'], expected_bob_profile_child_00['xprv']);
    assert.equal(profile_child_00['xpub'], expected_bob_profile_child_00['xpub']);
  });

  /**
   * 
   * 
   * SIMULATE MESSAGE PASSING BETWEEN ALICE AND BOB
   * 
   * 
   */

  // The following global variables simulate data stored on the server.

  let alice_recipient_xpub;
  let alice_profile_derivation_scheme;  // only holds m/index/revoke
  let alice_profile_cipher_info; // encrypted with primary
  let alice_encrypted_primary_from_bob;

  let bob_recipient_xpub;
  let bob_profile_derivation_scheme;
  let bob_profile_cipher_info;
  let bob_encrypted_key_from_alice;

  describe("ALICE & BOB: should simulate a flow where:", function () {
    it("1. ALICE & BOB registers on cypherpost", function (done) {
      // After registering alice and bob first send the server their recipient_child_00['xpub']
      const alice_recipient_child_00 = bitcoin.derive_child_indexes(alice_recipient_parent['xprv'], 0, 0);
      const bob_recipient_child_00 = bitcoin.derive_child_indexes(bob_recipient_parent['xprv'], 0, 0);

      assert.equal(alice_recipient_child_00['xpub'], expected_alice_recipient_child_00['xpub']);
      assert.equal(bob_recipient_child_00['xpub'], expected_bob_recipient_child_00['xpub']);
      // send xpubs to server with POST /profile
      alice_recipient_xpub = alice_recipient_child_00['xpub'];
      bob_recipient_xpub = bob_recipient_child_00['xpub'];

      done()
    });

    const alice_plain_text = "Contact me on Telegram @al1c3";
    const bob_plain_text = "+9162199513";

    it("2. ALICE & BOB create and share cipher_info via cypherpost.", function (done) {

      let alice_profile_child_00 = bitcoin.derive_child_indexes(alice_profile_parent['xprv'], 0, 0);
      let bob_profile_child_00 = bitcoin.derive_child_indexes(bob_profile_parent['xprv'], 0, 0);

      // encryption keys
      let alice_primary_key = crypto.createHash("sha256")
        .update(alice_profile_child_00['xprv'])
        .digest("hex");
      let bob_primary_key = crypto.createHash("sha256")
        .update(bob_profile_child_00['xprv'])
        .digest("hex");

      // POST /profile with cipher_info
      alice_profile_cipher_info = encrypt(alice_plain_text, alice_primary_key);
      bob_profile_cipher_info = encrypt(bob_plain_text, bob_primary_key);

      // assert is_encrypted with presence of 32 char length IV
      assert(alice_profile_cipher_info.split(':')[0].length === 32);
      assert(bob_profile_cipher_info.split(':')[0].length === 32);

      done()
    });

    it("3. ALICE & BOB trust each other.", function (done) {
      // Alice & Bob expresses trust in each other by:
      // 1. Generating a shared_secret with the other
      // 2. Using it to encrypt their primary_key
      // 3. Share this encrypted primary_key with other via cypherpost
      const alice_profile_child_00 = bitcoin.derive_child_indexes(alice_profile_parent['xprv'], 0, 0);
      const alice_recipient_child_00 = bitcoin.derive_child_indexes(alice_recipient_parent['xprv'], 0, 0);

      const alice_secret_ecdsa_pair = bitcoin.extract_ecdsa_pair(
        {
          xprv: alice_recipient_child_00['xprv'],
          xpub: bob_recipient_xpub
        }
      );
      const alice_shared_secret = bitcoin.calculate_shared_secret(
        alice_secret_ecdsa_pair['private_key'],
        alice_secret_ecdsa_pair['public_key']
      );

      const bob_profile_child_00 = bitcoin.derive_child_indexes(bob_profile_parent['xprv'], 0, 0);
      const bob_recipient_child_00 = bitcoin.derive_child_indexes(bob_recipient_parent['xprv'], 0, 0);

      const bob_secret_ecdsa_pair = bitcoin.extract_ecdsa_pair(
        {
          xprv: bob_recipient_child_00['xprv'],
          xpub: alice_recipient_xpub
        }
      );
      const bob_shared_secret = bitcoin.calculate_shared_secret(
        bob_secret_ecdsa_pair['private_key'],
        bob_secret_ecdsa_pair['public_key']
      );

      assert.equal(alice_shared_secret, bob_shared_secret);

      // encryption primary keys
      let alice_primary_key = crypto.createHash("sha256")
        .update(alice_profile_child_00['xprv'])
        .digest("hex");

      let bob_primary_key = crypto.createHash("sha256")
        .update(bob_profile_child_00['xprv'])
        .digest("hex");

      // encrypted primary_keys for trusted recipient
      let alice_encrypted_primary_for_bob = encrypt(alice_primary_key, alice_shared_secret);
      let bob_encrypted_primary_for_alice = encrypt(bob_primary_key, bob_shared_secret);

      // Alice and Bob can decrypt each others primary_key via their shared_secret
      // Alice and Bob can read each other's cipher_info with the primary_key
      // BOB
      assert.equal(alice_plain_text, decrypt(alice_profile_cipher_info, decrypt(alice_encrypted_primary_for_bob, bob_shared_secret)));
      // ALICE
      assert.equal(bob_plain_text, decrypt(bob_profile_cipher_info, decrypt(bob_encrypted_primary_for_alice, alice_shared_secret)));

      // Once the primary key is shared with a user, we assume they always maintain a local copy
      done()
    });

    it.skip("4. ALICE & BOB create posts that the other can view.", function (done) {

    });

    it.skip("5. ALICE & BOB revoke trust.", function (done) {

    });

  })
});