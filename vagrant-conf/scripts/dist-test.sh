#!/bin/bash

# build
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;grunt;'

# use nginx 'dist' config and restart nginx
vagrant ssh-config | ssh -F /dev/stdin default 'sudo cp /vagrant/vagrant-conf/nginx/ci-conf/nginx.conf /usr/local/nginx/conf;sudo service nginx reload'