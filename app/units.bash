#!/bin/bash

cd src/services/identity
mocha -r ts-node/register identity.spec.ts --exit

cd ../badges
mocha -r ts-node/register badges.spec.ts --exit

cd ../posts
mocha -r ts-node/register posts.spec.ts --exit
cd ./keys
mocha -r ts-node/register post_keys.spec.ts --exit
