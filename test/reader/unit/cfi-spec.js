/* global fixtures */

'use strict';

describe('CFI', function() {

	beforeEach(function () {
		spyOn($, 'ajax').and.callFake(function () {
			return {
				then: $.noop
			};
		});

		var filter = $.fn.filter;

		// Known bug in pHantomJS, where elements do not appear as visible.
		// In order to perform the unit tests, we do not filter elements out.
		spyOn($.fn, 'filter').and.callFake(function (args) {
			if(args === ':visible'){
				return this;
			}
			return filter.apply(this, arguments);
		});

		Reader.init({
			container: $('<div></div>').appendTo($('body')),
			width: 400,
			height: 600
		});
		Reader.Book.load(fixtures.BOOK.DATA);
	});

	it('should provide the CFI interface', function () {
		expect(Reader.CFI).toBeObject();
	});

	describe('isValidCFI', function () {

		it('should return true for valid CFIs', function () {
			expect(Reader.CFI.isValidCFI(fixtures.BOOK.BOOKMARK.CFI)).toBeTruthy();
			expect(Reader.CFI.isValidCFI(fixtures.BOOK.BOOKMARK_2.CFI)).toBeTruthy();
			expect(Reader.CFI.isValidCFI(fixtures.BOOK.BOOKMARK_3.CFI)).toBeTruthy();
		});

		it('should return false for invalid CFIs', function () {
			expect(Reader.CFI.isValidCFI('banana')).toBeFalsy();
			expect(Reader.CFI.isValidCFI('cpr-lastpage')).toBeFalsy();
		});

	});

	describe('getCFISelector', function () {

		it('should return the element selector for the given CFI', function () {
			expect($('<span></span>').attr('data-cfi', fixtures.BOOK.BOOKMARK.CFI).is(
				Reader.CFI.getCFISelector(fixtures.BOOK.BOOKMARK.CFI)
			)).toBeTruthy();
		});

	});

	describe('findCFIElement', function () {

		it('should return the page number containing the given CFI', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(123);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.CFI.findCFIElement(fixtures.BOOK.BOOKMARK.CFI)).toBe(123);
		});

		it('should return -1 if no element with the given CFI can be found', function () {
			expect(Reader.CFI.findCFIElement(fixtures.BOOK.BOOKMARK.CFI)).toBe(-1);
		});

	});

	describe('getChapterFromCFI', function () {

		it('should return the chapter number from the given CFI', function () {
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOK.BOOKMARK.CFI)).toBe(fixtures.BOOK.BOOKMARK_CHAPTER);
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOK.BOOKMARK_2.CFI)).toBe(fixtures.BOOK.BOOKMARK_2_CHAPTER);
			expect(Reader.CFI.getChapterFromCFI(fixtures.BOOK.BOOKMARK_3.CFI)).toBe(fixtures.BOOK.BOOKMARK_3_CHAPTER);
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			expect(
				// Extract the new word position:
				Number(cfiArg.split(':')[1].split(')')[0])
			).toBe(
				// Extract the old word position and add 6 (for the next word position):
				Number(fixtures.BOOK.BOOKMARK_4.CFI.split(':')[1].split(')')[0]) + 6
			);
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOK.BOOKMARK_4.CFI + '"]')).toBeTruthy();
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
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK_5.CFI);
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			nextNodeArg = Reader.Epub.generateCFI.calls.mostRecent().args[0];
			// Tbe argument given to the generateCFI method should be the next text node:
			expect(nextNodeArg).toBe(nextNode);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the next text node + 1 character (B|anana as given by the position of the generated CFI):
			expect(cfiArg).toBe(fixtures.BOOK.BOOKMARK_5.CFI.replace(':0', ':1'));
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOK.BOOKMARK_4.CFI + '"]')).toBeTruthy();
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
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK_6.CFI);
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			nextNodeArg = Reader.Epub.generateCFI.calls.mostRecent().args[0];
			// Tbe argument given to the generateCFI method should be the next text node:
			expect(nextNodeArg).toBe(nextNode);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the next text node character (Banan|a as given by the position of the generated CFI):
			expect(cfiArg).toBe(fixtures.BOOK.BOOKMARK_6.CFI);
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOK.BOOKMARK_4.CFI + '"]')).toBeTruthy();
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).toHaveBeenCalled();
			cfiArg = Reader.Epub.injectMarker.calls.mostRecent().args[0];
			// Tbe new position is the current text node + 1 character:
			expect(cfiArg).toBe(fixtures.BOOK.BOOKMARK_4.CFI.replace(':27', ':28'));
			markerArg = Reader.Epub.injectMarker.calls.mostRecent().args[1];
			expect($(markerArg).is('[data-cfi="' + fixtures.BOOK.BOOKMARK_4.CFI + '"]')).toBeTruthy();
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
			expect(wrapper.children().last().is('[data-cfi="' + fixtures.BOOK.BOOKMARK_4.CFI + '"]')).toBeTruthy();
			expect(wrapper.children().last().is('[data-bookmark]')).toBeFalsy();
		});

		it('should prepend the CFI marker if the next node text is not long enough', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>B</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI);
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
			expect(svg.is('[data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"]')).toBeTruthy();
			expect(svg.is('[data-bookmark]')).toBeFalsy();
		});

		it('should not inject any marker or add any class if no element at the given CFI position could be found', function () {
			spyOn(Reader.Epub, 'getElementAt').and.returnValue($(null));
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Epub.injectMarker).not.toHaveBeenCalled();
		});

		it('should trigger an error event if an inserting the CFI marker fails', function () {
			var wrapper = $('<div><span>Apple</span></div>').appendTo(Reader.$reader),
			// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker').and.throwError('ERROR');
			spyOn(Reader.Notify, 'error').and.callThrough();
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI);
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI, true);
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI, true);
			expect(wrapper.children().last().is('[data-bookmark]')).toBeTruthy();
		});

		it('should prepend the CFI marker if the next node text is not long enough', function () {
			// The given CFI position is at Pine|apple. The next word position is in front of Banana, which is in the next node:
			var wrapper = $('<div><span>Apple Orange Pear Peach Pineapple</span><span>B</span></div>').appendTo(Reader.$reader),
				// Select the text node as element:
				element = wrapper.find('span').first().contents();
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Epub, 'injectMarker');
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK_4.CFI, true);
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
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(svg.is('[data-bookmark]')).toBeTruthy();
		});

		it('should add the data-bookmark attribute to an existing CFI marker', function () {
			var element = $('<span data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>').appendTo(Reader.$reader);
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(element.is('[data-bookmark]')).toBeTruthy();
			// Should keep the attribute when trying to add the bookmark twice:
			Reader.CFI.setCFI(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(element.is('[data-bookmark]')).toBeTruthy();
		});

	});

	describe('goToCFI', function () {

		it('should load the page containing the given CFI', function () {
			var loadPagePromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader.Navigation, 'loadPage').and.returnValue(loadPagePromise);
			spyOn(Reader, 'returnPageElement').and.returnValue(123);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.CFI.goToCFI(fixtures.BOOK.BOOKMARK.CFI)).toBe(loadPagePromise);
			expect(Reader.Navigation.loadPage).toHaveBeenCalled();
		});

		it('should insert the CFI marker before loading the page if it does not already exist', function () {
			var loadPagePromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader.CFI, 'setCFI');
			spyOn(Reader.Navigation, 'loadPage').and.returnValue(loadPagePromise);
			expect(Reader.CFI.goToCFI(fixtures.BOOK.BOOKMARK.CFI)).toBe(loadPagePromise);
			expect(Reader.CFI.setCFI).toHaveBeenCalled();
			expect(Reader.Navigation.loadPage).toHaveBeenCalled();
		});

		it('should load the chapter containing the given CFI', function () {
			var loadChapterPromise = $.Deferred().promise();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER_2);
			spyOn(Reader.Navigation, 'isCFIInCurrentChapterPart').and.returnValue(true);
			spyOn(Reader, 'loadChapter').and.returnValue(loadChapterPromise);
			expect(Reader.CFI.goToCFI(fixtures.BOOK.BOOKMARK.CFI)).toBe(loadChapterPromise);
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

	describe('getCFIObject', function () {

		it('should return the CFI for the current position for a text node', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the current position for an element node', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div>Banana</div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should adjust the generated preview based on the element offset', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>test Banana</span>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 5
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 5
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: '&#8230;Banana',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should ignore empty text nodes', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><span>Banana</span>   <span>Apple</span></div>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'BananaApple',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should handle comment nodes', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><!-- HTML Comment --></div>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: '',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should ignore script content for the generated preview', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span><script>var banana = "Banana";</script><span>Apple</span>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'BananaApple',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should trim the generated preview to 100 words', function () {
			var doc = Reader.$iframe.contents()[0],
				wordList = new Array(101).join('Banana '),
				element = $('<span>' + wordList + wordList + '</span>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: wordList,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the current position for multiple text nodes', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span><span>Apple</span><span>Orange</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[1],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[1],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				// Adjust the CFI position based on the skipped text node:
				CFI: fixtures.BOOK.BOOKMARK.CFI.replace(':0', ':' + element[0].length),
				preview: 'AppleOrange',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the correct label for a chapter identified via URL anchor', function () {
			Reader.Book.load(fixtures.BOOK_2.DATA);
			var doc = Reader.$iframe.contents()[0],
					wrapper = $('<span id="int02">Banana</span>').appendTo(Reader.$reader),
					element = wrapper.contents();
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK_2.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK_2.BOOKMARK.CFI,
				preview: fixtures.BOOK_2.BOOKMARK.preview,
				chapter : fixtures.BOOK_2.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the correct label for a TOC child element', function () {
			Reader.Book.load(fixtures.BOOK_2.DATA);
			var doc = Reader.$iframe.contents()[0],
					wrapper = $('<span id="bk01ch01">Banana</span><span id="bk01ch02">Apple</span><span id="bk01ch03">Orange</span>')
						.appendTo(Reader.$reader),
					element = wrapper.contents();
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK_2.BOOKMARK_2.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(1);
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				switch(el.prop('id')) {
					case 'bk01ch01':
						return 0;
					case 'bk01ch02':
						return 1;
					case 'bk01ch03':
						return 2;
				}
			});
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK_2.BOOKMARK_2.CFI,
				preview: 'BananaAppleOrange',
				chapter : fixtures.BOOK_2.BOOKMARK_2.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should handle if a TOC child element does not have an anchor', function () {
			var clonedData = $.extend(true, fixtures.BOOK_2.DATA);
			clonedData.toc[7].children[0].href = clonedData.toc[7].children[0].href.split('#')[0];
			Reader.Book.load(clonedData);
			var doc = Reader.$iframe.contents()[0],
					wrapper = $('<span id="bk01ch02">Apple</span><span id="bk01ch03">Orange</span>')
						.appendTo(Reader.$reader),
					element = wrapper.contents();
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK_2.BOOKMARK_2.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(1);
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				switch(el.prop('id')) {
					case 'bk01ch02':
						return 1;
					case 'bk01ch03':
						return 2;
				}
			});
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK_2.BOOKMARK_2.CFI,
				preview: 'AppleOrange',
				chapter : fixtures.BOOK_2.BOOKMARK_2.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should handle if the chapter cannot be extracted from the given CFI', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(null);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: null,
				preview: 'Banana'
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the given text node if no range could be generated', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for adjacent text nodes if the original target is not in the viewport', function () {
			var doc = Reader.$iframe.contents()[0],
					element = $('<span>Banana</span>').contents().appendTo(Reader.$reader),
					left = -100;
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.callFake(function () {
				return element;
			});
			spyOn(doc, 'createRange').and.callFake(function () {
				var rect = {top: 0, left: left};
				if (left < 0) {
					element = $('<span>Apple</span>').contents().appendTo(Reader.$reader);
					left += 100;
				}
				return {
					setStart: $.noop,
					getClientRects: function () {
						return [rect];
					}
				};
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.callFake(function () {
					return {
						startContainer: element[0],
						startOffset: 0
					};
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.callFake(function () {
					return {
						offsetNode: element[0],
						offset: 0
					};
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Apple',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the first element in the viewport if the target cannot be found', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.$reader, 'find').and.callFake(function () {
				return $('<span>Apple</span>').appendTo(Reader.$reader);
			});
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: -100}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Apple',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the first element of the reader if no element can be found in the viewport', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(Reader.$reader, 'children').and.callFake(function () {
				return $('<span>Apple</span>').appendTo(Reader.$reader);
			});
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: -100}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Apple',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should use the img alt text for the generated preview', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Banana"></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Image: Banana',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should create a generic preview for images without alt text', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Image: No description',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should create a generic preview for tables as target element', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><table></table></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Table',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
		});

		it('should return the CFI for the parent SVG if the CFI targets one of its child nodes', function () {
			var doc = Reader.$iframe.contents()[0],
					wrapper = $('<div><svg><circle cx="32" cy="32" r="32"/></svg></div>').appendTo(Reader.$reader),
					element = wrapper.find('circle');
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: 'Image: No description',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			expect(Reader.Epub.generateCFI.calls.mostRecent().args[0]).toBe(wrapper.find('svg')[0]);
		});

		it('should return the CFI for target element if the only child is a blacklisted marker', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><span class="cpr-marker"></span></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: '',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			expect(Reader.Epub.generateCFI.calls.mostRecent().args[0]).toBe(element[0]);
		});

		it('should return the CFI for target element if all child elements are blacklisted', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><span class="cpr-marker"></span><span class="cpr-marker"></span></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: '',
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			expect(Reader.Epub.generateCFI.calls.mostRecent().args[0]).toBe(element[0]);
		});

		it('should return the CFI for the child element that is not a blacklisted marker', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<div><span class="cpr-marker"></span><span>Banana</span></div>').appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			expect(Reader.Epub.generateCFI.calls.mostRecent().args[0]).toBe(element.children().last().contents()[0]);
		});

		it('should trigger an error event if generating the CFI fails', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Epub, 'generateCFI').and.throwError('ERROR');
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			if (doc.caretRangeFromPoint) {
				spyOn(doc, 'caretRangeFromPoint').and.returnValue({
					startContainer: element[0],
					startOffset: 0
				});
			} else if (doc.caretPositionFromPoint) {
				spyOn(doc, 'caretPositionFromPoint').and.returnValue({
					offsetNode: element[0],
					offset: 0
				});
			}
			expect(Reader.CFI.getCFIObject()).toBeFalsy();
			expect(Reader.Epub.generateCFI).toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_CFI_GENERATION, {details: new Error('ERROR'), call: 'getCFIObject'}));
		});

		it('should provide cross-platform methods of retrieving the caret position', function () {
			var doc = Reader.$iframe.contents()[0],
				element = $('<span>Banana</span>').contents().appendTo(Reader.$reader);
			spyOn(Reader.Epub, 'generateCFI').and.returnValue(fixtures.BOOK.BOOKMARK.CFI);
			spyOn(Reader.Epub, 'getElementAt').and.returnValue(element);
			spyOn(doc, 'createRange').and.returnValue({
				setStart: $.noop,
				getClientRects: function () {
					return [{top: 0, left: 0}];
				}
			});
			Object.defineProperty(doc, 'caretRangeFromPoint', {writable: true, value: null});
			Object.defineProperty(doc, 'caretPositionFromPoint', {writable: true, value: function () {
				return {
					offsetNode: element[0],
					offset: 0
				};
			}});
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			Object.defineProperty(doc, 'caretPositionFromPoint', {writable: true, value: null});
			Object.defineProperty(doc, 'caretRangeFromPoint', {writable: true, value: function () {
				return {
					startContainer: element[0],
					startOffset: 0
				};
			}});
			expect(Reader.CFI.getCFIObject()).toEqual({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			Object.defineProperty(doc, 'caretRangeFromPoint', {writable: true, value: null});
			expect(Reader.CFI.getCFIObject()).toBeFalsy();
		});

	});

	describe('getCFI', function () {

		it('should return a JSON string of the CFI object', function () {
			var obj = {
					CFI: fixtures.BOOK.BOOKMARK.CFI,
					preview: fixtures.BOOK.BOOKMARK.preview,
					chapter : fixtures.BOOK.BOOKMARK.chapter
				},
				encodedObj = encodeURIComponent(JSON.stringify(obj));
			spyOn(Reader.CFI, 'getCFIObject').and.returnValue({
				CFI: fixtures.BOOK.BOOKMARK.CFI,
				preview: fixtures.BOOK.BOOKMARK.preview,
				chapter : fixtures.BOOK.BOOKMARK.chapter
			});
			expect(Reader.CFI.getCFI()).toBe(encodedObj);
		});

	});

});
