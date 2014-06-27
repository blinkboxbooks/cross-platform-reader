#!/bin/bash

# We need to switch to the master branch before making any changes that we want to commit
# because the Jenkins Git-plugin default branch is 'no-branch'
# git checkout master

# check for any changes in reader.js, and bump version if so
npm run tags

# build
vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;npm run build;'