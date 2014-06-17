'use strict';

var Page = function(){
	this.path = '/demo/#!/9780007441235?env=2';
	this.next = element(by.css('[data-test="next-button"]'));
	this.prev = element(by.css('[data-test="prev-button"]'));
	this.status = element.all(by.css('[data-test="status"]'));

	this.load = function(){
		browser.get(this.path);
		browser.waitForAngular();
	};

};

module.exports = new Page();