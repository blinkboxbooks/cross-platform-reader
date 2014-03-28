'use strict';

describe('Formatting', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#formatting_test',
		fontSize = {
			unit: 18,
			default: 1
		},
		lineHeight = {
			unit: 16,
			default: 1.2
		},
		margin = {
			min : [9.8, 4, 6.5, 4],
			max: [9.8, 17.75, 6.5, 17.75],
			medium: [9.8, 11, 6.5, 11]
		},
		themes = {
			transparent : {
				background : 'transparent',
				title : '#666',
				color : '#000'
			},
			light : {
				background : '#f4f4f4',
				title : '#666',
				color : '#000'
			},
			dark : {
				background : '#000000',
				title : '#666',
				color : '#dddddd'
			},
			sepia : {
				background : '#ede7d5',
				title : '#666',
				color : '#181818'
			}
		},
		flags = {
			statusUpdated: false,
			hasErrors: false
		},
		defaultArgs = {
			url: testBookUrl,
			container: readerID,
			listener: function(ev){
				switch(ev.code){
					case 6: // reader finished loading
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
		flags.statusUpdated = false;
		flags.hasErrors = false;
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	describe('Font size', function() {

		it('should initialise the reader with the default font size', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				// calling increase font size twice
				READER.increaseFontSize();
				READER.increaseFontSize();
				var $test = $('<span></span>');
				$test.css('font-size', ((fontSize.default + 2 * step) * fontSize.unit) + 'px');
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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
				return flags.statusUpdated;
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

	describe('Font family', function() {

		it('should initialise the reader with the default font family', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					fontFamily: 'Arial'
				});
			});

		});

		it('should initialise the reader with the given line height', function() {
			var value = 'Helvetica';

			READER.init($.extend({
				preferences: {
					fontFamily: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					fontFamily: value
				});
			});
		});

		it('should apply font family', function(){
			var value = 'Times New Roman', value2 = 'Comic Sans';

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setFontFamily(value);
				expect($contents).toHaveCss({
					// it appears some fonts are considered plain strings http://stackoverflow.com/a/11903633
					fontFamily: value
				});

				READER.setPreferences({
					fontFamily: value2
				});
				expect($contents).toHaveCss({
					fontFamily: value2
				});
			});
		});

	});

	describe('Text align', function() {

		it('should initialise the reader with the default text align', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					textAlign: 'left'
				});
			});

		});

		it('should initialise the reader with the given text align', function() {
			var value = 'justify';

			READER.init($.extend({
				preferences: {
					textAlign: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($contents).toHaveCss({
					textAlign: value
				});
			});
		});

		it('should apply text align', function(){
			var value = 'left', value2 = 'justify';

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setTextAlign(value);
				expect($contents).toHaveCss({
					textAlign: value
				});

				READER.setPreferences({
					textAlign: value2
				});
				expect($contents).toHaveCss({
					textAlign: value2
				});
			});
		});

	});

	describe('Theme', function() {

		it('should initialise the reader with the default text align', function() {
			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($(readerID + '_wrap')).toHaveCss({
					backgroundColor: 'rgb(255, 255, 255)'
				});
				expect($contents).toHaveCss({
					color: 'rgb(0, 0, 0)'
				});
			});

		});

		it('should initialise the reader with a predefined theme', function() {
			var value = 'dark';

			READER.init($.extend({
				preferences: {
					theme: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($(readerID + '_wrap')).toHaveCss({
					backgroundColor: themes.dark.background
				});
				expect($contents).toHaveCss({
					color: themes.dark.color
				});
			});
		});

		it('should initialise the reader with the given theme', function() {
			var value = {
				background : 'rgb(1, 2, 3)',
				title : '#666',
				color : 'rgb(10, 20, 30)'
			};

			READER.init($.extend({
				preferences: {
					theme: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');
				expect($(readerID + '_wrap')).toHaveCss({
					backgroundColor: value.background
				});
				expect($contents).toHaveCss({
					color: value.color
				});
			});
		});

		it('should apply theme', function(){
			var value = 'sepia', value2 = 'light';

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).find('span, p, em, div, strong, a');

				READER.setTheme(value);
				expect($(readerID + '_wrap')).toHaveCss({
					backgroundColor: themes.sepia.background
				});
				expect($contents).toHaveCss({
					color: themes.sepia.color
				});

				READER.setPreferences({
					theme: value2
				});
				expect($(readerID + '_wrap')).toHaveCss({
					backgroundColor: themes.light.background
				});
				expect($contents).toHaveCss({
					color: themes.light.color
				});
			});
		});

	});

	describe('Margin', function() {

		it('should initialise the reader with the default margins', function() {
			READER.init($.extend({
				width: 200,
				height: 300
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).parent();
				expect($contents).toHaveCss({
					// by default the margin is 11% of the reader width
					marginRight: Math.floor(margin.medium[1]/100 * 200) + 'px',
					marginLeft: Math.floor(margin.medium[3]/100 * 200) + 'px'
				});
			});

		});

		it('should initialise the reader with a predefined margin', function() {
			READER.init($.extend({
				width: 200,
				height: 300,
				preferences: {
					margin: 'min'
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).parent();

				expect($contents).toHaveCss({
					marginRight: Math.floor(margin.min[1]/100 * 200) + 'px',
					marginLeft: Math.floor(margin.min[3]/100 * 200) + 'px'
				});
			});
		});

		it('should initialise the reader with the given margin', function() {
			var value = [10,10,10,10];

			READER.init($.extend({
				width: 200,
				height: 300,
				preferences: {
					margin: value
				}
			}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).parent();

				expect($contents).toHaveCss({
					marginRight: Math.floor(value[1]/100 * 200) + 'px',
					marginLeft: Math.floor(value[3]/100 * 200) + 'px'
				});
			});
		});

		it('should apply margin', function(){
			var value = 'max', value2 = 'min';

			READER.init($.extend({}, defaultArgs));

			waitsFor(function(){
				return flags.statusUpdated;
			}, 'the reader to load the book', 10000);

			runs(function(){
				var $contents = $(readerID).parent();

				READER.setMargin(value);
				expect($contents).toHaveCss({
					marginRight: Math.floor(margin.max[1]/100 * 200) + 'px',
					marginLeft: Math.floor(margin.max[3]/100 * 200) + 'px'
				});

				READER.setPreferences({
					margin: value2
				});
				expect($contents).toHaveCss({
					marginRight: Math.floor(margin.min[1]/100 * 200) + 'px',
					marginLeft: Math.floor(margin.min[3]/100 * 200) + 'px'
				});
			});
		});

	});

});