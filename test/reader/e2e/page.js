'use strict';

var Page = function(){
	this.path = '/demo/#!/9780007441235?env=2';

	this.load = function(){
		browser.get(this.path);
		browser.waitForAngular();
	};

};

module.exports = new Page();