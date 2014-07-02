#!/bin/bash

# team city does not update local tags
git fetch origin --prune --tags

vagrant ssh-config | ssh -F /dev/stdin default 'sh /vagrant/vagrant-conf/scripts/init.sh;'