#!/bin/bash

docker volume rm      compose_cp-configdb
docker volume rm      compose_cp-datadb
docker volume rm      compose_cp-server-code
docker volume rm      compose_cp-server-keys
docker volume rm      compose_cp-server-logs
docker volume rm      compose_cp-web-root
