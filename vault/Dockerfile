FROM debian:latest

RUN apt update -y &&\
    apt install gpg wget lsb-base lsb-release -y &&\
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg &&\
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/hashicorp.list &&\
    apt update -y &&\
    apt install vault -y

WORKDIR /app
COPY run.sh .
RUN chmod +x run.sh
COPY creds .
EXPOSE 8200

CMD ["./run.sh"]
