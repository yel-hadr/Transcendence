#!/bin/bash

sleep 10
pip3 install -r requirements.txt > /dev/null
cd pongGame
uvicorn pongGame.asgi:application --host 0.0.0.0 --port 8001
