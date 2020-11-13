LATEST_TAG ?= latest

install: ##@local Install all dependencies
install:
	@npm install

clean-install: ##@local Reinstalls all dependencies
clean-install:
	@rm -Rf node_modules
	@npm install

run: ##@local Run the project locally (without docker)
run: node_modules
	@$(SHELL_EXPORT) npm run dev

build-docker: ##@devops Build the docker image
build-docker: ./Dockerfile
	@docker pull $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) || true
        @docker build -t  $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) \
          --build-arg react_app_title="$(REACT_APP_TITLE)" \
          --build-arg react_app_default_producer_logo="$(REACT_APP_DEFAULT_PRODUCER_LOGO)" \
          --build-arg react_app_eos_rate_link="$(REACT_APP_EOS_RATE_LINK)" \
          --build-arg react_app_use_rewards="$(REACT_APP_USE_REWARDS)" \
          --build-arg react_app_use_votes="$(REACT_APP_USE_VOTES)" \
          --build-arg react_app_hasura_url="$(REACT_APP_HASURA_URL)" \
          --build-arg react_app_eos_api_network_name="$(REACT_APP_EOS_API_NETWORK_NAME)" \
          --build-arg react_app_eos_api_host="$(REACT_APP_EOS_API_HOST)" \
          --build-arg react_app_eos_api_port="$(REACT_APP_EOS_API_PORT)" \
          --build-arg react_app_eos_api_protocol="$(REACT_APP_EOS_API_PROTOCOL)" \
          --build-arg react_app_eos_chain_id="$(REACT_APP_EOS_CHAIN_ID)" \
          --build-arg react_app_eos_default_exchange_rate="$(REACT_APP_EOS_DEFAULT_EXCHANGE_RATE)" \
          --build-arg react_app_eos_default_exchange_rate_api="$(REACT_APP_EOS_DEFAULT_EXCHANGE_RATE_API)" \
          --build-arg react_app_eos_use_bp_json_on_chain="$(REACT_APP_EOS_USE_BP_JSON_ON_CHAIN)" \
          --build-arg react_app_eos_bp_json_on_chain_contract="$(REACT_APP_EOS_BP_JSON_ON_CHAIN_CONTRACT)" \
          --build-arg react_app_eos_bp_json_on_chain_table="$(REACT_APP_EOS_BP_JSON_ON_CHAIN_TABLE)" \
          --build-arg react_app_eos_bp_json_on_chain_scope="$(REACT_APP_EOS_BP_JSON_ON_CHAIN_SCOPE)" \
          .

pull-image: ##@devops Pull the latest image from registry for caching
pull-image:
	@docker pull $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) || true

build-docker-cached: ##@devops Build the docker image using cached layers
build-docker-cached: ./Dockerfile
	@docker build \
		--target prod-stage \
		--cache-from $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) \
		-t $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) \
		-t $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) \
		.

push-image: ##@devops Push the freshly built image and tag with release or latest tag
push-image:
	@docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION)
ifeq ($(strip $(RELEASE_TAG)),)
	@docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG)
else
	@docker push $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(RELEASE_TAG)
endif
