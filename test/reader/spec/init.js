'use strict';

describe('Initialisation', function() {
	var readerID = 'reader';

	beforeEach(function(){
		// mock all ajax requests and return empty promise
		// can and should be be overwritten for each specific test
		spyOn( $, 'ajax' ).andCallFake( function () {
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

	// expect reader to be initialised
	it('should initialise reader with default container', function() {
		READER.init();
		expect($('#reader_container')).toExist();
		expect($('#reader_container')).toHaveReaderStructure();
	});

	it('should initialise reader on DOM element', function() {

		var $container = $('<div id="' + readerID + '"></div>').appendTo($('body'));

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
		READER.init();
		expect($('#reader_container')).toExist();

		var $container = $('<div id="'+readerID+'"></div>').appendTo($('body'));

		// replace the reader
		READER.init({
			container: '#' + readerID
		});

		expect($container).toHaveReaderStructure();
		expect($('#reader_container, #reader_container_wrap')).toNotExist();
	});

});