'use strict';

var Page = function(){
	this.path = '/demo/#!/9780007441235?env=2';

	var nextButton = element(by.css('[data-test="next-button"]')),
		prevButton = element(by.css('[data-test="prev-button"]')),
		status = element.all(by.css('[data-test="status"]')).first(),
		errors = element.all(by.css('[data-test="error"]')),
		fontSize = element(by.css('[data-test="font-size"]')),
		lineHeight = element(by.css('[data-test="line-height"]')),
		contents = element.all(by.css('#cpr-reader span, #cpr-reader p, #cpr-reader em, #cpr-reader div, #cpr-reader strong, #cpr-reader a')).first();

	this.load = function(path){
		browser.get(this.path + (path || ''));
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
			return protractor.promise.rejected();
		});
	};

	this.prev = function(){
		return prevButton.isEnabled().then(function(isEnabled){
			if(isEnabled){
				prevButton.click();

				browser.wait(function() {
					return status.isPresent();
				}, 2000);

				return status.getText().then(function(e){
					return JSON.parse(e);
				});
			}
			// button is not clickable, cannot go next, reject
			return protractor.promise.rejected();
		});
	};

	this.status = function(){
		return status.getText().then(function(e){
			return JSON.parse(e);
		});
	};

	/**
	 * Protractor can only work in one document at a time.
	 * If a test should require access to the contents of the reader's iframe, it should wrap any tests in this function, which temporarily switches the context of protractor
	 * */
	this.readerContext = function(action){
		var ptor = protractor.getInstance();

		ptor.switchTo().frame('reader');
		ptor.ignoreSynchronization = true;

		action(contents);

		ptor.switchTo().defaultContent();
		ptor.ignoreSynchronization = false;
	};

	this.hasErrors = function(){
		return errors.count().then(function(count){
			return count > 0;
		});
	};


	/**
	 * This function will loop through the entire book by either calling next or previous repeatedly.
	 * callback is a function called every time the status updates
	 * reverse is a flag that tell the reader to loop backwards
	 * returns a promise that resolves when the loop completes
	 * */
	this.loop = function(callback, reverse){

		var _defer = protractor.promise.defer(),
			_action = !reverse ? this.next : this.prev;

		var	_loop = function(status){
			callback(status);

			// the action will be rejected if the action cannot be completed (exp calling next on the last page)
			_action().then(_loop, _defer.fulfill);
		};

		this.status().then(_loop);

		return _defer.promise;
	};

	this.setFontSize = function(value){
		return fontSize.clear().then(function(){
			return fontSize.sendKeys(value);
		});
	};

	this.setLineHeight = function(value){
		return lineHeight.clear().then(function(){
			return lineHeight.sendKeys(value);
		});
	};

};

module.exports = new Page();