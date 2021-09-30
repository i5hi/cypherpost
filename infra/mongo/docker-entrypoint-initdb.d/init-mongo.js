db = db.getSiblingDB('cypherpost')
db.createUser({
  user: "cp",
  pwd: "secret",
  roles: [{
    role: "readWrite",
    db: "cypherpost"
  }]
})


db = db.getSiblingDB('admin')
db.shutdownServer()
