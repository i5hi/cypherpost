/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import crypto from "crypto";
import "mocha";
import { CypherpostBitcoinOps } from "../../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../../lib/crypto/crypto";
import { DbConnection } from "../../../lib/storage/interface";
import { MongoDatabase } from "../../../lib/storage/mongo";
import { PostDecryptionKey } from "./interface";
import { CypherpostPostKeys } from "./post_keys";
const sinon = require("sinon");

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const bitcoin = new CypherpostBitcoinOps();
const postKeys = new CypherpostPostKeys();
const s5crypto = new S5Crypto();
const db = new MongoDatabase();
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
/*
ROOT
{
  "fingerprint": "fcf5c473",
  "mnemonic": "want text option cargo region apology elegant easy uniform bird consider wedding sport spy romance scrap produce pluck cement thank country person ecology weird",
  "xprv": "xprv9s21ZrQH143K2C33LtYYTeVM187n1L1iKq1nyUJMsvxJJQNRxpkZzZfDxAv2iyds3E3Y5r3LeF3MBcasGGgvKfA2KmAqx61TFU46UZY8S9F"
}
PARENT e2ee'/cypherpost'/identity'
{
  "xprv": "[fcf5c473/128'/0'/0']xprv9zBSibqEyuQQktifoUyVajWgjuyWQz6B5Q3QPKo7nhKPGcimtFfdHjXZ8UBYi7Ycz6V7R1QrSk9uExx2xTb9mW6SprakREwVuC91233nJaD/*",
  "xpub": "[fcf5c473/128'/0'/0']xpub6DAo87N8pGxhyNo8uWWVwsTRHwozpSp2Scy1BiCjM2rN9R3vRnysqXr2ymokbVYGPzih9Ze1iW4GiKjnL7Eqdec4Gj2fcpvoScN1rfdVKjK/*"
}

ROOT1
{
  "fingerprint": "5d404b4f",
  "mnemonic": "solar spatial call country medal sunset twin brisk ocean history one exist change session inherit mesh swift document melt they over repeat link stick",
  "xprv": "xprv9s21ZrQH143K4JhmYa82pg6h31PMMTcmqwSDD4g6PLWJNpLFraD1FxBrcPz5mjATArQrvAxLiAtrHiWNtDQC4kt9qMvivFudCxL7G5AzMvu"
}
PARENT e2ee/cypherpost/identity
{
  "xprv": "[5d404b4f/128'/0'/0']xprv9yRZHsM6YXszFSuKhACgmV7DDX1GWzpJN7rL1CzWbvJ7F9uQ8y7UrjurKGdCSteFhKPrytgtVLNdkLTUR3hksooDan6AUg8ACQqcApeu1sk/*",
  "xpub": "[5d404b4f/128'/0'/0']xpub6CQuhNszNuSHTvynoBjh8d3wmYqkvTY9jLmvobQ8AFq67xEYgWRjQYELAXM5UCXiDYBZaiyoXsfGDd97imrJ3Btvo71Eb47ikZq8wJZYSoJ/*"
}

*/
let message = "GET /posts/keys";

let xpub = "xpub6DAo87N8pGxhyNo8uWWVwsTRHwozpSp2Scy1BiCjM2rN9R3vRnysqXr2ymokbVYGPzih9Ze1iW4GiKjnL7Eqdec4Gj2fcpvoScN1rfdVKjK";
let xprv = "xprv9zBSibqEyuQQktifoUyVajWgjuyWQz6B5Q3QPKo7nhKPGcimtFfdHjXZ8UBYi7Ycz6V7R1QrSk9uExx2xTb9mW6SprakREwVuC91233nJaD";
let xpub1 =  "xpub6CQuhNszNuSHTvynoBjh8d3wmYqkvTY9jLmvobQ8AFq67xEYgWRjQYELAXM5UCXiDYBZaiyoXsfGDd97imrJ3Btvo71Eb47ikZq8wJZYSoJ";
let xprv1 =  "xprv9yRZHsM6YXszFSuKhACgmV7DDX1GWzpJN7rL1CzWbvJ7F9uQ8y7UrjurKGdCSteFhKPrytgtVLNdkLTUR3hksooDan6AUg8ACQqcApeu1sk";
let  shared_secret;
let encryption_key;
let decryption_key;
const derivation_scheme = "m/0'/0'/0'";
let cypher_json;
let post1_id;
let post2_id;
let post3_id;

const post_id = "somePostId";
const post_id_1 = "somePostId1";
const post_id_2 = "somePostId2";
const post_id_3 = "somePostId3";


