'use strict';

describe('Bookmarks', function() {

	beforeEach(function () {
		Reader.init({
			container: $('<div></div>').appendTo($('body'))
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
			spyOn(Reader.Navigation, 'getCurrentCFI').and.returnValue(fixtures.BOOKMARK);
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark();
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(Reader.CFI.setCFI).toHaveBeenCalledWith(fixtures.BOOKMARK.CFI, true);
			expect(result).toEqual(JSON.stringify(fixtures.BOOKMARK));
		});

		it('should set the given CFI as bookmark', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getCurrentCFI').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Navigation.getCurrentCFI).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(Reader.CFI.setCFI).toHaveBeenCalledWith(fixtures.BOOKMARK.CFI, true);
			expect(result).toEqual(fixtures.BOOKMARK.CFI);
		});

		it('should not set a marker if the second argument is true', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI, true);
			expect(Reader.Navigation.getChapter).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.CFI.setCFI).not.toHaveBeenCalled();
			expect(result).toEqual(fixtures.BOOKMARK.CFI);
		});

		it('should trigger an error if the bookmark has already been set', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(fixtures.BOOKMARK_CHAPTER);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display.calls.count()).toBe(1);
			expect(Reader.CFI.setCFI.calls.count()).toBe(1);
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_EXISTS, {details: fixtures.BOOKMARK.CFI, call: 'setBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should trigger an error if the chapter cannot be extracted from the given CFI', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			spyOn(Reader.CFI, 'getChapterFromCFI').and.returnValue(-1);
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.CFI.setCFI).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_EXISTS, {details: fixtures.BOOKMARK.CFI, call: 'setBookmark'}));
			expect(result).toBeFalsy();
		});

	});

	describe('getBookmarks', function () {

		it('Should return the list of bookmarks', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOKMARK_CHAPTER] = [fixtures.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			expect(Reader.Bookmarks.getBookmarks()).toEqual([]);
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

	});

	describe('removeBookmark', function () {

		it('should trigger an error if the chapter cannot be extracted from the given CFI', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'getChapterFromCFI').and.returnValue(-1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_REMOVE, {details: fixtures.BOOKMARK.CFI, call: 'removeBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should trigger an error if the bookmark does not exist', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display).not.toHaveBeenCalled();
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_REMOVE, {details: fixtures.BOOKMARK.CFI, call: 'removeBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should set the bookmark in the list of bookmarks to null', function () {
			spyOn(Reader.Notify, 'error').and.callThrough();
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()[fixtures.BOOKMARK_CHAPTER][0]).toBe(fixtures.BOOKMARK.CFI);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.getBookmarks()[fixtures.BOOKMARK_CHAPTER][0]).toBeFalsy();
			expect(Reader.Notify.error).not.toHaveBeenCalled();
			expect(Reader.Bookmarks.display).toHaveBeenCalled();
			expect(result).toBeTruthy();
		});

		it('should remove the cpr-marker from the DOM', function () {
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			// Manually add a cpr-marker as we mocked Reader.CFI.setCFI:
			Reader.$reader.append(
				'<span class="cpr-marker" data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.$reader.find('.cpr-marker').length).toBe(1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.$reader.find('.cpr-marker').length).toBe(0);
			expect(result).toBeTruthy();
		});

		it('should remove the data-bookmark attribute from the element with the matching data-cfi attribute', function () {
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			// Manually add a bookmark as we mocked Reader.CFI.setCFI:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.$reader.find('[data-bookmark][data-cfi="' + fixtures.BOOKMARK.CFI + '"]').length).toBe(1);
			var result = Reader.Bookmarks.removeBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.$reader.find('[data-bookmark][data-cfi="' + fixtures.BOOKMARK.CFI + '"]').length).toBe(0);
			expect(result).toBeTruthy();
		});

	});

	describe('setBookmarks', function () {

		it('Should set the given list of bookmarks and remove any old bookmarks', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOKMARK_CHAPTER] = [fixtures.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmarks([fixtures.BOOKMARK.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
			bookmarks = [];
			bookmarks[fixtures.BOOKMARK_2_CHAPTER] = [fixtures.BOOKMARK_2.CFI, fixtures.BOOKMARK_3.CFI];
			Reader.Bookmarks.setBookmarks([fixtures.BOOKMARK_2.CFI, fixtures.BOOKMARK_3.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

		it('Should do nothing if the given argument is not an array', function () {
			var bookmarks = [];
			bookmarks[fixtures.BOOKMARK_CHAPTER] = [fixtures.BOOKMARK.CFI];
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmarks([fixtures.BOOKMARK.CFI]);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
			Reader.Bookmarks.setBookmarks(undefined);
			expect(Reader.Bookmarks.getBookmarks()).toEqual(bookmarks);
		});

	});

	describe('getVisibleBookmarks', function () {

		it('should return the list of visible bookmarks', function () {
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				if ($(el).is('[data-cfi="' + fixtures.BOOKMARK.CFI + '"]')) {
					// Define the first bookmark as being on page 1:
					return 1
				}
				// Define other bookmarks as being on page 2:
				return 2;
			});
			// Define the current page as page 2:
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add bookmarks:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK_2.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK_3.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.getVisibleBookmarks()).toEqual([
				fixtures.BOOKMARK_2.CFI,
				fixtures.BOOKMARK_3.CFI
			]);
		});

	});

	describe('getVisibleBookmarks', function () {

		it('should return the list of visible bookmarks', function () {
			spyOn(Reader, 'returnPageElement').and.callFake(function (el) {
				if ($(el).is('[data-cfi="' + fixtures.BOOKMARK.CFI + '"]')) {
					// Define the first bookmark as being on page 1:
					return 1
				}
				// Define other bookmarks as being on page 2:
				return 2;
			});
			// Define the current page as page 2:
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add bookmarks:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK_2.CFI + '"></span>'
			);
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK_3.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.getVisibleBookmarks()).toEqual([
				fixtures.BOOKMARK_2.CFI,
				fixtures.BOOKMARK_3.CFI
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
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.display()).toBeTruthy();
			expect(Reader.$wrap.find('#cpr-bookmark-ui').css('display')).toBe('block');
		});

		it('should return true for mobile clients if bookmarks are visible but not display the bookmark ui', function () {
			spyOn(Reader, 'returnPageElement').and.returnValue(2);
			spyOn(Reader.Navigation, 'getPage').and.returnValue(2);
			// Manually add a bookmark:
			Reader.$reader.append(
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
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
				'<span data-bookmark data-cfi="' + fixtures.BOOKMARK.CFI + '"></span>'
			);
			expect(Reader.Bookmarks.display()).toBeFalsy();
			expect(Reader.$wrap.find('#cpr-bookmark-ui').is(':visible')).toBeFalsy();
		});

	});

});


describe('Debug', function() {

	beforeEach(function () {
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
