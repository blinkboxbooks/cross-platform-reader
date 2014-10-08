/* global fixtures */

'use strict';

describe('Highlights', function(){
	var Highlights = Reader.Highlights, CFI = Reader.CFI, Epub = Reader.Epub, data = {
		cfi: 'epubcfi(/6/6!/4/2[dedication]/2/6/2,/5:10,/5:17)',
		chapter: 2
	};

	it('should provide the Bookmarks interface', function () {
		expect(Highlights).toBeObject();
		expect(Highlights.getHighlights).toBeFunction();
		expect(Highlights.setHighlights).toBeFunction();
		expect(Highlights.setHighlight).toBeFunction();
		expect(Highlights.removeHighlight).toBeFunction();
		expect(Highlights.display).toBeFunction();
		expect(Highlights.getVisibleHighlights).toBeFunction();
		expect(Highlights.reset).toBeFunction();
	});

	describe('setHighlight', function(){

		var highlights;

		beforeEach(function(){
			highlights = Highlights.getHighlights();
		});

		afterEach(function(){
			// return Highlights manager object to a clean state
			Highlights.reset();
		});

		it('should save the given cfi as a highlight in the correct location ', function(){

			spyOn(CFI, 'getChapterFromCFI').and.returnValue(data.chapter);

			expect(highlights).toBeEmptyArray();

			Highlights.setHighlight(data.cfi);

			expect(CFI.getChapterFromCFI).toHaveBeenCalledWith(data.cfi);
			expect(highlights).not.toBeEmptyArray();
			expect(highlights[data.chapter]).toBeArray(1);
			expect(highlights[data.chapter][0]).toEqual(data.cfi);
		});

		it('should generate a cfi from the user selection', function(){

			spyOn(Epub, 'generateRangeCFI').and.returnValue(data.cfi);
			spyOn(CFI, 'getChapterFromCFI').and.returnValue(data.chapter);
			// mock the $iframe object
			Reader.$iframe = {
				contents: function(){
					return [{
						getSelection: function(){
							return {
								rangeCount: 1,
								isCollapsed: false,
								getRangeAt: $.noop
							};
						}
					}];
				}
			};

			expect(highlights).toBeEmptyArray();

			Highlights.setHighlight();

			expect(CFI.getChapterFromCFI).toHaveBeenCalledWith(data.cfi);
			expect(Epub.generateRangeCFI).toHaveBeenCalled();
			expect(Epub.generateRangeCFI.calls.count()).toEqual(1);

			expect(highlights).not.toBeEmptyArray();
			expect(highlights[data.chapter]).toBeArray(1);
			expect(highlights[data.chapter][0]).toEqual(data.cfi);

			Reader.$iframe = null;
		});

		it('should trigger an error if no cfi exits');
		it('should trigger an error if the bookmark has already been set');
		it('should trigger an error if the chapter cannot be extracted from the given CFI');
	});

	describe('setHighlights', function(){
		it('should set the given list of highlights and remove any old highlights');
	});

	describe('removeHighlight', function(){
		it('');
	});

	describe('display', function(){
		it('');
	});

	describe('getVisibleHighlights', function(){
		it('');
	});

});

