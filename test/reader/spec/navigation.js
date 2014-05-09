'use strict';

describe('Navigation', function() {

	var testBookUrl = '/base/app/books/9780007441235',
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		currentStatus = null,
		previousStatus = null,
		$container = null,
		defaultArgs = {
			url: testBookUrl,
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
						flags.loadingComplete = false;
						break;
					case 6: // reader finished loading
						break;
					case 7: // reader returned status
						previousStatus = currentStatus;
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
						flags.hasErrors = true;
						break;
				}
			}
		};

	beforeEach(function(){
		// create a new container for the reader
		$container = $('<div></div>').appendTo($('body'));

		// reset flags and variables
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;

		currentStatus = null;
		previousStatus = null;
	});

	afterEach(function(){
		expect($container).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	it('should navigate from start to the end of the book and backwards', function(done){
		var _commonTests = function(){
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
			expect(currentStatus.progress).toBe(READER.getProgress());

			// expect the chapter label and preview to not be empty strings
			expect(currentStatus.cfi.preview).toBeTruthy();
			expect(currentStatus.cfi.chapter).toBeTruthy();

			// expect progress to be valid
			expect(currentStatus.progress).toBeGreaterOrEqualThan(0);
			expect(currentStatus.progress).toBeLessOrEqualThan(100);

			// expect no errors
			expect(flags.hasErrors).toBe(false);
		};

		var _nextLoop = function(){
			_commonTests();

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

			if(flags.hasNext){
				READER.next().then(_nextLoop);
			} else {
				// we reached the end of the book
				expect(currentStatus.progress).toBe(100);

				// prepare to go backwards within the book
				flags.hasPrev = true;
				READER.prev().then(_prevLoop);
			}
		};

		var _prevLoop = function(){
			_commonTests();

			expect(currentStatus.progress).toBeLessOrEqualThan(previousStatus.progress);

			// if we are in the same chapter, expect the page number to be decreased
			// else the chapter to be increased
			if(currentStatus.chapter === previousStatus.chapter){
				expect(currentStatus.page).toBe(previousStatus.page - 1);
			} else {
				expect(currentStatus.chapter).toBe(previousStatus.chapter - 1);
			}

			if(flags.hasPrev){
				READER.prev().then(_prevLoop);
			} else {
				// we reached the beginning of the book again
				expect(currentStatus.progress).toBe(0);

				// end current test
				done();
			}
		};

		READER.init($.extend({
				container: $container
			}, defaultArgs)).then(function(){

				// expect on initialization to open chapter 0 and page 0
				expect(currentStatus.page).toBe(0);
				expect(currentStatus.chapter).toBe(0);

				_nextLoop();
			});

	});

	it('should load the specified chapter', function(done){
		READER.init($.extend({
				container: $container
			}, defaultArgs)).then(function(){
				var spine = JSON.parse(READER.getSPINE());

				function saveChapter(chapter){
					chapters.push(chapter.href);
					if(chapter.children){
						for(var i = 0, l = chapter.children.length; i < l; i++){
							saveChapter(chapter.children[i]);
						}
					}
				}

				for(var i = 0, l = spine.length; i < l; i++){
					saveChapter(spine[i]);
				}

				expect(currentStatus.chapters).toBe(chapters.length);

				loadChapterTest(0);
			});

		// an array of chapter urls to test
		var chapters = [];

		function loadChapterTest(index){
			READER.loadChapter(chapters[index]).then(function(){
				// expect no errors
				expect(flags.hasErrors).toBe(false);
				expect(currentStatus.chapter).toBe(index);
				expect(currentStatus.page).toBe(0);

				if(index < chapters.length - 1){
					loadChapterTest(index+1);
				} else {
					done();
				}
			});
		}
	});
});