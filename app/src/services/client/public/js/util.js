const PROFILE = "PROFILE";
const PREFERENCES = "PREFERENCES";
const TRADE = "BITCOIN-TRADE";

const crypto = require("crypto");
const bitcoin = require("./bitcoin");

function verifyBadges(badges) {
  const bad_badges = badges.filter((badge) => {
    const message = `${badge.giver}:${badge.reciever}:${badge.type}:${badge.nonce}`;
    const verify = bitcoin.verify(message, badge.signature, badge.giver);
    if (!verify) {
      console.error("BADGE SIGNATURE FAILED:");
      console.error({ badge });
      return badge;
    };
  });
  if (bad_badges.length > 0) return { bad_badges };
  return true;
}
function mergeIdentitiesWithBadges(identities, badges) {
  return identities.map((identity) => {
    const recieved = badges.filter(badge => badge.reciever === identity.pubkey);
    const given = badges.filter(badge => badge.giver === identity.pubkey);

    return { ...identity, badges:  {given, recieved}  };
  });
}

function decryptCypherPostsFromOthers(identity_parent, posts_from_others) {
  let plain_json_posts = [];
  posts_from_others.map((post) => {
    const my_ecdsa = bitcoin.extract_ecdsa_pair(identity_parent);
    const shared_ecdsa_pair = {
      privkey: my_ecdsa.private_key,
      pubkey: post.owner
    };
    const shared_secret = bitcoin.calculate_shared_secret(shared_ecdsa_pair);
    // ASSUMING post.decryption_key is valid aes 256 cipher text.
    const primary_key = decrypt(post.decryption_key, shared_secret);
    const plain_json = decrypt(primary_key, post.cypher_json);
    JSON.parse(plain_json) ? plain_json_posts.push({ ...post, plain_json: JSON.parse(plain_json_string) })
      : null;
  });
  return plain_json_posts;
}
function segregatePlainPostsForMe(plain_json_posts) {
  return {
    profiles: plain_json_posts.filter(post => post.type === PROFILE),
    trades: plain_json_posts.filter(post => post.type === TRADE),
  }
}

function decryptMyCypherPosts(cypherpost_parent, my_posts) {
  let plain_json_posts = [];
  my_posts.map((post) => {
    const decryption_key = crypto.createHash("sha256")
      .update(bitcoin.derive_hardened_str(cypherpost_parent, post.derivation_scheme).xprv)
      .digest("hex");
    const plain_json_string = decrypt(decryption_key, post.cypher_json);
    JSON.parse(plain_json_string)
      ? plain_json_posts.push({ ...post, plain_json: JSON.parse(plain_json_string) })
      : null;
  });
  return plain_json_posts;

}

function segregateMyPlainPosts(plain_json_posts) {
  return {
    profiles: plain_json_posts.filter(post => post.type === PROFILE),
    trades: plain_json_posts.filter(post => post.type === TRADE),
    preferences: plain_json.filter(post => post.type === PREFERENCES),
  }
}

async function createRootKeyChain(mnemonic) {
  try {
    const seed_root = await bitcoin.seed_root(mnemonic);
    console.log({seed_root})
    const cypherpost_parent = bitcoin.derive_parent_128(seed_root);
    const keys = {
      cypherpost: cypherpost_parent.xprv,
      identity: bitcoin.extract_ecdsa_pair(bitcoin.derive_identity_parent(cypherpost_parent.xprv))
    };
    return keys;
  }
  catch (e) {
    console.error({ e });
    return e;
  }
}

// IF PROFILE IS NOT ROTATED, SERVER MUST ALLOW UPDATING POST_ID for KEYS
function createCypherJSON(cypherpost_parent, derivation_scheme, rotate, json) {
  try {
    const updated_ds = (rotate)
      ? rotatePath(derivation_scheme)
      : derivation_scheme;

    const primary_key = createPrimaryKey(cypherpost_parent, updated_ds);
    const cypher_json = encrypt(primary_key, JSON.stringify(json));
    return cypher_json;
  }
  catch (e) {
    console.error({ e });
    return e;
  }
};

function rotatePath(derivation_scheme) {
  if (!derivation_scheme.startsWith("m/")){
    return new Error("Derivation scheme must start with m/");
  }
  if (!derivation_scheme.endsWith("/")) derivation_scheme += "/";
  derivation_scheme = derivation_scheme.replace("'", "h").replace("'", "h").replace("'", "h");
  derivation_scheme = derivation_scheme.replace("m/", "");

  if (derivation_scheme.split("h/").length < 3) return new Error("Derivation scheme must contain 3 sub paths.");

  const use_case = parseInt(derivation_scheme.split("h/")[0]);
  const index = parseInt(derivation_scheme.split("h/")[1]);
  const revoke = parseInt(derivation_scheme.split("h/")[2]);

  return `m/${use_case}h/${index + 1}h/${revoke}h`;
}

function createPrimaryKey(cypherpost_parent, derivation_scheme) {
  crypto.createHash("sha256")
    .update(bitcoin.derive_hardened_str(cypherpost_parent, derivation_scheme).xprv)
    .digest("hex");
}

function createDecryptionKeys(identity_parent, primary_key, pubkeys) {
  let decryption_keys = [];
  pubkeys.map((pubkey) => {
    const my_ecdsa = bitcoin.extract_ecdsa_pair(identity_parent);
    const shared_ecdsa_pair = {
      privkey: my_ecdsa.private_key,
      pubkey
    };
    const shared_secret = bitcoin.calculate_shared_secret(shared_ecdsa_pair);

    const decryption_key = {
      reciever: pubkey,
      decryption_key: encrypt(primary_key, shared_secret)
    };
    decryption_keys.push(decryption_key);
  });
  return decryption_keys;
}

function usernamesToPubkeys(usernames, identities){
  return usernames.map((username)=>{
    const identity = identities.find(identity => identity.username === username);
    return identity.pubkey;
  });
}

module.exports = {
  verifyBadges,
  mergeIdentitiesWithBadges,
  decryptCypherPostsFromOthers,
  segregatePlainPostsForMe,
  decryptMyCypherPosts,
  segregateMyPlainPosts,
  createRootKeyChain,
  createCypherJSON,
  rotatePath,
  createPrimaryKey,
  createDecryptionKeys,
  usernamesToPubkeys

}