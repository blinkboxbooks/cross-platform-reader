'use strict';

// some extra basic matchers
require('jasmine-expect');

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
			return this.actual > expected - diff && this.actual < expected + diff;
		}
	});

	console.log(jasmine.getEnv().currentSpec.description);
});

afterEach(function(){
	// this is for development purposes only
	// browser.sleep(1000);
});
