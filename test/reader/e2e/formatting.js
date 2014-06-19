'use strict';

describe('Formatting', function() {

	var page = require('./page.js');

	it('should reload demo app', function() {
		page.load();
		expect(browser.getCurrentUrl()).toContain(page.path);
	});

	describe('Font size', function() {

		var _fontSize = {
			unit: 18,
			default: 1
		};

		beforeEach(function(){
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
			page.contents.map(function(el){
				return el.getCssValue('font-size');
			}).then(function(sizes){
				sizes.forEach(function(size){
					expect(parseInt(size, 10)).toBeWithinRange((_fontSize.default * _fontSize.unit) - 1, (_fontSize.default * _fontSize.unit) + 1);
				});
			});
		});

	});


});