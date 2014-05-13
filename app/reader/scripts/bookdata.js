'use strict';

/* jshint unused: true */
/* exported Reader */
/* globals $ */

var Reader = (function (r) {
	// This is a private array of bookmarks for the current book. The data is organised based on chapters.
	// Ex: `_bookmarks[1]` contains an array of bookmarks from the first chapter.
	var _bookmarks = [];

	// The **Bookmarks** object exposes methods to allow the user to manage their bookmarks.
	//
	// * [`getBookmarks`](#getBookmarks)
	// * [`setBookmarks`](#setBookmarks)
	// * [`removeBookmark`](#removeBookmark)
	// * `goToBookmark`
	// * `reset`
	// * [`display`](#display)
	r.Bookmarks = {
		// <a name="getBookmarks"></a> Public getter function.
		getBookmarks: function(){
			return _bookmarks;
		},
		getVisibleBookmarks: function(){
			var bookmarks = [];
			$('.bookmark[data-cfi]', r.$iframe.contents()).each(function(index, el){
				if(r.returnPageElement(el) === r.Navigation.getPage()){
					bookmarks.push($(el).attr('data-cfi'));
				}
			});
			return bookmarks;
		},
		// <a name="setBookmarks"></a>This function will set the bookmarks based on the chapter they appear in.
		// `val` is an array of cfi-s representing the current book's bookmarks.
		setBookmarks: function(val, noMarker){
			if($.isArray(val)){
				$.each(_bookmarks, function(i, el){
					if($.isArray(el)){
						$.each(el, function(index, cfi){
							r.Bookmarks.removeBookmark(cfi);
						});
					}
				});
				_bookmarks = [];
				$.each(val, function(i, element){
					r.Bookmarks.setBookmark(element, noMarker);
				});
			}
		},

		// <a name="setBookmark"></a>This function saves a bookmark in the appropriate location, based on the chapter it appears in, and returns the cfi object associated with it.
		//
		// * `cfi` (optional) the cfi to save as a bookmark, otherwise the current page's cfi will be used.
		// * `noMarker` (optional) flag to indicate the bookmark does not require a marker inserted into the DOM.
		setBookmark: function(cfi, noMarker){
			var cfiObj = null;
			if(typeof(cfi) === 'undefined'){
				cfiObj = r.Navigation.getCurrentCFI();
				if($.type(cfiObj) === 'object'){
					cfi = cfiObj.CFI;
				} else {
					r.Notify.error($.extend({}, r.Event.ERR_CFI_GENERATION, {details: cfiObj, call: 'setBookmark'}));
					return false;
				}
			}

			var index = r.CFI.getChapterFromCFI(cfi);
			if(index !== -1){
				if(!$.isArray(_bookmarks[index])){
					_bookmarks[index] = [];
				}
				if($.inArray(cfi, _bookmarks[index]) === -1){
					_bookmarks[index].push(cfi);
					if(!noMarker && index === r.Navigation.getChapter()){
						r.CFI.setCFI(cfi);
						r.Bookmarks.display();
					}
					return cfiObj !== null ? JSON.stringify(cfiObj) : cfi;
				}
			}
			// bookmark exists
			r.Notify.error($.extend({}, r.Event.ERR_BOOKMARK_EXISTS, {details: cfi, call: 'setBookmark'}));
			return false;
		},
		// <a name="removeBookmark"></a>This function will remove a bookmark from the book and any associated DOM elements.
		// * `cfi` (required) the CFI of the bookmark to remove.
		removeBookmark: function(cfi){
			var chapter = r.CFI.getChapterFromCFI(cfi);
			if(chapter !== -1){
				var index = $.inArray(cfi, _bookmarks[chapter]);
				if($.isArray(_bookmarks[chapter]) && index !== -1){
					_bookmarks[chapter][index] = null;

					var $marker = $('*[data-cfi="' + cfi + '"]', r.$iframe.contents());
					if($marker.length){
						var $parent = $marker.parent();
						$marker.remove();

						// this restates the DOM to the previous structure
						// todo do not alter the DOM in the first place
						$parent[0].normalize();
					}

					r.Bookmarks.display();
					return true;
				}
			}
			// cannot remove bookmark
			r.Notify.error({}, $.extend(r.Event.ERR_BOOKMARK_REMOVE, {details: cfi, call: 'removeBookmark'}));
			return false;
		},
		goToBookmark: function(cfi){
			return r.CFI.goToCFI(cfi);
		},
		reset: function(){
			_bookmarks = [];
		},
		// <a name="display"></a>This function refreshes the bookmark UI. If a bookmark is visible on the current page, it will display the bookmark UI. Ignores mobile readers.
		display: function(){
			var isVisible = false;
			$('.bookmark', r.$iframe.contents()).each(function(index, el){
				isVisible = r.returnPageElement(el) === r.Navigation.getPage();
				if (isVisible) {
					return false;
				}
			});
			if (r.mobile) {
				return isVisible;
			}
			if(isVisible){
				$('#cpr-bookmark-ui', r.$iframe.contents()).show();
				return isVisible;
			} else {
				$('#cpr-bookmark-ui', r.$iframe.contents()).hide();
			}
			return false;
		}
	};

	// Debug flag, used to log various events for debugging purposes
	var _debug = false;
	r.Debug = {
		enable: function enableDebug(){
			_debug = true;
		},
		disable: function disableDebug(){
			_debug = false;
		},
		log: function logDebug(s){
			if(_debug){
				console.warn(s);
			}
		}
	};

	return r;
}(Reader || {}));
