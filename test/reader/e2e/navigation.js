'use strict';

describe('Navigation', function() {

	var page = require('./page.js');

	it('should reload demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	var _baseStatusTests = function(status){
		// expect status updates to be defined
		expect(status.cfi).not.toBeNull();
		expect(status.cfi.CFI).toBeDefined();
		expect(status.cfi.preview).toBeDefined();
		expect(status.cfi.chapter).toBeDefined();
		expect(status.bookmarksInPage).toBeArray();
		expect(status.bookmarks).toBeArray();
		expect(status.page).toBeNumber();
		expect(status.pages).toBeNumber();
		expect(status.chapter).toBeNumber();
		expect(status.chapters).toBeNumber();
		expect(status.progress).toBeNumber();

		// expect the chapter label and preview to not be empty strings
		expect(status.cfi.preview).toBeTruthy();
		expect(status.cfi.chapter).toBeTruthy();

		// expect progress to be valid
		expect(status.progress).toBeGreaterOrEqualThan(0);
		expect(status.progress).toBeLessOrEqualThan(100);
	};

	it('should loop forward', function() {

		var _previousStatus = null;

		page.loop(function(status){
			_baseStatusTests(status);

			if(_previousStatus){
				expect(status.chapter).toBeGreaterOrEqualThan(_previousStatus.chapter);
			} else {
				// expect on initialization to open chapter 0 and page 0
				expect(status.page).toBe(0);
				expect(status.chapter).toBe(0);
			}

			_previousStatus = status;

			// keep track of progress
			process.stdout.write('> ' + status.progress + '% \r');
		}).then(function(){
			expect(_previousStatus.progress).toBe(100);
			expect(page.hasErrors()).toBe(false);
			console.log();
		});
	});

	it('should loop backwards', function() {

		var _previousStatus = null;

		page.loop(function(status){
			_baseStatusTests(status);

			if(_previousStatus){
				expect(status.chapter).toBeLessOrEqualThan(_previousStatus.chapter);
			}

			_previousStatus = status;

			// keep track of progress
			process.stdout.write('> ' + status.progress + '% \r');
		}, true).then(function(){
			expect(_previousStatus.progress).toBe(0);
			expect(page.hasErrors()).toBe(false);
			console.log();
		});
	});
});