#!/bin/bash

echo "[o] Running application unit tests"
echo "[!] This may take a while..."

docker exec -it application sh -c "bash units.bash"

echo "[o] Running application integration test"
docker exec -it application sh -c "npm test"
