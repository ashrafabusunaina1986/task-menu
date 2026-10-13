#!/bin/bash
# mongo/mongo-entrypoint.sh
set -e

KEYFILE="/data/db/mongo-keyfile"

if [ ! -f "$KEYFILE" ];then
    openssl rand -base64 756 > "$KEYFILE"
    chmod 400 "$KEYFILE"
fi

chown -R mongodb:mongodb /data/db

exec mongod --replSet rs0 --keyFile  "$KEYFILE" --auth --bind_ip_all
