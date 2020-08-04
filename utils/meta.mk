-include .env

VERSION=$(shell git rev-parse --short HEAD)
IMAGE_NAME=""
DOCKER_REGISTRY=""

MAKE_ENV += DOCKER_REGISTRY VERSION IMAGE_NAME

SHELL_EXPORT := $(foreach v,$(MAKE_ENV),$(v)='$($(v))')

ifneq ("$(wildcard .env)", "")
	export $(shell sed 's/=.*//' .env)
endif
