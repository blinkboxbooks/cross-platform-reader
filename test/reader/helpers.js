'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

beforeEach(function() {

	jasmine.addMatchers({
		toHaveClass: function() {
			return {
				compare: function(actual, expected){
					return { pass: actual.hasClass(expected) };
				}
			};
		},
		toMatch: function() {
			return {
				compare: function(actual, input){
					return { pass: actual.is(input) };
				}
			};
		},
		toBeArray: function() {
			return {
				compare: function(actual){
					return { pass: $.isArray(actual) };
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
