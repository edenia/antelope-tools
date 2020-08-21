#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: clean.sh <environment>"
    exit 0
fi

kubectl delete deployment wallet monitor-postgres monitor-webapp monitor-hapi monitor-hasura -n "$1"
kubectl delete svc        wallet monitor-postgres monitor-webapp monitor-hapi monitor-hasura \
                          monitor-port monitor-port-ssl -n "$1"
