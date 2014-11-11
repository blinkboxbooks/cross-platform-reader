'use strict';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

beforeEach(function() {

	jasmine.addMatchers({
		toMatch: function() {
			return {
				compare: function(actual, input){
					return { pass: $(actual).is(input) };
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
		toBeEmptyArray: function() {
			return {
				compare: function(actual){
					return { pass: $.isArray(actual) && actual.length === 0 };
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
					// todo write more validations
					var hasSingleChild = actual.children().length === 1,
						childIsiFrame = actual.children().first().is('iframe'),
						contents = actual.children().first().contents(),
						hasHeader = contents.has('#cpr-header'),
						hasFooter = contents.has('#cpr-footer'),
						hasReader = contents.has('#cpr-reader');

					return {
						pass: hasSingleChild && childIsiFrame && hasHeader && hasFooter && hasReader
					};
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
							// todo workaround for font-size and line height. different browsers calculate font-size differently, therefore the test only checks if the actual font-size is within +-1px of expected value
							// can be removed once this is fixed https://tools.mobcastdev.com/jira/browse/CR-264
							if(prop === 'font-size' || prop === 'line-height'){
								var avalue = parseInt($(actual).css(prop), 10), dvalue = parseInt($dummy.css(prop), 10);
								if (avalue + 1 < dvalue || avalue - 1 > dvalue){
									result = false;
								}
							}
							else if ($(actual).css(prop) !== $dummy.css(prop)){
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
		},
		toHaveAttributes: function(){
			return {
				compare: function(actual, attrs){
					var result = true;
					for (var prop in attrs){
						if(attrs.hasOwnProperty(prop)){
							if ($(actual).attr(prop) !== attrs[prop]){
								result = false;
							}
						}
					}
					return { pass: result };
				}
			};
		}
	});
});
