-include .env

VERSION ?= $(shell git rev-parse --short HEAD)
IMAGE_NAME_WEBAPP=monitor-webapp
IMAGE_NAME_HAPI=monitor-hapi
IMAGE_NAME_WALLET=wallet

DOCKER_REGISTRY=docker.pkg.github.com/eoscostarica/eosio-dashboard
K8S_BUILD_DIR ?= ./build_k8s
K8S_FILES := $(shell find ./kubernetes -name '*.yaml' | sed 's:./kubernetes/::g')
SUBDIRS = webapp hapi

MAKE_ENV += DOCKER_REGISTRY VERSION IMAGE_NAME

SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))')

ifneq ("$(wildcard .env)", "")
	export $(shell sed 's/=.*//' .env)
endif
