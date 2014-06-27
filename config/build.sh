#! /bin/bash

################################
# Build the cross platform reader
################################

# install dependencies
echo "installing dependencies..."

npm install --quiet
bower install

# build and run unit tests (creates 'dist' folder)
echo "building..."
grunt ci-init ci-build