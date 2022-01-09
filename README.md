# cypherpost

## A centralized encrypted data store, enabling client-side applications that require end-to-end encryption and selective visibility of content.

- Your identity on the platform is a `username:pubkey`
- All your posts are encrypted custom json strings.
- Posts can be decrypted only by the identities you give visibility to.
- You give identities visibility by sharing decryption keys with them.
- ECDSA Shared Secrets are used per identity, to encrypt decryption keys in transit.
- Badges form a reputation system and help build a trusted network.
- Value of badges are subjective and based on who the givers are.
- Badges include: Trusted, VerifiedInPerson & Scammer
- Your identity, badges given & recieved and number of live posts are public.
- At any point in time, a dump of the entire server can be taken and continued with new history by anyone.

### Server LIVE at https://cypherpost.io/api/v2

### Reference client UNDER CONSTRUCTION at https://cypherpost.io.

![cypherpost](design/assets/owl.png)

## Run on localhost

```bash
# PULL REPO TO YOUR HOME FOLDER

# add node_modules and compiled ts code in dist
cd ~/cypherpost/app
npm i
tsc
// If changes are made to any .ts file, run tsc again and restart container

# create signing keys
openssl genrsa -out ~/.keys/sats_sig.pem 2048
openssl rsa -in ~/.keys/sats_sig.pem -outform PEM -pubout -out $HOME/.keys/sats_sig.pub

# compile front-end js
cd ~/cypherpost/app/src/services/client/public
# compile.bash compiles each client side js module into  *_bundle.js files containing all dependency code
./compile.bash

# If changes are made to any files in public/js, run compile.bash again

# start containers
cd ~/cypherpost/compose
docker-compose -f dev-compose.yaml up -d

# to stop all containers
docker-compose -f dev-compose.yaml down

# if changes made to Dockerfiles -  rebuild all containers
docker-compose -f dev-compose.yaml up -d --build --force-recreate

# rebuild single container : node
docker-compose -f dev-compose.yaml up -d --build --force-recreate --no-deps node

# for errors related to volumes
bash delete_volumes.sh

# you might have to add localhost to /etc/hosts
echo "::1     localhost" | sudo tee -a /etc/hosts

# log node
docker logs -f application
# log nginx
docker logs -f server
# log mongo
docker logs -f database

# restart a container
docker restart application

```

## Run tests

```bash
# Integration test
docker exec -it application sh -c "npm test"

# Unit tests
docker exec -it application sh -c "bash units.bash"

```

## Inspect Database

```bash
# to initialize with genesis user
docker exec -it database sh -c "mongo scripts/genesis.js"

docker exec -it database mongo

use cypherpost
db.auth('cp','secret')
db.auths.find().pretty()
db.keys.find().pretty()
db.profiles.find().pretty()
db.posts.find().pretty()

# to insert a document
let doc = {
  "username": "ravi",
  "pass256": "somepass256"
};
db.auths.insert(doc)

# to update a document
# !! ALWAYS USE $set !!
# IF NOT, IT WILL REPLACE RATHER THAN UPDATE

let query = {
  "username": "ravi"
}
let update = {
  $set:{
    "pass256": "newPass256"
  }
}

db.auths.updateOne(query,update)

# Checkout infra/mongo/scripts for more.

```
