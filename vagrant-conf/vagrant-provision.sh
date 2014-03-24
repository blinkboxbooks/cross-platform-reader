#!/usr/bin/env bash

echo "Provisioning web-dev VM"

# ---------------------------------------------
# nginx conf
# ---------------------------------------------
cp -a /vagrant/vagrant-conf/nginx/conf/. /usr/local/nginx/conf
cp /vagrant/vagrant-conf/nginx/init.d/nginx /etc/init.d/nginx
chmod 775 /etc/rc.d/init.d/nginx
chkconfig --add nginx
chkconfig nginx on
service nginx start

# -------------------------------------------------------------------------
# Allow gem installation without sudo e.g. for gems required by smoke tests
# -------------------------------------------------------------------------
chown -R vagrant:vagrant /usr/local/rvm/gems/*