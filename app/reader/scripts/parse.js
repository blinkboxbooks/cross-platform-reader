/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * parse.js: methods to parse and clean the content
 */

'use strict';

var Reader = (function (r) {

	// Parses the content according its mimetype. Returns the parsed content
	//
	// * `content` The content of the document
	// * `mimetype` The MIME type of the given document
	r.parse = function (content, mimetype) {
		// Replace images and styles URLs.

		switch (mimetype) {
		case 'application/xhtml+xml':
			content = parseXHTML(content);
			break;
		default:
			break;
		}
		// Extract the contents of the body only thus ignoring any styles declared in head
		return typeof content === 'string' ? $(content.split(/<body[^>]*>/)[1].split('</body>')[0]) : null;
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

		object = r.Filters.applyFilters(r.Filters.HOOKS.BEFORE_CHAPTER_PARSE, object);

		var prefixes = [];
		// Get all elements in any namespace.
		var elements = object.getElementsByTagNameNS('*', '*');

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

	return r;

}(Reader || {}));