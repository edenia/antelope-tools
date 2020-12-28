-include .env

VERSION ?= $(shell git rev-parse --short HEAD)
CURRENT_BRANCH ?= $(git rev-parse --abbrev-ref HEAD)

ifeq ($(CURRENT_BRANCH),master)
	REACT_APP_HASURA_URL := https://graphql-mainnet.eosio.cr/v1/graphql
else ifeq ($(CURRENT_BRANCH),dev)
	REACT_APP_HASURA_URL := https://graphql-testnet.eosio.cr/v1/graphql
else ifeq ($(CURRENT_BRANCH),lacchain)
	REACT_APP_HASURA_URL := https://dashboard-graphql.latamlink.io/v1/graphql
else
	REACT_APP_HASURA_URL := http://localhost:8585/v1/graphql
endif

IMAGE_NAME_WEBAPP=monitor-webapp
IMAGE_NAME_HAPI=monitor-hapi
IMAGE_NAME_HASURA=monitor-hasura
IMAGE_NAME_WALLET=monitor-wallet

DOCKER_REGISTRY=eoscostarica506
SUBDIRS = webapp hapi hasura wallet

MAKE_ENV += DOCKER_REGISTRY VERSION IMAGE_NAME_WEBAPP IMAGE_NAME_HAPI IMAGE_NAME_WALLET IMAGE_NAME_HASURA

SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))')

ifneq ("$(wildcard .env)", "")
	export $(shell sed 's/=.*//' .env)
endif
