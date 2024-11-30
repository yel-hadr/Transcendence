#!/bin/sh

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
ELASTIC_USER=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/ELASTIC_USER | jq -r '.data.data.ELASTIC_USER')
if [ -z "$ELASTIC_USER" ]; then
    log "ERROR: Failed to fetch ELASTIC_USER"
    exit 1
fi

ELASTIC_PASSWORD=$(curl -s -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/ELASTIC_PASSWORD | jq -r '.data.data.ELASTIC_PASSWORD')
if [ -z "$ELASTIC_PASSWORD" ]; then
    log "ERROR: Failed to fetch ELASTIC_PASSWORD"
    exit 1
fi




# Export the variables
export ELASTIC_USER
export ELASTIC_PASSWORD

log "Fetched ELASTIC_USER and ELASTIC_PASSWORD successfully"
echo "$ELASTIC_USER $ELASTIC_PASSWORD"

# Write the Logstash configuration file
cat <<EOL > /usr/share/logstash/config/logstash.yml
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://elasticsearch:9200" ]
xpack.monitoring.elasticsearch.username: "${ELASTIC_USER}"
xpack.monitoring.elasticsearch.password: "${ELASTIC_PASSWORD}"
EOL

# Write the Logstash pipeline configuration file
cat <<EOL > /usr/share/logstash/pipeline/logstash.conf
input {
  syslog {
    port => 5140
    type => "syslog"
    codec => plain {
      charset => "UTF-8"
    }
  }
}

filter {
    if [type] == "syslog" {
        if [program] == "nginx_access" {
            grok {
                match => { "message" => "%{COMBINEDAPACHELOG}" }
                add_field => { "log_type" => "nginx_access" }
            }
            date {
                match => ["timestamp", "dd/MMM/YYYY:HH:mm:ss Z"]
                target => "@timestamp"
            }
            useragent {
                source => "agent"
                target => "user_agent"
            }
        }

        if [program] == "nginx_error" {
            grok {
                match => { "message" => "%{GREEDYDATA:error_message}" }
                add_field => { "log_type" => "nginx_error" }
            }
        }
    }
}

output {
    elasticsearch {
        hosts => ["http://elasticsearch:9200"]
        user => "${ELASTIC_USER}"
        password => "${ELASTIC_PASSWORD}"
        index => "nginx-logs-%{+YYYY.MM.dd}"
    }
    stdout { codec => rubydebug }
}
EOL


# Wait for Elasticsearch to be ready
log "Waiting for Elasticsearch to be ready..."
for i in $(seq 1 300); do
    if curl -s "http://elasticsearch:9200" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Check if the configuration file exists
if [ ! -f /usr/share/logstash/pipeline/logstash.conf ]; then
    log "Configuration file not found: /usr/share/logstash/pipeline/logstash.conf"
    exit 1
fi


# Start Logstash
log "Starting Logstash..."
exec /usr/share/logstash/bin/logstash -f /usr/share/logstash/pipeline/logstash.conf