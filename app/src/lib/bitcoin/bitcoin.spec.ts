/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { CypherpostBitcoinOps } from "./bitcoin";

const bitcoin = new CypherpostBitcoinOps();

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
// GLOBAL CONFIGURATIONS
let alice_words = "flash tortoise arctic forum play dish finish arrow chaos version find sword";
let alice_expected_root = "xprv9s21ZrQH143K2Yq5WQBcUxCy7k1YDx6VrQLFCQnvvjbknjByo3SN16QFaR7FLZw7BumMNwGYtQnaE29yjWPwsKFqYJE5jJWUKeQy8uLEScL";

// m/128h/0h
let expected_hardened_master = {
  xprv: "xprv9xWFJqfxvunUJjx6nckgn1f6iqrHjc2qaiJn5eKvpaVoPkBbbSzqHCPDxbV5QgL9V4JWF2RAhkDh3HTEkYkDtdPyFJmUDRC3BgzsgEwuCQb", 
  xpub: "xpub6BVbiMCrmHLmXE2ZteHh99bqGsgn94kgwwENt2jYNv2nGYWk8zK5pzhhospChAGzWnD5EEnymtekQTbzPrvqnnUFerZVCZouaTYqqLorHng"
};


let expected_hardened_contact_recipient = {
  xprv: "xprvA15eCAJsgoaHj2jCrrBBVKhvfaiW6ek8FLY5cV5YtTjhudwfdHzzHgBH7FKXs8UkVVa3ksUuYDtvNJGrS63eWMDNDfqjrFJeEEdke6ux3Y3", 
  xpub: "xpub6E4zbfqmXB8awWofxsiBrTefDcYzW7TycZTgQsVASoGgnSGpAqKEqUVkxXTqZwsW7agJqt69d7NuKgVCEnamWoaktYMKJEf6uKc6z5bvep5"
};


let expected_hardened_recipient = {
  xprv: "xprvA3nZFEAQSiHpvAyAJwoY2X6wJJJBbpcs2fzYgCHaqpP4MmHe3tjViGSfMEu61bWK7tH8GXjkZ6o9UZdGefEa1iovWEoaFf7unpDto8LC3We", 
  xpub: "xpub6GmuejhJH5r88f3dQyLYPf3frL8g1HLiPtv9UahCQ9v3EZcnbS3kG4m9CWAQq94r7dXXzxnChH47bhbZg5JfETAqbSTfFrioLZWuMKrzknc"
};

let expected_hardened_posts_sender = {
  xprv: "xprvA3kHeTNRh3U3krmc18PTZbeofPodfhACPzEkeKsFTLSneXKDNpA2j6vJYsbs5XMaK5tVfxjEZuGzWhAh1XvhSW9Re3t3J74DDGcS9ebnTuG", 
  xpub: "xpub6Gje3xuKXR2LyLr579vTvjbYDRe859t3mDAMSiGs1fymXKeMvMUHGuEnQ8Q1PvZpU1wSg2W7DGwjRr6Hd4TiPTh3X2XMQB7eYE521nnSLWi"
};


let expected_hardened_profile_sender = {
  xprv: "xprvA31FQKGxmJyGAMhf4vR6pU6S3CxjqHR6rrqQ49aKKV3HTSWvUuHZ9HUBx7jGZSyQJa64BoW87zmspDATwpY9Wj2z92Pb9tZVSpzMqPCCNFi", 
  xpub: "xpub6FzboporbgXZNqn8Awx7Bc3AbEoEEk8xE5kzrXyvspaGLEr52Sboh5nfoQsDCo7XTLrtyPqjVeq97bbKbzUyJiMjnf5LzkVDshQmu9DhUfa"
};


let xkeys = {
  xprv: "xprvA3nH6HUGxEUZbeZ2AGbsuVcsoEsa269AmySR95i3E81mwY3TmWoxoGUUqB59p8kjS6wb3Ppg2c9y3vKyG2aecijRpJfGWMxVX4swXwMLaSB", 
  xpub: "xpub6GmdVo1Anc2rp8dVGJ8tGdZcMGi4RYs29CN1wU7enTYkpLNcK48DM4nxgTLoSCEfGYGJZ6JqPwCpSnoGfEwDUU6tszeSUcdEqntoqqRCLhm"
};

let expected_ecdsa_pair =  {
  private_key: "3c842fc0e15f2f1395922d432aafa60c35e09ad97c363a37b637f03e7adcb1a7",
  public_key: "02dfbbf1979269802015da7dba4143ff5935ea502ef3a7276cc650be0d84a9c882",
};

