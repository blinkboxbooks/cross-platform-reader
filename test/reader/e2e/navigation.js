'use strict';

describe('Navigation', function() {

	var page = require('./page.js');

	beforeEach(function(){
		console.log(jasmine.getEnv().currentSpec.description);
	});

	afterEach(function(){
		// this is for development purposes only
		// browser.sleep(1000);
	});

	it('should load demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	it('should go next page', function() {

		var previousStatus = null;
		var _nextLoop = function(status){
			if(previousStatus){
				//expect(status.progress).toBeGreaterOrEqualThan(previousStatus.progress);

				// if we are in the same chapter, expect the page number to be increased
				// else the chapter to be increased
				if(status.chapter === previousStatus.chapter){
					expect(status.page).toBe(previousStatus.page + 1);
				} else {
					expect(status.chapter).toBe(previousStatus.chapter + 1);
				}
			} else {
				// expect on initialization to open chapter 0 and page 0
				expect(status.page).toBe(0);
				expect(status.chapter).toBe(0);
			}

			previousStatus = status;

			// keep track of progress
			process.stdout.write('> ' + status.progress + '% \r');

			page.next().then(_nextLoop, function(){
				// book finished
			});
		};

		page.status().then(_nextLoop);
	});
});