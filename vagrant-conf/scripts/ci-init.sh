#!/bin/bash

vagrant ssh-config | ssh -F /dev/stdin default 'sh /vagrant/vagrant-conf/scripts/init.sh;'