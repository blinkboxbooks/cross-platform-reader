'use strict';

describe('Navigation', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#navigation_test',
		flags = {
			isLoaded: false,
			hasErrors: false,
			hasNext: true
		},
		currentStatus = null,
		previousStatus = null,
		defaultArgs = {
			url: testBookUrl,
			container: readerID,
			width: 400,
			height: 600,
			listener: function(ev){
				switch(ev.code){
					case 2: // reader reached end of book
						flags.hasNext = false;
						break;
					case 7: // reader returned status
						previousStatus = currentStatus;
						currentStatus = ev;
						flags.isLoaded = true;
						break;
					case 9: // reader missing a file
					case 10: // parsing failed
					case 11: // cfi generation error
					case 12: // cfi insertion
					case 13: // invalid argument
					case 14: // cannot add bookmark
					case 15: // bookmark already exists
					case 16: // cannot remove bookmark
						flags.hasErrors = true;
						break;
				}
			}
		};

	beforeEach(function(){
		flags.isLoaded = false;
		flags.hasErrors = false;
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));
		READER.init($.extend({}, defaultArgs));
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	it('should navigate from start to the end of the book', function(){

		function load(){
			waitsFor(function(){
				return flags.isLoaded;
			}, 'waiting for next page', 1000);

			runs(function(){

				// expect status updates to be defined
				expect(currentStatus.cfi).not.toBeNull();
				expect(currentStatus.cfi.CFI).toBeDefined();
				expect(currentStatus.cfi.preview).toBeDefined();
				expect(currentStatus.cfi.chapter).toBeDefined();
				expect(currentStatus.bookmarksInPage).toBeArray();
				expect(currentStatus.bookmarks).toBeArray();
				expect(currentStatus.page).toBeNumber();
				expect(currentStatus.pages).toBeNumber();
				expect(currentStatus.chapter).toBeNumber();
				expect(currentStatus.chapters).toBeNumber();
				expect(currentStatus.progress).toBeNumber();

				// expect the chapter label and preview to not be empty strings
				expect(currentStatus.cfi.preview).toBeTruthy();
				expect(currentStatus.cfi.chapter).toBeTruthy();

				// expect progress to be valid
				expect(currentStatus.progress).toBeGreaterOrEqualThan(0);
				expect(currentStatus.progress).toBeLessOrEqualThan(100);

				if(previousStatus){
					expect(currentStatus.progress).toBeGreaterOrEqualThan(previousStatus.progress);

					// if we are in the same chapter, expect the page number to be increased
					// else the chapter to be increased
					if(currentStatus.chapter === previousStatus.chapter){
						expect(currentStatus.page).toBe(previousStatus.page + 1);
					} else {
						expect(currentStatus.chapter).toBe(previousStatus.chapter + 1);
					}
				} else {
					// expect on initialization to open chapter 0 and page 0
					expect(currentStatus.page).toBe(0);
					expect(currentStatus.chapter).toBe(0);
				}

				flags.isLoaded = false;
				READER.next();

				if(flags.hasNext){
					load();
				} else {
					expect(currentStatus.progress).toBe(100);
				}
			});
		};
		load();

	});

});