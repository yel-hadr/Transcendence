FROM docker.elastic.co/elasticsearch/elasticsearch:8.15.3

# Set environment variables
ENV discovery.type=single-node \
    cluster.name=elasticsearch \
    bootstrap.memory_lock=true \
    ES_JAVA_OPTS="-Xms512m -Xmx512m" \
    xpack.security.http.ssl.enabled=false \
    xpack.screenshotting.browser.chromium.disableSandbox=true \
    xpack.security.enabled=true \
    PATH=/usr/share/elasticsearch/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# Switch to root to install packages
USER root

# Install required packages quietly
RUN apt-get update -y && \
    apt-get install -y curl jq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy and set up run script
COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh && \
    chown elasticsearch:elasticsearch /usr/local/bin/run.sh

RUN mkdir -p /usr/share/elasticsearch/data/.kibana_status && \
    chown -R elasticsearch:elasticsearch /usr/share/elasticsearch/data/.kibana_status


# Switch back to elasticsearch user
USER elasticsearch

# Set the run script as the entrypoint
ENTRYPOINT ["/usr/local/bin/run.sh"]