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
		r.$reader = param.hasOwnProperty('container') && $(param.container).length ? $(param.container) : $('<div id="reader_container"></div>').appendTo(document.body);
		r.$container = r.$reader.empty().wrap($('<div></div>')).parent().wrap($('<div id="' + (r.$reader[0].id + '_wrap') + '"></div>').css('display', 'inline-block'));

		r.$header = $('<div id="cpr-header"></div>').insertBefore(r.$container);
		r.$footer = $('<div id="cpr-footer"></div>').insertAfter(r.$container);

    $('<span id="cpr-bookmark-ui"></span>').insertAfter(r.$container); // Add bookmark mark

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
		var $head = $('head');

		var styles = '#wrap_id #id *{animation:none;animation-delay:0;animation-direction:normal;animation-duration:0;animation-fill-mode:none;animation-iteration-count:1;animation-name:none;animation-play-state:running;animation-timing-function:ease;backface-visibility:visible;background:0;background-attachment:scroll;background-clip:border-box;background-color:transparent;background-image:none;background-origin:padding-box;background-position:0 0;background-position-x:0;background-position-y:0;background-repeat:repeat;background-size:auto auto;border:0;border-style:none;border-width:medium;border-color:inherit;border-bottom:0;border-bottom-color:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;border-bottom-style:none;border-bottom-width:medium;border-collapse:separate;border-image:none;border-left:0;border-left-color:inherit;border-left-style:none;border-left-width:medium;border-radius:0;border-right:0;border-right-color:inherit;border-right-style:none;border-right-width:medium;border-spacing:0;border-top:0;border-top-color:inherit;border-top-left-radius:0;border-top-right-radius:0;border-top-style:none;border-top-width:medium;bottom:auto;box-shadow:none;box-sizing:content-box;caption-side:top;clear:none;clip:auto;columns:auto;column-count:auto;column-fill:balance;column-gap:normal;column-rule:medium none currentColor;column-rule-color:currentColor;column-rule-style:none;column-rule-width:none;column-span:1;column-width:auto;content:normal;counter-increment:none;counter-reset:none;cursor:auto;direction:ltr;display:inline;empty-cells:show;float:none;font:400;font-variant:normal;height:auto;hyphens:none;left:auto;letter-spacing:normal;list-style:none;list-style-image:none;list-style-position:outside;list-style-type:disc;max-height:none;max-width:none;min-height:0;min-width:0;opacity:1;orphans:0;outline:0;outline-color:invert;outline-style:none;outline-width:medium;overflow:visible;overflow-x:visible;overflow-y:visible;page-break-after:auto;page-break-before:auto;page-break-inside:auto;perspective:none;perspective-origin:50% 50%;position:static;right:auto;tab-size:8;table-layout:auto;text-align-last:auto;text-decoration-color:inherit;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-shadow:none;text-transform:none;top:auto;transform:none;transform-style:flat;transition:none;transition-delay:0s;transition-duration:0s;transition-property:none;transition-timing-function:ease;unicode-bidi:normal;vertical-align:baseline;visibility:visible;white-space:normal;widows:0;width:auto;word-spacing:normal;z-index:auto}#wrap_id #id address,#wrap_id #id blockquote,#wrap_id #id body,#wrap_id #id center,#wrap_id #id dd,#wrap_id #id dir,#wrap_id #id div,#wrap_id #id dl,#wrap_id #id dt,#wrap_id #id fieldset,#wrap_id #id form,#wrap_id #id frame,#wrap_id #id frameset,#wrap_id #id h1,#wrap_id #id h2,#wrap_id #id h3,#wrap_id #id h4,#wrap_id #id h5,#wrap_id #id h6,#wrap_id #id hr,#wrap_id #id html,#wrap_id #id menu,#wrap_id #id noframes,#wrap_id #id ol,#wrap_id #id p,#wrap_id #id pre,#wrap_id #id ul{display:block;unicode-bidi:embed}#wrap_id #id li{display:list-item}#wrap_id #id head{display:none}#wrap_id #id table{display:table}#wrap_id #id tr{display:table-row}#wrap_id #id thead{display:table-header-group}#wrap_id #id tbody{display:table-row-group}#wrap_id #id tfoot{display:table-footer-group}#wrap_id #id col{display:table-column}#wrap_id #id colgroup{display:table-column-group}#wrap_id #id td,#wrap_id #id th{display:table-cell}#wrap_id #id caption{display:table-caption}#wrap_id #id th{font-weight:bolder;text-align:center}#wrap_id #id caption{text-align:center}#wrap_id #id blockquote,#wrap_id #id dir,#wrap_id #id dl,#wrap_id #id fieldset,#wrap_id #id form,#wrap_id #id h4,#wrap_id #id menu,#wrap_id #id ol,#wrap_id #id p,#wrap_id #id ul{margin:1.12em 0}#wrap_id #id blockquote{margin-left:40px;margin-right:40px}#wrap_id #id address,#wrap_id #id cite,#wrap_id #id em,#wrap_id #id i,#wrap_id #id var{font-style:italic}#wrap_id #id code,#wrap_id #id kbd,#wrap_id #id pre,#wrap_id #id samp,#wrap_id #id tt{font-family:monospace}#wrap_id #id button,#wrap_id #id input,#wrap_id #id select,#wrap_id #id textarea{display:inline-block}#wrap_id #id big{font-size:1.17em}#wrap_id #id tbody,#wrap_id #id tfoot,#wrap_id #id thead{vertical-align:middle}#wrap_id #id td,#wrap_id #id th,#wrap_id #id tr{vertical-align:inherit}#wrap_id #id del,#wrap_id #id s,#wrap_id #id strike{text-decoration:line-through}#wrap_id #id hr{border:1px inset}#wrap_id #id dd,#wrap_id #id dir,#wrap_id #id menu,#wrap_id #id ol,#wrap_id #id ul{margin-left:40px}#wrap_id #id ol{list-style-type:decimal}#wrap_id #id ol ol,#wrap_id #id ol ul,#wrap_id #id ul ol,#wrap_id #id ul ul{margin-top:0;margin-bottom:0}#wrap_id #id ins,#wrap_id #id u{text-decoration:underline}#wrap_id #id br:before{content:"";white-space:pre-line}#wrap_id #id center{text-align:center}#wrap_id #id :link,#wrap_id #id :visited{text-decoration:underline}#wrap_id #id :focus{outline:thin dotted invert}#wrap_id #id BDO[DIR=ltr]{direction:ltr;unicode-bidi:bidi-override}#wrap_id #id BDO[DIR=rtl]{direction:rtl;unicode-bidi:bidi-override}#wrap_id #id [DIR=ltr]{direction:ltr;unicode-bidi:embed}#wrap_id #id [DIR=rtl]{direction:rtl;unicode-bidi:embed}@media print{#wrap_id #id h1{page-break-before:always}#wrap_id #id h1,#wrap_id #id h2,#wrap_id #id h3,#wrap_id #id h4,#wrap_id #id h5,#wrap_id #id h6{page-break-after:avoid}#wrap_id #id dl,#wrap_id #id ol,#wrap_id #id ul{page-break-before:avoid}}#wrap_id #id article,#wrap_id #id aside,#wrap_id #id details,#wrap_id #id figcaption,#wrap_id #id figure,#wrap_id #id footer,#wrap_id #id header,#wrap_id #id hgroup,#wrap_id #id main,#wrap_id #id nav,#wrap_id #id section,#wrap_id #id summary{display:block}#wrap_id #id audio,#wrap_id #id canvas,#wrap_id #id video{display:inline-block}#wrap_id #id audio:not([controls]){display:none;height:0}#wrap_id #id [hidden],#wrap_id #id template{display:none}#wrap_id #id html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}#wrap_id #id body{margin:0}#wrap_id #id a{background:0 0}#wrap_id #id a:focus{outline:thin dotted}#wrap_id #id a:active,#wrap_id #id a:hover{outline:0}#wrap_id #id abbr[title]{border-bottom:1px dotted}#wrap_id #id b,#wrap_id #id strong{font-weight:700}#wrap_id #id dfn{font-style:italic}#wrap_id #id hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0}#wrap_id #id mark{background:#ff0;color:#000}#wrap_id #id code,#wrap_id #id kbd,#wrap_id #id pre,#wrap_id #id samp{font-family:monospace,serif;font-size:1em}#wrap_id #id pre{white-space:pre-wrap}#wrap_id #id small{font-size:80%}#wrap_id #id sub,#wrap_id #id sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}#wrap_id #id sup{top:-.5em}#wrap_id #id sub{bottom:-.25em}#wrap_id #id img{border:0}#wrap_id #id svg:not(:root){overflow:hidden}#wrap_id #id figure{margin:0}#wrap_id #id fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}#wrap_id #id legend{border:0;padding:0}#wrap_id #id button,#wrap_id #id input,#wrap_id #id select,#wrap_id #id textarea{font-family:inherit;font-size:100%;margin:0}#wrap_id #id button,#wrap_id #id input{line-height:normal}#wrap_id #id button,#wrap_id #id select{text-transform:none}#wrap_id #id button,#wrap_id #id html input[type=button],#wrap_id #id input[type=reset],#wrap_id #id input[type=submit]{-webkit-appearance:button;cursor:pointer}#wrap_id #id button[disabled],#wrap_id #id html input[disabled]{cursor:default}#wrap_id #id input[type=checkbox],#wrap_id #id input[type=radio]{box-sizing:border-box;padding:0}#wrap_id #id input[type=search]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}#wrap_id #id input[type=search]::-webkit-search-cancel-button,#wrap_id #id input[type=search]::-webkit-search-decoration{-webkit-appearance:none}#wrap_id #id button::-moz-focus-inner,#wrap_id #id input::-moz-focus-inner{border:0;padding:0}#wrap_id #id textarea{overflow:auto;vertical-align:top}#wrap_id #id table{border-collapse:collapse;border-spacing:0}#cpr-bookmark-ui{display:none;position:absolute;right:0;top:0;background:#111;width:30px;height:30px;box-shadow:0 0 3px #666}#cpr-bookmark-ui::before{position:absolute;content:"";right:0;top:0;width:0;height:0;border:15px solid #000;border-right-color:transparent;border-top-color:transparent}#cpr-footer{color:#000;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#cpr-header{color:#fff;line-height:30px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%}#wrap_id{background:#fff;position:relative;overflow:hidden}#wrap_id #id *,#wrap_id #id a,#wrap_id #id div,#wrap_id #id em,#wrap_id #id h1,#wrap_id #id h2,#wrap_id #id h3,#wrap_id #id h4,#wrap_id #id h5,#wrap_id #id h6,#wrap_id #id p,#wrap_id #id span,#wrap_id #id strong{padding:0;margin:0;font-weight:400;font-style:normal;text-decoration:none;text-align:left;color:#000;line-height:1.2;font-size:18px;font-family:Arial}#wrap_id #id h1,#wrap_id #id h2,#wrap_id #id h3,#wrap_id #id h4,#wrap_id #id h5,#wrap_id #id h6{font-weight:700;font-size:24px}#wrap_id #id p{margin-bottom:1em}#wrap_id #id :last-child{margin-bottom:0}#wrap_id #id :link{color:#09f;text-decoration:none;border-bottom:1px solid #09f}#wrap_id #id :link[data-link-type=external]:after{content:" ";font-size:.83em;vertical-align:super}#wrap_id #id :link *{color:#09f}#wrap_id #id img,#wrap_id #id svg,#wrap_id #id svg *{max-width:100%;max-height:100%}#wrap_id #id img.cpr-center,#wrap_id #id svg .cpr-center,#wrap_id #id svg.cpr-center{display:block;margin-right:auto;margin-left:auto}';

		r.$stylesheet = $('<style id="cpr-stylesheet">' +
			styles.replace(/#wrap_id/g, '#' + r.$reader.attr('id') + '_wrap').replace(/#id/g, '#' + r.$reader.attr('id')) +
			'</style>').appendTo($head);

		// Save a reference for each style
		var rules = r.$stylesheet[0].sheet.cssRules;
		var i= 0, l= rules.length, wrap_id = '#' + r.$reader.attr('id') + '_wrap', id = wrap_id + ' #' + r.$reader.attr('id');
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
			$head.append('<link href=\'//fonts.googleapis.com/css?family=Droid+Serif:400,700,700italic,400italic\' rel=\'stylesheet\' type=\'text/css\'>');
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

	// helper function that strips the last path from the url
	// Ex: a/b/c.html -> a/b
	var _removeLastPath = function(url){
		var pathSeparatorIndex = url.lastIndexOf('/');
		return pathSeparatorIndex !== -1 ? url.substring(0, pathSeparatorIndex) : url;
	};

	// Function to transform relative links
	// ex: `../html/chapter.html` -> `chapter.html`
	var _normalizeLink = function(url){
		// get current chapter folder url
		var chapter = r.Navigation.getChapter(), chapterURL = _removeLastPath(r.SPINE[chapter].href), result = chapterURL;

		// parse current url to remove `..` from path
		var paths = url.split('/');
		for(var i = 0, l = paths.length; i < l; i++){
			var path = paths[i];
			if(path === '..'){
				result = _removeLastPath(result);
			} else {
				result += '/' + path;
			}
		}
		return result;
	};

	// Check and load an URL if it is in the spine or the TOC.
	var _checkURL = function (url) {
		var findURL = false;
		// The URL.
		var u = _normalizeLink(url[0]);
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
		// Parse the content according its mime-type
		content = r.parse(content, mimetype);
		r.$reader.html(content);

		// Wait for the images and build the container
		var $images = $('#' + r.$reader[0].id + ' img');
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

				_resizeImages();

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
		r.$reader.addClass(areColumnsSupported() ? 'columns' : 'scroll');

		r.$reader.css({
			position: 'absolute',
			left: 0,
			top: 0
		});

		// Container parent styles.
		r.$container
			.css({
				overflow: 'hidden',
				position: 'relative',
				top: 0,
				left: 0
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

	r.resizeContainer = function(dimensions){

		dimensions = $.extend({
			width: r.Layout.Container.width,
			height: r.Layout.Container.height,
			columns: r.Layout.Reader.columns,
			padding: r.Layout.Reader.padding
		}, dimensions);

		// Save new values.
		r.Layout.Container.width = Math.floor(dimensions.width);
		r.Layout.Container.height = Math.floor(dimensions.height);
		r.Layout.Reader.width = r.Layout.Container.width - Math.floor(r.preferences.margin.value[1]*r.Layout.Container.width/100) - Math.floor(r.preferences.margin.value[3]*r.Layout.Container.width/100);
		r.Layout.Reader.height = r.Layout.Container.height - Math.floor(r.preferences.margin.value[0]*r.Layout.Container.height/100) - Math.floor(r.preferences.margin.value[2]*r.Layout.Container.height/100);
		r.Layout.Reader.columns = dimensions.columns;
		r.Layout.Reader.padding = dimensions.columns > 1 ? dimensions.padding : r.Layout.Reader.padding; // only set padding on multi-column layout

		// avoid rounding errors, adjust the width of the reader to contain the columns + padding
		var columnWidth = Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2);
		r.Layout.Reader.width = columnWidth * r.Layout.Reader.columns + (r.Layout.Reader.columns - 1) * r.Layout.Reader.padding;

		// Apply new size
		r.$reader.css({
			width: r.Layout.Reader.width + 'px',
			height: r.Layout.Reader.height + 'px',
			'column-width': columnWidth + 'px',
			'column-gap': r.Layout.Reader.padding + 'px',
			'column-fill': 'auto'
		});
		r.setReaderLeftPosition(-1 * Math.floor(r.Layout.Reader.width + r.Layout.Reader.padding) * r.Navigation.getPage());

		r.$container.css({
			width: r.Layout.Reader.width + 'px',
			height: r.Layout.Reader.height + 'px',
			'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
			'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px'
		});

		r.$header.css({
			width: r.Layout.Reader.width + 'px',
			'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
			'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px',
			'height': Math.floor(r.preferences.margin.value[0] * r.Layout.Container.height/100) + 'px',
			'line-height': Math.floor(r.preferences.margin.value[0] * r.Layout.Container.height/100) + 'px'
		});

		r.$footer.css({
			width: r.Layout.Reader.width + 'px',
			'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
			'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px',
			'height': Math.floor(r.preferences.margin.value[2] * r.Layout.Container.height/100) + 'px',
			'line-height': Math.floor(r.preferences.margin.value[2] * r.Layout.Container.height/100) + 'px'
		});

		_resizeImages();
		// Update navigation variables
		r.refreshLayout();
	};

	// Modifies some parameter related to the dimensions of the images and svg elements.
	// TODO Resize images based on column width, not just reader width
	var _resizeImages = function(){
		// Get SVG elements
		$('svg', r.$reader).each(function(index,node){
			// Calculate 95% of the width and height of the container.
			var width = Math.floor(0.95 * (r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2));
			var height = Math.floor(0.95 * r.Layout.Reader.height);
			// Modify SVG params when the dimensions are higher than the view space or they are set in % as this unit is not working in IE.
			if ((node.getAttribute('width') && (node.getAttribute('width') > r.Layout.Reader.width || node.getAttribute('width').indexOf('%') !== -1)) || !node.getAttribute('width')) {
				node.setAttribute('width', width);
			}
			if ((node.getAttribute('height') && (node.getAttribute('height') > r.Layout.Reader.height || node.getAttribute('height').indexOf('%') !== -1)) || !node.getAttribute('height')) {
				node.setAttribute('height', height);
			}
			// Modify the viewBox attribute if their dimensions are higher than the container.
			node.viewBox.baseVal.width = (node.viewBox.baseVal.width > r.Layout.Reader.width) ? width : node.viewBox.baseVal.width;
			node.viewBox.baseVal.height = (node.viewBox.baseVal.height > r.Layout.Reader.height) ? height : node.viewBox.baseVal.height;
			node.setAttribute('transform', 'scale(1)');
			// Modify children elements (images, rectangles, circles..) dimensions if they are higher than the container.
			$(this).children().map(function(){
				if ($(this).attr('width') > r.Layout.Reader.width) {
					$(this).attr('width', width);
				}
				if ($(this).attr('height') > r.Layout.Reader.height) {
					$(this).attr('height', height);
				}
			});
			if ($(this).find('path')) {
				// Fix path elements dimensions.
				var pathMaxWidth = 0;
				var pathMaxHeight = 0;
				// Take the highest width and height.
				$(this).find('path').each(function(){
					var pathWidth = $(this)[0].getBoundingClientRect().width;
					var pathHeight = $(this)[0].getBoundingClientRect().height;
					pathMaxWidth = (pathWidth > pathMaxWidth) ? pathWidth : pathMaxWidth;
					pathMaxHeight = (pathHeight > pathMaxHeight) ? pathHeight : pathMaxHeight;
				});
				if (pathMaxWidth > width || pathMaxHeight > height) {
					// Scale the elements to the correct proportion.
					var scale = Math.min(Math.floor((width/pathMaxWidth)*10)/10,Math.floor((height/pathMaxHeight)*10)/10);
					$(this).find('path').each(function(){
						$(this)[0].setAttribute('transform', 'scale(' + scale + ')');
					});
				}
			}
			// Remove SVG empty elements in some Webkit browsers is showing the content outside the SVG (Chrome).
			if ($(this).children().length === 0) {
				$(this).remove();
			}
		});
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
