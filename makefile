SHELL := /bin/bash
#COLORS
WHITE  := $(shell tput -Txterm setaf 7)
BLUE   := $(shell tput -Txterm setaf 6)
YELLOW := $(shell tput -Txterm setaf 3)
GREEN  := $(shell tput -Txterm setaf 2)
RESET  := $(shell tput -Txterm sgr0)

run:
	@echo "$(BLUE)running action $(filter-out $@,$(MAKECMDGOALS))$(RESET)"
%:
@:

jungle:
	cp .env.jungle .env
	make stop
	make start

lacchain:
	cp .env.lacchain .env
	make stop
	make start

local:
	cp .env.local .env
	make stop
	make start

mainnet:
	cp .env.mainnet .env
	make stop
	make start

stop:
	@docker-compose stop

start:
	make start-postgres
	# make start-wallet
	make start-hapi
	make start-hasura
	make start-webapp
	make -j 2 start-hasura-cli start-logs

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
		curl http://localhost:8585/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) ..."; \
		sleep 5; done;
	@echo "..."
	@cd hasura && hasura console --endpoint http://localhost:8585 --skip-update-check --no-browser;

start-webapp:
	$(eval -include .env)
	@until \
		curl http://localhost:8585/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-webapp |$(RESET) waiting for hasura service"; \
		sleep 5; done;
	@echo "..."
	@docker-compose up -d --build webapp

start-logs:
	@docker-compose logs -f hapi webapp