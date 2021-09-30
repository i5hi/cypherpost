#!/bin/bash -e


# CREATE CA ROOT CERT
ROOTCAKEY=$HOME/.keys/root_ca.key
ROOTCAPEM=$HOME/.keys/root_ca.pem

#openssl genrsa -out $ROOTCAKEY 2048
#for password key
openssl genrsa -des3 -out $ROOTCAKEY 2048
openssl req -x509 -new -nodes -key $ROOTCAKEY -sha256 -days 1024 -out $ROOTCAPEM

# CREATE CERT PER DEVICE

DEVICEKEY=$HOME/.keys/mongodb.key
DEVICECSR=$HOME/.keys/mongodb.csr
DEVICECERT=$HOME/.keys/mongodb.crt
DEVICEPEM=$HOME/.keys/mongodb.pem

openssl genrsa -out $DEVICEKEY 2048
openssl req -new -key $DEVICEKEY -out $DEVICECSR
openssl x509 -req -in $DEVICECSR -CA $ROOTCAPEM -CAkey $ROOTCAKEY -CAcreateserial -out $DEVICECERT -days 500 -sha256
cat $DEVICEKEY $DEVICECERT > $DEVICEPEM

