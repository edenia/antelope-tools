include utils/meta.mk utils/help.mk

SHELL := /bin/bash
#COLORS
WHITE  := $(shell tput -Txterm setaf 7)
BLUE   := $(shell tput -Txterm setaf 6)
YELLOW := $(shell tput -Txterm setaf 3)
GREEN  := $(shell tput -Txterm setaf 2)
RESET  := $(shell tput -Txterm sgr0)

K8S_BUILD_DIR ?= ./build_k8s
K8S_FILES := $(shell find ./kubernetes -name '*.yaml' | sed 's:./kubernetes/::g')

run:
	@echo "$(BLUE)running action $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
%:
@:

clean:
	@docker-compose stop
	@rm -rf tmp/postgres
	@rm -rf tmp/hapi
	@rm -rf tmp/webapp
	@docker system prune

jungle:
	@cat ".env.jungle" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

telos:
	@cat ".env.telos" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

telostestnet:
	@cat ".env.telostestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

lacchain:
	@cat ".env.lacchain" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

protontestnet:
	@cat ".env.protontestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

proton:
	@cat ".env.proton" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

waxtestnet:
	@cat ".env.waxtestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

airwire:
	@cat ".env.airwire" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

airwiretestnet:
	@cat ".env.airwiretestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

libre:
	@cat ".env.libre" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

ultratestnet:
	@cat ".env.ultratestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

libretestnet:
	@cat ".env.libretestnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

local:
	@cat ".env.local" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

mainnet:
	@cat ".env.mainnet" | sed -e 's/REACT_APP_VERSION=dev/REACT_APP_VERSION=$(shell git describe --tags `git rev-list --tags --max-count=1`)/g' > ".env"
	make stop
	make start

stop:
	@docker-compose stop

start:
	make start-postgres
	make start-wallet
	make start-hapi
	make start-hasura
	make -j 3 start-hasura-cli start-logs start-webapp

start-postgres:
	@docker-compose up -d --build postgres

start-wallet:
	@docker-compose up -d --build wallet

start-hapi:
	@docker-compose up -d --build hapi

start-hasura:
	$(eval -include .env)
	@until \
		docker-compose exec -T postgres pg_isready; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) waiting for postgres service"; \
		sleep 5; done;
	@until \
		curl http://localhost:9090/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) waiting for hapi service"; \
		sleep 5; done;
	@echo "..."
	@docker-compose stop hasura
	@docker-compose up -d --build hasura

start-hasura-cli:
	$(eval -include .env)
	@until \
		curl http://localhost:8080/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) ..."; \
		sleep 5; done;
	@echo "..."
	@cd hasura && hasura console --endpoint http://localhost:8080 --skip-update-check --no-browser --admin-secret $(HASURA_GRAPHQL_ADMIN_SECRET);

start-webapp:
	$(eval -include .env)
	@until \
		curl -s -o /dev/null -w 'hasura status %{http_code}\n' http://localhost:8080/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-webapp |$(RESET) waiting for hasura service"; \
		sleep 5; done;
	@cd webapp && yarn && yarn start:local | cat
	@echo "done webapp"

start-logs:
	@docker-compose logs -f hapi webapp

build-kubernetes: ##@devops Generate proper k8s files based on the templates
build-kubernetes: ./kubernetes
	@echo "Build kubernetes files..."
	@rm -Rf $(K8S_BUILD_DIR) && mkdir -p $(K8S_BUILD_DIR)
	@for file in $(K8S_FILES); do \
		mkdir -p `dirname "$(K8S_BUILD_DIR)/$$file"`; \
		$(SHELL_EXPORT) envsubst <./kubernetes/$$file >$(K8S_BUILD_DIR)/$$file; \
	done

deploy-kubernetes: ##@devops Publish the build k8s files
deploy-kubernetes: $(K8S_BUILD_DIR)
	@kubectl create ns $(NAMESPACE) || echo "Namespace '$(NAMESPACE)' already exists.";
	@echo "Creating SSL certificates..."
	@kubectl create secret tls \
		dashboard-tls-secret \
		--key ./ssl/antelope.tools.priv.key \
		--cert ./ssl/antelope.tools.crt \
		-n $(NAMESPACE)  || echo "SSL cert already configured.";
	@echo "Creating configmaps..."
	@kubectl create configmap -n $(NAMESPACE) \
	dashboard-wallet-config \
	--from-file wallet/config/ || echo "Wallet configuration already created.";
	@echo "Applying kubernetes files..."
	@for file in $(shell find $(K8S_BUILD_DIR) -name '*.yaml' | sed 's:$(K8S_BUILD_DIR)/::g'); do \
		kubectl apply -f $(K8S_BUILD_DIR)/$$file -n $(NAMESPACE) || echo "${file} Cannot be updated."; \
	done

build-docker-images: ##@devops Build docker images
build-docker-images:
	@echo "Building docker containers..."
	@for dir in $(SUBDIRS); do \
		$(MAKE) build-docker -C $$dir; \
	done

push-docker-images: ##@devops Publish docker images
push-docker-images:
	@echo $(DOCKER_PASSWORD) | docker login \
		--username $(DOCKER_USERNAME) \
		--password-stdin
	for dir in $(SUBDIRS); do \
		$(MAKE) push-image -C $$dir; \
	done

release: ##@devops Create Release for Version "make version=v1.3.xx release"
release:
	ifndef version
		$(error version is not set)
	endif
	@echo "Create release for version $(version)"
	@git tag -a $(version) -m "Create release tag $(version)"
	@git tag -a mainnet-$(version) -m "Create release tag mainnet-$(version)"
	@git tag -a lacchain-$(version) -m "Create release tag lacchain-$(version)"
	@git tag -a proton-$(version) -m "Create release tag proton-$(version)"
	@git tag -a wax-$(version) -m "Create release tag wax-$(version)"
	@git tag -a telos-$(version) -m "Create release tag telos-$(version)"
	@git tag -a proton-testnet-$(version) -m "Create release tag proton-testnet-$(version)"
	@git tag -a wax-testnet-$(version) -m "Create release tag wax-testnet-$(version)"
	@git tag -a telos-testnet-$(version) -m "Create release tag telos-testnet-$(version)"
	@git push --tags
