#!/bin/bash -e

perl -i -pe"s/--dry-run/--force-renewal/g" docker-compose.yaml

# Create default.conf nginx using pre.conf
REPO="$(dirname $(dirname $(pwd)))"
NGINX_CONF="$REPO/infra/nginx/prod/nginx-conf"
cat $NGINX_CONF/pre
cp $NGINX_CONF/pre $NGINX_CONF/default.conf
# Run docker-compose up to aquire SSL certificates
docker-compose up -d
# Run docker-compose down
docker-compose down
