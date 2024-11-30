FROM docker.elastic.co/logstash/logstash:8.15.3

ENV PATH=/usr/share/logstash/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
USER root


# Copy the logstash configuration file



# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    sudo \
    curl \
    jq \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy the run.sh script
COPY run.sh /usr/local/bin/run.sh

# Make the script executable
RUN chmod +x /usr/local/bin/run.sh


USER logstash
CMD ["/usr/local/bin/run.sh"]

# CMD ["/usr/local/bin/docker-entrypoint"]