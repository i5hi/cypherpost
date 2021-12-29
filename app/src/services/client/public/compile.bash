#!/bin/bash

rm -rf ./js/bundles
mkdir -p ./js/bundles

unzip ./js/mdb.min.zip -d ./js/bundles

browserify ./js/auth.js > ./js/bundles/auth_bundle.js
browserify ./js/notifications.js > ./js/bundles/notifications_bundle.js
browserify ./js/profile.js > ./js/bundles/profile_bundle.js
browserify ./js/network.js > ./js/bundles/network_bundle.js
browserify ./js/posts.js > ./js/bundles/posts_bundle.js
