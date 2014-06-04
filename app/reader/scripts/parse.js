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
	// * `options` addtional options containing the url of the file and the page to load
	r.parse = function (content, mimetype, options) {

		if(typeof content !== 'string'){
			return null;
		}

		switch (mimetype) {
		case 'application/xhtml+xml':
			content = parseXHTML(content, options);
			break;
		default:
			break;
		}

		var head = content.split(/<head[^>]*>/)[1].split('</head>')[0],
			body = content.split(/<body[^>]*>/)[1].split('</body>')[0];

		// Extract the contents of the body only thus ignoring any styles declared in head
		return {
			$head: $(head),
			$body: $(body)
		};
	};

	// Function to divide large chapters with many repeating elements into several parts:
	function chapterDivide(doc, options) {
		options = options || {};
		var page = options.page,
				// Only use the basename without anchor for the url:
				url = options.url.split('/').slice(-1)[0].split('#')[0],
				maxElements = r.preferences.maxChapterElements.value,
				// Find the parent element of the repeating elements which exceed the max chapter elements:
				parent = $(doc).find(':nth-child(0n+' + (maxElements + 1) + ')').first().parent(),
				children,
				parts,
				part,
				prefix,
				lastPageSuffix,
				nodeName,
				index;
		if (parent.length) {
			children = parent.children();
			// The number of parts to split this chapter into:
			parts = Math.ceil(children.length / maxElements);
			// By default, start with the first part (zero-indexed):
			part = 0;
			// The prefix to identify anchors to chapter parts:
			prefix = r.Navigation.getChapterPartAnchorPrefix() + '-';
			// The suffix to identify last page positions:
			lastPageSuffix = '-' + r.Navigation.getLastPageAnchorName();
			// The nodeName of the next/prev link-wrapper, a div unless the parent is a list:
			nodeName = /^(ul|ol)$/i.test(parent.prop('nodeName')) ? 'li' : 'div';
			if (r.Navigation.isChapterPartAnchor(page)) {
				// Get the current part from the page anchor:
				part = Number(String(page).replace(prefix, '').replace(lastPageSuffix, '')) || 0;
			} else if (r.Navigation.isLastPageAnchor(page)) {
				// Anchor points to the last page in the chapter, so select the last part:
				part = parts - 1;
			} else if (r.CFI.isValidCFI(page)) {
				part = r.Navigation.getChapterPartFromCFI(page);
			} else if ($.type(page) === 'string') {
				// Handle page anchors:
				index = $(doc).find('#' + page).closest(children).index();
				if (index >= maxElements) {
					part = Math.floor(index / maxElements);
				}
			}
			// Remove all elements up to the current part:
			children.slice(0, maxElements * part).remove();
			// Remove all elements after current part:
			children.slice(maxElements * (part + 1)).remove();
			if (part) {
				// Add a link to the previous part:
				$(document.createElement(nodeName))
					.prop('id', 'cpr-subchapter-prev')
					.addClass('cpr-subchapter-link')
					.append($('<a></a>').prop('href', url + '#' + prefix + (part - 1) + lastPageSuffix))
					.attr('data-chapter-part', part)
					.prependTo(parent);
			}
			if (part < parts - 1) {
				// Add a link to the next part:
				$(document.createElement(nodeName))
					.prop('id', 'cpr-subchapter-next')
					.addClass('cpr-subchapter-link')
					.append($('<a></a>').prop('href', url + '#' + prefix + (part + 1)))
					.appendTo(parent);
			}
		}
	}

	// Parses the content in application/xhtml+xml. Returns the parsed content.
	//
	// * `content` The content of the document
	// * `options` addtional options containing the url of the file and the page to load
	var parseXHTML = function (content, options) {
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

		if (elements.length > r.preferences.maxChapterElements.value) {
			// divide large chapters into subchapters:
			chapterDivide(object, options);
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

	return r;

}(Reader || {}));