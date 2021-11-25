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