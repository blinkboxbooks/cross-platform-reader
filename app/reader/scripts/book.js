'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)

var Reader = (function (r) {

	var defaultData = {
		spine: [],
		toc: [],
		title: '',
		author: '',
		contentPathPrefix: '',
		$opf: null,
		totalWordCount: 0,
		totalImageCount: 0
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

	function getAuthorFromOPF($opf) {
		return $opf.find('dc\\:creator').first().text();
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
						author: getAuthorFromOPF($opf),
						spine: getSpineFromOPF($opf, pathPrefix),
						toc: getTOCFromNavMap($(ncxDoc).find('navMap'), pathPrefix),
						contentPathPrefix: getPathPrefix(opfPath, $opf),
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
				data.contentPathPrefix = getPathPrefix(data.opfPath, $opf);
				data.$opf = $opf.filter('package');
				defer.resolve($.extend(args, data));
			}, defer.reject);
		}, defer.reject);
		return defer.promise();
	}

	// Count the number of words in the given HTML string:
	function countWords(str) {
		str = str
			// Replace the title element, as we don't count its contents:
			.replace(/<title>[^<]+<\/title>/i, '')
			// Replace all HTML elements with single spaces:
			.replace(/(<[^>]+>)/gi, ' ');
		// Convert all HTML entities to their textual representation,
		// so that whitespace entities are not counted as text:
		str = $('<p>').html(str).text();
		// Calculate the word matches:
		var match = str.match(/\s+\S+/g);
		return match ? match.length : 0;
	}

	// Count the number of images in the given HTML string:
	function countImages(str) {
		var result = str.match(/<img/gi);
		return result ? result.length : 0;
	}

	// Strip any HTML comments from the given HTML string:
	function stripHTMLComments(str) {
		return str.replace(/<!--.*?-->/g, '');
	}

	// Function to handle a given number of parallel requests:
	function parallelRequestsHandler(list, request) {
		var defer = $.Deferred(),
				count = list.length,
				index = 0,
				maxRequests = r.preferences.maxParallelRequests.value,
				pendingRequests = 0,
				handleResponse = function () {
					pendingRequests--;
					initRequests();
				},
				sendRequests = function () {
					while (index < count && pendingRequests < maxRequests) {
						pendingRequests++;
						request(list[index++]).always(handleResponse);
					}
				},
				initRequests = function () {
					if (index === count) {
						if (!pendingRequests) {
							defer.resolve(list);
						}
					} else {
						sendRequests();
					}
				};
		initRequests();
		return defer.promise();
	}

	// Function to parse a chapter in the spine to calculate word- and image- count:
	function parseChapter(spineItem) {
		if (spineItem.active === false) {
			// Given file is not available in the EPUB
			return $.Deferred().reject().promise();
		}
		return loadFile(spineItem.href)
			.done(function (result) {
				result = stripHTMLComments(result);
				spineItem.imageCount = countImages(result);
				if (spineItem.wordCount === undefined) {
					spineItem.wordCount = countWords(result);
				}
			})
			.fail(function () {
				// Given file is not available in the EPUB:
				spineItem.active = false;
			});
	}

	// Function to parse each chapter in the spine to calculate word- and image- count:
	function parseChapters(data) {
		return parallelRequestsHandler(data.spine, parseChapter).then(function () {
			return data;
		});
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
		return defer.promise().then(parseChapters);
	}

	// Method to count the total for the given spine item property:
	function countTotal(spine, prop) {
		var count = 0,
				i = 0,
				item;
		while ((item = spine[i++])) {
			count += item.linear ? item[prop] : 0;
		}
		return count;
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
		r.Book.totalWordCount = countTotal(r.Book.spine, 'wordCount');
		r.Book.totalImageCount = countTotal(r.Book.spine, 'imageCount');
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
