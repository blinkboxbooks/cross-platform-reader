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

	describe('Text align', function() {

		it('should initialise the reader with the default text align', function() {
			page.readerContext(function(contents){
				expect(contents.getCssValue('text-align')).toEqual('left');
			});
		});

		it('should apply text align', function(){
			page.textAlign.then(function(options){
				options.forEach(function(option){
					option.click().getText().then(function(value){
						page.readerContext(function(contents){
							expect(contents.getCssValue('text-align')).toEqual(value);
						});
					});
				});
			});
		});

	});

	describe('Theme', function() {

		var _themes = {
			transparent : {
				background : 'rgba(0, 0, 0, 0)',
				color : 'rgba(0, 0, 0, 1)'
			},
			light : {
				background : 'rgb(244, 244, 244)',
				color : 'rgba(0, 0, 0, 1)'
			},
			dark : {
				background : 'rgb(0, 0, 0)',
				color : 'rgba(221, 221, 221, 1)'
			},
			sepia : {
				background : 'rgb(237, 231, 213)',
				color : 'rgba(24, 24, 24, 1)'
			}
		};

		it('should initialise the reader with the default theme', function() {
			page.readerContext(function(contents, body){
				expect(contents.getCssValue('color')).toEqual('rgba(0, 0, 0, 1)');
				expect(body.getCssValue('backgroundColor')).toEqual('rgb(244, 244, 244)');
			});
		});

		it('should apply theme', function(){

			page.theme.then(function(options){
				options.forEach(function(option){
					option.click().getText().then(function(value){
						page.readerContext(function(contents, body){
							expect(body.getCssValue('backgroundColor')).toEqual(_themes[value].background);
							expect(contents.getCssValue('color')).toEqual(_themes[value].color);

						});
					});
				});
			});
		});
	});

	describe('Margin', function() {

		var _margin = {
			min : [9.8, 4, 6.5, 4],
			max: [9.8, 17.75, 6.5, 17.75],
			medium: [9.8, 11, 6.5, 11]
		};

		it('should initialise the reader with the default margins', function() {
			page.readerContext(function(contents, body, reader, header, footer, container){
				protractor.promise.all([
					header.getCssValue('margin-left'),
					header.getCssValue('margin-right'),
					footer.getCssValue('margin-left'),
					footer.getCssValue('margin-right'),
					container.getCssValue('margin-left'),
					container.getCssValue('margin-right'),
					body.getCssValue('width')
				]).then(function(result){
						var header = {
								marginLeft: result[0],
								marginRight: result[1]
							},
							footer = {
								marginLeft: result[2],
								marginRight: result[3]
							},
							container = {
								marginLeft: result[4],
								marginRight: result[5]
							},
							width = parseInt(result[6], 10),
							expected = {
								marginLeft: Math.floor(_margin.medium[1]/100 * width) + 'px',
								marginRight: Math.floor(_margin.medium[3]/100 * width) + 'px'
							};

						expect(header).toEqual(expected);
						expect(footer).toEqual(expected);
						expect(container).toEqual(expected);
					});
			});
		});

		it('should apply margin', function(){
			page.margin.then(function(options){
				options.forEach(function(option){
					option.click().getText().then(function(value){
						page.readerContext(function(contents, body, reader, header, footer, container){
							protractor.promise.all([
									header.getCssValue('margin-left'),
									header.getCssValue('margin-right'),
									footer.getCssValue('margin-left'),
									footer.getCssValue('margin-right'),
									container.getCssValue('margin-left'),
									container.getCssValue('margin-right'),
									body.getCssValue('width')
								]).then(function(result){
									var header = {
											marginLeft: result[0],
											marginRight: result[1]
										},
										footer = {
											marginLeft: result[2],
											marginRight: result[3]
										},
										container = {
											marginLeft: result[4],
											marginRight: result[5]
										},
										width = parseInt(result[6], 10),
										expected = {
											marginLeft: Math.floor(_margin[value][1]/100 * width) + 'px',
											marginRight: Math.floor(_margin[value][3]/100 * width) + 'px'
										};

									expect(header).toEqual(expected);
									expect(footer).toEqual(expected);
									expect(container).toEqual(expected);
								});
						});
					});
				});
			});
		});
	});
});