describe('Bookmarks', function() {

	beforeEach(function () {
		spyOn($, 'ajax').and.callFake(function () {
			return {
				then: $.noop
			};
		});
		Reader.init({
			container: $('<div></div>').appendTo($('body')),
			width: 400,
			height: 600
		});
	});

	it('should provide the Bookmarks interface', function () {
		expect(Reader.Bookmarks).toBeObject();
	});

	describe('setBookmark', function () {

		it('should trigger an error if no current CFI can be retrieved', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			Reader.Bookmarks.setBookmark();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_CFI_GENERATION, {details: null, call: 'setBookmark'}));
		});

		it('should set the current CFI as bookmark', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getCurrentCFI').and.returnValue(fixtures.BOOK.BOOKMARK);
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark();
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(Reader.CFI.setCFI).toHaveBeenCalledWith(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(result).toEqual(JSON.stringify(fixtures.BOOK.BOOKMARK));
		});

		it('should set the given CFI as bookmark', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getCurrentCFI').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Navigation.getCurrentCFI).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(Reader.CFI.setCFI).toHaveBeenCalledWith(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(result).toEqual(fixtures.BOOK.BOOKMARK.CFI);
		});

		it('should not set a marker if the second argument is true', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI, true);
			expect(Reader.Navigation.getChapter).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.CFI.setCFI).not.toHaveBeenCalled();
			expect(result).toEqual(fixtures.BOOK.BOOKMARK.CFI);
		});

		it('should trigger an error if the bookmark has already been set', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOK.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display.calls.count()).toBe(1);
			expect(Reader.CFI.setCFI.calls.count()).toBe(1);
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_EXISTS, {details: fixtures.BOOK.BOOKMARK.CFI, call: 'setBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should trigger an error if the chapter cannot be extracted from the given CFI', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			spyOn(Reader.CFI, 'getChapterFromCFI').and.returnValue(-1);
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.CFI.setCFI).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_EXISTS, {details: fixtures.BOOK.BOOKMARK.CFI, call: 'setBookmark'}));
			expect(result).toBeFalsy();
		});

	});

	describe('getBookmarks', function () {

		it('Should return the list of bookmarks', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOK.BOOKMARK_CHAPTER] = [fixtures.BOOK.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			expect(Reader.Bookmarks.getBookmarks()).toEqual([]);
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

	});

	describe('removeBookmark', function () {

		it('should trigger an error if the chapter cannot be extracted from the given CFI', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'getChapterFromCFI').and.returnValue(-1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_REMOVE, {details: fixtures.BOOK.BOOKMARK.CFI, call: 'removeBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should trigger an error if the bookmark does not exist', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_REMOVE, {details: fixtures.BOOK.BOOKMARK.CFI, call: 'removeBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should set the bookmark in the list of bookmarks to null', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()[fixtures.BOOK.BOOKMARK_CHAPTER][0]).toBe(fixtures.BOOK.BOOKMARK.CFI);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()[fixtures.BOOK.BOOKMARK_CHAPTER][0]).toBeFalsy();
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(result).toBeTruthy();
		});

		it('should remove the cpr-marker from the DOM', function () {
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			// Manually add a cpr-marker as we mocked Reader.CFI.setCFI:
			Reader.$reader.append(
				'<span class="cpr-marker" data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.$reader.find('.cpr-marker').length).toBe(1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.$reader.find('.cpr-marker').length).toBe(0);
			expect(result).toBeTruthy();
		});

		it('should remove the data-bookmark attribute from the element with the matching data-cfi attribute', function () {
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOK.BOOKMARK.CFI);
			// Manually add a bookmark as we mocked Reader.CFI.setCFI:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.$reader.find('[data-bookmark][data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"]').length).toBe(1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOK.BOOKMARK.CFI);
			expect(Reader.$reader.find('[data-bookmark][data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"]').length).toBe(0);
			expect(result).toBeTruthy();
		});

	});

	describe('setBookmarks', function () {

		it('Should set the given list of bookmarks and remove any old bookmarks', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOK.BOOKMARK_CHAPTER] = [fixtures.BOOK.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmarks([fixtures.BOOK.BOOKMARK.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
			bookmarks = [];
			bookmarks[fixtures.BOOK.BOOKMARK_2_CHAPTER] = [fixtures.BOOK.BOOKMARK_2.CFI, fixtures.BOOK.BOOKMARK_3.CFI];
			Reader.Bookmarks.setBookmarks([fixtures.BOOK.BOOKMARK_2.CFI, fixtures.BOOK.BOOKMARK_3.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

		it('Should do nothing if the given argument is not an array', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOK.BOOKMARK_CHAPTER] = [fixtures.BOOK.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmarks([fixtures.BOOK.BOOKMARK.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
			Reader.Bookmarks.setBookmarks(undefined);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

	});

	describe('getVisibleBookmarks', function () {

		it('should return the list of visible bookmarks', function () {
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				if ($(el).is('[data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"]')) {
					// Define the first bookmark as being on page 1:
					return 1;
				}
				// Define other bookmarks as being on page 2:
				return 2;
			});
			// Define the current page as page 2:
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add bookmarks:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK_2.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK_3.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.getVisibleBookmarks()).toEqual([
				fixtures.BOOK.BOOKMARK_2.CFI,
				fixtures.BOOK.BOOKMARK_3.CFI
			]);
		});

	});

	describe('getVisibleBookmarks', function () {

		it('should return the list of visible bookmarks', function () {
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				if ($(el).is('[data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"]')) {
					// Define the first bookmark as being on page 1:
					return 1;
				}
				// Define other bookmarks as being on page 2:
				return 2;
			});
			// Define the current page as page 2:
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add bookmarks:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK_2.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK_3.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.getVisibleBookmarks()).toEqual([
				fixtures.BOOK.BOOKMARK_2.CFI,
				fixtures.BOOK.BOOKMARK_3.CFI
			]);
		});

	});

	describe('goToBookmark', function () {

		it('should move to the specified bookmark', function () {
			spyOn(Reader.CFI, 'goToCFI');
			Reader.Bookmarks.goToBookmark();
			expect(Reader.CFI.goToCFI).toHaveBeenCalled();
		});

	});

	describe('display', function () {

		it('should display the bookmark ui and return true if there is a visible bookmark', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(2);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.display()).toBeTruthy();
			expect(Reader.$wrap.find('#cpr-bookmark-ui').css('display')).toBe('block');
		});

		it('should return true for mobile clients if bookmarks are visible but not display the bookmark ui', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(2);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			Reader.mobile = true;
			expect(Reader.Bookmarks.display()).toBeTruthy();
			expect(Reader.$wrap.find('#cpr-bookmark-ui').css('display')).toBe('none');
		});

		it('should return false if no bookmarks are visible', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(2);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(1);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOK.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.display()).toBeFalsy();
			expect(Reader.$wrap.find('#cpr-bookmark-ui').is(':visible')).toBeFalsy();
		});

	});

});


