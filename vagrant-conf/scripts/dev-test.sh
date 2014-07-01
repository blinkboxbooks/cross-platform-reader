#!/bin/bash

# use nginx dev config and restart nginx
vagrant ssh-config | ssh -F /dev/stdin default 'sudo cp /vagrant/vagrant-conf/nginx/conf/nginx.conf /usr/local/nginx/conf;sudo service nginx reload'

# start grunt server (live reload, watchers)
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;grunt serve;'