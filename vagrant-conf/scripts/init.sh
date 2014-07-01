#!/bin/sh

cd /vagrant

# installing dependencies
npm install && bower install

# start  a selenium server to run in the background for e2e tests
# we must replace stdin and out to allow the command to exit, it will print results in a file instead
# http://stackoverflow.com/questions/8208033/what-does-dev-null-dev-null-at-the-end-of-a-command-do
nohup node_modules/protractor/bin/webdriver-manager start 0<&- &>/dev/null &

