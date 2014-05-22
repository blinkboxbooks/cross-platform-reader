'use strict';

describe('Layout', function() {

	var testBookUrl = '/base/app/books/9780007441235',
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		currentStatus = null,
		defaultArgs = {
			preferences: {
				transitionDuration: 0
			},
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

	beforeEach(function(){
		// reset flags and variables
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;

		currentStatus = null;
	});

	afterEach(function(){
		expect(flags.hasErrors).toBe(false);
	});

	var dimensions = [
		{ width: 200, height: 300, padding: 0, columns: 1 },
		{ width: 300, height: 400, padding: 0, columns: 1 },
		{ width: 250, height: 500, padding: 0, columns: 1 },
		{ width: 200, height: 300, padding: 20, columns: 2 },
		{ width: 300, height: 400, padding: 20, columns: 2 },
		{ width: 250, height: 500, padding: 20, columns: 2 }
	];

	it('should initialize reader to given dimensions', function(done){

		var _dimensionTest = function(index){
			var dimension = dimensions[index], margin = [5, 5, 5, 5];

			var $container = $('<div></div>').appendTo($('body'));
			READER.init($.extend({
					url: testBookUrl,
					container: $container,
					preferences: {
						margin: margin
					}
				}, dimension)).then(function(){
					var $iframe = $container.find('iframe'),
						$reader_wrap = $iframe.contents().find('body'),
						$reader = $iframe.contents().find('#cpr-reader');

					var expectedWidth = dimension.width - Math.floor(margin[1]*dimension.width/100) - Math.floor(margin[3]*dimension.width/100);
					var expectedColumn = Math.floor(expectedWidth / dimension.columns - dimension.padding / 2);
					expectedWidth = expectedColumn * dimension.columns + (dimension.columns - 1) * dimension.padding;

					expect($reader_wrap).toHaveCss({
						'height': dimension.height + 'px',
						'width': (expectedWidth + Math.floor(margin[1]*dimension.width/100) + Math.floor(margin[3]*dimension.width/100) )+ 'px'
					});

					expect($reader).toHaveCss({
						'width': expectedWidth + 'px',
						'column-width': expectedColumn + 'px',
						'column-gap': dimension.padding + 'px'
					});

					if(index < dimensions.length - 1){
						_dimensionTest(index + 1);
					} else {
						done();
					}
				});
		};

		_dimensionTest(0);
	});

	it('should resize reader to given dimensions', function(done){
		var margin = [5, 5, 5, 5];

		var $container = $('<div></div>').appendTo($('body'));
		READER.init($.extend({
				container: $container,
				preferences: {
					margin: margin
				}
			}, defaultArgs)).then(function(){

				var $iframe = $container.find('iframe'),
					$reader_wrap = $iframe.contents().find('body'),
					$reader = $iframe.contents().find('#cpr-reader');

				for(var i = 0, l = dimensions.length; i < l; i++){
					var dimension = dimensions[i];

					READER.resizeContainer(dimension);

					var expectedWidth = dimension.width - Math.floor(margin[1]*dimension.width/100) - Math.floor(margin[3]*dimension.width/100);
					var expectedColumn = Math.floor(expectedWidth / dimension.columns - dimension.padding / 2);
					expectedWidth = expectedColumn * dimension.columns + (dimension.columns - 1) * dimension.padding;

					expect($reader_wrap).toHaveCss({
						'height': dimension.height + 'px',
						'width': (expectedWidth + Math.floor(margin[1]*dimension.width/100) + Math.floor(margin[3]*dimension.width/100) )+ 'px'
					});

					expect($reader).toHaveCss({
						'width': expectedWidth + 'px',
						'column-width': expectedColumn + 'px',
						'column-gap': dimension.padding + 'px'
					});
				}

				expect($container).toHaveReaderStructure();

				done();
			});
	});

});