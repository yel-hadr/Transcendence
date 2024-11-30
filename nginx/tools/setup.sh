

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/key.key -out /etc/ssl/certs/cert.crt \
	-subj /C=MA/ST=BeniMellal/L=BeniMellal/O=1337/OU=42Network/CN=saitbah

nginx -g "daemon off;"