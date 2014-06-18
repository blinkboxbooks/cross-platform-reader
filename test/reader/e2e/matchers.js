'use strict';

beforeEach(function() {

	var $ = require('jquery');

	this.addMatchers({
		toBeArray: function() {
			var result = $.isArray(this.actual);
			if(result && length){
				result = (this.actual.length === length);
			}
			return result;
		},
		toBeFunction: function() {
			return $.isFunction(this.actual);
		},
		toBeObject: function(){
			return $.isPlainObject(this.actual);
		},
		toBeNumber: function() {
			return $.isNumeric(this.actual);
		},
		toBeGreaterOrEqualThan: function(expected) {
			return this.actual >= expected;
		},
		toBeLessOrEqualThan: function(expected) {
			return this.actual <= expected;
		}
	});
});
