#!/bin/bash

sudo docker build -t postgres-setup -f ./Dockerfile_postgres --output type=docker .
sudo docker compose -f compose_setup.yaml --env-file ./../.env up -d
sudo docker stop setup-db-1
sudo docker rm setup-db-1
sudo docker image rm postgres-setup