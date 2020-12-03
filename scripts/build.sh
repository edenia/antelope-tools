#!/bin/bash

# TODO: review if there is a better way to do this compilation
yarn; cd webapp; yarn; cd ../hapi; yarn; cd ../hasura; yarn; cd ../
make build-all
make push-images
