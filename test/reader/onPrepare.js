'use strict';

// maximize browser window
browser.driver.manage().window().maximize();

// some extra basic matchers
require('jasmine-expect');
var Color = require('color');

beforeEach(function() {

	this.addMatchers({
		toBeGreaterOrEqualThan: function(expected) {
			return this.actual >= expected;
		},
		toBeLessOrEqualThan: function(expected) {
			return this.actual <= expected;
		},
		toBeApx: function(expected, diff) {
			diff = diff || 1; // note, diff cannot be 0, use toEqual instead
			var actual = parseInt(this.actual, 10);
			return actual > expected - diff && actual < expected + diff;
		},
		toEqualColor: function(expected){
			var actualColor = new Color(this.actual), expectedColor = new Color(expected);
			return actualColor.hexString() === expectedColor.hexString() && actualColor.alpha() === expectedColor.alpha();
		}
	});
});

var fs = require('fs'),
	path = require('path');

// Add global spec helpers in this file
var getDateStr = function () {
	var d = (new Date() + '').replace(new RegExp(':', 'g'), '-').split(' ');
	// "2013-Sep-03-21:58:03"
	return [d[3], d[1], d[2], d[4]].join('-');
};

var errorCallback = function (err) {
	console.log(err);
};

afterEach(function(){
	// this is for development purposes only
	// browser.sleep(1000);

	var passed = jasmine.getEnv().currentSpec.results().passed();
	// Replace all space characters in spec name with dashes
	var specName = jasmine.getEnv().currentSpec.description.replace(new RegExp(' ', 'g'), '-'),
		baseFileName = specName + '-' + getDateStr(),
		screenshotsDir = path.resolve(__dirname + '/../../screenshots/');

	if (!passed) {
		// Create screenshots dir if doesn't exist
		console.log('screenshotsDir = [' + screenshotsDir + ']');
		if (!fs.existsSync(screenshotsDir)) {
			fs.mkdirSync(screenshotsDir);
		}

		var pngFileName = path.resolve(screenshotsDir + '/' + baseFileName + '.png');
		browser.takeScreenshot().then(function (png) {
			// Do something with the png...
			console.log('Writing file ' + pngFileName);
			fs.writeFileSync(pngFileName, png, {encoding: 'base64'}, function (err) {
				console.log(err);
			});
		}, errorCallback);
	}
});
