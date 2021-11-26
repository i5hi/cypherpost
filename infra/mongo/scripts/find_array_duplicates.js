  db = db.getSiblingDB('cypherpost')
  db.auth('cp','secret');

  usernames = db.auths.find({},{username:1,_id:0}).toArray().map(item=>item.username);

  usernames.map((username)=>{
    let dups = db.keys.find(username).toArray().map(item=>item.key);

  })

  // Find duplicates in profile_keys
  profile_key_dups = db.keys.aggregate([
    {
      "$project": {"profile_keys":1, username: 1}
    },
    {
      "$unwind":"$profile_keys"
    },
    {
      "$group": {
        "_id":{
          "username":"$username", 
          "pkid":"$profile_keys.id"
        }, 
        "count":{"$sum":1}
      }
    },
    {
      "$match": {"count":{"$gt":1}}
    },
    {
      "$group": {
        "_id": "$_id.username", 
        "profile_ids":{"$addToSet":"$_id.pkid"},
        "count":{"$addToSet":"$count"}
      }
    }
  ]);


  // Find duplicates in recipient_keys
  recipient_key_dups = db.keys.aggregate([
    {"$project": {"recipient_keys":1, username: 1}},
    {"$unwind":"$recipient_keys"},
    {"$group": {"_id":{"username":"$username", "rkid":"$recipient_keys.id"}, "count":{"$sum":1}}},
    {"$match": {"count":{"$gt":1}}},
    {"$group": {"_id": "$_id.username", "recipient_ids":{"$addToSet":"$_id.rkid"}, "count":{"$addToSet":"$count"}}}
  ]);

  let u = {username:"ravi"};
  db.keys.update(u,{ $pull: { recipient_keys: {id:"vmd"}} })
  db.keys.update(u,{ $pull: { profile_keys: {id:"ravi"}} })

  u = {username: "ishi"};
  db.keys.update(u,{ $pull: { recipient_keys: {id:"vmd"}} })
  db.keys.update(u,{ $pull: { profile_keys: {id:"ishi"}} })

  let username = "vmd";
  db.keys.update({username},{ $pull: { recipient_keys: {id:"ravi"}} })

  username = "ada";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "honkadonka";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "rockstar";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "nhub";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "bogha";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "eaten";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "vivek4real";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "koalamanboy";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "jantesan";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  username = "sushi";
  db.keys.update({username},{ $pull: { profile_keys: {id:username}} })

  db.profile.update(
    { username: id },
    { $pull: { 'trusting': { username: 'ishi' } } }
  );

  db.profile.update(
    { _id: id },
    { $pull: { 'trusting': { username: 'ravi' } } }
  );

  db.profile.update(
    { _id: id },
    { $pull: { 'trusting': { username: 'vmd' } } }
  );