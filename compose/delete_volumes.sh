#!/bin/bash

docker volume rm      compose_app-keys
docker volume rm      compose_certbot-etc
docker volume rm      compose_certbot-var
docker volume rm      compose_dhparam
docker volume rm      compose_cp-app-code
docker volume rm      compose_cp-app-keys
docker volume rm      compose_cp-client-code
docker volume rm      compose_cp-client-keys
docker volume rm      compose_cp-configdb
docker volume rm      compose_cp-datadb
docker volume rm      compose_cp-server-code
docker volume rm      compose_cp-server-keys
docker volume rm      compose_cp-server-logs
docker volume rm      compose_cp-web-root
docker volume rm      compose_web-root
