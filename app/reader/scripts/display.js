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
		r.$iframe = $('<iframe scrolling="no" seamless="seamless" src="javascript:undefined;"></iframe>').appendTo(r.$parent);
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

		// Set the initial position.
		_initCFI = param.hasOwnProperty('initCFI') ? param.initCFI : _initCFI;
		_initURL = param.hasOwnProperty('initURL') ? param.initURL : _initURL;

		// Resize the container with the width and height (if they exist).
		_createContainer(param.width, param.height, param.columns, param.padding);

		// Apply all user preferences
		r.setPreferences(param.preferences);

		r.resizeContainer(param);

		// Enable bugsense reporting
		_setBugsense();

		// Start the party.
		return loadInfo();
	};

	var _addStyles= function(){
		var styles = 'html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}#cpr-bookmark-ui{display:none;position:absolute;right:0;top:0;background:#111;width:30px;height:30px;box-shadow:0 0 3px #666}#cpr-bookmark-ui::before{position:absolute;content:"";right:0;top:0;width:0;height:0;border:15px solid #000;border-right-color:transparent;border-top-color:transparent}#cpr-footer{color:#000;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cpr-header{color:#fff;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}body{background:#fff;position:relative;overflow:hidden;margin:0;padding:0}body #cpr-reader{-webkit-backface-visibility:hidden;-webkit-perspective:1000;backface-visibility:hidden;perspective:1000;display:inline-block}body #cpr-reader *,body #cpr-reader a,body #cpr-reader div,body #cpr-reader em,body #cpr-reader h1,body #cpr-reader h2,body #cpr-reader h3,body #cpr-reader h4,body #cpr-reader h5,body #cpr-reader h6,body #cpr-reader p,body #cpr-reader span,body #cpr-reader strong{padding:0;margin:0;font-weight:400;font-style:normal;text-decoration:none;text-align:left;color:#000;line-height:1.2;font-size:18px;font-family:Arial}body #cpr-reader h1,body #cpr-reader h2,body #cpr-reader h3,body #cpr-reader h4,body #cpr-reader h5,body #cpr-reader h6{font-weight:700;font-size:24px}body #cpr-reader p{margin-bottom:1em}body #cpr-reader :last-child{margin-bottom:0}body #cpr-reader :link{color:#09f;text-decoration:none;border-bottom:1px solid #09f}body #cpr-reader :link[data-link-type=external]:after{content:" ";font-size:.83em;vertical-align:super}body #cpr-reader :link *{color:#09f}body #cpr-reader img,body #cpr-reader svg,body #cpr-reader svg *{max-width:100%;max-height:100%}body #cpr-reader img.cpr-center,body #cpr-reader svg .cpr-center,body #cpr-reader svg.cpr-center{display:block;margin-right:auto;margin-left:auto}';

		r.$stylesheet = $('<style>' + styles + '</style>').appendTo(r.$head);

		// Save a reference for each style
		var rules = r.$stylesheet[0].sheet.cssRules;
		var i, l= rules.length, wrap_id = 'body', id = ' #' + r.$reader.attr('id');
    var _checkSelectors = function(v) { if (rule.selectorText) { return rule.selectorText.indexOf(v) >= 0; }};
		for(i=0; i< l; i++){
			var rule = rules[i];
      var selectors = [id +' *', id+' span', id+' p', id+' em', id+' div', id+' strong', id+' a', id+' h1', id+' h2', id+' h3', id+' h4', id+' h5', id+' h6'];
      if(selectors.every(_checkSelectors)){
				r.preferences.lineHeight.rules.push({rule: rule.style, property: 'lineHeight'});
				r.preferences.fontSize.rules.push({rule: rule.style, property: 'fontSize'});
				r.preferences.fontFamily.rules.push({rule: rule.style, property: 'fontFamily'});
				r.preferences.textAlign.rules.push({rule: rule.style, property: 'textAlign'});
				r.preferences.theme.rules.color.push({rule: rule.style, property: 'color'});
			} else if(rule.selectorText === wrap_id){
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
		if ((r.SPINE[chapter].href.indexOf(u) !== -1 || u === '') && a !=='') {
			r.Navigation.loadPage(r.moveToAnchor(a));
			return true;
		}
		// Check the table of contents...
		for (var i=0; i<r.TOC.length; i++) {
			if (r.TOC[i].href.indexOf(u) !== -1 && r.TOC[i].active === true) { findURL = true; }
		}

		var _load = function(j,a){
			r.Notify.event(r.Event.LOADING_STARTED);
			r.loadAnchor.apply(r, [j,a]).always(function clickLoadComplete(){
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
		for (var j=0; j<r.SPINE.length;j++) {
			// URL is in the Spine and it has a chapter number...
			if (r.SPINE[j].href.indexOf(u) !== -1) {
				r.Navigation.setChapter(j);
				r.Navigation.setPage(0);

				// since this is a user generated even, we must handle callbacks here
				_load(j,a);
				return true;
			}
		}
		return findURL;
	};

	var _touchTimer, _touchData = {
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
		// if the difference between touchstart and touchend is smalller than 300ms, send the callback, otherwise it's a long touch event
		if((new Date()).getTime() - _touchTimer < 300 && $(e.target).is(':not(a)')){
			r.Notify.event($.extend({}, Reader.Event.UNHANDLED_TOUCH_EVENT, _touchData));
		}
	};

	// Capture all the links in the reader
	var _clickHandler = function (e) {
		e.preventDefault();
		if (this.getAttribute('data-link-type') === 'external') {
			// External link, notify client about it
			r.Notify.event($.extend({}, Reader.Event.NOTICE_EXT_LINK, {call: 'userClick', href:this.getAttribute('href')}));
		} else if (this.getAttribute('data-link-type') === 'internal') {
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
		var defer = $.Deferred();

		if (!param) { param = []; }
		// Take the params values
		var content = (param.hasOwnProperty('content')) ? param.content : '';
		var mimetype = (param.hasOwnProperty('mimetype')) ? param.mimetype : 'application/xhtml+xml';

		r.$header.text(r.bookTitle); // TODO Do not polute the reader object.

		// Parse the content according its mime-type and apply all filters attached to display content
		content = r.Filters.applyFilters(r.Filters.HOOKS.BEFORE_CHAPTER_DISPLAY, r.parse(content, mimetype));

		r.$reader.html(content);

		// Wait for the images and build the container
		var $images = $('img', r.$reader);
		var counter = 0, i = 0;
		var timer = setInterval(function () {

			if (counter >= $images.length) {
				clearInterval(timer);

				for (i = 0; i < $images.length; i++) {
					var $image = $($images[i]);
					// All images greater than 75% of the reader width will receive cpr-center class to center them
					if($image.width() > 3/4*(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2)){
						$image.addClass('cpr-center');
					}
				}

				defer.resolve();
				return;
			}

			var tempCounter = 0;
			for (i = 0; i < $images.length; i++) {
				if ($images[i].complete === true) {
					tempCounter++;
				}
			}
			counter = tempCounter;
		}, 100);

		// Add all bookmarks for this chapter.
		var bookmarks = r.Bookmarks.getBookmarks()[r.Navigation.getChapter()];
		if(typeof(bookmarks) !== 'undefined'){
			$.each(bookmarks, function(index, bookmark){
				r.Navigation.setCFI(bookmark);
			});
		}

		return defer.promise();
	};

	// Define the container dimensions and create the multi column or adjust the height for the vertical scroll.
	//
	// * `width` In pixels
	// * `height` In pixels
	var _createContainer = function() {
		r.$iframe.css({
			display: 'inline-block',
			border: 'none'
		});

		r.$reader.addClass(areColumnsSupported() ? 'columns' : 'scroll');

		// Container parent styles.
		r.$container
			.css({
				overflow: 'hidden',
				display: 'inline-block'
			});

		// Capture the anchor links into the content
		r.$container.on('click', 'a', _clickHandler);

		// Set touch handler for mobile clients, to send back the coordinates of the click
		if(r.mobile){
			document.removeEventListener('touchstart', _touchStartHandler);
			document.addEventListener('touchstart', _touchStartHandler);
			document.removeEventListener('touchend', _touchEndHandler);
			document.addEventListener('touchend', _touchEndHandler);
		}
	};

	// Load the JSON file with all the information related to this book
	//
	// * `resource`
	var loadInfo = function() {
		var defer = $.Deferred();
		loadFile(r.INF, 'json').then(function bookInfoLoaded(data){
			r.SPINE = data.spine;
			r.TOC = data.toc;
			r.sample = data.sample;
			r.bookTitle = data.title;

			// Check for startCFI, save it if and only if initCFI is null
			_initCFI = data.startCfi && !_initCFI ? data.startCfi : _initCFI;

			// Validate initCFI (chapter exists)
			var chapter = r.CFI.getChapterFromCFI(_initCFI);
			if(chapter === -1 || chapter >= r.SPINE.length){
				chapter = 0;
				_initCFI = null;
			}

			// If the OPF is in a folder...
			if (data.opfPath.indexOf('/') !== -1) {
				var pathComponents = data.opfPath.split('/');
				r.CONTENT_PATH_PREFIX = '';
				for (var i = 0; i < (pathComponents.length-1); i++){
					if (i !== 0) {
						r.CONTENT_PATH_PREFIX += '/';
					}
					r.CONTENT_PATH_PREFIX  += pathComponents[i];
				}
			}
			// If the PATH is empty set its value with the path of the first element in the spine.
			if (r.CONTENT_PATH_PREFIX === '') {
				// Check the path has more then one component.
				if (r.SPINE[0].href.indexOf('/') !== -1) {
					r.CONTENT_PATH_PREFIX = r.SPINE[0].href.split('/')[0];
				}
			}
			// Set OPF
			r.OPF = data.opfPath;
			if (r.OPF !== '') {
				loadFile(r.OPF).then(function opfFileLoaded(opf){
					r.opf = opf;

					var promise; // promise object to return
					if(_initCFI === null){
						// if initURL is null, load the first chapter, otherwise load the specified chapter
						promise = !!_initURL ? r.Navigation.loadChapter(_initURL) : r.loadChapter(0);
					} else {
						// load the chapter specified by the CFI, otherwise load chapter 0
						promise = r.loadChapter(chapter);
					}
					promise.then(r.Navigation.update).then(defer.resolve, defer.reject);
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

	// Load a chapter and go to the page pointed by the anchor value.
	r.loadAnchor = function(c,a){
		return r.loadChapter(c).then(function onLoadAnchorSuccess(){
			if (a) {
				var p = r.moveToAnchor(a);
				r.Navigation.loadPage(p);
				r.Navigation.update();
			} else {
				r.Navigation.loadPage(0);
				r.Navigation.update();
			}
		});
	};

	// Load a chapter with the index from the spine of this chapter
	r.loadChapter = function(chapterNumber) {
		var defer = $.Deferred();

		r.CFI.setUp(chapterNumber);
		r.Navigation.setChapter(chapterNumber);
		r.$reader.css('opacity', 0);

		// success handler for load chapter
		var loadChapterSuccess = function(data){
			displayContent({content: data}).then(function(){

				r.Navigation.setNumberOfPages();
				r.$reader.css('opacity', 1);

				// Go to init cfi, if it was set.
				if(_initCFI){
					r.CFI.goToCFI(_initCFI);
					_initCFI = null;
				}

				defer.resolve();
			}, defer.reject); // Execute the callback inside displayContent when its timer interval finish
		};

		// Check if the PATH is in the href value from the spine...
		if ((r.SPINE[chapterNumber].href.indexOf(r.CONTENT_PATH_PREFIX) !== -1)) {
			loadFile(r.SPINE[chapterNumber].href).then(loadChapterSuccess, defer.reject);
		} else {
			// If it is not, add it and load the chapter
			loadFile(r.CONTENT_PATH_PREFIX+'/'+r.SPINE[chapterNumber].href).then(loadChapterSuccess, defer.reject);
		}

		return defer.promise();
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
