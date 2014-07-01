#! /bin/bash

READER_VERSION='v'$(grep version package.json | awk -F\" '{print $(NF-1)}')
READER_VERSION=$READER_VERSION-$BUILD_NUMBER
echo "Tagging build as $READER_VERSION..."

git checkout master
git tag $READER_VERSION
git push --tags
git push origin master