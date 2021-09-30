db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');


const admin_user = {
  "username": "adm1n",
  // password-plaintext = supersecret
  // client submits <username:sha256(password-plaintext)>
  // server stores <sha256(username:sha256(password-plaintext))>
  "pass256": "9e82c38d12df93cf255fd44225932b2da481a40e455342d76f4b27374e3808b9",
  "seed256": "83f249debd6b32f6601a37d87ce4c23a628cb66809e7440d5a0c80d3c011ae67",
  "genesis": Date.now(),
  "uid": "s5idAdmin",
  "invited_by": "satoshi",
  "verified": true,
  "invite_codes": ["brijbala","sushidog","gaiagard"]
};

db.auths.insertOne(admin_user)