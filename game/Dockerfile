FROM python:latest

SHELL ["/bin/bash", "-c"]

RUN apt update -y 
RUN apt install wget -y 

WORKDIR /game

COPY . /game

RUN pip3 install virtualenv
RUN python3 -m virtualenv /game
RUN python3 -m venv env
RUN source env/bin/activate

# COPY pongGame .
# COPY requirements.txt .
# COPY run.sh .

EXPOSE 8001

CMD ["bash", "/game/run.sh"]
