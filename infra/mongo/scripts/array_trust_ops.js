db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');

let q = {username: "ravis"};

// let up = { $push: {trusted_by: {username:"sushi"}} };

// db.profiles.updateOne(q,up);

let pull_entry_recipient = {
  "key" : "xpub6FfLCLh6Dzhf57o2WcjXbc1RsC9SQuHUE67fQuXg1jHVXnCgJsuyXge745GUTrcWmowtXyybqjR4TjpLarvPyUN2yYynyG1pbW6zjFAv73U",
  "id" : "ravis",
  "signature" : "later"
}

let pull_entry_profile = {
  "key" : "0fcb452f751c78f2c3adcb43779ee247:MVcEzQDtptntAN+WaAnBk5YGOcTTa9QBvCMzxemTNtQMe1j812CghhCWLuJ6PfdD54ebImEc0WgTzkSeLAXaxP5tsqGS1yG6L3ck1EGd9gQ=",
  "id" : "sushi"
};

let up2 = { $pull: {profile_keys: {id: "sushi"}}};
let up3 = { $push: {profile_keys: pull_entry_profile}}
db.keys.updateOne(q,up2)
db.keys.updateOne(q,up3)