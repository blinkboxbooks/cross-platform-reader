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

	describe('setCFI', function () {

		it('should inject the given CFI into the DOM in front of the next word', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Strawberry, which is 6 characters ahead:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple Strawberry</span><span>Banana</span></div>').appendTo(Reader.$reader),
					// Select the text node as element:
					element = wrapper.find('span').first().contents(),
					cfiArg,
					markerArg;
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			expect(
				// Extract the new word position:
				Number(cfiArg.split(':')[1].split(')')[0])
			).toBe(
				// Extract the old word position and add 6 (for the next word position):
				Number(fixtures.BOOKMARK_4.CFI.split(':')[1].split(')')[0]) + 6
			);
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect($(markerArg).hasClass('cpr-marker')).toBeTruthy();
			expect($(markerArg).is('[data-bookmark]')).toBeFalsy();
		});

		it('should inject the given CFI into the DOM in the next word in the next node (+ 1 character)', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>Banana</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents(),
				nextNode = wrapper.find('span').last().contents()[0],
				nextNodeArg,
				cfiArg,
				markerArg;
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOKMARK_5.CFI);
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			nextNodeArg = Reader.Epub.generateCFI.calls.mostRecent().args[0];
			// Tbe argument given to the generateCFI method should be the next text node:
			expect(nextNodeArg).toBe(nextNode);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the next text node + 1 character (B|anana as given by the position of the generated CFI):
			expect(cfiArg).toBe(fixtures.BOOKMARK_5.CFI.replace(':0', ':1'));
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect($(markerArg).hasClass('cpr-marker')).toBeTruthy();
			expect($(markerArg).is('[data-bookmark]')).toBeFalsy();
		});

		it('should inject the given CFI into the DOM in the next word in the next node (+0 characters)', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>Banana</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents(),
				nextNode = wrapper.find('span').last().contents()[0],
				nextNodeArg,
				cfiArg,
				markerArg;
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOKMARK_6.CFI);
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			nextNodeArg = Reader.Epub.generateCFI.calls.mostRecent().args[0];
			// Tbe argument given to the generateCFI method should be the next text node:
			expect(nextNodeArg).toBe(nextNode);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the next text node character (Banan|a as given by the position of the generated CFI):
			expect(cfiArg).toBe(fixtures.BOOKMARK_6.CFI);
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect($(markerArg).hasClass('cpr-marker')).toBeTruthy();
			expect($(markerArg).is('[data-bookmark]')).toBeFalsy();
		});

		it('should inject the given CFI into the DOM in the current text node if there is no next node (+ 1 character)', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents(),
				cfiArg,
				markerArg;
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the current text node + 1 character:
			expect(cfiArg).toBe(fixtures.BOOKMARK_4.CFI.replace(':27', ':28'));
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect($(markerArg).hasClass('cpr-marker')).toBeTruthy();
			expect($(markerArg).is('[data-bookmark]')).toBeFalsy();
		});

		it('should add the data-cfi attribute directly to the element if the next node is an element without text', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span></span></div>').appendTo(Reader.$reader),
					// Select the text node as element:
					element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
			expect(wrapper.children().last().is('[data-cfi="' + fixtures.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect(wrapper.children().last().is('[data-bookmark]')).toBeFalsy();
		});

		it('should prepend the CFI marker if the next node text is not long enough', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>B</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
			expect(wrapper.children().last().find('.cpr-marker').length).toBe(1);
			expect(wrapper.children().last().find('.cpr-marker').is('[data-bookmark]')).toBeFalsy();
		});

		it('should add the data-cfi attribute directly to the containing SVG if the CFI targets a child', function () {
			// The given CFI position is the circle element inside of the SVG:
			var wrapper = $('<div><svg><circle cx="32" cy="32" r="32"/></svg></div>').appendTo(Reader.$reader),
				svg = wrapper.find('svg'),
				// Select the circle as element:
				element = svg.find('circle');
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
			expect(svg.is('[data-cfi="' + fixtures.BOOKMARK.CFI + '"]')).toBeTruthy();
			expect(svg.is('[data-bookmark]')).toBeFalsy();
		});

		it('should not inject any marker or add any class if no element at the given CFI position could be found', function () {
			spyOn(Reader.Epub, 'getElementAt').and.returnValue($(null));
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
		});

		it('should trigger an error event if an inserting the CFI marker fails', function () {
			var wrapper = $('<div><span>Apple</span></div>').appendTo(Reader.$reader),
			// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker').and.throwError('ERROR');
			spyOn(Reader.Notify, 'error').and.callThrough();
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_CFI_INSERTION, {details: new Error('ERROR'), call: 'setCFI'}));
		});

	});

	describe('setCFI bookmark', function () {

		it('should inject the given CFI into the DOM in front of the next word', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Strawberry, which is 6 characters ahead:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple Strawberry</span><span>Banana</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents(),
				markerArg;
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI, true);
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-bookmark]')).toBeTruthy();
		});

		it('should add the data-cfi attribute directly to the element if the next node is an element without text', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span></span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI, true);
			expect(wrapper.children().last().is('[data-bookmark]')).toBeTruthy();
		});

		it('should prepend the CFI marker if the next node text is not long enough', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>B</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK_4.CFI, true);
			expect(wrapper.children().last().find('.cpr-marker').is('[data-bookmark]')).toBeTruthy();
		});

		it('should add the data-cfi attribute directly to the containing SVG if the CFI targets a child', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><svg><circle cx="32" cy="32" r="32"/></svg></div>').appendTo(Reader.$reader),
				svg = wrapper.find('svg'),
				// Select the circle as element:
				element = svg.find('circle');
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI, true);
			expect(svg.is('[data-bookmark]')).toBeTruthy();
		});

		it('should add the data-bookmark attribute to an existing CFI marker', function () {
			var element = $('<span data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>').appendTo(Reader.$reader);
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI, true);
			expect(element.is('[data-bookmark]')).toBeTruthy();
			// Should keep the attribute when trying to add the bookmark twice:
			Reader.CFI.setCFI(fixtures.BOOKMARK.CFI, true);
			expect(element.is('[data-bookmark]')).toBeTruthy();
		});

	});

	describe('goToCFI', function () {

		it('should load the page containing the given CFI', function () {
			var loadPagePromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader.Navigation, 'loadPage').and.returnValue(loadPagePromise);
			spyOn(Reader, 'returnPageElement').and.returnValue(123);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.CFI.goToCFI(fixtures.BOOKMARK.CFI)).toBe(loadPagePromise);
			expect(Reader.Navigation.loadPage).toHaveBeenCalled();
		});

		it('should insert the CFI marker before loading the page if it does not already exist', function () {
			var loadPagePromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader.CFI, 'setCFI');
			spyOn(Reader.Navigation, 'loadPage').and.returnValue(loadPagePromise);
			expect(Reader.CFI.goToCFI(fixtures.BOOKMARK.CFI)).toBe(loadPagePromise);
			expect(Reader.CFI.setCFI).toHaveBeenCalled();
			expect(Reader.Navigation.loadPage).toHaveBeenCalled();
		});

		it('should load the chapter containing the given CFI', function () {
			var loadChapterPromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER_2);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader, 'loadChapter').and.returnValue(loadChapterPromise);
			expect(Reader.CFI.goToCFI(fixtures.BOOKMARK.CFI)).toBe(loadChapterPromise);
			expect(Reader.loadChapter).toHaveBeenCalled();
		});

		it('should trigger an error event if the given CFI is invalid', function () {
			spyOn(Reader.Navigation, 'loadPage');
			spyOn(Reader, 'loadChapter');
			spyOn(Reader.Notify, 'error').and.callThrough();
			expect(Reader.CFI.goToCFI('banana').then).toBeFunction();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_INVALID_ARGUMENT, {details: 'Invalid CFI', value: 'banana', call: 'goToCFI'}));
			expect(Reader.Navigation.loadPage).not.toHaveBeenCalled();
			expect(Reader.loadChapter).not.toHaveBeenCalled();
		});

	});

});