let post_key: PostDecryptionKey = {
  genesis: 0,
  giver: xpub,
  reciever: xpub1,
  post_id: "5omePostID",
  decryption_key: ""
};
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Post Key Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);
    // exmaple encryption key - not correct for real use
    encryption_key = bitcoin.derive_hardened(xprv,2,0,0);
    if (encryption_key instanceof Error) throw encryption_key;
    encryption_key = crypto.createHash('sha256').update(encryption_key.xprv).digest('hex');
    let pair = bitcoin.extract_ecdsa_pair({xprv: xprv, xpub: xpub1});
    if(pair instanceof Error) throw pair;
    shared_secret = bitcoin.calculate_shared_secret(pair);
    decryption_key = s5crypto.encryptAESMessageWithIV(encryption_key as string,shared_secret as string);
    if (decryption_key instanceof Error) throw decryption_key;

  });

  describe("POST KEY SERVICE OPERATIONS:", async function () {
    it("CREATE new post decryption key from xpub to xpub1", async function () {
      const response = await postKeys.addPostDecryptionKeys(xpub, post_id,[
        {reciever: xpub1, decryption_key: decryption_key }
      ]);
      expect(response).to.equal(true);
    });
    it("CREATE new post decryption key from xpub1 to xpub", async function () {
      const response = await postKeys.addPostDecryptionKeys(xpub1, post_id_2,[
        {reciever: xpub, decryption_key: decryption_key }
      ]);
      expect(response).to.equal(true);
    });
    it("UPDATE post key", async function () {
      encryption_key = bitcoin.derive_hardened(xprv,2,0,1);
      if (encryption_key instanceof Error) throw encryption_key;
      encryption_key = crypto.createHash('sha256').update(encryption_key.xprv).digest('hex');
      let pair = bitcoin.extract_ecdsa_pair({xprv: xprv, xpub: xpub1});
      if(pair instanceof Error) throw pair;
      shared_secret = bitcoin.calculate_shared_secret(pair);
      decryption_key = s5crypto.encryptAESMessageWithIV(encryption_key as string,shared_secret as string);
      if (decryption_key instanceof Error) throw decryption_key;

      const response = await postKeys.updatePostDecryptionKeys(xpub, post_id,[
        {reciever: xpub1, decryption_key: decryption_key }
      ]);
      expect(response).to.equal(true);
    });
    it("FIND post decryption key BY GIVER", async function () {
      const response = await postKeys.findPostDecryptionKeyByGiver(xpub);
      expect(response[0]['giver']).to.equal(xpub);
      expect(response[0]['reciever']).to.equal(xpub1);
      expect(response[0]['post_id']).to.equal(post_id);
    });
    it("FIND post decryption key BY RECIEVER", async function () {
      const response = await postKeys.findPostDecryptionKeyByReciever(xpub1);
      expect(response[0]['reciever']).to.equal(xpub1);
      expect(response[0]['giver']).to.equal(xpub);
      expect(response[0]['post_id']).to.equal(post_id);
    });
    it("DELETE post decryption key BY RECIEVER", async function () {
      const response = await postKeys.removePostDecryptionKeyByReciever(xpub, xpub1);
      expect(response).to.equal(true);
    });
    it("CREATE new post decryption key from xpub to xpub1", async function () {
      const response = await postKeys.addPostDecryptionKeys(xpub, post_id,[
        {reciever: xpub1, decryption_key: decryption_key }
      ]);
      expect(response).to.equal(true);
    });
    it("DELETE post decryption key BY ID", async function () {
      const response = await postKeys.removePostDecryptionKeyById(xpub, post_id);
      expect(response).to.equal(true);
    });
    it("DELETE post decryption key BY giver SHOULD be false since no keys exist", async function () {
      const response = await postKeys.removePostDecryptionKeyByGiver(xpub);
      expect(response).to.equal(false);
    });
    it("FIND post decryption key BY GIVER", async function () {
      const response = await postKeys.findPostDecryptionKeyByGiver(xpub);
      expect(response['name']).to.equal("404");
    });
    it("FIND post decryption key BY GIVER", async function () {
      const response = await postKeys.findPostDecryptionKeyByGiver(xpub1);
      expect(response[0]['giver']).to.equal(xpub1);
      expect(response[0]['reciever']).to.equal(xpub);
      expect(response[0]['post_id']).to.equal(post_id_2);
    });
    it("DELETE post decryption key BY giver SHOULD be false since no keys exist", async function () {
      const response = await postKeys.removePostDecryptionKeyByGiver(xpub1);
      expect(response).to.equal(true);
    });

  });
});
