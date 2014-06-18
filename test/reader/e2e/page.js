'use strict';

var Page = function(){
	this.path = '/demo/#!/9780007441235?env=2';

	var nextButton = element(by.css('[data-test="next-button"]')),
		prevButton = element(by.css('[data-test="prev-button"]')),
		status = element.all(by.css('[data-test="status"]')).first(),
		errors = element.all(by.css('[data-test="error"]'));

	this.load = function(){
		browser.get(this.path);
		browser.waitForAngular();
	};

	this.next = function(){
		return nextButton.isEnabled().then(function(isEnabled){
			if(isEnabled){
				nextButton.click();

				browser.wait(function() {
					return status.isPresent();
				}, 2000);

				return status.getText().then(function(e){
					return JSON.parse(e);
				});
			}
			// button is not clickable, cannot go next, reject
			var defer = protractor.promise.defer();
			defer.reject();
			return defer.promise; // error handler required to prevent test failure
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

	this.hasErrors = function(){
		return errors.count().then(function(count){
			return count > 0;
		});
	};


	/**
	 * This function will loop through the entire book by either calling next or previous repeatedly.
	 * callback is a function called every time the status updates
	 * done is a function called when the loop is complete
	 * reverse is a flag that tell the reader to loop backwards
	 * */
	this.loop = function(callback, done, reverse){

		var _action = !reverse ? this.next : this.prev;

		var	_loop = function(status){
			callback(status);

			// the action will be rejected if the action cannot be completed (exp calling next on the last page)
			_action().then(_loop, done);
		};

		this.status().then(_loop);
	};

};

module.exports = new Page();