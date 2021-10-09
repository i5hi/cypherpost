# debug

If the database requires debugging, never operate it in production.

Instead, clone the db and bring a copy to your local development environment where you can test more freely.

## mongodump

In production:

```bash
docker exec -it database bash
mongodump --username=cp --password=***secret*** --db=cypherpost --archive="mongodump.01"
```
This will dump all collections into the persistent volume at `/mnt/persistence/mongo/data/db/mongodump.01`


In development:

```bash
nano ~/.ssh/config
# make sure you have the remote User, IP and Port under Host cypherpost
scp cypherpost:/mnt/persistence/mongo/data/db/mongodump.01 ~/cypherpost/infra/mongo/dumps/mongodump.01
# This will bring the archive into the cypherpost workspace into a folder called dumps whose contents are git ignored.

cd ~/cypherpost/compose
docker-compose -f dev-compose.yaml up -d --force-recreate --build --no-deps mongo
docker exec -it database bash

cd dumps
mongorestore --username=cp --password=secret --db=cypherpost --archive="mongodump.01"
```