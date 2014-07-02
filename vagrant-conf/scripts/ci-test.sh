#!/bin/bash

# build
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;/sbin/fuser -k 9001/tcp;grunt test;'