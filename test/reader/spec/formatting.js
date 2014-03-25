'use strict';

describe('Formatting', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#reader_container', fontSizeUnit = 18, defaultFontSize = 1,
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
					fontSize: (defaultFontSize * fontSizeUnit) + 'px'
				});
			});

		});

		it('should initialise the reader with the given font size', function() {
			var fontSize = 2;

			READER.init($.extend({
				preferences: {
					fontSize: fontSize
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					fontSize: (fontSizeUnit * fontSize) + 'px'
				});
			});
		});

		it('should apply font-size', function(){
			var fontSize = 1.5, fontSize2 = 2.5;

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.isLoaded;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setFontSize(fontSize);
				expect($contents).toHaveCss({
					fontSize: (fontSizeUnit * fontSize) + 'px'
				});

				READER.setPreferences({
					fontSize: fontSize2
				});
				expect($contents).toHaveCss({
					fontSize: (fontSizeUnit * fontSize2) + 'px'
				});
			});
		});

		it('should handle invalid arguments', function(){

		});
	});
});