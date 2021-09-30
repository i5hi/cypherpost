
db = db.getSiblingDB('cypherpost')
db.auth('cp','secret');

db.profiles.drop()
db.pins.drop()
db.tfas.drop()
db.sessions.drop()
db.solos.drop()


