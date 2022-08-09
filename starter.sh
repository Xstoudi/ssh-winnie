#!/bin/ash

node ace honeypot:run &
node server.js &

wait -n

exit $?