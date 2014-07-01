#!/bin/sh

cd /vagrant

# installing dependencies
npm install && bower install

# start  a selenium server to run in the background for e2e tests
nohup node_modules/protractor/bin/webdriver-manager start 0<&- &>/dev/null &

