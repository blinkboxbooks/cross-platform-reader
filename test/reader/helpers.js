'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

beforeEach(function() {

	jasmine.addMatchers({
		toMatch: function() {
			return {
				compare: function(actual, input){
					return { pass: actual.is(input) };
				}
			};
		},
		toBeArray: function() {
			return {
				compare: function(actual, input){
					var result = $.isArray(actual);
					if(result && input){
						result = (actual.length === input);
					}
					return { pass: result };
				}
			};
		},
		toBeFunction: function() {
			return {
				compare: function(actual){
					return { pass: $.isFunction(actual) };
				}
			};
		},
		toBeObject: function(util){
			return {
				compare: function(actual){
					return { pass: util.equals(actual, jasmine.any(Object)) };
				}
			};
		},
		toBeNumber: function() {
			return {
				compare: function(actual){
					return { pass: $.isNumeric(actual) };
				}
			};
		},
		toExist: function() {
			return {
				compare: function(actual){
					return { pass: !!actual.length };
				}
			};
		},
		toHaveReaderStructure: function() {
			return {
				compare: function(actual){
					var id = actual.attr('id');
					return { pass: !!actual.parents('#' + id + '_wrap').length &&
						!!actual.parent().siblings('#cpr-header').length &&
						!!actual.parent().siblings('#cpr-footer').length };
				}
			};
		},
		toHaveCss: function() {
			return {
				compare: function(actual, css){
					var result = true;
					var $dummy = $('<span></span>').css(css);
					for (var prop in css){
						if(css.hasOwnProperty(prop)){
							if ($(actual).css(prop) !== $dummy.css(prop)){
								result = false;
							}
						}
					}
					return { pass: result };
				}
			};
		},
		toBeGreaterOrEqualThan: function() {
			return {
				compare: function(actual, input){
					return { pass: actual >= input };
				}
			};
		},
		toBeLessOrEqualThan: function() {
			return {
				compare: function(actual, input){
					return { pass: actual <= input };
				}
			};
		}
	});
});
