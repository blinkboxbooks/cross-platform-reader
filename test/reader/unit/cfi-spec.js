'use strict';

describe('CFI', function() {

	beforeEach(function () {
		spyOn($, 'ajax').and.callFake(function () {
			return {
				then: $.noop
			}
		});
		Reader.init({
			container: $('<div></div>').appendTo($('body'))
		});
	});

	it('should provide the CFI interface', function () {
		expect(Reader.CFI).toBeObject();
	});

	describe('isValidCFI', function () {

		it('should return true for valid CFIs', function () {
			expect(Reader.CFI.isValidCFI(fixtures.BOOKMARK.CFI)).toBeTruthy();
			expect(Reader.CFI.isValidCFI(fixtures.BOOKMARK_2.CFI)).toBeTruthy();
			expect(Reader.CFI.isValidCFI(fixtures.BOOKMARK_3.CFI)).toBeTruthy();
		});

		it('should return false for invalid CFIs', function () {
			expect(Reader.CFI.isValidCFI('banana')).toBeFalsy();
			expect(Reader.CFI.isValidCFI('cpr-lastpage')).toBeFalsy();
		});

	});

	describe('getCFISelector', function () {

		it('should return the element selector for the given CFI', function () {
			expect($('<span></span>').attr('data-cfi', fixtures.BOOKMARK.CFI).is(
				Reader.CFI.getCFISelector(fixtures.BOOKMARK.CFI)
			)).toBeTruthy();
		});

	});

	describe('findCFIElement', function () {

		it('should return the page number containing the given CFI', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(123);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.CFI.findCFIElement(fixtures.BOOKMARK.CFI)).toBe(123);
		});

		it('should return -1 if no element with the given CFI can be found', function () {
			expect(Reader.CFI.findCFIElement(fixtures.BOOKMARK.CFI)).toBe(-1);
		});

	});

	describe('getChapterFromCFI', function () {

		it('should return the chapter number from the given CFI', function () {
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOKMARK.CFI)).toBe(fixtures.BOOKMARK_CHAPTER);
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOKMARK_2.CFI)).toBe(fixtures.BOOKMARK_2_CHAPTER);
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOKMARK_3.CFI)).toBe(fixtures.BOOKMARK_3_CHAPTER);
		});

		it('should return -1 if the given CFI is not a valid string', function () {
			expect(Reader.CFI.getChapterFromCFI()).toBe(-1);
		});

		it('should return -1 if the given CFI does not contain a chapter segment', function () {
			expect(Reader.CFI.getChapterFromCFI('epubcfi(/6)')).toBe(-1);
		});

	});

	describe('addOneNodeToCFI', function () {

		it('should return false if no next node can be found', function () {
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>',
					element = $('<span>Apple</span>').appendTo(Reader.$reader);
			expect(Reader.CFI.addOneNodeToCFI(fixtures.BOOKMARK.CFI, element, marker)).toBeFalsy();
		});

		it('should inject a marker and return true if a next node can be found', function () {
			spyOn(Reader.Epub, 'injectMarker');
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>',
					wrapper = $('<div><span>Apple</span><span>Banana</span></div>').appendTo(Reader.$reader),
					element = wrapper.find('span').first();
			expect(Reader.CFI.addOneNodeToCFI(fixtures.BOOKMARK.CFI, element, marker)).toBeTruthy();
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
		});

		it('should prepend the marker if the next node is not large enough', function () {
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>',
				wrapper = $('<div><span>Apple</span><span>B</span></div>').appendTo(Reader.$reader),
				element = wrapper.find('span').first();
			expect(Reader.CFI.addOneNodeToCFI(fixtures.BOOKMARK.CFI, element, marker)).toBeTruthy();
			expect(wrapper.children().last().find('.cpr-marker').length).toBe(1);
		});

		it('should add the data-cfi attribute directly to the element if the next node is an element without text', function () {
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>',
				wrapper = $('<div><span>Apple</span><span></span></div>').appendTo(Reader.$reader),
				element = wrapper.find('span').first();
			expect(Reader.CFI.addOneNodeToCFI(fixtures.BOOKMARK.CFI, element, marker)).toBeTruthy();
			expect(wrapper.children().last().is('[data-cfi="' + fixtures.BOOKMARK.CFI + '"]')).toBeTruthy();
			expect(wrapper.children().last().is('[data-bookmark]')).toBeFalsy();
		});

		it('should add the data-bookmark attribute if the isBookmark attribute is true', function () {
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>',
				wrapper = $('<div><span>Apple</span><span></span></div>').appendTo(Reader.$reader),
				element = wrapper.find('span').first();
			expect(Reader.CFI.addOneNodeToCFI(fixtures.BOOKMARK.CFI, element, marker, true)).toBeTruthy();
			expect(wrapper.children().last().is('[data-bookmark]')).toBeTruthy();
		});

	});

	describe('addOneWordToCFI', function () {

		it('should set the CFI position to the next word', function () {
			spyOn(Reader.Epub, 'injectMarker');
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK_4.CFI + '"></span>',
				// Strawberry (10 characters length) is the next word after the CFI position (inside of Pineapple):
				wrapper = $('<div><span>Apple Orange Pear Peach Pineapple Strawberry</span><span>Banana</span></div>').appendTo(Reader.$reader),
				element = wrapper.find('span').first(),
				cfiArg;
			Reader.CFI.addOneWordToCFI(fixtures.BOOKMARK_4.CFI, element, marker);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			expect(
				// Extract the new word position:
				Number(cfiArg.split(':')[1].split(')')[0])
			).toBe(
					// Extract the old word position and add 10 (for the next word):
					Number(fixtures.BOOKMARK_4.CFI.split(':')[1].split(')')[0]) + 10
			);
		});

		it('should set the CFI position to the next word in the next node', function () {
			spyOn(Reader.Epub, 'injectMarker');
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOKMARK_5.CFI);
			var marker = '<span class="cpr-marker" data-cfi="' + fixtures.BOOKMARK_4.CFI + '"></span>',
				// There is no next word the CFI position (inside of Pineapple):
				wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>Banana</span></div>').appendTo(Reader.$reader),
				element = wrapper.find('span').first(),
				cfiArg,
				pos;
			Reader.CFI.addOneWordToCFI(fixtures.BOOKMARK_4.CFI, element, marker);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			expect(cfiArg).toBe(fixtures.BOOKMARK_5.CFI.replace(':0', ':1'));
		});

	});

});
