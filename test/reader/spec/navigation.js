'use strict';

describe('Navigation', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#navigation_test',
		flags = {
			statusUpdated: false,
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
			loadingComplete: false
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
						flags.loadingComplete = true;
						break;
					case 7: // reader returned status
						previousStatus = currentStatus;
						currentStatus = ev;
						flags.statusUpdated = true;
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
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));
		READER.init($.extend({}, defaultArgs));

		// reset flags and variables
		flags.statusUpdated = false;
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;
		flags.loadingComplete = false;

		currentStatus = null;
		previousStatus = null;
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	it('should navigate from start to the end of the book and backwards', function(){

		function commonTests(){
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
		}

		function goNext(){
			waitsFor(function(){
				return flags.statusUpdated;
			}, 'waiting for next page', 1000);

			runs(function(){

				commonTests();

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
					flags.statusUpdated = false;
					READER.next();
					goNext();
				} else {
					// we reached the end of the book
					expect(currentStatus.progress).toBe(100);

					// prepare to go backwards within the book
					flags.hasPrev = true;
					flags.statusUpdated = false;
					READER.prev();
					goPrev();
				}
			});
		}

		function goPrev(){
			waitsFor(function(){
				return flags.statusUpdated;
			}, 'waiting for prev page', 1000);

			runs(function(){

				commonTests();

				expect(currentStatus.progress).toBeLessOrEqualThan(previousStatus.progress);

				// if we are in the same chapter, expect the page number to be decreased
				// else the chapter to be increased
				if(currentStatus.chapter === previousStatus.chapter){
					expect(currentStatus.page).toBe(previousStatus.page - 1);
				} else {
					expect(currentStatus.chapter).toBe(previousStatus.chapter - 1);
				}

				// expect no errors
				expect(flags.hasErrors).toBe(false);

				if(flags.hasPrev){
					flags.statusUpdated = false;
					READER.prev();
					goPrev();
				} else {
					// we reached the beginning of the book again
					expect(currentStatus.progress).toBe(0);
				}
			});
		}

		goNext();

	});


	it('should load the specified chapter', function(){
		// ana array of chapter urls to test
		var chapters = [];

		waitsFor(function(){
			return flags.statusUpdated;
		}, 'the reader to load the book', 1000);

		runs(function(){
			// todo expose the spine publicly
			var spine = Reader.SPINE;

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

		function loadChapterTest(index){
			flags.statusUpdated = false;
			READER.loadChapter(chapters[index]);

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the chapter', 1000);

			runs(function(){
				// expect no errors
				expect(flags.hasErrors).toBe(false);
				expect(currentStatus.chapter).toBe(index);
				expect(currentStatus.page).toBe(0);

				if(index < chapters.length - 1){
					loadChapterTest(index+1);
				}
			});
		}
	});
});