FROM debian:latest

RUN apt update -y
RUN apt install postgresql postgresql-contrib curl jq -y

EXPOSE 5432

COPY setup.win.sh /
COPY setup.sh /

RUN chmod +x /setup.win.sh
RUN chmod +x /setup.sh

USER postgres

CMD ["sh",  "/setup.sh"]