'use strict';

beforeEach(function() {
	this.addMatchers({
		toHaveClass: function(input) {
			return this.actual.hasClass(input);
		},
		toMatch: function(input) {
			return this.actual.is(input);
		},
		toBeArray: function(){
			return $.isArray(this.actual);
		},
		toBeFunction: function(){
			return $.isFunction(this.actual);
		},
		toExist: function(){
			return !!this.actual.length;
		},
		toNotExist: function(){
			return !this.actual.length;
		},
		toHaveReaderStructure: function(){
			var id = this.actual.attr('id');
			return !!this.actual.parents('#' + id + '_wrap').length &&
				!!this.actual.parent().siblings('#cpr-header').length &&
				!!this.actual.parent().siblings('#cpr-footer').length;
		},
		toHaveCss: function(css){
			for (var prop in css){
				if(css.hasOwnProperty(prop)){
					var value = css[prop];
					// work-around for auto property
					if (value === 'auto' && $(this.actual).get(0).style[prop] === 'auto'){
						continue;
					}
					if ($(this.actual).css(prop) !== value){
						return false;
					}
				}
			}
			return true;
		}
	});
});
