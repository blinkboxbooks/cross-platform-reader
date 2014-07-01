#!/bin/bash

# check for any changes in reader.js, and bump version if so
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;npm run push && npm run pages;'