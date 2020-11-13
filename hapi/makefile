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
	@docker build \
		--cache-from $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(LATEST_TAG) \
		--target prod-stage \
		-t $(DOCKER_REGISTRY)/$(IMAGE_NAME):$(VERSION) \
		-t $(DOCKER_REGISTRY)/$(IMAGE_NAME):latest \
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
