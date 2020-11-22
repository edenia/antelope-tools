#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: build.sh <environment>"
    exit 0
fi

# TODO: review if there is a better way to do this compilation
yarn; cd webapp; yarn; cd ../hapi; yarn; cd ../hasura; yarn; cd ../
echo "Building docker containers..."
if [ "$1" == "production" ]; then
    cp .env.mainnet .env
    sed -i 's/REACT_APP_HASURA_URL\=http:\/\/localhost:8585\/v1\/graphql/REACT_APP_HASURA_URL\=https\:\/\/graphql-mainnet.eosio.cr\/v1\/graphql/g' .env
    eval $(scripts/dotenv export)
    docker build -t eoscostarica506/monitor-webapp:latest --target run-stage webapp/ \
       --build-arg react_app_title="${REACT_APP_TITLE}" \
       --build-arg react_app_default_producer_logo="${REACT_APP_DEFAULT_PRODUCER_LOGO}" \
       --build-arg react_app_eos_rate_link="${REACT_APP_EOS_RATE_LINK}" \
       --build-arg react_app_use_rewards="${REACT_APP_USE_REWARDS}" \
       --build-arg react_app_use_votes="${REACT_APP_USE_VOTES}" \
       --build-arg react_app_hasura_url="${REACT_APP_HASURA_URL}" \
       --build-arg react_app_eos_api_network_name="${REACT_APP_EOS_API_NETWORK_NAME}" \
       --build-arg react_app_eos_api_host="${REACT_APP_EOS_API_HOST}" \
       --build-arg react_app_eos_api_port="${REACT_APP_EOS_API_PORT}" \
       --build-arg react_app_eos_api_protocol="${REACT_APP_EOS_API_PROTOCOL}" \
       --build-arg react_app_eos_chain_id="${REACT_APP_EOS_CHAIN_ID}" \
       --build-arg react_app_eos_default_exchange_rate="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE}" \
       --build-arg react_app_eos_default_exchange_rate_api="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API}" \
       --build-arg react_app_eos_use_bp_json_on_chain="${REACT_APP_EOS_USE_BP_JSON_ON_CHAIN}" \
       --build-arg react_app_eos_bp_json_on_chain_contract="${REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT}" \
       --build-arg react_app_eos_bp_json_on_chain_table="${REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE}" \
       --build-arg react_app_eos_bp_json_on_chain_scope="${REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE}" \
    && docker push eoscostarica506/monitor-webapp:latest
    docker build -t eoscostarica506/monitor-hapi --target release hapi/ && docker push eoscostarica506/monitor-hapi
    docker build -t eoscostarica506/wallet --target run-stage wallet/ && docker push eoscostarica506/wallet
elif [ "$1" == "testing" ]; then
    cp .env.jungle .env
    sed -i 's/REACT_APP_HASURA_URL\=http:\/\/localhost:8585\/v1\/graphql/REACT_APP_HASURA_URL\=https\:\/\/graphql-testnet.eosio.cr\:3000\/v1\/graphql/g' .env
    eval $(scripts/dotenv export)
    docker build -t eoscostarica506/monitor-webapp:testing --target run-stage webapp/ \
       --build-arg react_app_title="${REACT_APP_TITLE}" \
       --build-arg react_app_default_producer_logo="${REACT_APP_DEFAULT_PRODUCER_LOGO}" \
       --build-arg react_app_eos_rate_link="${REACT_APP_EOS_RATE_LINK}" \
       --build-arg react_app_use_rewards="${REACT_APP_USE_REWARDS}" \
       --build-arg react_app_use_votes="${REACT_APP_USE_VOTES}" \
       --build-arg react_app_hasura_url="${REACT_APP_HASURA_URL}" \
       --build-arg react_app_eos_api_network_name="${REACT_APP_EOS_API_NETWORK_NAME}" \
       --build-arg react_app_eos_api_host="${REACT_APP_EOS_API_HOST}" \
       --build-arg react_app_eos_api_port="${REACT_APP_EOS_API_PORT}" \
       --build-arg react_app_eos_api_protocol="${REACT_APP_EOS_API_PROTOCOL}" \
       --build-arg react_app_eos_chain_id="${REACT_APP_EOS_CHAIN_ID}" \
       --build-arg react_app_eos_default_exchange_rate="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE}" \
       --build-arg react_app_eos_default_exchange_rate_api="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API}" \
       --build-arg react_app_eos_use_bp_json_on_chain="${REACT_APP_EOS_USE_BP_JSON_ON_CHAIN}" \
       --build-arg react_app_eos_bp_json_on_chain_contract="${REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT}" \
       --build-arg react_app_eos_bp_json_on_chain_table="${REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE}" \
       --build-arg react_app_eos_bp_json_on_chain_scope="${REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE}" \
    && docker push eoscostarica506/monitor-webapp:testing
elif [ "$1" == "lacchain" ]; then
    cp .env.lacchain .env
    sed -i 's/REACT_APP_HASURA_URL\=http:\/\/localhost:8585\/v1\/graphql/REACT_APP_HASURA_URL\=https\:\/\/dashboard-graphql.latamlink.io\/v1\/graphql/g' .env
    eval $(scripts/dotenv export)
    docker build -t eoscostarica506/monitor-webapp:lacchain --target run-stage webapp/ \
       --build-arg react_app_title="${REACT_APP_TITLE}" \
       --build-arg react_app_default_producer_logo="${REACT_APP_DEFAULT_PRODUCER_LOGO}" \
       --build-arg react_app_eos_rate_link="${REACT_APP_EOS_RATE_LINK}" \
       --build-arg react_app_use_rewards="${REACT_APP_USE_REWARDS}" \
       --build-arg react_app_use_votes="${REACT_APP_USE_VOTES}" \
       --build-arg react_app_hasura_url="${REACT_APP_HASURA_URL}" \
       --build-arg react_app_eos_api_network_name="${REACT_APP_EOS_API_NETWORK_NAME}" \
       --build-arg react_app_eos_api_host="${REACT_APP_EOS_API_HOST}" \
       --build-arg react_app_eos_api_port="${REACT_APP_EOS_API_PORT}" \
       --build-arg react_app_eos_api_protocol="${REACT_APP_EOS_API_PROTOCOL}" \
       --build-arg react_app_eos_chain_id="${REACT_APP_EOS_CHAIN_ID}" \
       --build-arg react_app_eos_default_exchange_rate="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE}" \
       --build-arg react_app_eos_default_exchange_rate_api="${REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API}" \
       --build-arg react_app_eos_use_bp_json_on_chain="${REACT_APP_EOS_USE_BP_JSON_ON_CHAIN}" \
       --build-arg react_app_eos_bp_json_on_chain_contract="${REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT}" \
       --build-arg react_app_eos_bp_json_on_chain_table="${REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE}" \
       --build-arg react_app_eos_bp_json_on_chain_scope="${REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE}" \
    && docker push eoscostarica506/monitor-webapp:lacchain
fi