describe('Debug', function() {

	beforeEach(function () {
		spyOn($, 'ajax').and.callFake(function () {
			return {
				then: $.noop
			};
		});
		Reader.init({
			container: $('<div></div>').appendTo($('body'))
		});
	});

	it('should provide the Debug interface', function () {
		expect(Reader.Debug).toBeObject();
	});

	describe('log', function () {

		it('should log info messages with console.warn when debug is enabled', function () {
			var message;
			spyOn(console, 'warn').and.callFake(function (msg) {
				message = msg;
			});
			Reader.Debug.enable();
			Reader.Debug.log('BANANA');
			expect(message).toBe('BANANA');
			expect(console.warn).toHaveBeenCalled();
		});

	});

	describe('error', function () {

		it('should log error messages with console.error when debug is enabled', function () {
			var message;
			spyOn(console, 'error').and.callFake(function (msg) {
				message = msg;
			});
			Reader.Debug.enable();
			Reader.Debug.error('BANANA');
			expect(message).toBe('BANANA');
			expect(console.error).toHaveBeenCalled();
		});

	});

	describe('enable', function () {

		it('should enable debug messages', function () {
			var message;
			spyOn(console, 'warn').and.callFake(function (msg) {
				message = msg;
			});
			Reader.Debug.disable();
			Reader.Debug.log('BANANA');
			expect(message).toBeUndefined();
			expect(console.warn).not.toHaveBeenCalled();
			Reader.Debug.enable();
			Reader.Debug.log('BANANA');
			expect(message).toBe('BANANA');
			expect(console.warn).toHaveBeenCalled();
		});

	});

	describe('disable', function () {

		it('should disable debug messages', function () {
			var message;
			spyOn(console, 'warn').and.callFake(function (msg) {
				message = msg;
			});
			Reader.Debug.enable();
			Reader.Debug.log('BANANA');
			expect(message).toBe('BANANA');
			expect(console.warn.calls.count()).toBe(1);
			message = null;
			Reader.Debug.disable();
			Reader.Debug.log('BANANA');
			expect(message).toBeNull();
			expect(console.warn.calls.count()).toBe(1);
		});

	});

});
