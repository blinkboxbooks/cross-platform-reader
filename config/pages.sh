#! /bin/bash

echo "Updating Github Pages..."

READER_VERSION='v'$(grep version package.json | awk -F\" '{print $(NF-1)}')
READER_VERSION=$READER_VERSION-$BUILD_NUMBER

git fetch web-app gh-pages
git checkout gh-pages
rm -r latest
git rm -r latest
cp -r dist latest
cp -r dist $READER_VERSION
git add latest
git add $READER_VERSION
git commit -m "Added build $READER_VERSION to gh-pages"
git push web-app gh-pages
git checkout master