# cypherpost.io

## Note: This project is in extreme BETA and actively looking for community support. We see this project forming a basis for privacy respecting social networks; if this is something you are interested in, please reach out.

A private, end-to-end encrypted social network to selectively post ads and messages to members of a trusted network.

- Each post is encrypted with new private key.
- Server can't decrypt this posts
- Posts can be decrypted by people you are trusting.
- Conatct info under profile page is encrypted. Only people you trust can decrypt it.
- Ability to trust/untrust
- List of people you are trusting is not encrypted. Anyone can see who is trusting whome.

BIP39 key generation & BIP32 key derivation is used for portable end-to-end encryption; to allow users to recover their accounts on any device without the need to maintain a master device holding a non-human readable master key.

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
