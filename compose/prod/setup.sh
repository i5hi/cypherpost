#!/bin/bash -e

echo "
──────╔╗────────╔═╦╗
╔═╦╦╦═╣╚╦═╦╦╦═╦═╣═╣╚╗
║═╣║║╬║║║╩╣╔╣╬║╬╠═║╔╣
╚═╬╗║╔╩╩╩═╩╝║╔╩═╩═╩═╝
──╚═╩╝──────╚╝";

printf "\n"

if test -f .env; then
    echo "[!] .env file exists"
    cat .env
    echo "Would you like to reconfigure setup? (Y/n)"
    read -r reconfigure
    if [[ $reconfigure == "n" ]]; then
      exit;
    fi
fi

echo "Cypherpost can be run as a public or private server."
echo "As a spam protection measure, public servers requires payment and private servers require a secret invitation code.";
echo "Which server type would you prefer? (PUB/priv)"
read -r TYPE
printf "\n"

echo "At what domain name would you like to host cypherpost on?"
read -r MY_DOMAIN_NAME
printf "\n"

echo "Provide an email at which you will recieve notifications regarding your SSL certificate."
read -r EMAIL
printf "\n"

echo "We will now setup directories on your host which will be used as volumes with each container."
echo "You will only need to provide the parent directory. We will check if child directories for each contianer exists. If not we will create them."
echo "Provide a full path to parent directory for container volumes:"
read -r VOLUMES_PARENT_DIR
printf "\n"

if [[ "$VOLUMES_PARENT_DIR" == */ ]]; then
  VOLUMES_PARENT_DIR=${VOLUMES_PARENT_DIR%?}
fi
NODE_VOLUME="$VOLUMES_PARENT_DIR/node"
MONGO_VOLUME="$VOLUMES_PARENT_DIR/mongo"
CERTS_VOLUME="$VOLUMES_PARENT_DIR/certs"

mkdir -p "$NODE_VOLUME/.keys" 2> /dev/null
mkdir -p "$NODE_VOLUME/winston" 2> /dev/null
mkdir -p "$MONGO_VOLUME/data/db" 2> /dev/null
mkdir -p "$MONGO_VOLUME/configdb" 2> /dev/null
mkdir -p "$CERTS_VOLUME" 2> /dev/null

echo "[*] Container volume parent directories are setup."
printf "\n"

if [[ -f "$CERTS_VOLUME/dhparam.pem" ]]; then
    echo "[*] DHParam exists for nginx server."
else
  openssl dhparam -out "$CERTS_VOLUME/dhparam.pem" 2048
  echo "[*] DHParam setup for nginx server."
fi

if [[ $TYPE == *"priv"* ]] || [[ $TYPE == *"PRIV"* ]] ; then
  if [[ $(uname) == "Darwin" ]]; then
    SECRET=$(echo $RANDOM | md5 );
  else
    SECRET=$(echo $RANDOM | md5sum |  cut -d' ' -f1);
  fi
  echo "[*] Setting up as a private server."
  echo "[!] Use the following secret to invite members to your cypherpost server: $SECRET"
else
  TYPE="public"
  SECRET="public"
  echo "[*] Setting up as public server."
fi

sudo openssl genrsa -out $NODE_VOLUME/.keys/sats_sig.pem 4096
sudo openssl rsa -in $NODE_VOLUME/.keys/sats_sig.pem -outform PEM -pubout -out $NODE_VOLUME/.keys/sats_sig.pub
echo "[!] Giving node container GUI 1300 permission to use response signing keys."
sudo chown -R $(whoami):1300 $NODE_VOLUME
sudo chmod -R 770 $NODE_VOLUME
echo "[*] Generated new server signing keys."

## NGINX CONFIG
REPO="$(dirname $(dirname $(pwd)))"
REPO_NGINX_CONF="$REPO/infra/nginx/prod/nginx-conf"

rm -rf "$REPO_NGINX_CONF/pre" "$REPO_NGINX_CONF/post"

