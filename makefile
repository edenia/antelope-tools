include utils/meta.mk utils/help.mk

# SHELL := /bin/bash

run: ##@local Run the project locally
run: 
	make stop
	make run-env 
	make run-postgres
	make run-wallet
	make -j 3 run-hapi run-hasura run-webapp

run-env:
	@[ -f .env ] && echo "$(BLUE)INFO:$(RESET) Using .env file" || echo "$(YELLOW)WARNING:$(RESET) .env file not found"

run-postgres:
	@docker-compose up -d --build postgres

run-wallet:
	@docker-compose up -d --build wallet

run-hapi:
	@docker-compose up -d --build hapi
	@docker-compose logs -f hapi

run-hasura:
	@until \
		docker-compose exec -T postgres pg_isready; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) waiting for postgres service"; \
		sleep 5; done;
	@until \
		curl http://localhost:9090/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) waiting for hapi service"; \
		sleep 5; done;
	@docker-compose stop hasura
	@docker-compose up -d --build hasura
	@until \
		curl http://localhost:8080/healthz; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-hasura |$(RESET) ..."; \
		sleep 5; done;
	@cd hasura && hasura console --endpoint http://localhost:8080 --skip-update-check --no-browser;

run-webapp:
	@until \
		curl http://localhost:8080/v1/version; \
		do echo "$(BLUE)$(STAGE)-$(APP_NAME)-webapp |$(RESET) waiting for hasura service"; \
		sleep 5; done;
	@docker-compose up -d --build webapp
	@docker-compose logs -f webapp

stop: ##@local Stops the development instance
stop:
	@docker-compose stop

install: ##@local Install hapi and webapp dependencies
install:
	@cd hapi && yarn
	@cd webapp && yarn

pre-commit: ##@local Run pre commit validations for hapi and webapp
pre-commit:
	@[ ! -d hapi/node_modules ] && cd hapi && yarn || echo ""
	@cd hapi && yarn format && yarn lint
	@[ ! -d webapp/node_modules ] && cd webapp && yarn || echo ""
	@cd webapp && yarn format && yarn lint