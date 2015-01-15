'use strict';
(function(useIframe){
	var iframeTestSuffix = ' : ' + (useIframe ? 'with iframe' : 'without iframe');
	describe('Navigation' + iframeTestSuffix, function() {

		var page = require('../page.js');

		beforeEach(function(){
			page.useIframe = useIframe;
		});

		it('should reload demo app', function() {
			page.load();
			expect(browser.getCurrentUrl()).toContain(page.path);
		});

		var _baseStatusTests = function(status){
			// expect status updates to be defined
			expect(status.cfi).not.toBeNull();
			expect(status.cfi.CFI).toBeDefined();
			expect(status.cfi.preview).toBeDefined();
			expect(status.bookmarksInPage).toBeArray();
			expect(status.bookmarks).toBeArray();
			expect(status.page).toBeNumber();
			expect(status.pages).toBeNumber();
			expect(status.chapter).toBeNumber();
			expect(status.chapters).toBeNumber();
			expect(status.progress).toBeNumber();

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
			}).then(function(){
				expect(_previousStatus.progress).toBe(100);
				expect(page.hasErrors()).toBe(false);
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
			}, true).then(function(){
				// _previousStatus.progress will not be 0,
				// as we count progress for the displayed page (bottom right).
				expect(page.hasErrors()).toBe(false);
			});
		});
	});
})(/*grunt:useiframe*/true);