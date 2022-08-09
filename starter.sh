#!/bin/ash

node ace honeypot:run &
if [ "$ENABLE_DASHBOARD" = "true" ]; then
  node server.js &
else
  echo "Dashboard is disabled" &
fi

wait

exit $?