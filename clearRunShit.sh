#!/bin/bash
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -qa)
docker volume rm $(docker volume ls -q)
docker system prune -a
docker compose up