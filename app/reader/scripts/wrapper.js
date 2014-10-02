'use strict';
/* exported READER */
/* globals $, Reader */
var READER = (function() {
	// Public methods from the Reader.
	// All client communication is done here and only here. Do NOT send any events from other files.
	// The reader should return a promise for any action, a promise that gets resolved/rejected and the appropriate event is fired when the promise is fulfiled.
	// The goal is to make the reader as client-ignorant as possible.

	var _isLoading = false;
	
	// Generates an object summarizing the reader status.
	function sendStatus(call) {
		Reader.Notify.event($.extend({}, Reader.Event.getStatus(call)));
	}

	// Wrap a reader action so that it will return the reader status after the action is performed
	function statusWrap(obj, method) {
		return function() {
			var result = obj[method].apply(obj, arguments);
			sendStatus(method);
			return result;
		};
	}

	// Wrap a reader action so that it will send loading notifications if applicable:
	function loadingWrap(obj, method) {
		return function() {
			if (_isLoading) {
				return $.Deferred().reject().promise();
			}
			return obj[method].apply(obj, arguments).always(function complete() {
				if (_isLoading) {
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function done() {
					sendStatus(method);
				},
				function fail(err) {
					if (err === Reader.Event.END_OF_BOOK || err === Reader.Event.START_OF_BOOK) {
						Reader.Notify.event(err);
					} else {
						Reader.Notify.error(err);
					}
				},
				function progress(args) {
					if (!_isLoading && args && (args.type === 'chapter.loading' || args.type === 'meta.loading')) {
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		};
	}

	return {
		init: loadingWrap(Reader, 'init'),
		setLineHeight: statusWrap(Reader, 'setLineHeight'),
		increaseLineHeight: statusWrap(Reader, 'increaseLineHeight'),
		decreaseLineHeight: statusWrap(Reader, 'decreaseLineHeight'),
		increaseFontSize: statusWrap(Reader, 'increaseFontSize'),
		decreaseFontSize: statusWrap(Reader, 'decreaseFontSize'),
		setFontSize: statusWrap(Reader, 'setFontSize'),
		setTextAlign: statusWrap(Reader, 'setTextAlign'),
		setMargin: statusWrap(Reader, 'setMargin'),
		setTheme: statusWrap(Reader, 'setTheme'),
		setFontFamily: statusWrap(Reader, 'setFontFamily'),
		setPreferences: statusWrap(Reader, 'setPreferences'),
		getCFI: Reader.CFI.getCFI,
		goToCFI: loadingWrap(Reader.CFI, 'goToCFI'),
		goToProgress: loadingWrap(Reader.Navigation, 'goToProgress'),
		next: loadingWrap(Reader.Navigation, 'next'),
		prev: loadingWrap(Reader.Navigation, 'prev'),
		loadChapter: loadingWrap(Reader.Navigation, 'loadChapter'),
		getProgress: Reader.Navigation.getProgress,
		getBookmarks: Reader.Bookmarks.getBookmarks,
		setBookmarks: statusWrap(Reader.Bookmarks, 'setBookmarks'),
		setBookmark: statusWrap(Reader.Bookmarks, 'setBookmark'),
		goToBookmark: loadingWrap(Reader.Bookmarks, 'goToBookmark'),
		removeBookmark: statusWrap(Reader.Bookmarks, 'removeBookmark'),
		showHeaderAndFooter: Reader.showHeaderAndFooter,
		hideHeaderAndFooter: Reader.hideHeaderAndFooter,
		resizeContainer: statusWrap(Reader.Layout, 'resizeContainer'),
		Event: Reader.Event,
		refreshLayout: statusWrap(Reader, 'refreshLayout'),
		enableDebug: Reader.Debug.enable,
		disableDebug: Reader.Debug.disable
	};
}());
