'use strict';

describe('Initialisation', function() {
	var readerID = 'reader';

	beforeEach(function(){
		// mock all ajax requests and return empty promise
		// can and should be be overwritten for each specific test
		spyOn( $, 'ajax' ).and.callFake( function () {
			return $.Deferred().promise();
		});
	});

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

	it('should initialise reader on DOM element', function() {

		var $container = $('<div></div>').appendTo($('body'));

		READER.init({
			container: $container[0]
		});

		expect($container).toHaveReaderStructure();
	});

	it('should initialise reader with selector', function() {

		var $container = $('<div id="' + readerID + '"></div>').appendTo($('body'));

		READER.init({
			container: '#' + readerID
		});

		expect($container).toHaveReaderStructure();
	});

	it('should replace previous reader', function() {
		// create a reader
		var $container = $('<div></div>').appendTo($('body')),
			$newContainer = $('<div></div>').appendTo($('body'));

		READER.init({
			container: $container
		});
		expect($container).toHaveReaderStructure();
		expect($newContainer).not.toHaveReaderStructure();

		// should replace the reader
		READER.init({
			container: $newContainer
		});

		expect($container).not.toHaveReaderStructure();
		expect($newContainer).toHaveReaderStructure();
	});

});