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
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(4);
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
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(4);
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
			spyOn(Reader.Navigation, 'getChapter').and.returnValue(4);
			spyOn(Reader.Bookmarks, 'display').and.callThrough();
			spyOn(Reader.CFI, 'setCFI');
			Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			var result = Reader.Bookmarks.setBookmark(fixtures.BOOKMARK.CFI);
			expect(Reader.Bookmarks.display.calls.count()).toBe(1);
			expect(Reader.CFI.setCFI.calls.count()).toBe(1);
			expect(Reader.Notify.error).toHaveBeenCalledWith($.extend({}, Reader.Event.ERR_BOOKMARK_EXISTS, {details: fixtures.BOOKMARK.CFI, call: 'setBookmark'}));
			expect(result).toBeFalsy();
		});

		it('should trigger an error if the chapter cannpt be extracted from the given CFI', function () {
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

});
