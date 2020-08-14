#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: build.sh <environment>"
    exit 0
fi

echo "Building docker containers..."
if [ "$1" == "production" ]; then
    docker build -t eoscostarica506/monitor-webapp:latest --target run-stage webapp/
    docker push eoscostarica506/monitor-webapp:latest
    docker build -t eoscostarica506/monitor-hapi hapi/
    docker push eoscostarica506/monitor-hapi
    docker build -t eoscostarica506/wallet wallet/
    docker push eoscostarica506/wallet
elif [ "$1" == "testing" ]; then
    docker build -t eoscostarica506/monitor-webapp:testing webapp/
    docker push eoscostarica506/monitor-webapp:testing hapi/
fi
