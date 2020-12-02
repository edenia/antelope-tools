-include .env

VERSION=$(shell git rev-parse --short HEAD)
IMAGE_NAME=""
DOCKER_REGISTRY=""
K8S_BUILD_DIR ?= ./build_k8s
K8S_FILES := $(shell find ./kubernetes -name '*.yaml' | sed 's:./kubernetes/::g')

MAKE_ENV += DOCKER_REGISTRY VERSION IMAGE_NAME

SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))')

ifneq ("$(wildcard .env)", "")
	export $(shell sed 's/=.*//' .env)
endif
