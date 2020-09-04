#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Usage: deploy.sh <namespace> <external_ip>"
    exit 0
fi

if [ "$1" == "production" ]; then
    kubectl create -f kubernetes/ --namespace="$1"
    kubectl create -f kubernetes/production --namespace="$1"
    kubectl expose deployment monitor-webapp --name=monitor-port-ssl --port=443 \
            --target-port=443 --type=ClusterIP --external-ip="$2" -n "$1"
    kubectl expose deployment monitor-webapp --name=monitor-port --port=80 \
            --target-port=80  --type=ClusterIP --external-ip="$2" -n "$1"
elif [ "$1" == "testing" ]; then
    kubectl create -f kubernetes/ --namespace="$1"
    kubectl create -f kubernetes/testing --namespace="$1"
    kubectl expose deployment monitor-webapp --name=monitor-port --port=3000 \
            --target-port=3000  --type=ClusterIP --external-ip="$2" -n "$1"
fi
