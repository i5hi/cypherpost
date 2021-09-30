#!/bin/sh
# /etc/sources.list.d
# deb https://nginx.org/packages/debian/ buster nginx
# deb-src https://nginx.org/packages/debian/ buster nginx
apt-get update
apt-get install nginx


# Nginx w/Mod Sec & OWASP Core Set

apt-get install -y git build-essential libpcre3 libpcre3-dev libssl-dev libtool autoconf apache2-dev libxml2-dev libcurl4-openssl-dev automake pkgconf

sudo chown -R nginx /etc/nginx
