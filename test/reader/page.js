'use strict';

var Page = function(){
	this.path = 'http://localhost:9001/demo/#!/';

	var nextButton = element(by.css('[data-test="next-button"]')),
		prevButton = element(by.css('[data-test="prev-button"]')),
		status = element.all(by.css('[data-test="status"]')).first(),
		errors = element.all(by.css('[data-test="error"]')),
		fontSize = element(by.css('[data-test="font-size"]')),
		lineHeight = element(by.css('[data-test="line-height"]')),
		bookmark = element(by.css('[data-test="bookmark-button"]')),
		width = element(by.css('[data-test="width"]')),
		height = element(by.css('[data-test="height"]')),
		columns = element(by.css('[data-test="columns"]')),
		padding = element(by.css('[data-test="padding"]')),
		reader = element(by.css('[data-test="reader"] iframe'));

	this.fontFamily = element.all(by.css('[data-test="font-family"] option'));
	this.textAlign = element.all(by.css('[data-test="text-align"] option'));
	this.theme = element.all(by.css('[data-test="theme"] option'));
	this.margin = element.all(by.css('[data-test="margin"] option'));
	this.isbn = element(by.css('[data-test="isbn"]'));

	this.load = function(isbn, env, publisherStyles){
		browser.get(this.path + (isbn || '9780007441235') + '?env=' + (typeof env === 'undefined' ? 2 : env) + '&publisherStyles='+(!!publisherStyles ? 'true' : 'false')+'&transitionDuration=0');
		return browser.waitForAngular();
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

		action(
			element.all(by.css('#cpr-reader span, #cpr-reader p, #cpr-reader em, #cpr-reader div, #cpr-reader strong, #cpr-reader a')).first(),
			element(by.css('body')),
			element(by.css('#cpr-reader')),
			element(by.css('#cpr-header')),
			element(by.css('#cpr-footer')),
			element(by.css('body > div:nth-of-type(2)')) // todo better selector
		);

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
			var promise = callback(status);

			if(protractor.promise.isPromise(promise)){
				promise.then(function(){
					// the action will be rejected if the action cannot be completed (exp calling next on the last page)
					_action().then(_loop, _defer.fulfill);
				}, _defer.fulfill);
			} else {
				// the action will be rejected if the action cannot be completed (exp calling next on the last page)
				_action().then(_loop, _defer.fulfill);
			}
		};

		this.status().then(_loop);

		return _defer.promise;
	};

	// clears an input and sets the specified value
	var _input = function(el, value){
		return el.clear().then(function(){
			return el.sendKeys(value);
		});
	};

	this.setFontSize = function(value){
		return _input(fontSize, value);
	};

	this.setLineHeight = function(value){
		return _input(lineHeight, value);
	};

	this.bookmark = function(){
		var status = this.status;
		return bookmark.click().then(function(){
			return status();
		});
	};

	this.resize = function(dimension){
		return protractor.promise.all([
				_input(width, dimension.width),
				_input(height, dimension.height),
				_input(columns, dimension.columns),
				_input(padding, dimension.padding),
			]).then(function(){
				return reader.getSize();
			});
	};
};

module.exports = new Page();