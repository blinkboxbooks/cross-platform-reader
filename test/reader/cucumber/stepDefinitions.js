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
		page.load(isbn + '?env=1');
		next();
	});

	this.Then(/^the isbn should equal "([^"]*)"$/, function(isbn, next) {
		expect(page.isbn.getText()).to.eventually.equal(isbn).and.notify(next);
	});

};