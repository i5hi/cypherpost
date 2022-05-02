#!/bin/bash

rm -rf $(pwd)/js/bundles
mkdir -p $(pwd)/js/bundles

unzip $(pwd)/js/mdb.min.zip -d $(pwd)/js/bundles

browserify $(pwd)/js/auth.js > $(pwd)/js/bundles/auth_bundle.js
browserify $(pwd)/js/notifications.js > $(pwd)/js/bundles/notifications_bundle.js
browserify $(pwd)/js/preferences.js > $(pwd)/js/bundles/preferences_bundle.js
browserify $(pwd)/js/network.js > $(pwd)/js/bundles/network_bundle.js
browserify $(pwd)/js/posts.js > $(pwd)/js/bundles/posts_bundle.js
