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

	function getManifestItem($opf, id) {
		// Searching via #id might fail with invalid id properties, so we use an attribute selector instead:
		return $opf.find('manifest item[id="' + id + '"]');
	}

	function getPathPrefix(opfPath, $opf) {
		var pathPrefix = opfPath.split('/').slice(0, -1).join('/'),
			spineItemId,
			spineItemHref;
		// If the path prefix is empty, set its value to the path of the first element in the spine:
		if (!pathPrefix) {
			spineItemId = $opf.find('spine itemref').attr('idref');
			spineItemHref = getManifestItem($opf, spineItemId).attr('href');
			// Check if the path has more then one component:
			if (spineItemHref.indexOf('/') !== -1) {
				pathPrefix = spineItemHref.split('/')[0];
			}
		}
		// Add a trailing slash if we have a path prefix:
		return pathPrefix && pathPrefix + '/';
	}

	function getTitleFromOPF($opf) {
		return $opf.find('dc\\:title').first().text();
	}

	function getSpineFromOPF($opf, pathPrefix) {
		return $.map($opf.find('spine itemref'), function (itemref) {
			var id = itemref.getAttribute('idref'),
				$item = getManifestItem($opf, id);
			return {
				itemId: id,
				href: pathPrefix + $item.attr('href'),
				// The default is "yes", so unlike it's "no", the spine item is linear:
				linear: itemref.getAttribute('linear') === 'no' ? false : true,
				mediaType: $item.attr('media-type')
			};
		});
	}

	function getTOCFromNavMap(navMap, pathPrefix) {
		return $.map(navMap.children('navPoint'), function (navPoint) {
			var $navPoint = $(navPoint),
				data = {
					// active: true, // false if HTML file is not available, e.g. in samples
					href: pathPrefix + $navPoint.children('content').attr('src'),
					itemId: navPoint.id,
					label: $navPoint.children('navLabel').children('text').text(),
					playOrder: $navPoint.attr('playOrder')
				},
				children = getTOCFromNavMap($navPoint, pathPrefix);
			if (children.length) {
				data.children = children;
			}
			return data;
		});
	}

	// Get a file from the server:
	function loadFile(resource, type) {
		var defer = $.Deferred();
		$.ajax({
			url: r.DOCROOT + '/' + resource,
			dataType: type ? type : 'text'
		}).then(defer.resolve, function (err) {
			defer.reject($.extend({}, r.Event.ERR_MISSING_FILE, {details: err.responseText}));
		});
		return defer.promise();
	}

	// Load book meta data if book-info.json is not available:
	function loadBookMetaData(args) {
		var defer = $.Deferred();
		loadFile(r.ROOTFILE_INFO, 'xml').then(function rootFileLoaded(rootDoc) {
			var opfPath = $(rootDoc).find('rootfile').attr('full-path');
			loadFile(opfPath).then(function opfFileLoaded(opfDoc) {
				var $opf = $(opfDoc),
					pathPrefix = getPathPrefix(opfPath, $opf),
					tocId = $opf.find('spine').attr('toc'),
				// Url of EPUB v3 TOC document:
				//navHref = $opf.find('manifest item[properties="nav"]').attr('href'),
				// Url of EPUB v2 TOC document:
					ncxHref = getManifestItem($opf, tocId).attr('href');
				loadFile(pathPrefix + ncxHref, 'xml').then(function tocFileLoaded(ncxDoc) {
					defer.resolve($.extend(args, {
						title: getTitleFromOPF($opf),
						spine: getSpineFromOPF($opf, pathPrefix),
						toc: getTOCFromNavMap($(ncxDoc).find('navMap'), pathPrefix),
						content_path_prefix: getPathPrefix(opfPath, $opf),
						$opf: $opf.filter('package')
					}));
				}, defer.reject);
			}, defer.reject);
		}, defer.reject);
		return defer.promise();
	}

	// Load book meta data from book-info.json:
	function loadBookInfo(args) {
		var defer = $.Deferred();
		loadFile(r.INF, 'json').then(function bookInfoLoaded(data) {
			loadFile(data.opfPath).then(function opfFileLoaded(opfDoc) {
				var $opf = $(opfDoc);
				data.content_path_prefix = getPathPrefix(data.opfPath, $opf);
				data.$opf = $opf.filter('package');
				defer.resolve($.extend(args, data));
			}, defer.reject);
		}, defer.reject);
		return defer.promise();
	}

	// Wrapper function to load book meta data from book-info.json or EPUB meta files:
	function loadBookData(args) {
		var defer = $.Deferred();
		loadBookInfo(args).then(
			// book-info.json is available:
			defer.resolve,
			// book-info.json not available:
			function () {
				loadBookMetaData(args)
					.then(defer.resolve, defer.reject);
			}
		);
		// notify client that info promise has been processed
		defer.notify();
		return defer.promise();
	}

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

	function initializeBookData(args) {
		$.extend(r.Book, args);
		r.Book.totalWordCount = getTotalWordCount(r.Book.spine);
		addLabelAndProgressToSpine(r.Book.spine);
		r.Navigation.setNumberOfChapters(r.Book.spine.length);
		return r.Book;
	}

	r.Book = {
		// <a name="load"></a> Loads a book's information.
		load: function (args) {
			r.Book.reset();
			if (!args.spine) {
				return loadBookData(args).then(initializeBookData);
			}
			return $.Deferred().resolve(initializeBookData(args)).promise();
		},
		// <a name="reset"></a> Resets the module to default values.
		reset: function () {
			$.extend(r.Book, defaultData);
		},
		getTOCItem: function (href, currentPage) {
			return parseTOCItem({children: r.Book.toc}, href, currentPage);
		},
		loadFile: loadFile
	};

	// Initialize the Reader with default (empty) book data:
	r.Book.reset();

	return r;
}(Reader || {}));
