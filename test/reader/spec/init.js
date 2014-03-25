'use strict';

describe('Initialisation', function() {

	it('should initialise library', function() {
		expect(READER).toBeDefined();
		expect(READER.init).toBeFunction();
		expect(READER.enableDebug).toBeFunction();
		READER.enableDebug();
	});

	// expect reader to be initialised
	it('should initialise reader with default container', function() {
		expect($('#reader_container')).toNotExist();
		READER.init();
		expect($('#reader_container')).toExist();
		expect($('#reader_container')).toHaveReaderStructure();
	});

	it('should initialise reader on DOM element', function() {
		var readerID = 'reader_test_1';

		var $container = $('<div id="' + readerID + '"></div>').appendTo($('body'));

		READER.init({
			container: $container[0]
		});

		expect($container).toHaveReaderStructure();
	});

	it('should initialise reader with selector', function() {
		var readerID = 'reader_test_2';

		var $container = $('<div id="' + readerID + '"></div>').appendTo($('body'));

		READER.init({
			container: '#' + readerID
		});

		expect($container).toHaveReaderStructure();
	});

	it('should replace previous reader', function() {
		var testID = 'testID';

		// create a reader
		READER.init();
		expect($('#reader_container')).toExist();

		var $container = $('<div id="'+testID+'"></div>').appendTo($('body'));

		// replace the reader
		READER.init({
			container: $container[0]
		});

		expect($container).toHaveReaderStructure();

		// todo CR-229 the reader does not remove the previous reader
		// expect($('#reader_container')).toNotExist();
	});

});