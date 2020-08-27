#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: build.sh <environment>"
    exit 0
fi

echo "Building docker containers..."
if [ "$1" == "production" ]; then
    cp ./.env.mainnet ./.env
    docker build -t eoscostarica506/monitor-webapp:latest --target run-stage webapp/
    docker push eoscostarica506/monitor-webapp:latest
    docker build -t eoscostarica506/monitor-hapi hapi/
    docker push eoscostarica506/monitor-hapi
    docker build -t eoscostarica506/wallet --target run-stage wallet/
    docker push eoscostarica506/wallet
elif [ "$1" == "testing" ]; then
    cp ./.env.jungle ./.env
    docker build -t eoscostarica506/monitor-webapp:testing webapp/
    docker push eoscostarica506/monitor-webapp:testing
elif [ "$1" == "lacchain" ]; then
    cp ./.env.lacchain ./.env
    docker build -t eoscostarica506/monitor-webapp:lacchain webapp/
    docker push eoscostarica506/monitor-webapp:lacchain
fi
