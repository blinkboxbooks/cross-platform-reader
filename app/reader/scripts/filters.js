'use strict';

var Reader = (function (r) {

	var filters = new FilterJS(), HOOKS = {
		BEFORE_CHAPTER_PARSE: 'beforeChapterParse',
		BEFORE_CHAPTER_DISPLAY: 'beforeChapterDisplay',
		AFTER_CHAPTER_DISPLAY: 'afterChapterDisplay'
	};

	// Build an absolute path from the relative path of a resource
	//
	// * `resourcePath` - relative path to the resource
	//
	// N.B. any relative path of a resource is relative to the containing document's place in the hierachary
	// Notes: relative path permutations (all of which must be handled)
	//
	// 1. Higher up the hierarchy e.g. `../../image.png"`
	// 2. Lower down int the hierarchy e.g. `/images/image.png`
	// 3. In the same hierarchy e.g. `image.png"`
	//
	// `CONTENT_PATH_PREFIX` represents a special case whereby there are path components present in the OPF file path e.g. `/OEPBS/content.opf` which is in turn should be inferred with any resource paths if they don't already exist in the resource path
	var _parseURL = function(resourcePath){
		var absoluteUrl = '',
			docName = r.Navigation.getChapterDocName(),
			docAbsPath = r.DOCROOT;

		// Absolute path of the document containing the image
		// TODO Move this to Chapter object? Maybe separate file?
		for (var i = 0; i < r.Book.spine.length; i++) {
			var href = r.Book.spine[i].href;
			if (href.indexOf(docName) !== -1) {
				// The document name was found.
				var pathComponents = href.split('/');
				if (href.indexOf(r.Book.content_path_prefix) === -1) {
					// The href didn't contain the content path prefix (i.e. any path attached to the OPF file), so add it.
					docAbsPath += '/'+r.Book.content_path_prefix.split('/')[0];
				}
				// Append the path components of the document to the absolute path (ignoring the path component which is the document name).
				if (pathComponents.length > 1) {
					for (var j = 0; j < pathComponents.length-1; j++) {
						docAbsPath += '/'+pathComponents[j];
					}
				}
			}
		}

		if (resourcePath.indexOf('../') === 0) {
			// Case 1 - resource is higher up the hierarchy e.g. `resourcePath = "../../image.png"` - You can find an example in *9780141918921 (Thinking, Fast and Slow)*
			try {
				var docPathComponents = docAbsPath.split('/');
				// Start at the second to the rightmost element document path component (we already know there's at least one '../' present
				var pathComponentIdx = docPathComponents.length-2;
				// Start at the index past the `../`
				var pos = 3;
				do {
					// Search resource path from left to right
					pos = resourcePath.indexOf('../', pos);
					if (pos !== -1) {
						pathComponentIdx--;
						// Skip past the `../`
						pos += 3;
					}
				} while (pos !== -1 );
				// Create the absolute path by using the absDocPath up to the target path component and then appending the resource path
				//
				// Locate the start of the target path component
				var startPos = docAbsPath.indexOf(docPathComponents[pathComponentIdx]);
				var length = docPathComponents[pathComponentIdx].length;
				absoluteUrl += docAbsPath.substring(0, startPos+length);
				// Add the resource path removing any leading `../`
				absoluteUrl += '/'+resourcePath.replace(/\.\.\//g, '');
			}
			catch (e) {
				console.log(e);
			}
		}
		else {
			// Case 2 - resource is lower down int the hierarchy e.g. `resourcePath = images/image.png` - You can find an example in *9781447213291 - The Prince who Walked with Lions*.
			//
			// Case 3 - resource is in the same hierarchy e.g. `resourcePath = "image.png"` - real example: *9781488508493 - Special Greats*.
			//
			// NOTE: docRoot has a trailing slash
			absoluteUrl = docAbsPath.charAt(docAbsPath.length-1) === '/' ? docAbsPath+resourcePath : docAbsPath+'/'+resourcePath;
		}

		// Calculate 95% of the width and height of the column.
		var width = Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2);
		var height = Math.floor(r.Layout.Reader.height);

		// if url starts with protocol agnostic url, add protocol to avoid Chrome bug
		// if the url is not absolute, add the window location
		if(absoluteUrl.indexOf('//') === 0){
			absoluteUrl = location.protocol + absoluteUrl;
		} else if(absoluteUrl.indexOf('/') === 0){
			absoluteUrl = location.protocol + '//' + location.host + absoluteUrl;
		}
		return absoluteUrl.replace('params;', 'params;img:w='+width+';img:h='+height+';img:m=scale;');
	};

	// add data attributes to anchors
	var _anchorData = function($content){

		$content.find('a[href]').add($content.filter('a[href]')).each(function(i, link){
			var $link = $(link);
			var valid = /^(ftp|http|https):\/\/[^ "]+$/.test($link.attr('href'));
			if (!valid) {
				// ### Internal link.
				$link.attr('data-link-type', 'internal');
				/* elements[idx].attributes[0].nodeValue = 'http://localhost:8888/books/9780718159467/OPS/xhtml/' + elements[idx].attributes[0].nodeValue;*/

				// internal links must be normalized to point to the correct content
				$link.attr('href', _normalizeLink($link.attr('href')));
			} else {
				// ### External link.
				// External links attribute 'target' set to '_blank' for open the new link in another window / tab of the browser.
				$link.attr('data-link-type', 'external').attr('target', '_blank');
			}
		});

		return $content;
	};

	// Rebuild image src
	var _parseImages = function(content){
		// Transform relative image resource paths to absolute
		var images = content.getElementsByTagName('img');
		if (images.length === 0) {
			images = content.getElementsByTagName('IMG');
		}
		// Check if the img tag is a SVG or not as Webkit and IE10 change the tag name.
		for (var i = 0, image = images[i]; image; image = images[++i]) {
			if (image.hasAttribute('src')) {
				var imgSrc = _parseURL(image.getAttribute('src'));
				// Prevent premature loading of img elements:
				image.setAttribute('data-src', imgSrc);
        // Save original URL for the image:
        image.setAttribute('data-original-src', _normalizeLink(image.getAttribute('src')));
				// Use a tiny data-uri GIF as placeholder:
				image.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
				// Add a placeholder class:
				$(image).addClass('cpr-placeholder');
			}
		}
		return content;
	};

	// Modify SVG images URL and put it in a new IMG element.
	var _parseSVG = function(content){
		var svg = content.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg');

		if (svg.length === 0) { // Just in case the tags are not in the NS format
			svg = content.getElementsByTagName('svg');
		}
		if (svg) {
			for (var j = 0; j < svg.length; j++) {
				var img = svg[j].getElementsByTagNameNS('http://www.w3.org/2000/svg', 'image')[0];
				if (img === undefined) {
					// Check if the tag is IMG
					img = svg[j].getElementsByTagName('img')[0];
				}
				if (img === undefined) {
					// Check if the tag is IMAGE but it does not have Namespace
					img = svg[j].getElementsByTagName('image')[0];
				}
				if (img) {
					if (img.hasAttributeNS('http://www.w3.org/1999/xlink', 'href')) {
						var url = img.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
            // Save original URL for the image:
            img.setAttribute('data-original-src', _normalizeLink(url));
						img.setAttributeNS('http://www.w3.org/1999/xlink', 'href',  _parseURL(url));
					}
				}
			}
		}
		return content;
	};

	// Modify video URL.
	var _parseVideos = function(content){
		var videos = content.getElementsByTagName('video');
		for (var y = 0; y < videos.length; y++) {
			var vidSrc = videos[y].getAttribute('src');
			vidSrc = _parseURL(vidSrc);
			videos[y].setAttribute('src', vidSrc);
		}
		return content;
	};


	// helper function that strips the last path from the url
	// Ex: a/b/c.html -> a/b
	var _removeLastPath = function(url){
		var pathSeparatorIndex = url.lastIndexOf('/');
		return pathSeparatorIndex !== -1 ? url.substring(0, pathSeparatorIndex) : '';
	};

	// Function to transform relative links
	// ex: `../html/chapter.html` -> `chapter.html`
	var _normalizeLink = function(url){
		// get current chapter folder url
		var chapter = r.Navigation.getChapter(), chapterURL = _removeLastPath(r.Book.spine[chapter].href), result = chapterURL;

		// parse current url to remove `..` from path
		var paths = url.split('/');
		for(var i = 0, l = paths.length; i < l; i++){
			var path = paths[i];
			if(path === '..'){
				result = _removeLastPath(result);
			} else {
				result += (!result ? '' : '/') + path;
			}
		}
		return result;
	};

	var _parseCSSLinks = function(content){
		var links = content.getElementsByTagName('link');
		for (var y = 0; y < links.length; y++) {
			var href = links[y].getAttribute('href');
			href = _parseURL(href);
			links[y].setAttribute('href', href);
		}
		return content;
	};

	// Register all the anchors.
	filters.addFilter(HOOKS.BEFORE_CHAPTER_DISPLAY, _anchorData);
	filters.addFilter(HOOKS.BEFORE_CHAPTER_PARSE, _parseImages);
	filters.addFilter(HOOKS.BEFORE_CHAPTER_PARSE, _parseSVG);
	filters.addFilter(HOOKS.BEFORE_CHAPTER_PARSE, _parseVideos);
	filters.addFilter(HOOKS.BEFORE_CHAPTER_PARSE, _parseCSSLinks);

	r.Filters = $.extend({HOOKS: HOOKS}, filters);

	return r;
}(Reader || {}));
