#!/bin/bash

cd src/services/auth
mocha -r ts-node/register mongo.spec.ts --exit
mocha -r ts-node/register auth.spec.ts --exit


cd ../profile
mocha -r ts-node/register mongo.spec.ts --exit
mocha -r ts-node/register profile.spec.ts --exit


cd ../keys
mocha -r ts-node/register mongo.spec.ts --exit
mocha -r ts-node/register keys.spec.ts --exit


cd ../posts
mocha -r ts-node/register mongo.spec.ts --exit
mocha -r ts-node/register posts.spec.ts --exit
