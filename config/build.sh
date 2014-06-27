#! /bin/bash

################################
# Build the cross platform reader
################################

# install dependencies
echo "installing dependencies..."

npm install --quiet
bower install

# We need to switch to the master branch before making any changes that we want to commit
# because the Jenkins Git-plugin default branch is 'no-branch'
# git checkout master

################################
# check for any changes in reader.js, and bump version if so
################################

npm run tags

# build and run unit tests (creates 'dist' folder)
echo "building..."
grunt ci-init ci-build