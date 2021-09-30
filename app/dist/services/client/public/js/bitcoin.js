var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var bip32 = require("bip32");
var bip39 = require("bip39");
var _a = require("crypto"), createECDH = _a.createECDH, ECDH = _a.ECDH;
function generate_mnemonic() {
    return bip39.generateMnemonic();
}
function seed_root(mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var seed, master_key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic)];
                case 1:
                    seed = _a.sent();
                    master_key = bip32.fromSeed(seed);
                    return [2 /*return*/, master_key.toBase58()];
            }
        });
    });
}
// Store result encrypted in localStorage with sha256(uname:pass)
function derive_parent_128(root_xprv) {
    var master_key = bip32.fromBase58(root_xprv);
    var parent_key = master_key.derivePath("m/128'/0'");
    var extended_keys = {
        xpub: parent_key.neutered().toBase58(),
        xprv: parent_key.toBase58(),
    };
    return extended_keys;
}
// usecase:0 (recipient)
// usecase:1 (profile)
// usecase:2 (posts)
// Store result on login in sessionStorage as plaintext
function derive_parent_usecase(parent_128_xprv, use_case) {
    var parent_key = bip32.fromBase58(parent_128_xprv);
    var child_key = parent_key.deriveHardened(use_case);
    var extended_keys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
    };
    return extended_keys;
}
function derive_child_indexes(use_case_parent, index, revoke) {
    var parent_key = bip32.fromBase58(use_case_parent);
    var child_key = parent_key.deriveHardened(index).deriveHardened(revoke);
    var extended_keys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
    };
    return extended_keys;
}
function derive_child(parent, index) {
    var parent_key = bip32.fromBase58(parent);
    var child_key = parent_key.derive(index);
    var extended_keys = {
        xpub: child_key.neutered().toBase58(),
        xprv: child_key.toBase58(),
    };
    return extended_keys;
}
/*
{
  xprv,
  xpub
}
*/
function extract_ecdsa_pair(extended_keys) {
    // const parent_key = bip32.fromBase58(extended_keys.xprv);
    return {
        private_key: bip32.fromBase58(extended_keys.xprv).privateKey.toString("hex"),
        public_key: bip32.fromBase58(extended_keys.xpub).publicKey.toString("hex")
    };
    // return ecdsa_keys;
}
function calculate_shared_secret(local_private_key, remote_public_key) {
    var type = "secp256k1";
    var curve = createECDH(type);
    curve.setPrivateKey(local_private_key, "hex");
    // let cpub = curve.getPublicKey("hex","compressed");
    var shared_secret = curve.computeSecret(remote_public_key, "hex");
    return shared_secret.toString("hex");
}
function deriveSecretKey(privateKey, publicKey) {
    var imported_pub = window.crypto.subtle.importKey('raw', hex2Arr(publicKey), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, true, []);
    var imported_priv = window.crypto.subtle.importKey('raw', hex2Arr(privateKey), {
        name: 'ECDH',
        namedCurve: 'P-256'
    }, true, []);
    var type = "secp256k1";
    var curve = createECDH(type);
    curve.setPrivateKey(privateKey, "hex");
    var shared_secret = curve.computeSecret(publicKey, "hex");
    return shared_secret.toString("hex");
}
var hex2Arr = function (str) {
    if (!str) {
        return new Uint8Array();
    }
    var arr = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        arr.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(arr);
};
var buf2Hex = function (buf) {
    return Array.from(new Uint8Array(buf))
        .map(function (x) { return ('00' + x.toString(16)).slice(-2); })
        .join('');
};
module.exports = {
    generate_mnemonic: generate_mnemonic,
    seed_root: seed_root,
    derive_parent_128: derive_parent_128,
    derive_parent_usecase: derive_parent_usecase,
    derive_child_indexes: derive_child_indexes,
    extract_ecdsa_pair: extract_ecdsa_pair,
    calculate_shared_secret: calculate_shared_secret,
    deriveSecretKey: deriveSecretKey
};
//# sourceMappingURL=bitcoin.js.map