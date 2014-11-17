#! /bin/bash

READER_VERSION='v'$(grep version package.json | awk -F\" '{print $(NF-1)}')
REPOSITORY=master

if [ "$BUILD_SUFFIX" ];
then
	READER_VERSION=$READER_VERSION-$BUILD_SUFFIX
	REPOSITORY=development
fi

READER_VERSION=$READER_VERSION-$BUILD_NUMBER
echo "Tagging build as $READER_VERSION..."

git checkout $REPOSITORY
git tag $READER_VERSION
git push --tags
git push origin $REPOSITORY
