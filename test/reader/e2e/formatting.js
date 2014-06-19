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

	describe('Line height', function() {

		var _lineHeight = {
			unit: 16,
			default: 1.2
		};

		it('should initialise the reader with the default line height', function() {
			page.readerContext(function(contents){
				protractor.promise.all([contents.getCssValue('line-height'), contents.getCssValue('font-size')]).then(function(result){
					var lineHeight = result[0],
						fontSize = result[1];
					expect(lineHeight).toBeApx(_lineHeight.default * parseInt(fontSize, 10));
				});
			});
		});

		it('should apply line height', function(){
			[1.5, 2, 2.5].forEach(function(value){
				page.setLineHeight(value).then(function(){
					page.readerContext(function(contents){
						protractor.promise.all([contents.getCssValue('line-height'), contents.getCssValue('font-size')]).then(function(result){
							var lineHeight = result[0],
								fontSize = result[1];
							expect(lineHeight).toBeApx(value * parseInt(fontSize, 10));
						});
					});
				});
			});
		});
	});

	describe('Font family', function() {

		it('should initialise the reader with the default font family', function() {
			page.readerContext(function(contents){
				expect(contents.getCssValue('font-family')).toEqual('Helvetica');
			});
		});

		it('should apply font family', function(){
			page.fontFamily.then(function(options){
				options.forEach(function(option){
					option.click().getText().then(function(value){
						page.readerContext(function(contents){
							expect(contents.getCssValue('font-family')).toContain(value);
						});
					});
				});
			});
		});

	});

});