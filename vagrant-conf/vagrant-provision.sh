#!/usr/bin/env bash

echo "Provisioning web-dev VM as $(whoami)"

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

yum install Xvfb firefox -y

# required for headless firefox
Xvfb :1 -screen 0 1280x768x24 &
echo 'export DISPLAY=:1' >>/etc/bashrc