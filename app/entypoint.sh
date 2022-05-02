#!/bin/bash

export "CYPHERNODE_GATEKEEPER_CERT_CA=$(cat /home/node/.keys/cert.pem)" 

npm start