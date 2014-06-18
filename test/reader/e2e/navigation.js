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

		var previousStatus = null;
		var _nextLoop = function(status){
			if(previousStatus){
				// expect(status.progress).toBeGreaterOrEqualThan(previousStatus.progress);

				// if we are in the same chapter, expect the page number to be increased
				// else the chapter to be increased
				if(status.chapter === previousStatus.chapter){
					console.log('>> Page ' + status.page + ' of ' + status.pages);
					expect(status.page).toBe(previousStatus.page + 1);
				} else {
					console.log('> Chapter ' + status.chapter + ' of ' + status.chapters);
					expect(status.chapter).toBe(previousStatus.chapter + 1);
				}
			} else {
				console.log('> Chapter 1');

				// expect on initialization to open chapter 0 and page 0
				expect(status.page).toBe(0);
				expect(status.chapter).toBe(0);
			}

			previousStatus = status;

			if(status.chapter < status.chapters - 1 && status.page <= status.pages){
				page.next().then(_nextLoop);
			}
		};

		page.status().then(_nextLoop);
	});
});