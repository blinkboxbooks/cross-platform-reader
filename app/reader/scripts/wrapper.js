'use strict';
/* exported READER */
/* globals $, Reader */
var READER = (function() {
	// Public methods from the Reader.
	// All client communication is done here and only here. Do NOT send any events from other files.
	// The reader should return a promise for any action, a promise that gets resolved/rejected and the appropriate event is fired when the promise is fulfiled.
	// The goal is to make the reader as client-ignorant as possible.

	// Generates an object summarizing the reader status.
	var _send_status = function(call){
		Reader.Notify.event($.extend({}, Reader.Event.getStatus(call)));
	};

	// Wrap a reader action so that it will return the reader status after the action is performed
	var _status_wrap = function(action, call){
		return function(){
			var result = action.apply(null, arguments);
			_send_status(call);
			return result;
		};
	};

	var _isLoading = false;

	return {
		init: function init(){
			if(_isLoading){
				return $.Deferred().reject().promise();
			}
			return Reader.init.apply(Reader, arguments).always(function initComplete(){
				Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
				_isLoading = false;
			}).then(
				function initSuccess(){
					_send_status('init');
				},
				function initFailure(err){
					Reader.Notify.error(err);
				},
				function initNotify(){
					// The notify event will be sent twice on init:
					// 1. once for the meta data load
					// 2. once for the chapter load
					if (!_isLoading) {
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		setLineHeight: _status_wrap(Reader.setLineHeight, 'setLineHeight'),
		increaseLineHeight: _status_wrap(Reader.increaseLineHeight, 'increaseLineHeight'),
		decreaseLineHeight: _status_wrap(Reader.decreaseLineHeight, 'decreaseLineHeight'),
		increaseFontSize: _status_wrap(Reader.increaseFontSize, 'increaseFontSize'),
		decreaseFontSize: _status_wrap(Reader.decreaseFontSize, 'decreaseFontSize'),
		setFontSize: _status_wrap(Reader.setFontSize, 'setFontSize'),
		setTextAlign: _status_wrap(Reader.setTextAlign, 'setTextAlign'),
		setMargin: _status_wrap(Reader.setMargin, 'setMargin'),
		setTheme: _status_wrap(Reader.setTheme, 'setTheme'),
		setFontFamily: _status_wrap(Reader.setFontFamily, 'setFontFamily'),
		setPreferences: _status_wrap(Reader.setPreferences, 'setPreferences'),
		getCFI: Reader.CFI.getCFI,
		goToCFI: function goToCFI(){
			if (_isLoading) {
				return $.Deferred().reject().promise();
			}
			return Reader.CFI.goToCFI.apply(Reader.CFI, arguments).always(function goToCFIComplete(){
				if (_isLoading) {
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function goToCFISuccess () {
					_send_status('goToCFI');
				},
				function goToCFIFail (err) {
					Reader.Notify.error(err);
				},
				function goToCFINotification (args) {
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		goToProgress: function goToProgress(){
			if (_isLoading) {
				return $.Deferred().reject().promise();
			}
			return Reader.Navigation.goToProgress.apply(Reader.Navigation.goToProgress, arguments).always(function goToProgressComplete(){
				if (_isLoading) {
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function goToProgressSuccess () {
					_send_status('goToProgress');
				},
				function goToProgressFail (err) {
					Reader.Notify.error(err);
				},
				function goToProgressNotification (args) {
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		next: function next(){
			if(_isLoading){
				return $.Deferred().reject().promise();
			}
			return Reader.Navigation.next().always(function nextComplete(){
				if(_isLoading){
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function nextOnSuccess(){
					_send_status('next');
				},
				function nextOnError(err){
					if(err === Reader.Event.END_OF_BOOK || err === Reader.Event.START_OF_BOOK){
						Reader.Notify.event(err);
					} else {
						Reader.Notify.error(err);
					}
				},
				function nextOnNotification(args){
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		prev: function prev(){
			if(_isLoading){
				return $.Deferred().reject().promise();
			}
			return Reader.Navigation.prev().always(function prevComplete(){
				if(_isLoading){
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function prevOnSuccess(){
					_send_status('prev');
				},
				function prevOnError(err){
					if(err === Reader.Event.END_OF_BOOK || err === Reader.Event.START_OF_BOOK){
						Reader.Notify.event(err);
					} else {
						Reader.Notify.error(err);
					}
				},
				function prevOnNotification(args){
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		loadChapter: function loadChapter(){
			if (_isLoading) {
				return $.Deferred().reject().promise();
			}
			return Reader.Navigation.loadChapter.apply(Reader.Navigation, arguments).always(function loadChapterComplete(){
				if (_isLoading) {
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function loadChapterSuccess(){
					_send_status('loadChapter');
				},
				function loadChapterFail(err){
					Reader.Notify.error(err);
				},
				function loadChapterNotification (args) {
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		getProgress: Reader.Navigation.getProgress,
		getBookmarks: Reader.Bookmarks.getBookmarks,
		setBookmarks: _status_wrap(Reader.Bookmarks.setBookmarks, 'setBookmarks'),
		setBookmark: _status_wrap(Reader.Bookmarks.setBookmark, 'setBookmark'),
		goToBookmark: function goToBookmark(){
			if (_isLoading) {
				return $.Deferred().reject().promise();
			}
			return Reader.Bookmarks.goToBookmark.apply(Reader.Bookmarks, arguments).always(function goToCFIComplete(){
				if (_isLoading) {
					Reader.Notify.event(Reader.Event.LOADING_COMPLETE);
					_isLoading = false;
				}
			}).then(
				function goToBookmarkSuccess(){
					_send_status('goToBookmark');
				},
				function goToBookmarkFail(err){
					Reader.Notify.error(err);
				},
				function goToBookmarkNotification (args) {
					if (args && args.type === 'chapter.loading') {
						// book requires remote file, send a loading event to notify the client:
						Reader.Notify.event(Reader.Event.LOADING_STARTED);
						_isLoading = true;
					}
				}
			);
		},
		removeBookmark: _status_wrap(Reader.Bookmarks.removeBookmark, 'removeBookmark'),
		showHeaderAndFooter: Reader.showHeaderAndFooter,
		hideHeaderAndFooter: Reader.hideHeaderAndFooter,
		resizeContainer: _status_wrap(Reader.Layout.resizeContainer, 'resizeContainer'),
		Event: Reader.Event,
		refreshLayout: _status_wrap(Reader.refreshLayout, 'refreshLayout'),
		enableDebug: Reader.Debug.enable,
		disableDebug: Reader.Debug.disable
	};
}());