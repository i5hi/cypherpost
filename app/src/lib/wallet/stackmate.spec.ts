/*
cypherpost.io
Developed @ Stackmate India
*/

import { expect } from "chai";
import "mocha";
import { compilePolicy, createExtendedKeyString, createMultiPolicyString, deriveHardened, estimateNetworkFee, generateMaster, getAddress, importMaster, syncBalance, syncHistory } from './stackmate';
import { BitcoinNetwork, ChildKey, MasterKey, MnemonicWords, NetworkFee, NodeAddress, PurposePath, ScriptType, WalletAddress, WalletBalance, WalletHistory, WalletPolicy } from "./types/data";

// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
/*Long live the bitcoin testnet faucet!*/
const RETURN_ADDRESS = "mkHS9ne12qx9pS9VojpwU5xtRd4T7X7ZUt";
// ------------------ ┌∩┐(◣_◢)┌∩┐ ------------------
describe("***stackmate-core::ffi*** ", function () {

  describe("***(keys)*** ", function () {
    const passphrase = "secretSauces";
    let alice_master: MasterKey;
    let alice_child: ChildKey;
    let bob_master: MasterKey;
    let bob_child: ChildKey;
    let descriptor: string;

    it("GENERATES & IMPORTS a 24 word mnemonic MASTER KEY", async function () {
      const generated = generateMaster(BitcoinNetwork.Test, MnemonicWords.High, passphrase) as MasterKey;
      expect(generated.mnemonic.split(" ").length).to.equal(24);
      const imported = importMaster(BitcoinNetwork.Test, generated.mnemonic, passphrase) as MasterKey;
      expect(generated.xprv).to.equal(imported.xprv);
      alice_master = imported;
      bob_master = generateMaster(BitcoinNetwork.Test, MnemonicWords.High, passphrase) as MasterKey;
    });
    it("DERIVES CHILD KEYS @ Harnded Path", async function () {
      alice_child = deriveHardened(alice_master.xprv, PurposePath.SegwitNative, 0) as ChildKey;
      expect(alice_child.fingerprint).to.equal(alice_master.fingerprint);

      bob_child = deriveHardened(bob_master.xprv, PurposePath.SegwitNative, 0) as ChildKey;
      expect(bob_child.fingerprint).to.equal(bob_master.fingerprint);
    });
    it("COMPILES a Multi-Sig POLICY", async function () {
      const alice_xkey = createExtendedKeyString(alice_child);
      const bob_xkey = createExtendedKeyString(bob_child);

      const policy_string = createMultiPolicyString(2, [alice_xkey, bob_xkey]);
      const policy = compilePolicy(policy_string, ScriptType.SegwitScript) as WalletPolicy;
      expect(policy).to.has.property("policy");
      expect(policy).to.has.property("descriptor");
      expect(policy.policy.startsWith('thresh')).to.equal(true);
      expect(policy.descriptor.startsWith('wsh')).to.equal(true);
      descriptor = policy.descriptor;
    });

  });
  describe("***(network)*** ", function () {
    it("GETS MAINNET FEE FROM BLOCKSTEAM", async function () {
      const response = estimateNetworkFee(BitcoinNetwork.Main, NodeAddress.Default, 1) as NetworkFee;
      console.log(response)
      expect(response.rate).to.be.greaterThan(0.0);
      expect(response.absolute).to.equal(0);

    });
  });
  
  describe("***(wallet)*** ", function () {
    
    const passphrase = "secretSauces";
    const alice_master: MasterKey = {
      fingerprint: '64b8d0b1',
      mnemonic: 'this right mixture judge gold muffin immune finish garlic fortune average churn phone enough degree diagram grunt cement emerge width buzz leopard oyster crunch',
      xprv: 'tprv8ZgxMBicQKsPegV1toh3EBXNqBakZjTh1yczDRjc5n291Yr7avoLBUfeHqjQTDKTy9LWGxRHYMn7UK3ZQQKkTWvi56xvJL9YZ3dWRd8KX3j'
    };
    const alice_child: ChildKey = {
      fingerprint: '64b8d0b1',
      hardened_path: 'm/84h/1h/0h',
      xprv: 'tprv8gLvNdxSpyHqHdcbCq4pDsfofb2LGze3tfsGmGn49xweYerU7CEo2rM19CBQZLRvjcispC7Uwoe6chcRHe25bhZxaxY5AcRab97jmX2FjNx',
      xpub: 'tpubDD2xX3zgyLyWB6eP6UjQdHKvEcYGSKpxTyU43npMaEk3P97Ejb4PDLxsKL4VTnUg5hNgmRu4VkRJvC4UkjgN8YeuMgTePaZ7ezP6i6RAHsG'
    };
    const bob_master: MasterKey = {
      fingerprint: '0bded976',
      mnemonic: 'wood snack erupt evoke snack runway nominee airport worth coach melody doll leopard normal sample happy remember outside speak road icon response dentist naive',
      xprv: 'tprv8ZgxMBicQKsPfCtoMPoTUy2tCLE6CBso44ySfJh1VdwFvPY38FFqsaJAZUHMcCpxXarmmRih5LbkrTbiTMKpRY6JWpdjGACWyiv4Bj4z5bQ'
    };
    const bob_child: ChildKey = {
      fingerprint: '0bded976',
      hardened_path: 'm/84h/1h/0h',
      xprv: 'tprv8g1pUkJgqxS9Yg87RuhhLStsK3hRDhaKUXisBA1Yw9KeuhR2GTsAqBrhHSPk4eWvZpWe7iwxFGNrrMW5ywyE3ukw8yWMbW6Za5n7cXricBc',
      xpub: 'tpubDChrdALvzL7pS99uKZNHjrYyt5DMP2mE3qKeTg3rMR83kBfntrgm1gUZTbBVnKw81mfKjWeYvrofxgd77no1YcMh8TTjxhUuroFQucxK14j'
    };
    const descriptor: string = 'wsh(multi(2,[64b8d0b1/84h/1h/0h]tpubDD2xX3zgyLyWB6eP6UjQdHKvEcYGSKpxTyU43npMaEk3P97Ejb4PDLxsKL4VTnUg5hNgmRu4VkRJvC4UkjgN8YeuMgTePaZ7ezP6i6RAHsG/*,[0bded976/84h/1h/0h]tpubDChrdALvzL7pS99uKZNHjrYyt5DMP2mE3qKeTg3rMR83kBfntrgm1gUZTbBVnKw81mfKjWeYvrofxgd77no1YcMh8TTjxhUuroFQucxK14j/*))';
    const expected_address0 = "tb1qu4p4vqr2n3hc02yjx20quu4qg99wkqj378lzq6tp2m3572ad54psvtpqc8"

    it("GENERATES an ADDRESS from a Multi-Sig descriptor AT INDEX 0", async function () {
      const response = getAddress(descriptor, 0) as WalletAddress;
      expect(response.address).to.equal(expected_address0);
    });
    it("SYNCS BALANCE of a Multi-Sig descriptor", async function () {
      const response = syncBalance(descriptor, NodeAddress.Default) as WalletBalance;
      console.log(response)
      expect(response.balance).to.be.greaterThan(0);
    });
    it("SYNCS HISTORY of a Multi-Sig descriptor", async function () {
      const response = syncHistory(descriptor, NodeAddress.Default) as WalletHistory;
      console.log(response)
      expect(response.history[0]).to.have.property("txid");
    });

  });
});

// ------------------ '(◣ ◢)' ---------------------

