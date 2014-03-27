'use strict';

describe('Formatting', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#reader_container',
		fontSize = {
			unit: 18,
			default: 1
		},
		lineHeight = {
			unit: 16,
			default: 1.2
		},
		flags = {
			isLoaded: false,
			hasErrors: false
		},
		defaultArgs = {
			url: testBookUrl,
			listener: function(ev){
				switch(ev.code){
					case 6: // reader finished loading
						flags.isLoaded = true;
						break;
					case 9: // reader missing a file
						flags.hasErrors = true;
						break;
				}
			}
		};

	beforeEach(function(){
		flags.isLoaded = false;
		flags.hasErrors = false;
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	describe('Font size', function() {

		it('should initialise the reader with the default font size', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					fontSize: (fontSize.default * fontSize.unit) + 'px'
				});
			});

		});

		it('should initialise the reader with the given font size', function() {
			var value = 2;

			READER.init($.extend({
				preferences: {
					fontSize: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					fontSize: (fontSize.unit * value) + 'px'
				});
			});
		});

		it('should apply font-size', function(){
			var value = 1.5, value2 = 2.5;

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setFontSize(value);
				expect($contents).toHaveCss({
					fontSize: (fontSize.unit * value) + 'px'
				});

				READER.setPreferences({
					fontSize: value2
				});
				expect($contents).toHaveCss({
					fontSize: (fontSize.unit * value2) + 'px'
				});
			});
		});

		it('should increase font size', function(){

			var step = 0.1;

			READER.init($.extend({
				preferences: {
					fontSize: 1
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				// calling increase font size twice
				READER.increaseFontSize();
				READER.increaseFontSize();
				expect($contents).toHaveCss({
					fontSize: Math.round((fontSize.default + 2 * step) * fontSize.unit) + 'px'
				});

			});
		});

		it('should decrease font size', function(){

			var step = 0.1;

			READER.init($.extend({
				preferences: {
					fontSize: 1
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				// calling increase font size twice
				READER.decreaseFontSize();
				expect($contents).toHaveCss({
					fontSize: Math.round((fontSize.default - step) * fontSize.unit) + 'px'
				});

			});
		});

		it('should handle invalid arguments', function(){

		});
	});

	describe('Line height', function() {

		it('should initialise the reader with the default line height', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				var fontSize = parseInt($contents.css('fontSize'));
				expect($contents).toHaveCss({
					// line height appears to be computed as the floor value of the actual value
					lineHeight: Math.floor(lineHeight.default * fontSize) + 'px'
				});
			});

		});

		it('should initialise the reader with the given line height', function() {
			var value = 2;

			READER.init($.extend({
				preferences: {
					lineHeight: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				var fontSize = parseInt($contents.css('fontSize'));
				expect($contents).toHaveCss({
					lineHeight: (fontSize * value) + 'px'
				});
			});
		});

		it('should apply line height', function(){
			var value = 1.5, value2 = 2.5;

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setLineHeight(value);
				fontSize = parseInt($contents.css('fontSize'));
				expect($contents).toHaveCss({
					lineHeight: (fontSize * value) + 'px'
				});

				READER.setPreferences({
					lineHeight: value2
				});
				fontSize = parseInt($contents.css('fontSize'));
				expect($contents).toHaveCss({
					lineHeight: (fontSize * value2) + 'px'
				});
			});
		});

		it('should increase line height', function(){

			var step = 0.1;

			READER.init($.extend({
				preferences: {
					lineHeight: 2
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				fontSize = parseInt($contents.css('fontSize'));

				// calling increase line height twice
				READER.increaseLineHeight();
				READER.increaseLineHeight();
				expect($contents).toHaveCss({
					lineHeight: Math.round((2 + 2 * step) * fontSize) + 'px'
				});

			});
		});

		it('should decrease line height', function(){

			var step = 0.1;

			READER.init($.extend({
				preferences: {
					lineHeight: 2
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				fontSize = parseInt($contents.css('fontSize'));

				// calling increase font size twice
				READER.decreaseLineHeight();
				expect($contents).toHaveCss({
					lineHeight: Math.round((2 - step) * fontSize) + 'px'
				});

			});
		});

		it('should handle invalid arguments', function(){

		});
	});
});