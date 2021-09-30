#!/bin/bash

cd $HOME/cypherpost/compose

CONFIG="$HOME/cypherpost/infra/nginx/main/nginx-conf"

cp $CONFIG/pre $CONFIG/default.conf && \
docker restart server

docker-compose up --no-deps certbot && \
cp $CONFIG/post $CONFIG/default.conf && \
docker restart server

