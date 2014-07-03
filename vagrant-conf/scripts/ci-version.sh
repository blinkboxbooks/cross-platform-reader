#!/bin/bash

# team city does not update local tags
git fetch origin --prune --tags

# Check for any changes in reader.js, and bump version if so

LATEST=$( git for-each-ref refs/tags --sort=-authordate --format='%(refname)' --count=1)
echo 'Latest git tag is '$LATEST'. Checking if there are differences in the reader folder...'

CHANGED=$(git diff $LATEST -- app/reader app/lib)
if [ "$CHANGED" ];
then
	echo 'Reader library changed. Patching version...'

	vagrant ssh-config | ssh -F /dev/stdin default 'cd /vagrant;grunt bump;'
    git add package.json
    git commit -m "New release"
fi