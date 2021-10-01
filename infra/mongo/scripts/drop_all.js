
db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');

db.auths.drop()
db.profiles.drop()
db.posts.drop()
db.keys.drop()


