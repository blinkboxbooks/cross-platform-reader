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
		page.load(isbn, 1);
		next();
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

	this.Then(/^the isbn should equal "([^"]*)"$/, function(isbn, next) {
		expect(page.isbn.getText()).to.eventually.equal(isbn).and.notify(next);
	});

	this.Then(/^I want to bookmark the current page$/, function (next) {
		page.bookmark().then(function(status){
			expect(status.bookmarksInPage.length).to.equal(1);
			next();
		});
	});
};