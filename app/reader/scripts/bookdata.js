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
		ATTRIBUTE: 'data-bookmark',
		// <a name="getBookmarks"></a> Public getter function.
		getBookmarks: function(){
			return _bookmarks;
		},
		getVisibleBookmarks: function(){
			var bookmarks = [];
			$('[data-bookmark][data-cfi]', r.$iframe.contents()).each(function(index, el){
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
							if(cfi){
								r.Bookmarks.removeBookmark(cfi);
							}
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
						r.CFI.setBookmarkCFI(cfi);
						r.Bookmarks.display();
					}
					return cfiObj !== null ? JSON.stringify(cfiObj) : cfi;
				}
			}  else {
				// cfi not recognised in book
				r.Notify.error($.extend({}, r.Event.ERR_BOOKMARK_ADD, {details: cfi, call: 'setBookmark'}));
				return false;
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
					_bookmarks[chapter].splice(index, 1);

					var $marker = $('[data-bookmark][data-cfi="' + cfi + '"]', r.$iframe.contents());
					if($marker.length){
						if($marker.hasClass('cpr-marker')){
							var $parent = $marker.parent();
							$marker.remove();

							// this restates the DOM to the previous structure
							// todo do not alter the DOM in the first place
							$parent[0].normalize();
						} else {
							$marker.removeAttr('data-bookmark');
						}
					}

					r.Bookmarks.display();
					return true;
				}
			}
			// cannot remove bookmark
			r.Notify.error($.extend({}, r.Event.ERR_BOOKMARK_REMOVE, {details: cfi, call: 'removeBookmark'}));
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
			$('[data-bookmark]', r.$iframe.contents()).each(function(index, el){
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

	// This is a private array of highlights for the current book. The data is organised based on chapters.
	// Ex: `_highlights[1]` contains an array of bookmarks from the first chapter.
	var _highlights = [];

	r.Highlights = {
		ATTRIBUTE: 'data-highlight',
		getHighlights: function(){
			return _highlights;
		},
		// <a name="setHighlights"></a>This function will set the highlights based on the chapter they appear in.
		// `val` is an array of cfi-s representing the current book's bookmarks.
		setHighlights: function(val){
			if($.isArray(val)){
				$.each(_highlights, function(i, el){
					if($.isArray(el)){
						$.each(el, function(index, cfi){
							if(cfi){
								r.Highlights.removeHighlight(cfi);
							}
						});
					}
				});
				_highlights = [];
				$.each(val, function(i, element){
					r.Highlights.setHighlight(element);
				});
			}
		},
		// <a name="setHighlight"></a>This function saves a highlight in the appropriate location, based on the chapter it appears in, and returns the cfi associated with it.
		//
		// * `cfi` (optional) the cfi to save as a highlight, otherwise the current selection's cfi will be used. If no cfi exists and no selection is set, an exception is thrown.
		setHighlight: function(cfi){

			if(!cfi){
				// if cfi is not preset, we assume the current selection needs to be highlighted
				var selection = r.$iframe.contents()[0].getSelection();
				if(selection.rangeCount > 0 && !selection.isCollapsed){
					cfi = r.Epub.generateRangeCFI(selection.getRangeAt(0));
				} else {
					// no selected text
					r.Notify.error($.extend({}, r.Event.ERR_HIGHLIGHT_ADD, {call: 'setHighlight'}));
					return false;
				}
			}

			var chapter = r.CFI.getChapterFromCFI(cfi);
			if(chapter !== -1){
				if(!$.isArray(_highlights[chapter])){
					_highlights[chapter] = [];
				}
				if($.inArray(cfi, _highlights[chapter]) === -1){
					_highlights[chapter].push(cfi);
					if(chapter === r.Navigation.getChapter()){
						r.CFI.setHighlightCFI(cfi);
						r.Highlights.display();
					}
					return cfi;
				}
			} else {
				// cfi not recognised in book
				r.Notify.error($.extend({}, r.Event.ERR_HIGHLIGHT_ADD, {details: cfi, call: 'setHighlight'}));
				return false;
			}
			// highlight already exists
			r.Notify.error($.extend({}, r.Event.ERR_HIGHLIGHT_EXISTS, {details: cfi, call: 'setHighlight'}));
			return false;
		},
		removeHighlight: function(cfi){
			var chapter = r.CFI.getChapterFromCFI(cfi);
			if(chapter !== -1){
				var index = $.inArray(cfi, _highlights[chapter]);
				if($.isArray(_highlights[chapter]) && index !== -1){
					_highlights[chapter].splice(index, 1);

					var $marker = $('['+r.Highlights.ATTRIBUTE+'][data-cfi="' + cfi + '"]', r.$iframe.contents());
					if($marker.length){
						if($marker.hasClass('cpr-marker')){
							var $parent = $marker.parent();
							$marker.remove();

							// this restates the DOM to the previous structure
							// todo do not alter the DOM in the first place
							$parent[0].normalize();
						} else {
							$marker.removeAttr(r.Highlights.ATTRIBUTE);
						}
					}

					r.Highlights.display();
					return true;
				}
			}
			// cannot remove bookmark
			r.Notify.error($.extend({}, r.Event.ERR_HIGHLIGHT_REMOVE, {details: cfi, call: 'removeHighlight'}));
			return false;
		},
		display: function(){
			var isVisible = false;
			$('[data-highlight]', r.$iframe.contents()).each(function(index, el){
				isVisible = r.returnPageElement(el) === r.Navigation.getPage();
				if (isVisible) {
					return false;
				}
			});
			return isVisible;
		},
		getVisibleHighlights: function(){
			var highlights = [];
			$('[data-highlight]', r.$iframe.contents()).each(function(index, el){
				if(r.returnPageElement(el) === r.Navigation.getPage()){
					highlights.push($(el).attr('data-highlight'));
				}
			});
			// the array must be unique
			return highlights.filter(function(el, index){
				return highlights.indexOf(el) === index;
			});
		},
		reset: function(){
			_highlights = [];
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
		},
		error: function logDebug(s){
			if(_debug){
				console.error(s);
			}
		}
	};

	return r;
}(Reader || {}));
