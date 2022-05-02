#!/bin/bash -e

echo "
──────╔╗────────╔═╦╗
╔═╦╦╦═╣╚╦═╦╦╦═╦═╣═╣╚╗
║═╣║║╬║║║╩╣╔╣╬║╬╠═║╔╣
╚═╬╗║╔╩╩╩═╩╝║╔╩═╩═╩═╝
──╚═╩╝──────╚╝";

printf "\n"

echo "Cypherpost can be run as a public or private server."
echo "A public server requires payment for spam protection. A private server requires a secret invitation code.";
echo "Would you like to setup as a (pub)lic or (priv)ate server?"

read -r server_type
printf "\n"

if [[ $server_type == *"priv"* ]] || [[ $server_type == *"PRIV"* ]] ; then
  echo "[*] Setting up as a private server."
  # echo "Choose an admin password to encrypt your invitation code."
  # read -p "Enter password: " -s admin_password
  # printf "\n"
  # read -p "Confirm password: " -s admin_password_confirm
  # printf "\n"

  # if [[ $admin_password != $admin_password_confirm ]]; then
  #   echo "[x] Passwords do not match."
  #   echo "[x] Exiting."
  #   exit;
  # fi

  if [[ $(uname) == "Darwin" ]]; then
    SECRET=$(echo -n test | md5 );
    # PHASH=$(echo $admin_password | shasum -a 256)
  else
    SECRET=$(echo -n test | md5sum | cut -d' ' -f1 );
  fi
  echo "[!] Use the following code to invite members to your cypherpost server: $SECRET"
  # SECRET=$(echo $SECRET | openssl aes-256-cbc -nopad -a -k $PHASH 2> /dev/null)
  # The above errors due to nopad
  # Currently works, but needs to be looked into later
else
  server_type="public"
  SECRET="public"
  echo "Path to your cyphernode gatekeeper:"
  read -r CN_GATEKEEPER
  printf "\n"
  echo "[x] Copying gatekeeper certs for application."
  cp -r $CN_GATEKEEPER/certs ~/.keys
  cp -r $CN_GATEKEEPER/keys.properties ~/.keys
  echo "[*] Setting up as public server."
fi

TYPE=$server_type
REPO="$(dirname $(dirname $(pwd)))"
REPO_APP="$REPO/app"
echo "[*] Using $REPO_APP as path to development codebase."

mkdir -p ~/.keys 2> /dev/null
openssl genrsa -out ~/.keys/sats_sig.pem 4096 2> /dev/null
openssl rsa -in ~/.keys/sats_sig.pem -outform PEM -pubout -out $HOME/.keys/sats_sig.pub 2> /dev/null
echo "[*] Generated new server signing keys."

MY_DOMAIN_NAME="localhost"
REPO_NGINX_CONF="$REPO/infra/nginx/dev/nginx-conf"
rm -rf "$REPO_NGINX_CONF/default.conf"
cp "$REPO_NGINX_CONF/template.conf" "$REPO_NGINX_CONF/default.conf" 
perl -i -pe"s/___DOMAIN___/$MY_DOMAIN_NAME/g" "$REPO_NGINX_CONF/default.conf"
echo "[*] Created nginx default.conf with $MY_DOMAIN_NAME as hostname."

rm -rf .env
touch .env
chmod +r .env

echo "COMPOSE_PROJECT_NAME=cypherpost-dev" >> .env
S=$(echo "SECRET=$SECRET" | perl -pe '~ s/^\s+|\s+$//g') 
echo $S > .env
echo "REPO=$REPO_APP" >> .env
echo "KEYS=$HOME/.keys" >> .env
echo "TYPE=$TYPE" >> .env
  
echo "[!] Adjuisting permissions! Requires sudo."

sudo chown -R $(whoami):1000 ~/.keys
sudo chmod -R 770 ~/.keys

echo "[*] SETUP COMPLETE!"
