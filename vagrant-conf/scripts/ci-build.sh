#!/bin/bash

# building...
# we need to export build number to vagrant environment
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;export BUILD_NUMBER=$BUILD_NUMBER;grunt ci-init ci-build;'