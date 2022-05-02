// CAREFUL:::RUN THIS MANUALLY
// delete all auth users excpet adm1n who don't have profiles

db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');

let auth_usernames = db.auths.find({},{username:1,_id:0}).toArray().map(item=>item.username);
let profile_usernames = db.profiles.find({username:{$in: auth_usernames}}, {username:1, _id:0}).toArray().map(item=>item.username);
let keyed_usernames = db.keys.find({username:{$in: auth_usernames}}, {username:1, _id:0}).toArray().map(item=>item.username);

// profile_usernames.push("adm1n");

// This check is not sufficient to check array equality
// CHECK MANUALLY
if(profile_usernames.length === keyed_usernames.length){

  db.keys.remove( { username : { $nin: profile_usernames } } )

  db.profiles.remove( { username : { $nin: profile_usernames } } )

  db.auths.remove( { username : { $nin: profile_usernames } } )

}
