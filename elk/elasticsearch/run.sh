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
ELASTIC_PASSWORD=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/ELASTIC_PASSWORD | jq -r '.data.data.ELASTIC_PASSWORD')
if [ -z "$ELASTIC_PASSWORD" ]; then
    log "ERROR: Failed to fetch ELASTIC_PASSWORD"
    exit 1
fi

KIBANA_SYSTEM_PASSWORD=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/KIBANA_SYSTEM_PASSWORD | jq -r '.data.data.KIBANA_SYSTEM_PASSWORD')
if [ -z "$KIBANA_SYSTEM_PASSWORD" ]; then
    log "ERROR: Failed to fetch KIBANA_SYSTEM_PASSWORD"
    exit 1
fi

KIBANA_USER=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/KIBANA_USER | jq -r '.data.data.KIBANA_USER')
if [ -z "$KIBANA_USER" ]; then
    log "ERROR: Failed to fetch KIBANA_USER"
    exit 1
fi

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
export ELASTIC_PASSWORD
export KIBANA_SYSTEM_PASSWORD
export KIBANA_USER
export ELASTICSEARCH_USERNAME
export ELASTICSEARCH_PASSWORD

# Start Elasticsearch in the background
/usr/local/bin/docker-entrypoint.sh elasticsearch &

# Wait for Elasticsearch to start
log "Waiting for Elasticsearch to start..."
for i in $(seq 1 300); do
    if curl -s "http://localhost:9200" >/dev/null 2>&1; then
        log "Elasticsearch is up!"
        break
    fi
    
    if [ $i -eq 300 ]; then
        log "ERROR: Elasticsearch did not start within 5 minutes"
        exit 1
    fi
    sleep 1
done

# Create kibana_system user if not already created
if [ ! -f /usr/share/elasticsearch/data/.kibana_status/kibana_system_created ]; then
    log "Creating kibana_system user..."
    
    RESPONSE=$(curl -s -X POST "http://localhost:9200/_security/user/$KIBANA_USER" \
         -H "Content-Type: application/json" \
         -u "elastic:${ELASTIC_PASSWORD}" \
         -d "{
             \"password\": \"${KIBANA_SYSTEM_PASSWORD}\",
             \"roles\": [\"kibana_system\"],
             \"full_name\": \"Kibana System User\"
         }")
    
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        mkdir -p /usr/share/elasticsearch/data/.kibana_status
        touch /usr/share/elasticsearch/data/.kibana_status/kibana_system_created
        log "Successfully created kibana_system user"
        log "Response: $RESPONSE"
    else
        log "ERROR: Failed to create kibana_system user"
        log "Response: $RESPONSE"
    fi
fi



# Keep the script running and wait for the Elasticsearch process
wait