#! /bin/bash

LATEST=$( git for-each-ref refs/tags --sort=-authordate --format='%(refname)' --count=1)
echo 'Latest git tag is '$LATEST'. Checking if there are differences in the reader folder...'

CHANGED=$(git diff $LATEST -- app/reader, app/lib)
if [ "$CHANGED" ];
then
	echo 'Reader library changed. Patching version...'
	grunt bump
fi