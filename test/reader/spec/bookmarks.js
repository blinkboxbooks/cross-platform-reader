'use strict';

describe('Bookmarks', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#bookmarks_test',
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		bookmarks = [
			'epubcfi(/6/4!/4/2[title-page]/2/2/2/2)',
			'epubcfi(/6/8!/4/2[contents]/66/2/2/1:0)',
			'epubcfi(/6/10!/4/2[semiprologue]/2/10/3:618)'
		],
		bookmark = 'epubcfi(/6/10!/4/2[semiprologue]/2/14/1:0)',
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

			// should set bookmark in its chapter location
			expect(currentStatus.bookmarks[currentStatus.chapter]).toBeArray();
			expect(currentStatus.bookmarks[currentStatus.chapter]).toContain(currentStatus.cfi.CFI);

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

	var _flattenBookmarks = function(bookmarks){
		var temp = [];
		for(var i = 0, l = bookmarks.length; i < l; i++){
			if(bookmarks[i]){
				temp = temp.concat(bookmarks[i]);
			}
		}
		return temp;
	};

	it('should set all bookmarks', function(done){

		READER.init($.extend({}, defaultArgs)).then(function(){

			expect(currentStatus.bookmarksInPage).toBeArray(0);
			expect(currentStatus.bookmarks).toBeArray(0);

			READER.setBookmarks(bookmarks);
			expect(_flattenBookmarks(currentStatus.bookmarks)).toEqual(bookmarks);

			done();
		});

	});

	it('should disregard previous bookmarks after set', function(done){
		READER.init($.extend({
				bookmarks: [bookmark]
			}, defaultArgs)).then(function(){
				expect(_flattenBookmarks(currentStatus.bookmarks)).toContain(bookmark);

				READER.setBookmarks(bookmarks);
				var test = _flattenBookmarks(currentStatus.bookmarks);
				expect(test).not.toContain(bookmark);
				expect(test).toEqual(bookmarks);

				done();
			});
	});

	it('should initialise with specified bookmarks', function(done){
		READER.init($.extend({
				bookmarks: bookmarks
			}, defaultArgs)).then(function(){

				expect(_flattenBookmarks(currentStatus.bookmarks)).toEqual(bookmarks);
				done();
			});
	});

	it('should set a bookmark', function(done){
		READER.init($.extend({}, defaultArgs)).then(function(){
				expect(_flattenBookmarks(currentStatus.bookmarks)).not.toContain(bookmark);

				READER.setBookmark(bookmark);
				expect(_flattenBookmarks(currentStatus.bookmarks)).toContain(bookmark);

				done();
			});
	});

	it('should remove a bookmark', function(done){
		READER.init($.extend({
				bookmarks: [bookmark]
			}, defaultArgs)).then(function(){
				expect(_flattenBookmarks(currentStatus.bookmarks)).toContain(bookmark);

				READER.removeBookmark(bookmark);
				expect(_flattenBookmarks(currentStatus.bookmarks)).not.toContain(bookmark);

				done();
			});
	});

	it('should set bookmark in its chapter location', function(done){
		READER.init($.extend({
				bookmarks: [bookmark]
			}, defaultArgs)).then(function(){
				expect(currentStatus.bookmarks).toBeArray(5); // bookmark is in chapter 4
				expect(currentStatus.bookmarks[4]).toBeArray(1);
				expect(currentStatus.bookmarks[4]).toContain(bookmark);

				done();
			});
	});

	it('should return the spine and toc', function(done){
		READER.init($.extend({}, defaultArgs)).then(function(){
				expect(JSON.parse(READER.getSPINE())).toBeArray();
				expect(JSON.parse(READER.getTOC())).toBeArray();

				done();
			});
	});

});