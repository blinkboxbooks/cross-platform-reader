/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * display.js: methods for create the container and display the content
 */

/* jshint unused: true */
/* exported Reader */
/* globals $, Bugsense */

var Reader = (function (r) {
	'use strict';

	// **Init function**
	//
	// Assign parameters to the global variables.
	//
	// * `param` Contains the parameters: container (id), chapters, padding, url, mobile, dimensions (width and height) etc.
	r.init = function(param) {
		r.reset();

		if (!param) {
			param = {};
		}

		// Take the params {container, chapters, width, height, padding, _mobile} or create them.
		// todo validate container
		r.$cprElement = $(param.cprElement);
		r.$cprframe = $(param.cprframe);
		r.$document = r.$cprframe[0].shadowRoot;
		r.$head = $(r.$cprframe[0].$.head);
		r.$body = $(r.$cprframe[0].$.body);
		r.$container = $('<div></div>').appendTo(r.$body);
		r.$reader = $('<div id="cpr-reader"></div>').appendTo(r.$container);
		r.$header = $('<div id="cpr-header"></div>').insertBefore(r.$container);
		r.$footer = $('<div id="cpr-footer"></div>').insertAfter(r.$container);

		// Add bookmark mark
		$('<span id="cpr-bookmark-ui"></span>').insertAfter(r.$container);

		// add styles and fonts
		_addStyles();

		r.listener = (param.hasOwnProperty('listener')) ? param.listener : null;

		r.DOCROOT = (param.hasOwnProperty('url')) ? param.url : '';
		r.ISBN = (param.hasOwnProperty('isbn')) ? param.isbn : '';

		// Set the mobile flag.
		r.mobile = !!((param.hasOwnProperty('mobile')));

		// Initialise the epub module
		r.Epub.init(r.$reader[0]);

		// Initialize the touch module:
		r.Touch.init(r.$body);

		// Resize the container with the width and height (if they exist).
		_createContainer(param.width, param.height, param.columns, param.padding);

		// Apply all user preferences
		r.setPreferences(param.preferences);

		// Set initial transition timing function:
		r.$reader.css('transition-timing-function', r.preferences.transitionTimingFunction.value);

		r.support = {
			transitionend: _getTransitionEndProperty()
		};

		r.Layout.resizeContainer(param);

		// Enable bugsense reporting
		_setBugsense();

		// Start the party:
		return r.Book.load(param.book).then(function (book) {
			// Save the initial bookmarks and highlights.
			r.Bookmarks.setBookmarks((param.hasOwnProperty('bookmarks')) ? param.bookmarks : [], true);
			r.Highlights.setHighlights((param.hasOwnProperty('highlights')) ? param.highlights : [], true);

			return initializeBook(book, param);
		});
	};

	function _getTransitionEndProperty() {
		var element= window.document.createElement('div');
		if (element.style.webkitTransition !== undefined) {
			return 'webkitTransitionEnd';
		}
		if (element.style.MozTransition !== undefined) {
			return 'transitionend';
		}
		if (element.style.OTransition !== undefined) {
			return 'otransitionend';
		}
		if (element.style.transition !== undefined) {
			return 'transitionend';
		}
	}

	function _addStyles() {
		// Save a reference for each style
		var rules = r.$cprframe[0].$.style.sheet.cssRules;
		var i, l= rules.length;
		for(i=0; i< l; i++){
			var rule = rules[i];
			if(rule.selectorText === '#html'){
				r.preferences.fontSize.rules.push({rule: rule.style, property: 'fontSize'});
			} else if(rule.selectorText === '#body'){
				r.preferences.lineHeight.rules.push({rule: rule.style, property: 'lineHeight'});
				r.preferences.fontFamily.rules.push({rule: rule.style, property: 'fontFamily'});
				r.preferences.textAlign.rules.push({rule: rule.style, property: 'textAlign'});
				r.preferences.theme.rules.color.push({rule: rule.style, property: 'color'});
				r.preferences.theme.rules.background.push({rule: rule.style, property: 'background'});
			} else if(rule.selectorText === '#cpr-header' || rule.selectorText === '#cpr-footer'){
				r.preferences.theme.rules.title.push({rule: rule.style, property: 'color'});
			} else if(rule.selectorText === '#cpr-bookmark-ui'){
				r.preferences.theme.rules.background.push({rule: rule.style, property: 'background'});
			}
		}

		// Note, this is injected regardless if it exists or not
		if(!r.mobile){
			r.$head.append('<link href=\'//fonts.googleapis.com/css?family=Droid+Serif:400,700,700italic,400italic\' rel=\'stylesheet\' type=\'text/css\'>');
		}
	}

	function _setBugsense() {
		if (typeof Bugsense === 'function') {
			r.Bugsense = new Bugsense({
				apiKey: 'f38df951',
				appName: 'CPR',
				appversion: '@@readerVersion'
			});
			// Setup error handler
			window.onerror = function (message, url, line) {
				r.Notify.error(message, url, line);
				return false;
			};
		}
	}

	function _highlightHandler(e){
		var x = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX,
			y = e.type === 'touchstart' ? e.originalEvent.touches[0].clientY : e.clientY;

		/*jshint validthis:true */
		r.Notify.event($.extend({}, Reader.Event.HIGHLIGHT_TAPPED, {call: 'userClick', cfi: $(this).attr('data-cfi'), clientX: x, clientY: y}));
		e.preventDefault();
		e.stopPropagation();
	}

	// Capture all the links in the reader
	function _clickHandler(e) {
		/*jshint validthis:true */
		// Retrieve the encoded relative version of the url:
		var url = this.getAttribute('href'),
				type = this.getAttribute('data-link-type');
		e.preventDefault();
		e.stopPropagation();
		if (type === 'external') {
			// External link, notify client about it:
			r.Notify.event($.extend({}, Reader.Event.NOTICE_EXT_LINK, {call: 'userClick', href: url}));
		} else if (type === 'internal') {
			url = this.href.split('/').slice(-url.split('/').length).join('/');
			// Internal link, notify client about it:
			r.Notify.event($.extend({}, Reader.Event.NOTICE_INT_LINK, {call: 'userClick', href: url}));
			// Load the given URL:
			r.Notify.event(r.Event.LOADING_STARTED);
			r.Navigation.loadChapter(url)
				.always(function () {
					r.Notify.event(r.Event.LOADING_COMPLETE);
				})
				.done(function () {
					r.Notify.event($.extend({}, Reader.Event.getStatus(), {call: 'clickLoad', href: url}));
				})
				.fail(function (error) {
					if (error && error.code === r.Event.ERR_INVALID_ARGUMENT.code) {
						r.Notify.event($.extend({}, Reader.Event.CONTENT_NOT_AVAILABLE, {call: 'userClick', href: url}));
					} else {
						r.Notify.error(error);
					}
				});
		}
	}

	// Display HTML content
	//
	// * `param` Contains the parameters: content, page and mimetype
	// * `callback` Function to be called after the function's logic
	function displayContent(param) {
		if (!param) { param = {}; }
		// Take the params values
		var content = (param.hasOwnProperty('content')) ? param.content : '';
		var mimetype = (param.hasOwnProperty('mimetype')) ? param.mimetype : 'application/xhtml+xml';

		r.$header.text(r.Book.title); // TODO Do not polute the reader object.

		// Parse the content according its mime-type and apply all filters attached to display content
		var result = r.parse(content, mimetype, param);
		r.Navigation.setChapterHead(result.$head);
		var promise = r.preferences.publisherStyles.value ? r.addPublisherStyles() : $.Deferred().resolve().promise();

		return promise.then(function(){

			content = r.Filters.applyFilters(r.Filters.HOOKS.BEFORE_CHAPTER_DISPLAY, result.$body);
			r.$reader.html(content);

			r.Filters.applyFilters(r.Filters.HOOKS.AFTER_CHAPTER_DISPLAY);

			// Add all bookmarks for this chapter.
			var bookmarks = r.Bookmarks.getBookmarks()[r.Navigation.getChapter()];
			if(bookmarks){
				$.each(bookmarks, function(index, bookmark){
					// Ignore bookmarks not part of the current chapter part:
					if (bookmark && r.Navigation.isCFIInCurrentChapterPart(bookmark)) {
						r.CFI.setBookmarkCFI(bookmark);
					}
				});
			}

			// Add all highlights for this chapter
			var highlights = r.Highlights.getHighlights()[r.Navigation.getChapter()];
			if(highlights){
				$.each(highlights, function(index, highlight){
					// Ignore bookmarks not part of the current chapter part:
					if (highlight && r.Navigation.isCFIInCurrentChapterPart(highlight)) {
						r.CFI.setHighlightCFI(highlight);
					}
				});
			}
		});
	}

	// Check if the browser supports css-columns.
	function areColumnsSupported() {
		var elemStyle = window.document.createElement('ch').style,
			domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
			prop = 'columnCount',
			uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1),
			props   = (prop + ' ' + domPrefixes.join(uc_prop + ' ') + uc_prop).split(' ');

		for ( var i in props ) {
			if ( elemStyle[ props[i] ] !== undefined ) {
				return true;
			}
		}
		return false;
	}

	// Define the container dimensions and create the multi column or adjust the height for the vertical scroll.
	//
	// * `width` In pixels
	// * `height` In pixels
	function _createContainer() {
		r.$cprframe.css({
			display: 'inline-block',
			border: 'none'
		});

		r.$cprElement.css({
			display: 'inline-block',
			border: 'none'
		});


		r.$body.css({
			display: 'inline-block',
			border: 'none'
		});

		r.$reader.addClass(areColumnsSupported() ? 'columns' : 'scroll');

		// Container parent styles.
		r.$container
			.css({
				overflow: 'hidden',
				'-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
				'-webkit-touch-callout': 'none'
			});

		// Capture the anchor links into the content
		r.$container.on('click', 'a', _clickHandler);
		r.$container.on('click touchstart', '.cpr-highlight div', _highlightHandler);
		r.$container.on('touchmove touchend touchcancel', '.cpr-highlight div', function(e){
			// we need to stop all touch events on highlight markers
			e.preventDefault();
			e.stopPropagation();
		});

		// Capture text selection events and notify client of text value.
		var $doc = $(r.$body).contents();
		$doc.bind('selectionchange', function(){
			var selection = $doc[0].getSelection().toString();
			r.Notify.event($.extend({value: selection}, r.Event.TEXT_SELECTION_EVENT));
		});
	}

	function initializeBook(book, param) {
		// Use startCFI if initCFI is not already set:
		var initCFI = param.initCFI || book.startCfi;
		var chapter = r.CFI.getChapterFromCFI(initCFI),
				promise;
		// Validate initCFI (chapter exists):
		if (chapter === -1 || chapter >= book.spine.length) {
			chapter = 0;
			initCFI = null;
		}
		if (initCFI) {
			promise = r.loadChapter(chapter, initCFI);
		} else {
			promise = param.initURL ? r.Navigation.loadChapter(param.initURL) : r.loadChapter(0);
		}
		if (r.preferences.loadProgressData.value === 2) {
			// Load the spine progress data after loading the initial chapter:
			promise.then(function () {
				r.Book.loadProgressData().then(function () {
					r.Navigation.updateProgress();
					r.Notify.event($.extend({}, Reader.Event.getStatus('progressLoad'), {call: 'progressLoad'}));
				});
			});
		}
		return promise;
	}

	// Load a chapter with the index from the spine of this chapter
	r.loadChapter = function(chapterNumber, page) {
		var defer = $.Deferred(),
				chapterUrl = r.Book.spine[chapterNumber].href;

		r.Epub.setUp(chapterNumber, r.Book);
		r.Navigation.setChapter(chapterNumber);
		r.setReaderOpacity(0);

		// success handler for load chapter
		function loadChapterSuccess(data){
			// The url param is required for the chapter divide:
			displayContent({content: data, page: page, url: chapterUrl}).then(function(){

				r.Navigation.setNumberOfPages();

				var cfi = r.CFI.isValidCFI(String(page)) && page;
				if (cfi) {
					r.CFI.goToCFI(cfi).then(defer.resolve);
				} else {
					r.Navigation.loadPage(page).then(defer.resolve);
				}
			}, defer.reject); // Execute the callback inside displayContent when its timer interval finish
		}

		defer.notify({type: 'chapter.loading'});
		r.Book.loadFile(chapterUrl).then(loadChapterSuccess, defer.reject);

		return defer.promise().then(function () {
			// setReaderOpacity returns a promise, but we don't rely on the fade in
			// and the transitionend event does not seem to be fired on the Huddle,
			// so we don't return this promise:
			r.setReaderOpacity(1, r.preferences.transitionDuration.value);
		});
	};

	return r;

}(Reader || {}));
