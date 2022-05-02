#!/bin/bash -e
perl -i -pe"s/--force-renewal/--dry-run/g" docker-compose.yaml

REPO="$(dirname $(dirname $(pwd)))"
NGINX_CONF="$REPO/infra/nginx/prod/nginx-conf"
cp $NGINX_CONF/post $NGINX_CONF/default.conf

# Re-run docker-compose up
docker-compose -p "cypherpost-production" up -d