# cypherpost

## A centralized, encrypted data store, enabling client-side applications that require end-to-end encryption and selective visibility of content.

- Your identity on the platform is a `username:pubkey`
- All your posts are encrypted custom json strings.
- Posts can be decrypted only by the identities you give visibility to.
- You give identities visibility by sharing decryption keys with them.
- ECDSA Shared Secrets are used per identity, to encrypt decryption keys in transit.
- Badges form a reputation system and help build a trusted network.
- Value of badges are subjective and based on who the givers are.
- Issuance of badges can be verified by all clients
=======

### cypherpost can be run either as a `PUBLIC` or `PRIVATE` server. 

Running a public cypherpost instance requires attachment to `cyphernodeappsnet` to access payment facilities via `cyphernode`.

Public servers have no other means of protecting from spam, since neither email or phone number is required to register an account. Users are permitted to use the service for 30 days with 0 conf payment; holding a `PARTIAL` verification status, after which they willl have to either bump the fee on their transaction or wait until their payment if confirmed to continue using the service.

Private servers generate an `invite code` during server setup. This code is required during client registration to maintain a closed network. Private servers can be run stand-alone without the need of payment facilites.

#### Public Server LIVE at https://cypherpost.io/api/v2

#### Reference client UNDER CONSTRUCTION at https://cypherpost.io.

![cypherpost](design/assets/owl.png)

## Manual Development Environment 

You must have npm installed.
To get the latest version of npm visit: https://nodejs.org/en/

### Install typescript
```bash
sudo npm i -g typescript
```
### Clone repo
```bash
git clone git@github.com:StackmateNetwork/cypherpost.git
```

### Install server dependencies and compile TS code
```bash
cd cypherpost/app
npm i
tsc

# If changes are made to any .ts file, run tsc again and restart container
```

### Install client dependencies and compile browser JS code
```bash
cd src/services/client/public/js
npm i
cd ..
./compile.bash

# compile.bash compiles each client side js module into  *_bundle.js files containing all dependency code
# If changes are made to any files in public/js, run compile.bash again
```

### Add localhost to /etc/hosts to access client on the browser as localhost
```bash
echo "::1     localhost" | sudo tee -a /etc/hosts
```

#### NOTE: MAC users will need to use Docker Desktop <= v4.5 and disable gRPC File Sharing in Preferences for volume mounting to work. Unfortunately you will have to bare with that annoying `!` on your taskbar icon.

#### NOTE: SETUP DEV ENVIRONMENT AS PRIVATE SERVER (PUBLIC SERVER WILL FAIL TESTS WITH 402:Payment Required). Tests for public server with payment is still under development.

## Development Scripts

### SETUP:
```bash
# setup dev compose environment
cd ../../../../../compose
./setup.sh
# Follow the instructions.
```

### START & TEST
```bash
./start.sh
./test.sh
```

#### You can now access the reference client on `localhost` in your browser.

#### NOTE: The development client does not work on Safari. Use Firefox or Chromium.

### STOP
```
./stop.sh
```

## Docker Helpers
```bash
# to stop all containers
docker-compose -f dev-compose.yaml down
```

```bash
# if changes made to Dockerfiles - rebuild all containers
docker-compose -f dev-compose.yaml up -d --build --force-recreate
```

```bash
# rebuild single container : eg. node
docker-compose -f dev-compose.yaml up -d --build --force-recreate --no-deps node
```

```bash
# for errors related to volumes
./delete_volumes.sh
```

```bash
# log node
docker logs -f application
# log nginx
docker logs -f server
# log mongo
docker logs -f database
```

```bash
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
docker exec -it database mongo

use cypherpost
db.auth('cp','secret')
db.identities.find().pretty()
db.badges.find().pretty()
db.posts.find().pretty()
db.post_keys.find().pretty()
# Checkout infra/mongo/scripts for more.
```

## Pier Environment

Pier tries to make sure you never have to cd between folders while working to setup test and update the environment.

Always stay in the root directory with pier.toml, for pier to work. If you move to another folder, pier will not work.

Install pier

```
cargo install pier
```

In the root folder run `pier list` to view all possible commands.

To use a command run `pier run <command> <args>` eg: `pier run dev-start`
