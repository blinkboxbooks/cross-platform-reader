#! /bin/bash

READER_VERSION='v'$(grep version package.json | awk -F\" '{print $(NF-1)}')
LATEST=$( git for-each-ref refs/tags --sort=-authordate --format='%(refname)' --count=1)
echo 'Latest git tag is '$LATEST'. Checking if there are differences in the reader folder...'

CHANGED=$(git diff $LATEST -- app/reader, app/lib)
if [ "$CHANGED" ];
then
	echo 'Reader library changed. Patching version...'
	READER_VERSION=$(npm version patch --no-git-tag-version)
	echo 'Reader is now at '$READER_VERSION'. Pushing changes...'
	git add package.json
	git commit -m 'Updating reader version to '$READER_VERSION
	git push origin master
else
	echo 'Nothing changed, keeping old version...'
fi

READER_VERSION=$READER_VERSION-$BUILD_NUMBER
echo "Tagging build as $READER_VERSION..."

git tag $READER_VERSION
git push --tags