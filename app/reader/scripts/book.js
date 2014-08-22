'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)
//
// * `spine`
// * `toc`
// * `title`
// * `load`
// * `reset`
// * [`getTOC`](#getTOC)
// * [`getSPINE`](#getSPINE)

var Reader = (function (r) {

	var defaultData = {
		spine: [],
		toc: [],
		title: '',
		content_path_prefix: '',
		$opf: null,
		totalWordCount: 0
	};

	function getTotalWordCount(spine) {
		var totalWordCount = 0,
				i;
		for (i = 0; i < spine.length; i++) {
			totalWordCount += spine[i].linear ? spine[i].wordCount : 0;
		}
		return totalWordCount;
	}

	function parseTOCItem(item, href, currentPage) {
		var children = item.children,
			result,
			i,
			childItem,
			anchorId,
			anchorPage;
		if (item.href && item.href.indexOf(href) === 0) {
			if (!currentPage) {
				return item;
			}
			result = item;
		}
		if (children) {
			for (i = 0; i < children.length; i++) {
				childItem = parseTOCItem(children[i], href, currentPage);
				if (childItem) {
					if (result) {
						anchorId = childItem.href.split('#')[1];
						if (!anchorId) {
							continue;
						}
						anchorPage = r.returnPageElement('#' + anchorId);
						if (anchorPage === -1) {
							continue;
						}
						if (anchorPage > currentPage) {
							break;
						}
					}
					result = childItem;
				}
			}
		}
		return result;
	}

	function addLabelAndProgressToSpine(spine) {
		var totalWordCount = r.Book.totalWordCount,
				currentWordCount = 0,
				i,
				spineItem,
				tocItem;
		for (i = 0; i < spine.length; i++) {
			spineItem = spine[i];
			tocItem = r.Book.getTOCItem(spineItem.href);
			if (tocItem) {
				spineItem.label = tocItem.label;
			}
			// Add +1 to the current word count of the previous chapters
			// to identify the progress for the first word of the chapter:
			spineItem.progress = (currentWordCount + 1) / totalWordCount * 100;
			currentWordCount += spineItem.linear ? spineItem.wordCount : 0;
		}
	}

	r.Book = {
		// <a name="load"></a> Loads a book's information.
		load: function (args) {
			r.Book.reset();
			$.extend(r.Book, args);
			r.Book.$opf = $(args.opf).filter('package');
			r.Book.totalWordCount = getTotalWordCount(r.Book.spine);
			addLabelAndProgressToSpine(r.Book.spine);
		},
		// <a name="reset"></a> Resets the module to default values.
		reset: function () {
			$.extend(r.Book, defaultData);
		},
		// <a name="getSPINE"></a> Returns the spine as a JSON string.
		getSPINE: function () {
			return JSON.stringify(r.Book.spine);
		},
		// This function returns a stringified version of the table of contents. It is mainly used on mobile readers.
		// <a name="getTOC"></a> Returns the TOC as a JSON string.
		getTOC: function () {
			return JSON.stringify(r.Book.toc);
		},
		getTOCItem: function (href, currentPage) {
			return parseTOCItem({children: r.Book.toc}, href, currentPage);
		}
	};

	// Initialize the Reader with default (empty) book data:
	r.Book.reset();

	return r;
}(Reader || {}));
