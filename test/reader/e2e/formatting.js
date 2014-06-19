'use strict';

describe('Formatting', function() {

	var page = require('./page.js');

	describe('Font size', function() {

		var _fontSize = {
			unit: 18,
			default: 1
		};

		beforeEach(function(){
			page.load();

			var ptor = protractor.getInstance();
			ptor.switchTo().frame('reader');
			ptor.ignoreSynchronization = true;
		});

		afterEach(function(){
			var ptor = protractor.getInstance();
			ptor.switchTo().defaultContent();
			ptor.ignoreSynchronization = false;
		});

		it('should initialise the reader with the default font size', function() {
			expect(page.contents.first().getCssValue('font-size').then(function(size){
				return parseInt(size, 10);
			})).toBeApx(_fontSize.default * _fontSize.unit);
		});

		it('should apply font-size', function(){
			/*
			page.setFontSize(value).then(function(){
				expect(page.contents.first().getCssValue('font-size').then(function(size){
					return parseInt(size, 10);
				})).toBeApx(value * _fontSize.unit);
			});
			*/
		});

	});


});