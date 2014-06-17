'use strict';

describe('Navigation', function() {

	var page = require('./page.js');

	afterEach(function(){
		browser.sleep(1000);
	});

	it('should load demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	it('should go next page', function() {
		page.next.click();
		expect(page.status.first().getText()).toBe(null);
		browser.sleep(1000);
		expect(page.status.first().getText()).toBe(null);
	});
});