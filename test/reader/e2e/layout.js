'use strict';

describe('Layout', function() {

	var page = require('./page.js');

	it('should reload demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	it('should resize reader', function() {

		var _margin = [9.8, 11, 6.5, 11]; // default reader margins

		[
			{ width: 400, height: 500, padding: 0, columns: 1 },
			{ width: 500, height: 625, padding: 0, columns: 1 },
			{ width: 350, height: 750, padding: 10, columns: 1 },
			{ width: 600, height: 750, padding: 20, columns: 2 },
			{ width: 650, height: 300, padding: 20, columns: 2 },
			{ width: 700, height: 350, padding: 20, columns: 2 }
		].forEach(function(dimension){

			var expectedWidth = dimension.width - Math.floor(_margin[1]*dimension.width/100) - Math.floor(_margin[3]*dimension.width/100);
			var expectedColumn = Math.floor(expectedWidth / dimension.columns - dimension.padding / 2);
			expectedWidth = expectedColumn * dimension.columns + (dimension.columns - 1) * dimension.padding;

			page.resize(dimension).then(function(readerSize){
				// checks the iframe size
				expect(readerSize.width).toEqual(dimension.width);
				expect(readerSize.height).toEqual(dimension.height);

				page.readerContext(function(contents, body, reader){
					expect(reader.getCssValue('width')).toEqual(expectedWidth + 'px');
					expect(reader.getCssValue('-webkit-column-width')).toEqual(expectedColumn + 'px');
					expect(reader.getCssValue('-webkit-column-gap')).toEqual(dimension.padding + 'px');
				});
			});
		});
	});
});