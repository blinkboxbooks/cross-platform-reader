'use strict';

beforeEach(function() {

	// some extra basic matchers
	require('jasmine-expect');

	this.addMatchers({
		toBeGreaterOrEqualThan: function(expected) {
			return this.actual >= expected;
		},
		toBeLessOrEqualThan: function(expected) {
			return this.actual <= expected;
		},
		toHaveCss: function(){
			return true;
		}
	});

	console.log(jasmine.getEnv().currentSpec.description);
});

afterEach(function(){
	// this is for development purposes only
	// browser.sleep(1000);
});
