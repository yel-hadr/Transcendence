#!/bin/sh


nohup vault server -dev -dev-listen-address="0.0.0.0:8200"&
# vault secrets enable -path=secrets kv

# securing the premises

echo "[-] - saving the creds in the vault"
cat creds | while IFS= read -r line; do
	value=${line#*=}
	name=${line%%=*}
	vault kv put secret/$name $name=$value > /dev/null
done

yes ok > /dev/null