cp "$REPO_NGINX_CONF/pre_template" "$REPO_NGINX_CONF/pre" 
perl -i -pe"s/___DOMAIN___/$MY_DOMAIN_NAME/g" "$REPO_NGINX_CONF/pre"

cp "$REPO_NGINX_CONF/post_template" "$REPO_NGINX_CONF/post" 
perl -i -pe"s/___DOMAIN___/$MY_DOMAIN_NAME/g" "$REPO_NGINX_CONF/post"

echo "[*] Created nginx pre & post conf files with $MY_DOMAIN_NAME as hostname."


# CREATE DB PASSWORD IN A .secrets file
# If secrets file exists, use it to add DB creds to .env
# If secrets files !exists, create it and add DB creds to .env
if [[ -f .secrets.json ]]; then
    echo "[*] DB secrets are already set."
    DB_USER=$(cat .secrets.json | jq -r "db_user")
    DB_PASS=$(cat .secrets.json | jq -r "db_pass")
    INITDB_NAME=$(cat .secrets.json | jq -r "initdb_name")
    INITDB_ROOT_USER=$(cat .secrets.json | jq -r "initdb_root_user")
    INITDB_ROOT_PASS=$(cat .secrets.json | jq -r "initdb_root_pass")
  else
    echo "[!] Database secrets are about to be generated in a .secrets.json file"
    echo "[!] Once set, this can only be changed manually via mongo shell."
    echo "[!] Store it on a local (at home) encrypted medium for recovery."

    printf "\n"
    read -p "Continue? (y/N)" -n 1 -r
    echo    # (optional) move to a new line
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
    INITDB_ROOT_PASS=$(echo $RANDOM$RANDOM$RANDOM$RANDOM$RANDOM$RANDOM$RANDOM$RANDOM | md5 )
    DB_PASS=$(echo $RANDOM$RANDOM$RANDOM$RANDOM$RANDOM | md5 )
    jq -n --arg DB_PASS "$DB_PASS" --arg INITDB_ROOT_PASS "$INITDB_ROOT_PASS" '{initdb_name: "cypherpost", initdb_root_user: "admin", initdb_root_pass: $INITDB_ROOT_PASS, db_user: "cp", db_pass: $DB_PASS}' > .secrets.json
    INITDB_NAME="cypherpost"
    INITDB_ROOT_USER="admin"
    DB_USER="cp"
    echo "[*] Created DB secrets"

fi

perl -i -pe"s/___USER___/$DB_USER/g" ../../infra/mongo/docker-entrypoint-initdb.d/init-mongo.js
perl -i -pe"s/___PWD___/$DB_PASS/g" ../../infra/mongo/docker-entrypoint-initdb.d/init-mongo.js

touch .env
echo "COMPOSE_PROJECT_NAME=cypherpost-prod" >> .env
echo "REPO=$REPO/app" > .env
echo "KEYS=$HOME/.keys" >> .env
echo "TYPE=$TYPE" >> .env
echo "SECRET=$SECRET" >> .env
echo "DOMAIN=$MY_DOMAIN_NAME" >> .env
echo "EMAIL=$EMAIL" >> .env
echo "NODE_VOLUME=$NODE_VOLUME" >> .env
echo "MONGO_VOLUME=$MONGO_VOLUME" >> .env
echo "CERTS_VOLUME=$CERTS_VOLUME" >> .env
echo "INITDB_NAME=$INITDB_NAME" >> .env
echo "INITDB_ROOT_USER=$INITDB_ROOT_USER" >> .env
echo "INITDB_ROOT_PASS=$INITDB_ROOT_PASS" >> .env
echo "DB_USER=$DB_USER" >> .env
echo "DB_PASS=$DB_PASS" >> .env

echo "[*] SETUP COMPLETE! VERIFY YOUR ENVIRONMENT VARIABLES."
cat .env
echo "[!] Make sure your domain name points to this server's IP."
echo "[!] Run issue_ssl.sh OR start.sh directly if you have ssl certs issued."