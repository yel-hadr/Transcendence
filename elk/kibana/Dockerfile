FROM docker.elastic.co/kibana/kibana:8.15.3

ENV ELASTICSEARCH_HOSTS=http://elasticsearch:9200
ENV TELEMETRY_ENABLED=false
ENV server.host=0.0.0.0

USER root
RUN apt update -y > /dev/null && apt install -y curl jq > /dev/null

COPY run.sh .

ENV PATH=/usr/share/kibana/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

ENTRYPOINT ["bash", "./run.sh" ]

USER kibana

CMD ["/usr/local/bin/kibana-docker"]