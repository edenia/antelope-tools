#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: build.sh <environment>"
    exit 0
fi

echo "Building docker containers..."
if [ "$1" == "production" ]; then
    cp .env.mainnet .env
    docker-compose build
    docker image tag eosio-dashboard_webapp:latest eoscostarica506/monitor-webapp:latest
    docker image tag eosio-dashboard_hapi:latest eoscostarica506/monitor-hapi
    docker image tag eosio-dashboard_wallet:latest eoscostarica506/wallet
    docker push eoscostarica506/monitor-webapp:latest
    docker push eoscostarica506/monitor-hapi
    docker push eoscostarica506/wallet
elif [ "$1" == "testing" ]; then
    cp .env.jungle .env
    docker-compose build webapp
    docker image tag eosio-dashboard_webapp:latest eoscostarica506/monitor-webapp:testing
    docker push eoscostarica506/monitor-webapp:testing
elif [ "$1" == "lacchain" ]; then
    cp .env.lacchain .env
    docker-compose build webapp
    docker image tag eosio-dashboard_webapp:latest eoscostarica506/monitor-webapp:lacchain
    docker push eoscostarica506/monitor-webapp:lacchain
fi
