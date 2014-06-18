'use strict';

describe('Navigation', function() {

	var page = require('./page.js');

	beforeEach(function(){
		console.log(jasmine.getEnv().currentSpec.description);
	});

	afterEach(function(){
		// this is for development purposes only
		// browser.sleep(10000);
	});

	it('should load demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	it('should go to next page', function() {

		var _previousStatus = null;

		page.loop(function(status){
			expect(page.hasErrors()).toBe(false);

			if(_previousStatus){
				expect(status.progress).toBeGreaterOrEqualThan(_previousStatus.progress);

				// if we are in the same chapter, expect the page number to be increased
				// else the chapter to be increased
				if(status.chapter === _previousStatus.chapter){
					expect(status.page).toBe(_previousStatus.page + 1);
				} else {
					expect(status.chapter).toBe(_previousStatus.chapter + 1);
				}
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
			console.log();
		});
	});

	it('should go to previous page', function() {

		var _previousStatus = null;

		page.loop(function(status){
			expect(page.hasErrors()).toBe(false);

			if(_previousStatus){
				expect(status.progress).toBeLessOrEqualThan(_previousStatus.progress);

				// if we are in the same chapter, expect the page number to be decreased
				// else the chapter to be increased
				if(status.chapter === _previousStatus.chapter){
					expect(status.page).toBe(_previousStatus.page - 1);
				} else {
					expect(status.chapter).toBe(_previousStatus.chapter - 1);
				}
			}

			_previousStatus = status;

			// keep track of progress
			process.stdout.write('> ' + status.progress + '% \r');
		}, true).then(function(){
			expect(_previousStatus.progress).toBe(0);
		});
	});
});