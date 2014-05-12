'use strict';

describe('Initialisation', function() {
	var readerID = 'reader';

	var testBookUrl = '/base/app/books/9780007441235',
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		currentStatus = null,
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

	it('should initialise library', function() {
		expect(READER).toBeDefined();
		expect(READER.init).toBeFunction();
		expect(READER.setLineHeight).toBeFunction();
		expect(READER.increaseLineHeight).toBeFunction();
		expect(READER.decreaseLineHeight).toBeFunction();
		expect(READER.increaseFontSize).toBeFunction();
		expect(READER.decreaseFontSize).toBeFunction();
		expect(READER.setFontSize).toBeFunction();
		expect(READER.setTextAlign).toBeFunction();
		expect(READER.setMargin).toBeFunction();
		expect(READER.setTheme).toBeFunction();
		expect(READER.setFontFamily).toBeFunction();
		expect(READER.setPreferences).toBeFunction();
		expect(READER.getCFI).toBeFunction();
		expect(READER.goToCFI).toBeFunction();
		expect(READER.next).toBeFunction();
		expect(READER.prev).toBeFunction();
		expect(READER.loadChapter).toBeFunction();
		expect(READER.getProgress).toBeFunction();
		expect(READER.getTOC).toBeFunction();
		expect(READER.getSPINE).toBeFunction();
		expect(READER.getBookmarks).toBeFunction();
		expect(READER.setBookmarks).toBeFunction();
		expect(READER.setBookmark).toBeFunction();
		expect(READER.goToBookmark).toBeFunction();
		expect(READER.removeBookmark).toBeFunction();
		expect(READER.showHeaderAndFooter).toBeFunction();
		expect(READER.hideHeaderAndFooter).toBeFunction();
		expect(READER.resizeContainer).toBeFunction();
		expect(READER.Event).toBeDefined();
		expect(READER.refreshLayout).toBeFunction();
		expect(READER.enableDebug).toBeFunction();
		expect(READER.disableDebug).toBeFunction();
	});

	it('should initialise reader on DOM element', function(done) {

		var $container = $('<div></div>').appendTo($('body'));

		READER.init($.extend({
			container: $container[0]
		}, defaultArgs)).then(function(){
				expect($container).toHaveReaderStructure();
				done();
			});
	});

	it('should initialise reader with selector', function(done) {

		var $container = $('<div id="' + readerID + '"></div>').appendTo($('body'));

		READER.init($.extend({
			container: '#' + readerID
		}, defaultArgs)).then(function(){
				expect($container).toHaveReaderStructure();
				done();
			});
	});

	it('should replace previous reader', function(done) {
		// create a reader
		var $container = $('<div></div>').appendTo($('body')),
			$newContainer = $('<div></div>').appendTo($('body'));

		READER.init($.extend({
			container: $container
		}, defaultArgs)).then(function(){
				expect($container).toHaveReaderStructure();
				expect($newContainer).not.toHaveReaderStructure();

				// should replace the reader
				READER.init($.extend({
					container: $newContainer
				}, defaultArgs)).then(function(){
						expect($container).not.toHaveReaderStructure();
						expect($newContainer).toHaveReaderStructure();
						done();
					});
			});
	});

});