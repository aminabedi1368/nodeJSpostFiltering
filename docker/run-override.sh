#!/bin/bash

if [ ! -f /docker/initialized ]; then
   cd /var/www/ \
   && npm install \
   && touch /docker/initialized
fi

## continue with default Parent CMD
node server.js
