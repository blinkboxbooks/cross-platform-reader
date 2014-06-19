'use strict';

beforeEach(function() {

	var _ = require('underscore-node');

	this.addMatchers({
		toBeArray: function(length) {
			var result = _.isArray(this.actual);
			if(result && length){
				result = (this.actual.length === length);
			}
			return result;
		},
		toBeFunction: function() {
			return _.isFunction(this.actual);
		},
		toBeObject: function(){
			return _.isObject(this.actual);
		},
		toBeNumber: function() {
			return _.isNumber(this.actual);
		},
		toBeGreaterOrEqualThan: function(expected) {
			return this.actual >= expected;
		},
		toBeLessOrEqualThan: function(expected) {
			return this.actual <= expected;
		}
	});
});
