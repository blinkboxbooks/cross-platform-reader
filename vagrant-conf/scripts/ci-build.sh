#!/bin/bash

# building...
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;grunt ci-init ci-build;'