/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { CypherpostBitcoinOps } from "../../lib/bitcoin/bitcoin";
import { S5Crypto } from "../../lib/crypto/crypto";
import { DbConnection } from "../../lib/storage/interface";
import { MongoDatabase } from "../../lib/storage/mongo";
import { CypherpostBadges } from "./badges";
import { BadgeType } from "./interface";
const sinon = require("sinon");

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
const bitcoin = new CypherpostBitcoinOps();
const badges = new CypherpostBadges();
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
let message = "GET /badges/";

let xpub = "xpub6DAo87N8pGxhyNo8uWWVwsTRHwozpSp2Scy1BiCjM2rN9R3vRnysqXr2ymokbVYGPzih9Ze1iW4GiKjnL7Eqdec4Gj2fcpvoScN1rfdVKjK";
let xprv = "xprv9zBSibqEyuQQktifoUyVajWgjuyWQz6B5Q3QPKo7nhKPGcimtFfdHjXZ8UBYi7Ycz6V7R1QrSk9uExx2xTb9mW6SprakREwVuC91233nJaD";
let xpub1 =  "xpub6CQuhNszNuSHTvynoBjh8d3wmYqkvTY9jLmvobQ8AFq67xEYgWRjQYELAXM5UCXiDYBZaiyoXsfGDd97imrJ3Btvo71Eb47ikZq8wJZYSoJ";
let xprv1 =  "xprv9yRZHsM6YXszFSuKhACgmV7DDX1GWzpJN7rL1CzWbvJ7F9uQ8y7UrjurKGdCSteFhKPrytgtVLNdkLTUR3hksooDan6AUg8ACQqcApeu1sk";
let nonce = Date.now().toString();
let hash;
let signature;
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("Initalizing Test: Badge Service", function () {
  before(async function () {
    const connection: DbConnection = {
      port: process.env.DB_PORT,
      ip: process.env.DB_IP,
      name: process.env.DB_NAME,
      auth: process.env.DB_AUTH,
    };
    await db.connect(connection);

    const key_pair = bitcoin.extract_ecdsa_pair({xpub,xprv});
    if(key_pair instanceof Error) return key_pair;
    const message = `${xpub}:${xpub1}:${BadgeType.Trusted.toString()}:${nonce}`;
    signature = bitcoin.sign(message,key_pair.private_key);
  });

  describe("BADGE SERVICE OPERATIONS:", async function () {
    it("CREATE new TRUST from xpub to xpub1", async function () {
      const response = await badges.create(xpub, xpub1, BadgeType.Trusted,nonce, signature);
      expect(response).to.equal(true);
    });
    it("409 for CREATE duplicate TRUST from xpub to xpub1", async function () {
      const response = await badges.create(xpub, xpub1, BadgeType.Trusted,nonce, signature);
      expect(response['name']).to.equal("409");
    });
    it("FIND badges by giver", async function () {
      const response = await badges.findByGiver(xpub);
      expect(response[0]['giver']===xpub).to.equal(true);
    });
    it("FIND badges by reciever", async function () {
      const response = await badges.findByReciever(xpub1);
      expect(response[0]['giver']===xpub).to.equal(true);
    });
    it("REVOKE badge", async function () {
      const response = await badges.revoke(xpub, xpub1, BadgeType.Trusted);
      expect(response).to.equal(true);
    });
    it("FIND 0 badges post revoke", async function () {
      const response = await badges.findByReciever(xpub1);
      expect(response['name']).to.equal("404");
    });
    it("CREATE new TRUST from xpub to xpub1", async function () {
      const response = await badges.create(xpub, xpub1, BadgeType.Trusted,nonce, signature);
      expect(response).to.equal(true);
    });
    it("REMOVE ALL by xpub", async function () {
      const response = await badges.removeAllOfUser(xpub);
      expect(response).to.equal(true);
    });
    it("FIND 0 badges post revoke", async function () {
      const response = await badges.getAll();
      expect(response['name']).to.equal("404");
    });
  });
});
