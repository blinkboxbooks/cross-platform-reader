'use strict';

var Page = function(){
	this.path = '/demo/#!/9780007441235?env=2';

	var nextButton = element(by.css('[data-test="next-button"]')),
		prevButton = element(by.css('[data-test="prev-button"]')),
		status = element.all(by.css('[data-test="status"]')).first();

	this.load = function(){
		browser.get(this.path);
		browser.waitForAngular();
	};

	this.next = function(){
		nextButton.click();

		browser.wait(function() {
			return status.isPresent();
		}, 2000);

		return status.getText().then(function(e){
			return JSON.parse(e);
		});
	};

	this.prev = function(){
		prevButton.click();

		browser.wait(function() {
			return status.isPresent();
		}, 2000);

		return status.getText().then(function(e){
			return JSON.parse(e);
		});
	};

	this.status = function(){
		return status.getText().then(function(e){
			return JSON.parse(e);
		});
	};

};

module.exports = new Page();