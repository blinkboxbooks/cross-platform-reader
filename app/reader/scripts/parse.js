/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * parse.js: methods to parse and clean the content
 */


'use strict';

/* jshint unused: true */
/* exported Reader */
/* globals $ */

var Reader = (function (r) {
	// Parses the content according its mimetype. Returns the parsed content
	//
	// * `content` The content of the document
	// * `mimetype` The MIME type of the given document
	r.parse = function (content, mimetype) {
		// Replace images and styles URLs.
		if (r.DOCROOT !== '') {

		}
		switch (mimetype) {
		case 'application/xhtml+xml':
			content = parseXHTML(content);
			break;
		default:
			break;
		}
		// Extract the contents of the body only thus ignoring any styles declared in head
		return typeof content === 'string' ? content.split(/<body[^>]*>/)[1].split('</body>')[0] : null;
	};

	// Parses the content in application/xhtml+xml. Returns the parsed content.
	//
	// * `content` The content of the document
	var parseXHTML = function (content) {
		var parser = new DOMParser();
		if (content.indexOf('<!-- livereload snippet -->') !== -1) {
			// Delete livereload script tags (added by grunt to html files)
			content = content.split('<!-- livereload snippet -->')[0].trim() + '</body></html>';
		}

		var object = parser.parseFromString(content, 'application/xhtml+xml');
		if(object.getElementsByTagName('parsererror').length > 0){
			// TODO Refactor
			// Parsing failures should be handled differently than just sending an error to the client
			r.Notify.error(r.Event.ERR_PARSING_FAILED);
		}

		var prefixes = [];
		// Get all elements in any namespace.
		var elements = object.getElementsByTagNameNS('*', '*');
		// Get all a elements from the content.
		var $links = $('a[href]', object);
		for (var idx = 0; idx < $links.length; idx++) {
			var $link = $($links[idx]);
			var valid = /^(ftp|http|https):\/\/[^ "]+$/.test($link.attr('href'));
			if (!valid) {
				// ### Internal link.
				$link.attr('data-link-type', 'internal');
				/* elements[idx].attributes[0].nodeValue = 'http://localhost:8888/books/9780718159467/OPS/xhtml/' + elements[idx].attributes[0].nodeValue;*/
			} else {
				// ### External link.
				// External links attribute 'target' set to '_blank' for open the new link in another window / tab of the browser.
				$link.attr('data-link-type', 'external').attr('target', '_blank');
			}
		}

		// ### Build URL for parsing.

		// Transform relative image resource paths to absolute
		var images = object.getElementsByTagName('img');
		if (images.length === 0) {
			images = object.getElementsByTagName('IMG');
		}
		// Check if the img tag is a SVG or not as Webkit and IE10 change the tag name.
		for (var i = 0; i < images.length; i++) {
			if (images[i].hasAttribute('src')) {
				var imgSrc = images[i].getAttribute('src');
				imgSrc = buildURL(imgSrc);
				images[i].setAttribute('src', imgSrc);
				// TODO Firefox fix for max-width within columns
				// images[i].style.maxWidth = 95 / 100 * Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2) + 'px';
			}
		}

		// Modify SVG images URL and put it in a new IMG element.
		var svg = object.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'svg');
		if (svg.length === 0) { // Just in case the tags are not in the NS format
			svg = object.getElementsByTagName('svg');
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
						url = buildURL(url);
						// Replace the svg tag if it is an image and show it in a normal IMG tag (compatible with SVG image format)
						var newImg = document.createElement('img');
						newImg.setAttribute('src', url);
						// TODO Firefox max-width fix
						// newImg.style.maxWidth = 95 / 100 * Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2) + 'px';
						var parentNode = svg[j].parentNode;
						parentNode.insertBefore(newImg,svg[j]);
						parentNode.removeChild(svg[j]);
					}
				}
			}
		}

		// Modify video URL.
		var videos = object.getElementsByTagName('video');
		for (var y = 0; y < videos.length; y++) {
			var vidSrc = videos[y].getAttribute('src');
			vidSrc = buildURL(vidSrc);
			videos[y].setAttribute('src', vidSrc);
		}

		var html = '<!DOCTYPE html>\n<html>' + object.documentElement.innerHTML + '</html>';
		// Remove the prefix in those that have.
		for (var k = 0; k < elements.length; k++) {
			if (elements[k].prefix) {
				prefixes[elements[k].prefix] = {prefix: elements[k].prefix, uri: elements[k].namespaceURI};
			}
		}

		// Search all prefixes in the code and remove them, also search the declaration of this prefix and also eliminates them.
		for (var x in prefixes) {
			var prefix = prefixes[x].prefix;
			var uri = prefixes[x].uri;
			// Patterns to search the prefixes and their namespace declarations.
			var pattern_open = new RegExp('<' + prefix + ':', 'g');
			var pattern_close = new RegExp('<\/' + prefix + ':', 'g');
			var namespaceURI = new RegExp('xmlns:' + prefix + '=\"' + uri + '\"', 'g');

			html = html.replace(pattern_open, '<');
			html = html.replace(pattern_close, '</');
			html = html.replace(namespaceURI, '');
		}
		return html;
	};

	var addSizeConstraints = function(url){
		// Calculate 95% of the width and height of the column.
		var width = Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2);
		var height = Math.floor(r.Layout.Reader.height);
		return url.replace('params;', 'params;img:w='+width+';img:h='+height+';img:m=scale;');
	};

	// Using the the document root and the spine as a reference, return the absolute path of a given document.
	var getDocAbsPath = function(docName) {

		var docAbsPath = r.DOCROOT;
		try {
			for (var i = 0; i < r.SPINE.length; i++) {
				var href = r.SPINE[i].href;
				if (href.indexOf(docName) !== -1) {
					// The document name was found.
					var pathComponents = href.split('/');
					if (href.indexOf(r.CONTENT_PATH_PREFIX) === -1) {
						// The href didn't contain the content path prefix (i.e. any path attached to the OPF file), so add it.
						docAbsPath += '/'+r.CONTENT_PATH_PREFIX.split('/')[0];
					}
					// Append the path components of the document to the absolute path (ignoring the path component which is the document name).
					if (pathComponents.length > 1) {
						for (var j = 0; j < pathComponents.length-1; j++) {
							docAbsPath += '/'+pathComponents[j];
						}
					}
					return docAbsPath;
				}
			}
		}
		catch (e) {
			console.log('getDocAbsPath: '+e);
		}
		// If we arrived here, it means that the we didn't find the document in the spine (which in theory should not happen) or there was an exception so just return the document root and any prefix.
		return docAbsPath+r.CONTENT_PATH_PREFIX;
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
	var buildURL = function(resourcePath){
		var absoluteUrl = '';
		// Absolute path of the document containing the image
		var docAbsPath = getDocAbsPath(r.Navigation.getChapterDocName());

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
		return addSizeConstraints(absoluteUrl);
	};
	return r;

}(Reader || {}));