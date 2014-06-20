'use strict';

describe('Bookmarks', function() {

	var page = require('./page.js');

	it('should reload demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	it('should bookmark every page', function() {

		page.loop(function(status){
			expect(status.bookmarksInPage).toBeArrayOfSize(0);

			// keep track of progress
			process.stdout.write('> ' + status.progress + '% \r');

			return page.bookmark().then(function(status){
				expect(status.bookmarksInPage).toBeArrayOfSize(1);
			});
		});
	});
});