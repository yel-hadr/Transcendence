#!/bin/sh
set -e

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Wait for Vault to be ready
log "Waiting for services to be ready..."
sleep 5

# Fetch secrets from Vault
log "Fetching secrets from Vault..."

# Fetch and process each secret individually with error handling
ELASTICSEARCH_USERNAME=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/ELASTICSEARCH_USERNAME | jq -r '.data.data.ELASTICSEARCH_USERNAME')
if [ -z "$ELASTICSEARCH_USERNAME" ]; then
    log "ERROR: Failed to fetch ELASTICSEARCH_USERNAME"
    exit 1
fi

ELASTICSEARCH_PASSWORD=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/ELASTICSEARCH_PASSWORD | jq -r '.data.data.ELASTICSEARCH_PASSWORD')
if [ -z "$ELASTICSEARCH_PASSWORD" ]; then
    log "ERROR: Failed to fetch ELASTICSEARCH_PASSWORD"
    exit 1
fi

# Export the variables
export ELASTICSEARCH_USERNAME
export ELASTICSEARCH_PASSWORD

echo "$ELASTICSEARCH_USERNAME $ELASTICSEARCH_PASSWORD"

# Write the Kibana configuration file
cat <<EOL > /usr/share/kibana/config/kibana.yml
server.host: "0.0.0.0"
elasticsearch.hosts: [ "http://elasticsearch:9200" ]
elasticsearch.username: "${ELASTICSEARCH_USERNAME}"
elasticsearch.password: "${ELASTICSEARCH_PASSWORD}"
EOL

# Wait for Elasticsearch to start
log "Waiting for Elasticsearch to start..."
for i in $(seq 1 300); do
    if curl -s "http://elasticsearch:9200" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Start Kibana
log "Starting Kibana..."
exec /usr/local/bin/kibana-docker