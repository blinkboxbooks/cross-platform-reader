'use strict';

// Use the external Chai As Promised to deal with resolving promises in expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

/*jshint -W079 */
var expect = chai.expect,
	page = require('../page');

module.exports = function() {

	this.Given(/^I open book with the ISBN of ([^"]*)$/, function(isbn, next) {
		page.load(isbn, 1, 1).then(function(){
			next();
		});
	});

	this.Given(/^I go to chapter (\d+) page (\d+)$/, function (chapter, pageNumber, next) {
		chapter = parseInt(chapter, 10);
		pageNumber = parseInt(pageNumber, 10);

		var found = false;

		// loop through the book until the specified location is found
		page.loop(function(status){
			if(status.chapter === chapter && status.page === pageNumber){
				found = true;
				return protractor.promise.rejected(); // stop loop
			} else {
				if(status.chapter > chapter || (status.chapter === chapter && status.page > pageNumber)){
					return protractor.promise.rejected(); // stop loop
				}
			}
		}).then(function(){
				if(found){
					next();
				}	else {
					next.fail('Book location not found');
				}
			});
	});

	this.Given(/^I open a book$/, function (next) {
		page.load().then(function(){
			next();
		});
	});

	this.Given(/^I change the font family to "([^"]*)"$/, function (fontFamily, next) {
		// get font family option matching the selector and click it
		page.fontFamily.filter(function(option){
			return option.getText().then(function(text){
				return text === fontFamily;
			});
		}).then(function(el){
			el[0].click().then(function(){
				next();
			});
		});
	});

	this.Then(/^I want to bookmark the current page$/, function (next) {
		page.bookmark().then(function(status){
			expect(status.bookmarksInPage.length).to.equal(1);
			next();
		});
	});

	this.Then(/^I expect the text "([^"]*)" to not be clipped$/, function (text, next) {
		page.readerContext(function(){
			expect(element(by.xpath('//*[contains(text(),"'+text+'")]')).getCssValue('text-indent').then(parseFloat)).to.eventually.be.at.least(0).and.notify(next);
		});
	});

	this.Then(/^I expect the header to have font family "([^"]*)"$/, function (fontFamily, next) {
		// express the regexp above with the code you wish you had
		page.readerContext(function(contents, body, reader, header){
			expect(header.getCssValue('font-family')).to.eventually.equal(fontFamily).and.notify(next);
		});
	});

	this.Then(/^I expect the footer to have font family "([^"]*)"$/, function (fontFamily, next) {
		// express the regexp above with the code you wish you had
		page.readerContext(function(contents, body, reader, header, footer){
			expect(footer.getCssValue('font-family')).to.eventually.equal(fontFamily).and.notify(next);
		});
	});

};