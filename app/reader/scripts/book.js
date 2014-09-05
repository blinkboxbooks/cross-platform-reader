'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)

var Reader = (function (r) {

	var defaultData = {
		// This version number identifies the data format:
		version: '2.0.0',
		spine: [],
		toc: [],
		title: '',
		author: '',
		opfPath: '',
		contentPathPrefix: '',
		$opf: null,
		totalWordCount: 0,
		totalImageCount: 0,
		sample: false
	};

	// Retrieves the item with the given id from the OPF manifest:
	function getManifestItem($opf, id) {
		// Searching via #id might fail with invalid id properties, so we use an attribute selector instead:
		return $opf.find('manifest item[id="' + id + '"]');
	}

	// Calculates the path prefix for book resources:
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

	// Retrieves the TOC from a given navMap entry point (recursive function):
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

	// Retrieve the opfPath from the root file:
	function loadOpfPath(data) {
		return loadFile(r.ROOTFILE_INFO, 'xml').then(function rootFileLoaded(rootDoc) {
			data.opfPath = $(rootDoc).find('rootfile').attr('full-path');
			return data;
		});
	}

	// Load opfFile and store $opf and contentPathPrefix in the given data object:
	function loadOpfData(data) {
		if (data.opf) {
			// OPF data is provided via XML string
			data.$opf = $(data.opf).filter('package');
			return $.Deferred().resolve(data).promise();
		}
		return loadFile(data.opfPath).then(function opfFileLoaded(opfDoc) {
			data.$opf = $(opfDoc).filter('package');
			data.contentPathPrefix = getPathPrefix(data.opfPath, data.$opf);
			return data;
		});
	}

	// Function to load the TOC data from the EPUB2 NCX (TOC) file.
	function loadTOCData(data) {
		var tocId = data.$opf.find('spine').attr('toc'),
				ncxHref = getManifestItem(data.$opf, tocId).attr('href');
		// The ncx file is part of EPUB v2.
		// To retrieve the Url of an EPUB v3 TOC document:
		// navHref = $opf.find('manifest item[properties="nav"]').attr('href'),
		return loadFile(data.contentPathPrefix + ncxHref, 'xml').then(function tocFileLoaded(ncxDoc) {
			data.toc = getTOCFromNavMap($(ncxDoc).find('navMap'), data.contentPathPrefix);
			return data;
		});
	}

	// Load book meta data if book-info.json is not available:
	function loadBookMetaData(args) {
		return loadOpfPath({})
			.then(loadOpfData)
			.then(loadTOCData)
			.then(function (data) {
				var $opf = data.$opf;
				return $.extend(data, {
					title: getTitleFromOPF($opf),
					author: getAuthorFromOPF($opf),
					spine: getSpineFromOPF($opf, data.contentPathPrefix)
				}, args);
			});
	}

	// Load book meta data from book-info.json:
	function loadBookInfo(args) {
		return loadFile(r.INF, 'json')
			.then(loadOpfData)
			.then(function (data) {
				return $.extend(data, args);
			});
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

	// Count the number of images (and SVG elements) in the given HTML string:
	function countImages(str) {
		var result = str.match(/(<img)|(<svg)/gi);
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
				spineItem.active = true;
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
		// Notify the client that loading has been started:
		defer.notify();
		if (args.spine) {
			// Book data is provided via arguments, so we only load the opfData:
			loadOpfData($.extend({}, args))
				.then(defer.resolve, defer.reject);
			return defer.promise();
		} else {
			// Try loading book-info.json:
			loadBookInfo(args).then(
				defer.resolve,
				function () {
					// book-info.json not available, load meta data manually:
					loadBookMetaData(args)
						.then(defer.resolve, defer.reject);
				}
			);
			// Book data is not provided via arguments
			return defer.promise().then(function (data) {
				// loadProgressData === 1 -> load progress data on Book load
				if (r.preferences.loadProgressData.value === 1) {
					// Parse the chapters for the word/image count:
					return parseChapters(data);
				}
				return data;
			});
		}
	}

	// Function to count the total word- and image- count for the given book data:
	function calculateTotals(book) {
		var spine = book.spine,
				wordCount = 0,
				imageCount = 0,
				i = 0,
				item;
		while ((item = spine[i++])) {
			// Check if the spine item is available (explicit type check as the active property might be undefined):
			if (item.active !== false) {
				wordCount += item.wordCount;
				imageCount += item.imageCount;
			}
		}
		book.totalWordCount = wordCount;
		book.totalImageCount = imageCount;
	}

	// Function to retrieve the associated TOC item for a given href and optional currentPage.
	// The search starts from the given TOC item to simplify recursion:
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

	// Adds labels from TOC and progress information to the spine:
	function addLabelAndProgressToSpine(book) {
		var spine = book.spine,
				totalCount = book.getTotalWordCount(),
				currentCount = 0,
				i = 0,
				spineItem,
				tocItem;
		while ((spineItem = spine[i++])) {
			if (spineItem.label === undefined) {
				tocItem = book.getTOCItem(spineItem.href);
				if (tocItem) {
					spineItem.label = tocItem.label;
				}
			}
			// Check if the spine item is available (explicit type check as the active property might be undefined):
			if (spineItem.active !== false) {
				// Add +1 to the current word count of the previous chapters
				// to identify the progress for the first word of the chapter:
				spineItem.progress = (currentCount + 1) / totalCount * 100;
				currentCount += book.getWordCount(spineItem);
			}
		}
	}

	// Initialize the book with the given data:
	function initializeBookData(data) {
		var book = r.Book;
		$.extend(book, data);
		calculateTotals(book);
		addLabelAndProgressToSpine(book);
		r.Navigation.setNumberOfChapters(book.spine.length);
		return book;
	}

	r.Book = {
		// Method to load a file from the book resources:
		loadFile: loadFile,
		// Load the book information.
		// Uses the given arguments and loads any missing data:
		load: function (args) {
			this.reset();
			return loadBookData(args || {}).then(initializeBookData);
		},
		// Load the spine progress data (word- and image count):
		loadProgressData: function () {
			return parseChapters(this).then(initializeBookData);
		},
		// Reset the module to default values:
		reset: function () {
			$.extend(this, defaultData);
		},
		// Retrieve the associated TOC item for a given href and optional currentPage:
		getTOCItem: function (href, currentPage) {
			return parseTOCItem({children: this.toc}, href, currentPage);
		},
		// Retrieve the total word count of a book (takes image count into account):
		getTotalWordCount: function () {
			return this.totalWordCount + (this.totalImageCount || 0) * r.preferences.imageWordCount.value;
		},
		// Retrieve the word count of a chapter (takes image count into account):
		getWordCount: function (spineItem) {
			return spineItem.wordCount + (spineItem.imageCount || 0) * r.preferences.imageWordCount.value;
		},
		// Export the book data that can be converted to JSON:
		getData: function () {
			var data = {},
					prop,
					value;
			for (prop in this) {
				value = this[prop];
				if (this.hasOwnProperty(prop) && typeof value !== 'function' && !(value instanceof $)) {
					data[prop] = value;
				}
			}
			return data;
		}
	};

	// Initialize the Reader with default (empty) book data:
	r.Book.reset();

	return r;
}(Reader || {}));
