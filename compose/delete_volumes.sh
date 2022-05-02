#!/bin/bash

docker volume rm     cypherpost-development_cp-configdb
docker volume rm     cypherpost-development_cp-datadb
docker volume rm     cypherpost-development_cp-server-code
docker volume rm     cypherpost-development_cp-server-keys
docker volume rm     cypherpost-development_cp-server-logs
docker volume rm     cypherpost-development_cp-web-root
docker volume rm     cypherpost-development_cn-gatekeeper-certs

docker volume rm     prod_certbot-etc
docker volume rm     prod_certbot-var
docker volume rm     prod_cp-configdb
docker volume rm     prod_cp-datadb
docker volume rm     prod_cp-server-keys
docker volume rm     prod_cp-server-logs
docker volume rm     prod_dhparam
docker volume rm     prod_web-root