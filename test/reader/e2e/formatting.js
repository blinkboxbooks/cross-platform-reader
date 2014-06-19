'use strict';

describe('Formatting', function() {

	var page = require('./page.js');

	it('should reload the demo', function() {
		page.load();
	});

	describe('Font size', function() {

		var _fontSize = {
			unit: 18,
			default: 1
		};

		it('should initialise the reader with the default font size', function() {
			page.readerContext(function(contents){
				expect(contents.getCssValue('font-size')).toBeApx(_fontSize.default * _fontSize.unit);
			});
		});

		it('should apply font-size', function(){
			var value = 2;
			page.setFontSize(value).then(function(){
				page.readerContext(function(contents){
					expect(contents.getCssValue('font-size')).toBeApx(value * _fontSize.unit);
				});
			});
		});

	});

});