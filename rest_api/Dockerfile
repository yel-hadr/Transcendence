FROM python:latest

SHELL ["/bin/bash", "-c"]

RUN apt update -y && apt install wget openssl -y

WORKDIR /api
COPY . /api

RUN pip3 install virtualenv && \
    python3 -m virtualenv /api && \
    python3 -m venv env && \
    source env/bin/activate

EXPOSE 8000

CMD ["bash", "./run.sh"]
