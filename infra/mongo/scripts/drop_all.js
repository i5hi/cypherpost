
db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');

db.identities.drop()
db.badges.drop()
db.preferences.drop()
db.profiles.drop()
db.posts.drop()

db.profile_keys.drop()
db.post_keys.drop()
