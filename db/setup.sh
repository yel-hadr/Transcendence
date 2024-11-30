#!/bin/bash

sleep 5

/usr/lib/postgresql/??/bin/initdb /var/lib/postgresql/data
/usr/lib/postgresql/??/bin/pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start

POSTGRES_DB_R=$(curl -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/POSTGRES_DB)
POSTGRES_PASS_R=$(curl -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/POSTGRES_PASS)
POSTGRES_USER_R=$(curl -H "X-Vault-Token: $VAULT_TOKEN" -X GET http://vault:8200/v1/secret/data/POSTGRES_USER)

POSTGRES_DB=$(echo $POSTGRES_DB_R | jq -r ".data.data.POSTGRES_DB")
POSTGRES_PASS=$(echo $POSTGRES_PASS_R | jq -r ".data.data.POSTGRES_PASS")
POSTGRES_USER=$(echo $POSTGRES_USER_R | jq -r ".data.data.POSTGRES_USER")

echo "L7WA $POSTGRES_DB, $POSTGRES_PASS, $POSTGRES_USER"

createdb -U postgres $POSTGRES_DB
psql -U postgres -d $POSTGRES_DB -c "CREATE USER $POSTGRES_USER WITH PASSWORD '$POSTGRES_PASS';"
psql -U postgres -d $POSTGRES_DB -c "ALTER USER postgres PASSWORD '$POSTGRES_PASS';"
psql -U postgres -d $POSTGRES_DB -c "ALTER ROLE $POSTGRES_USER SET client_encoding TO 'utf8';"
psql -U postgres -d $POSTGRES_DB -c "ALTER ROLE $POSTGRES_USER SET default_transaction_isolation TO 'read committed';"
psql -U postgres -d $POSTGRES_DB -c "ALTER ROLE $POSTGRES_USER SET timezone TO 'UTC';"
psql -U postgres -d $POSTGRES_DB -c "GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;"

killall postgres
/usr/lib/postgresql/??/bin/pg_ctl -D /var/lib/postgresql/data stop
echo "listen_addresses = '*'" >> /etc/postgresql/??/main/postgresql.conf
echo "listen_addresses = '*'" >> /var/lib/postgresql/data/postgresql.conf
sed -i 's\127.0.0.1/32\0.0.0.0/0\g' /var/lib/postgresql/data/pg_hba.conf
sed -i 's\127.0.0.1/32\0.0.0.0/0\g' /etc/postgresql/??/main/pg_hba.conf
/usr/lib/postgresql/??/bin/postgres -D /var/lib/postgresql/data -c hba_file=/var/lib/postgresql/data/pg_hba.conf
