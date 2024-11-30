FROM debian:latest

RUN apt update -y

# RUN add-apt-repository ppa:nginx/stable -y
RUN apt install -y nginx openssl vim git make tar && \
  apt-get install -y bison build-essential ca-certificates curl dh-autoreconf doxygen \
  flex gawk git iputils-ping libcurl4-gnutls-dev libexpat1-dev libgeoip-dev liblmdb-dev \
  libpcre3-dev  libssl-dev libtool libxml2 libxml2-dev libyajl-dev locales \
  lua5.3-dev pkg-config wget zlib1g-dev  libgd-dev libxslt1-dev


# Increase Git buffer size to prevent fetch issues
RUN git config --global http.postBuffer 524288000

# installing modsecurity

RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity /opt/ModSecurity

WORKDIR /opt/ModSecurity
RUN git submodule init && git submodule update &&\
      ./build.sh &&\
      ./configure &&\
      make &&\
      make install

# now we install the module for nginx
WORKDIR /opt
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git &&\
    wget http://nginx.org/download/nginx-$(nginx -v 2>&1 | cut -d '/' -f 2 | tr -d '\n').tar.gz &&\
    tar -xvzmf nginx-$(nginx -v 2>&1 | cut -d '/' -f 2 | tr -d '\n').tar.gz &&\
    rm nginx-$(nginx -v 2>&1 | cut -d '/' -f 2 | tr -d '\n').tar.gz &&\
    mv nginx-$(nginx -v 2>&1 | cut -d '/' -f 2 | tr -d '\n') nginx

WORKDIR /opt/nginx

RUN ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx &&\
      make modules &&\
      mkdir /etc/nginx/additional_modules &&\
      cp objs/ngx_http_modsecurity_module.so /etc/nginx/additional_modules &&\
      sed -i -e '5iload_module /etc/nginx/additional_modules/ngx_http_modsecurity_module.so;\' /etc/nginx/nginx.conf &&\
      mkdir -p /etc/nginx/modsec &&\
      wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended &&\
      wget -P /etc/nginx/modsec/ https://github.com/SpiderLabs/ModSecurity/blob/49495f1925a14f74f93cb0ef01172e5abc3e4c55/unicode.mapping &&\
      mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf &&\
      sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf

# installing owasp modsec
WORKDIR /etc/nginx/modsec
RUN git clone https://github.com/SpiderLabs/owasp-modsecurity-crs.git
WORKDIR /etc/nginx/modsec/owasp-modsecurity-crs
RUN cp crs-setup.conf.example crs-setup.conf &&\
      cp rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf &&\
      cp rules/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf.example RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf

EXPOSE 443 80


WORKDIR /front

COPY . /front

CMD ["sh", "/front/tools/setup.win.sh"]