const alice_pair = expected_ecdsa_pair;

const bob_pair =  {
  private_key: "d5f984d2ab332345dbf7ddff9f47852125721b2025329e6981c4130671e237d0",
  public_key: "023946267e8f3eeeea651b0ea865b52d1f9d1c12e851b0f98a3303c15a26cf235d",
};

let expected_shared_secret = "49ab8cb9ba741c6083343688544861872e3b73b3d094b09e36550cf62d06ef1e";



// let bob_pair =  {
//   private_key: "3c842fc0e15f2f1395922d432aafa60c35e09ad97c363a37b637f03e7adcb1a7",
//   public_key: "02dfbbf1979269802015da7dba4143ff5935ea502ef3a7276cc650be0d84a9c882",
// }; 

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: S5Crypto Lib ", function () {

  after(function (done) {
   
    done();
  });

  describe("Bitcoin Operations TEST", function () {
    it("should generate a 12 word mnemonic phrase", async function () {
      let mnemonic = bitcoin.generate_mnemonic();
      if (mnemonic instanceof Error) throw mnemonic;
      let word_array = mnemonic.split(" ");
      expect(word_array.length).to.equal(12);

    });
    it("should get the seed_root xprv", async function () {
      let root_xprv = await bitcoin.seed_root(alice_words);
      if (root_xprv instanceof Error) throw root_xprv;
      expect(root_xprv).to.equal(alice_expected_root);

    });
    it("should derive_parent at m/128h/0h", async function () {
      let key_pair = bitcoin.derive_parent_128(alice_expected_root);
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.xprv).to.equal(expected_hardened_master.xprv);
      expect(key_pair.xpub).to.equal(expected_hardened_master.xpub);
    });



    it("should derive_hardened pair at m/0h/0h/0h for hardened recipient/index/revoke", async function () {
      let key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv,0,0,0);
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.xprv).to.equal(expected_hardened_recipient.xprv);
      expect(key_pair.xpub).to.equal(expected_hardened_recipient.xpub);
    });
    it("should derive_hardened pair at m/1h/0h/0h for hardened contact/index/revoke", async function () {
      let key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv,1,0,0);
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.xprv).to.equal(expected_hardened_profile_sender.xprv);
      expect(key_pair.xpub).to.equal(expected_hardened_profile_sender.xpub);
    });
    it("should derive_hardened pair at m/2h/1h/0h for hardened posts/index/revoke", async function () {
      let key_pair = bitcoin.derive_hardened(expected_hardened_master.xprv,2,1,0);
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.xprv).to.equal(expected_hardened_posts_sender.xprv);
      expect(key_pair.xpub).to.equal(expected_hardened_posts_sender.xpub);
    });

    it("should derive_hardened pair at m/2h/1h/0h AS_STR for hardened posts/index/revoke", async function () {
      let key_pair = bitcoin.derive_hardened_str(expected_hardened_master.xprv,"m/2'/1'/0'");
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.xprv).to.equal(expected_hardened_posts_sender.xprv);
      expect(key_pair.xpub).to.equal(expected_hardened_posts_sender.xpub);
    });
    


 


    it("should extract_ecdsa_pair from extended key pair", async function () {
      let key_pair = await bitcoin.extract_ecdsa_pair(xkeys);
      if (key_pair instanceof Error) throw key_pair;
      expect(key_pair.public_key).to.equal(expected_ecdsa_pair.public_key);
      expect(key_pair.private_key).to.equal(expected_ecdsa_pair.private_key);
    });
    it("should generate_shared_secret from alice public_key and bob private_key", async function () {
      
      let shared_secret_0 = bitcoin.calculate_shared_secret({private_key: alice_pair.private_key, public_key: bob_pair.public_key});
      let shared_secret_1 = bitcoin.calculate_shared_secret({private_key: bob_pair.private_key, public_key: alice_pair.public_key});
      console.log({shared_secret_0});
      expect(shared_secret_0).to.equal(shared_secret_1);
    
    });

    let message = `"hello 123 {}"`;
    let signature;
    it.only("should sign and verify a message with ecdsa keys", async function () {
      console.log(alice_pair.public_key);
      signature = await  bitcoin.sign(message,alice_pair.private_key);
      if (signature instanceof Error) throw signature;
      console.log({signature});
      let status = await bitcoin.verify(message,signature,alice_pair.public_key);
      if (status instanceof Error) throw status;
      expect(status).to.equal(true);
    });

  });

});

// ------------------ '(◣ ◢)' ---------------------
