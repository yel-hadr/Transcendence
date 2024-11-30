sleep 5

printf "# From https://github.com/SpiderLabs/ModSecurity/blob/master/\n# modsecurity.conf-recommended\n#\n# Edit to set SecRuleEngine On\nInclude \"/etc/nginx/modsec/modsecurity.conf\"\n" > /etc/nginx/modsec/main.conf

cd /front
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/key.key -out /etc/ssl/certs/cert.crt \
    -subj /C=MA/ST=BeniMellal/L=BeniMellal/O=1337/OU=42Network/CN=saitbah

cp tools/default /etc/nginx/sites-available/
sed -i -e "s/rest_api/$(getent hosts rest_api | awk '{print $1}')/g" /etc/nginx/sites-available/default
sed -i -e "s/game/$(getent hosts game | awk '{print $1}')/g" /etc/nginx/sites-available/default
sed -i -e "s/kibana/$(getent hosts kibana | awk '{print $1}')/g" /etc/nginx/sites-available/default


nginx -g "daemon off;"

