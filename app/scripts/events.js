'use strict';

/* jshint unused: true */
/* exported Reader */
/* globals $ */

var Reader = (function (r) {

	// Register a listener to the reader. Any future events will notify it.
	r.registerListener = function(f){
		if (f && typeof(f) === 'function') {
			r.listener = f;
			return true;
		}
		return false;
	};

	// Check if this is the first or last page of the book, and fire the appropriate event.
	var _check_page_pos = function(status){
		if(status.page === 0 && status.chapter === 0){
			Reader.Notify.event(Reader.Event.FIRST_PAGE);
		}
		if(status.page === status.pages && status.chapter === status.chapters - 1){
			Reader.Notify.event(Reader.Event.LAST_PAGE);
		}
		return status;
	};


	// Events supported by the reader.
	//
	// * `LAST_PAGE` - raised when the reader has opened the last page
	// * `LAYOUT_UPDATE` - raised when the number of pages and current page have been updated and possibly changed
	// * `PROGRESS_UPDATED` - event raised when the progress of the book is updated.
	// * `FIRST_PAGE` - event raised when the book displayed the first page of the book.
	// * `END_OF_BOOK`
	r.Event = {
		LAST_PAGE : {
			code: 0,
			message: 'Reader has displayed the last page.'
		},
		END_OF_BOOK : {
			code: 2,
			message: 'The end of the book has been reached.'
		},
		FIRST_PAGE: {
			code: 4,
			message: 'Reader has displayed the first page.'
		},
		LOADING_STARTED: {
			code: 5,
			message: 'Reader is loading.'
		},
		LOADING_COMPLETE: {
			code: 6,
			message: 'Reader has finished loading.'
		},
		STATUS: {
			'code': 7,
			'message': 'Reader has updated its status.',
			'version': '@@readerVersion'
		},
		START_OF_BOOK : {
			code: 8,
			message: 'The start of the book has been reached.'
		},
		ERR_MISSING_FILE:{
			code: 9,
			message: 'A file required by the reader is missing from the ePub.'
		},
		ERR_PARSING_FAILED:{
			code: 10,
			message: 'Parsing of the current chapter failed.'
		},
		ERR_CFI_GENERATION:{
			code: 11,
			message: 'Could not generate a CFI for this location.'
		},
		ERR_CFI_INSERTION:{
			code: 12,
			message: 'Could not insert content at the location specified by the CFI.'
		},
		ERR_INVALID_ARGUMENT:{
			code: 13,
			message: 'An invalid argument was sent to the reader.'
		},
		ERR_BOOKMARK_ADD:{
			code: 14,
			message: 'Could not add the bookmark.'
		},
		ERR_BOOKMARK_EXISTS:{
			code: 15,
			message: 'Could not add the bookmark because one already exists in this location.'
		},
		ERR_BOOKMARK_REMOVE:{
			code: 16,
			message: 'Could not remove bookmark.'
		},
		NOTICE_EXT_LINK:{
			code: 17,
			message: 'External link will navigate away from the reader'
		},
		CONTENT_NOT_AVAILABLE: {
			code: 18,
			message: 'This is a sample, content not available'
		},
		UNHANDLED_TOUCH_EVENT: {
			code: 19,
			message: 'Unhandled touch event at given coordinates.'
		},
		getStatus: function(){
			return _check_page_pos($.extend({}, r.Event.STATUS, {
				'bookmarksInPage': Reader.Bookmarks.getVisibleBookmarks(), // true if there is a bookmark on the current page
				'bookmarks': Reader.Bookmarks.getBookmarks(), // array of bookmarks from the book
				'cfi': Reader.Navigation.getCurrentCFI(), // the current CFI
				'progress': Reader.Navigation.getProgress(), // the progress of the book
				'chapter': Reader.Navigation.getChapter(), // the current chapter
				'chapters': Reader.Navigation.getNumberOfChapters(), // total number of chapters
				'page': Reader.Navigation.getPage(), // the current page
				'pages': Reader.Navigation.getNumberOfPages() // the total number of pages in the current chapter
			}));
		}
	};

	// Notify clients of reader events
	var _notify = function(data){
		r.Debug.log(data);

		// Notify reader listener, if it exists
		if (r.listener && typeof(r.listener) === 'function') { r.listener(data); }

		// Perform callback to mobile clients
		if(r.mobile){
			$.ajax({
				url: 'BBBCALLBACK',
				type: 'POST',
				data: JSON.stringify(data),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json'
			});
		}
	};

	r.Notify = {
		error: function notifyError(err){
			_notify(err);
			if(r.Bugsense){
				var error = Object.prototype.toString.call(err) === '[object Error]' ? err : new Error(JSON.stringify(err));
				r.Bugsense.notify(error, '', '', '', {
					Status: JSON.stringify(r.Event.getStatus()),
					Book: r.DOCROOT
				});
			}
		},
		event: function notifyEvent(event){
			_notify(event);
		}
	};

	return r;

}(Reader || {}));