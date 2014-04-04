'use strict';

describe('Bookmarks', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#bookmarks_test',
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		currentStatus = null,
		defaultArgs = {
			url: testBookUrl,
			container: readerID,
			width: 400,
			height: 600,
			listener: function(ev){
				switch(ev.code){
					case 0: // reader reached last page of book
						flags.hasNext = false;
						break;
					case 4: // reader reached first page of book
						flags.hasPrev = false;
						break;
					case 5: // reader started loading
						break;
					case 6: // reader finished loading
						break;
					case 7: // reader returned status
						currentStatus = ev;
						break;
					case 9: // reader missing a file
					case 10: // parsing failed
					case 11: // cfi generation error
					case 12: // cfi insertion
					case 13: // invalid argument
					case 14: // cannot add bookmark
					case 15: // bookmark already exists
					case 16: // cannot remove bookmark
						console.log(ev);
						flags.hasErrors = true;
						break;
				}
			}
		};

	beforeEach(function(){
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));

		// reset flags and variables
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;

		currentStatus = null;
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	it('should successfully bookmark every page of the book', function(done){
		var _nextLoop = function(){
			if(flags.hasErrors){
				// terminate test if we have errors
				done();
			}

			READER.setBookmark();

			// expect no errors
			expect(flags.hasErrors).toBe(false);

			// expect bookmarks to be defined
			expect(currentStatus.bookmarksInPage).toBeArray(1);
			expect(currentStatus.bookmarks).toBeArray();
			expect(currentStatus.cfi).toBeDefined();
			expect(currentStatus.cfi.CFI).toBeDefined();
			expect(currentStatus.bookmarksInPage[0]).toEqual(currentStatus.cfi.CFI);

			if(flags.hasNext){
				READER.next().then(_nextLoop);
			} else {
				// we reached the end of the book
				done();
			}
		};

		READER.init($.extend({}, defaultArgs)).then(function(){

			// expect on initialization to open chapter 0 and page 0
			expect(currentStatus.page).toBe(0);
			expect(currentStatus.chapter).toBe(0);

			expect(currentStatus.bookmarksInPage).toBeArray(0);
			expect(currentStatus.bookmarks).toBeArray(0);

			_nextLoop();
		});

	});
});