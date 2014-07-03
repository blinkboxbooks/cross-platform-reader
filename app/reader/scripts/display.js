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

	var _initCFI = null, _initURL = null;

	// **Init function**
	//
	// Assign parameters to the global variables.
	//
	// * `param` Contains the parameters: container (id), chapters, padding, url, mobile, dimensions (width and height) etc.
	r.init = function(param) {
		r.reset(); // Reset the reader values.
		if (!param) { param = {}; }
		_initCFI = null;
		_initURL = null;

		// Take the params {container, chapters, width, height, padding, _mobile} or create them.
		// todo validate container
		r.$parent = $(param.container).empty();
		r.$iframe = $('<iframe name="reader" scrolling="no" seamless="seamless" src="javascript:undefined;"></iframe>').appendTo(r.$parent);
		r.$head = r.$iframe.contents().find('head');
		r.$wrap = r.$iframe.contents().find('body');
		r.$container = $('<div></div>').appendTo(r.$wrap);
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

		// Save the initial bookmarks.
		r.Bookmarks.setBookmarks((param.hasOwnProperty('bookmarks')) ? param.bookmarks : [], true);

		// Initialise the epub module
		r.Epub.init(r.$reader[0]);

		// Set the initial position.
		_initCFI = param.hasOwnProperty('initCFI') ? param.initCFI : _initCFI;
		_initURL = param.hasOwnProperty('initURL') ? param.initURL : _initURL;

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

		// Start the party.
		return loadInfo();
	};

	function _getTransitionEndProperty() {
		var element= document.createElement('div');
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

	var _addStyles= function(){
		var styles = 'html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}#cpr-bookmark-ui{display:none;position:absolute;right:0;top:0;background:#111;width:30px;height:30px;box-shadow:0 0 3px #666}#cpr-bookmark-ui::before{position:absolute;content:"";right:0;top:0;width:0;height:0;border:15px solid #000;border-right-color:transparent;border-top-color:transparent}#cpr-footer{color:#000;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:18px}#cpr-header{color:#fff;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;font-size:18px}.cpr-placeholder{visibility:hidden;width:1px;height:1px}*{box-sizing:border-box}html{font-size:18px}body{background:#fff;color:#000;position:relative;overflow:hidden;word-wrap:break-word;font-family:Arial;font-weight:400;font-style:normal;text-decoration:none;text-align:left;line-height:1.2;padding:0;margin:0;font-size:1rem}body #cpr-reader{-webkit-backface-visibility:hidden;-webkit-perspective:1000;backface-visibility:hidden;perspective:1000}h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin:0 0 .67em;clear:both}h1{font-size:1.5rem}h2{font-size:1.4rem}h3{font-size:1.3rem}h4{font-size:1.2rem}h5{font-size:1.1rem}h6{font-size:1rem}p{margin-bottom:1rem}div:last-child,p:last-child{margin-bottom:0}blockquote{border-left:4px solid #e1e1e1;padding:0 1rem 0 1.4rem}:link{color:#09f;text-decoration:underline}:link[data-link-type=external]:after{content:"";background:url(data:image/png;base64,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WHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE0LTA1LTI4VDA5OjU4OjE5PC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCk8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMTMtMDgtMDhUMTA6MTI6MzU8L3htcDpDcmVhdGVEYXRlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NjAwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjY0MDc8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K/AFthgAAAJhJREFUOBHNklEOgCAIhjG7VXWdOlOdx47lLHRuxBgT50O9BPj3AX8CDHoccvyVAiRYGpkhHm7j2ikX2iEoXzkE85kW3055QlqjsT9TojmNPyB6IMVaIxHU41nxiLfv8EycqHK1VVBDPZMnqiTD++cgurNhqywtqzm4rR9yff5rcXfitediLR9mtnqPLJ7JE1k8s2g1b+rZA2oNIaRRHfQPAAAAAElFTkSuQmCC) 0 0 no-repeat;background-size:cover;width:.6rem;height:.6rem;display:inline-block;vertical-align:top;margin:0 0 0 .2rem}:link *{color:#09f}img,svg,svg *{max-width:100%;max-height:100%}img.cpr-img-large,svg .cpr-img-large,svg.cpr-img-large{display:inline-block;margin:0 auto .5rem}img.cpr-img-large:last-child,svg .cpr-img-large:last-child,svg.cpr-img-large:last-child{margin-bottom:0}img.cpr-img-large .cpr-subchapter-link,svg .cpr-img-large .cpr-subchapter-link,svg.cpr-img-large .cpr-subchapter-link{display:none}img.cpr-img-medium,svg .cpr-img-medium,svg.cpr-img-medium{float:left;margin:0 .5rem .5rem 0}img.cpr-img-small,svg .cpr-img-small,svg.cpr-img-small{display:inline}';

		var $style = $('<style>' + styles + '</style>').appendTo(r.$head);

		// Save a reference for each style
		var rules = $style[0].sheet.cssRules;
		var i, l= rules.length;
		for(i=0; i< l; i++){
			var rule = rules[i];
			if(rule.selectorText === 'html'){
				r.preferences.fontSize.rules.push({rule: rule.style, property: 'fontSize'});
			} else if(rule.selectorText === 'body'){
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
	};

	var _setBugsense = function(){
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
	};

	// Check and load an URL if it is in the spine or the TOC.
	var _checkURL = function (url) {
		var findURL = false;
		// The URL.
		var u = url[0];
		// The anchor.
		var a = url[1];
		// Link is in the actual chapter.
		var chapter = r.Navigation.getChapter();
		if ((r.Book.spine[chapter].href.indexOf(u) !== -1 || u === '') && a !=='') {
			// If the anchor points to another chapter part, reload the chapter,
			// else simply go to the page with the given anchor:
			if (!r.Navigation.isChapterPartAnchor(a)) {
				r.Navigation.loadPage(a);
				return true;
			}
		}
		// Check the table of contents...
		for (var i=0; i<r.Book.toc.length; i++) {
			if (r.Book.toc[i].href.indexOf(u) !== -1 && r.Book.toc[i].active === true) { findURL = true; }
		}

		var _load = function(j,a){
			r.Notify.event(r.Event.LOADING_STARTED);
			r.loadChapter(j,a).always(function clickLoadComplete(){
				r.Notify.event(r.Event.LOADING_COMPLETE);
			}).then(
				function clickLoadSuccess(){
					r.Notify.event($.extend({}, Reader.Event.getStatus(), {call: 'clickLoad'}));
				},
				function clickLoadError(err){
					r.Notify.error(err);
				}
			);
		};

		// Check the spine...
		for (var j=0; j<r.Book.spine.length;j++) {
			// URL is in the Spine and it has a chapter number...
			if (r.Book.spine[j].href.indexOf(u) !== -1) {
				r.Navigation.setChapter(j);
				r.Navigation.setPage(0);

				// since this is a user generated even, we must handle callbacks here
				_load(j,a);
				return true;
			}
		}
		return findURL;
	};

	var _touchTimer, _touchLastTime, _touchData = {
		call: 'userClick',
		clientX: null,
		clientY: null
	};

	// For mobile devices, notify the client of any touch events that happen on the reader (that are not links)
	var _touchStartHandler = function(e){
		if($(e.target).is(':not(a)')){
			_touchTimer = (new Date()).getTime();
			_touchData.clientX = e.touches ? e.touches[0].clientX : null;
			_touchData.clientY = e.touches ? e.touches[0].clientY : null;
		}
	};

	var _touchEndHandler = function(e){
    // Check if it is a double tap
    if (((new Date()).getTime() - _touchLastTime) < 500 && $(e.target).is('img')) {
      if (typeof $(e.target).attr('data-original-src') !== 'undefined'){
        _touchData.src = $(e.target).attr('data-original-src');
        _touchData.call = 'doubleTap';
        r.Notify.event($.extend({}, Reader.Event.IMAGE_SELECTION_EVENT, _touchData));
      }
    } else {
      // if the difference between touchstart and touchend is smalller than 300ms, send the callback, otherwise it's a long touch event
      if((new Date()).getTime() - _touchTimer < 300 && $(e.target).is(':not(a)')){
        _touchData.call = 'userClick';
        r.Notify.event($.extend({}, Reader.Event.UNHANDLED_TOUCH_EVENT, _touchData));
      }
      // Record the end of the touch just in case we are going to have a double tab
      _touchLastTime = (new Date()).getTime();
    }
	};

	// Capture all the links in the reader
	var _clickHandler = function (e) {
		e.preventDefault();
		if (this.getAttribute('data-link-type') === 'external') {
			// External link, notify client about it
			r.Notify.event($.extend({}, Reader.Event.NOTICE_EXT_LINK, {call: 'userClick', href:this.getAttribute('href')}));
		} else if (this.getAttribute('data-link-type') === 'internal') {
			// Internal link, notify client about it
			r.Notify.event($.extend({}, Reader.Event.NOTICE_INT_LINK, {call: 'userClick', href:this.getAttribute('href')}));
			// Internal link
			// Reduce the URL to the name file (remove anchors ids)
			var url = this.getAttribute('href').split('#');
			// Check if the link exists in the spine and ask the user
			if (!_checkURL(url)) {
				r.Notify.event($.extend({}, Reader.Event.CONTENT_NOT_AVAILABLE, {call: 'userClick'}));
			}
		}
		// Stop event propagation
		if (e.stopPropagation) { e.stopPropagation(); }
	};

	// Display HTML content
	//
	// * `param` Contains the parameters: content, page and mimetype
	// * `callback` Function to be called after the function's logic
	var displayContent = function(param) {
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
						r.Navigation.setCFI(bookmark, true);
					}
				});
			}
		});
	};

	// Define the container dimensions and create the multi column or adjust the height for the vertical scroll.
	//
	// * `width` In pixels
	// * `height` In pixels
	var _createContainer = function() {
		var doc = r.$iframe.contents()[0];
		r.$iframe.css({
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

		// Set touch handler for mobile clients, to send back the coordinates of the click
		if(r.mobile){
      doc.removeEventListener('touchstart', _touchStartHandler);
      doc.addEventListener('touchstart', _touchStartHandler);
      doc.removeEventListener('touchend', _touchEndHandler);
      doc.addEventListener('touchend', _touchEndHandler);
		}
	};

	// Load the JSON file with all the information related to this book
	//
	// * `resource`
	var loadInfo = function() {
		var defer = $.Deferred();
		loadFile(r.INF, 'json').then(function bookInfoLoaded(data){
			// Check for startCFI, save it if and only if initCFI is null
			_initCFI = data.startCfi && !_initCFI ? data.startCfi : _initCFI;

			// Validate initCFI (chapter exists)
			var chapter = r.CFI.getChapterFromCFI(_initCFI);
			if(chapter === -1 || chapter >= data.spine.length){
				chapter = 0;
				_initCFI = null;
			}

			// todo calculate path prefix in book?
			var path_prefix = '';

			// If the OPF is in a folder...
			if (data.opfPath.indexOf('/') !== -1) {
				var pathComponents = data.opfPath.split('/');
				for (var i = 0; i < (pathComponents.length-1); i++){
					if (i !== 0) {
						path_prefix += '/';
					}
					path_prefix  += pathComponents[i];
				}
			}
			// If the PATH is empty set its value with the path of the first element in the spine.
			if (path_prefix === '') {
				// Check the path has more then one component.
				if (data.spine[0].href.indexOf('/') !== -1) {
					path_prefix = data.spine[0].href.split('/')[0];
				}
			}
			// Set OPF
			if (data.opfPath !== '') {
				loadFile(data.opfPath).then(function opfFileLoaded(opf){
					// save book metadata
					r.Book.load({
						title: data.title,
						spine: data.spine,
						toc: data.toc,
						content_path_prefix: path_prefix,
						opf: opf
					});

					var promise; // promise object to return
					if(_initCFI === null){
						// if initURL is null, load the first chapter, otherwise load the specified chapter
						promise = !!_initURL ? r.Navigation.loadChapter(_initURL) : r.loadChapter(0);
					} else {
						// load the chapter specified by the CFI, otherwise load chapter 0
						promise = r.loadChapter(chapter);
					}
					promise.then(defer.resolve, defer.reject);
				}, defer.reject);
			}
			r.Navigation.setNumberOfChapters(data.spine.length); // Set number of chapters
		}, defer.reject);
		// notify client that info promise has been processed
		defer.notify();
		return defer.promise();
	};

	// Get a file from the server and display its content
	//
	// * `resource`
	// * `callback`
	var loadFile = function(resource, type) {
		var defer = $.Deferred();
		$.ajax({
			url: r.DOCROOT+'/'+resource,
			dataType: (type) ? type : 'text'
		}).then(defer.resolve, function(err){
				defer.reject($.extend({}, r.Event.ERR_MISSING_FILE, {details: err}));
			});
		return defer.promise();
	};

	// Load a chapter with the index from the spine of this chapter
	r.loadChapter = function(chapterNumber, page) {
		var defer = $.Deferred(),
				chapterUrl;

		// Check if the PATH is in the href value from the spine...
		if ((r.Book.spine[chapterNumber].href.indexOf(r.Book.content_path_prefix) !== -1)) {
			chapterUrl = r.Book.spine[chapterNumber].href;
		} else {
			// If it is not, add it and load the chapter
			chapterUrl = r.Book.content_path_prefix+'/'+r.Book.spine[chapterNumber].href;
		}

		r.Epub.setUp(chapterNumber, r.Book.$opf);
		r.Navigation.setChapter(chapterNumber);
		r.setReaderOpacity(0);

		// success handler for load chapter
		function loadChapterSuccess(data){
			displayContent({content: data, page: page, url: chapterUrl}).then(function(){

				r.Navigation.setNumberOfPages();

				var cfi = r.CFI.isValidCFI(String(page)) && page;
				if (cfi || _initCFI) {
					r.CFI.goToCFI(cfi || _initCFI).then(defer.resolve);
					_initCFI = null;
				} else {
					r.Navigation.loadPage(page).then(defer.resolve);
				}
			}, defer.reject); // Execute the callback inside displayContent when its timer interval finish
		}

		loadFile(chapterUrl).then(loadChapterSuccess, defer.reject);

		return defer.promise().then(function () {
			// setReaderOpacity returns a promise, but we don't rely on the fade in
			// and the transitionend event does not seem to be fired on the Huddle,
			// so we don't return this promise:
			r.setReaderOpacity(1, r.preferences.transitionDuration.value);
		});
	};

	// Check if the browser supports css-columns.
	var areColumnsSupported = function () {
		var elemStyle = document.createElement('ch').style,
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
	};

	return r;

}(Reader || {}));
