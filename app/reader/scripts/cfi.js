'use strict';

/* jshint unused: true */
/* exported Reader */
/* globals $, EPUBcfi */

var Reader = (function (r) {
	// Private array for blacklisted classes. The CFI library will ignore any DOM elements that have these classes.
	// [Read more](https://github.com/readium/EPUBCFI/blob/864527fbb2dd1aaafa034278393d44bba27230df/spec/javascripts/cfi_instruction_spec.js#L137)
	var _classBlacklist = ['bookmark', 'cpr-marker'];

	// The **CFI** object exposes methods to handle CFIs. it is **not** intended to be exposed to the client directly.
	//
	// * [`setUp`](#setUp)
	// * [`getCFIObject`](#getCFIObject)
	// * [`setCFI`](#setCFI)
	// * [`addOneNodeToCFI`](#addOneNodeToCFI)
	// * [`addOneWordToCFI`](#addOneWordToCFI)
	// * [`goToCFI`](#goToCFI)
	// * reset

	// Helper methods:
	//
	// * [`updateContext`](#updateContext)
	// * [`addContext`](#addContext)
	// * [`removeContext`](#removeContext)
	// * [`addOneNodeToCFI`](#addOneNodeToCFI)
	// * [`getChapterFromCFI`](#getChapterFromCFI)
	//
	// Other private methods
	//
	// * [`getFirstNode`](#getFirstNode)
	r.CFI = {
		// The `opfCFI` is used to generate the first part of any valid CFI. This part points to the **file** containing the chapter.
		opfCFI: null,
		// Variable that contains a partial CFI representing the DOM tree between the reader container and the body. It is different between clients and has to be constructed dynamically.
		context: null,
		// <a name="setUp"></a>  Initialises the CFI variables, should be called whenever we load a new chapter
		// `chapter` the current chapter
		setUp: function (chapter) {
			if (r.opf === null) {
				return;
			}
			try {
				var chapterId = $(r.opf).find('spine').children()[chapter].getAttribute('idref');
				r.CFI.opfCFI = EPUBcfi.Generator.generatePackageDocumentCFIComponent(chapterId, r.opf);
			} catch (err) {
				// cannot generate CFI
				r.Notify.error($.extend({}, r.Event.ERR_CFI_GENERATION, {details: err, call: 'CFI.setUp'}));
			}
		},
		// <a name="updateContext"></a> This function will generate the CFI path between the body and the reader, specific to every client.
		updateContext: function(){
			if(!r.$reader || !r.CFI.opfCFI){
				return;
			}

			var elCFI = EPUBcfi.Generator.generateElementCFIComponent(r.$reader[0]);
			var completeCFI = EPUBcfi.Generator.generateCompleteCFI(r.CFI.opfCFI, elCFI);
			var part_1 = completeCFI.split('!/4')[1];
			r.CFI.context = part_1.split('[' + (r.$reader[0].id) + ']')[0] + '[' + (r.$reader[0].id) + ']';
		},
		// <a name="addContext"></a> This function will add the context into a CFI to generate a complete and valid CFI to be used with the current chapter.
		addContext: function(completeCFI){
			if($.type(completeCFI) !== 'string'){
				return;
			}
			// The reader context would not normally be updated anymore, but this is a workaround to the web-app, when they move the reader in the DOM and the context changes. Until that is fixed, we must update the context all the time.
			// if(r.CFI.context === null){
			r.CFI.updateContext();
			// }

			if(completeCFI.indexOf('!/4') !== -1){
				// Remove any IDs that contain "."
				completeCFI = completeCFI.replace(/\[([\w-_])*\.([\w-_])*\]/gi, '');
				// Take into account the style tags and Google font tag (current node -= 2/3)
				var contextSplit = completeCFI.split('!/4');
				completeCFI = contextSplit[0] + '!/4' + r.CFI.context + contextSplit[1];
			}

			return completeCFI;
		},
		// <a name="removeContext"></a> This function will remove the context from a CFI to generate a re-usable, generic, CFI.
		removeContext: function(completeCFI){
			if($.type(completeCFI) !== 'string'){
				return;
			}
			// The reader context would not normally be updated anymore, but this is a workaround to the web-app, when they move the reader in the DOM and the context changes. Until that is fixed, we must update the context all the time.
			// if(r.CFI.context === null){
			r.CFI.updateContext();
			// }

			if(completeCFI.indexOf(r.CFI.context) !== -1){
				completeCFI = completeCFI.replace(r.CFI.context, '');
				// Remove any IDs that contain "."
				completeCFI = completeCFI.replace(/\[([\w-_])*\.([\w-_])*\]/gi, '');
			}

			return completeCFI;
		},

		// <a name="getCFIObject"></a> Return the current position's CFI and a preview of the current text.
		getCFIObject: function() {
			// The reader context would not normally be updated anymore, but this is a workaround to the web-app, when they move the reader in the DOM and the context changes. Until that is fixed, we must update the context all the time.
			// if(r.CFI.context === null){
			r.CFI.updateContext();
			// }

			try {
				var startTextNode = getFirstNode();
				var elCFI = null;
				if (startTextNode.textNode.nodeType === 3) {
					elCFI = EPUBcfi.Generator.generateCharacterOffsetCFIComponent(startTextNode.textNode, startTextNode.offset, _classBlacklist);
				} else if (startTextNode.textNode.nodeType === 1) {
					elCFI = EPUBcfi.Generator.generateElementCFIComponent(startTextNode.textNode, _classBlacklist);
				}
				if (elCFI !== null) {

					var completeCFI = EPUBcfi.Generator.generateCompleteCFI(r.CFI.opfCFI, elCFI);
					var i;
					// getFirstNode does not have a blacklist and the injected markers break the CFI generation.
					// To ensure the correct CFI is generated, we must test it first. If the EPUBcfi library returns more than one text nodes, we must update the offset to include the previous text nodes.
					// the complete CFi must not contain any \. (processed normally, but not here)
					var $node = $(EPUBcfi.Interpreter.getTargetElement(completeCFI.replace(/\[([\w-_])*\.([\w-_])*\]/gi, ''), document, _classBlacklist));
					if($node.length > 1 && $node[0].nodeType === 3) {
						var offset = startTextNode.offset;
						for(i = 0; i < $node.length - 1; i++){
							offset += $node[i].length;
						}
						completeCFI = completeCFI.replace(/:\d+/, ':' + offset);
					}

					var result = {
						CFI: r.CFI.removeContext(completeCFI),
						preview: startTextNode.preview
					};

					var chapter =  r.CFI.getChapterFromCFI(result.CFI);
					var sections = [];

					var _parseItem = function(item){
						if(item.href.indexOf(href) !== -1){
							sections.push(item);
						}
						if(item.children){
							for(var i = 0, l = item.children.length; i < l; i++){
								_parseItem(item.children[i]);
							}
						}
					};

					if(chapter !== -1){
						var href = r.SPINE[chapter].href;
						for(i = 0; i < r.TOC.length; i++){
							_parseItem(r.TOC[i]);
						}
					}
					if(sections.length){
						if(sections.length > 1){
							var currentPage =  r.Navigation.getPage();
							// if more than one match, compare page numbers of different elements and identify where the current page is
							for(var j = 0, l = sections.length; j < l; j++){
								// get the anchor the url is pointing at
								var anchor = sections[j].href.split('#');
								anchor = anchor.length > 1 ? '#'+anchor[1] : null;
								if(!anchor){
									continue;
								} else {
									var $anchor = $(anchor);
									// we have to check if the element exists in the current chapter. Samples sometimes cut portions of the document, resulting in missing links
									if($anchor.length){
										var anchorPage = r.returnPageElement($anchor);
										if(anchorPage > currentPage){
											break;
										}
										result.chapter = sections[j].label;
									}
								}
							}
						} else {
							result.chapter = sections[0].label;
						}
					}
					return result;
				}
				return null;
			}
			catch (err) {
				// cannot generate CFI
				r.Notify.error($.extend({}, r.Event.ERR_CFI_GENERATION, {details: err, call: 'getCFIObject'}));
			}
		},
		getCFI: function() {
			return encodeURIComponent(JSON.stringify(r.CFI.getCFIObject()));
		},
		// <a name="setCFI"></a> This function will inject a blacklisted market into the DOM to allow the user to identify where a CFI points to.
		setCFI: function (cfi, markerClass) { // Add an element to a CFI point
			if($('.'+(markerClass ? markerClass : 'bookmark')+'[data-cfi="' + cfi + '"]').length === 0){
				try {
					/* TODO: *** REFACTORING CANDIDATE ***
					 ideally, we should not end up with bookmark markers in a span element within an image element
					 the mainl problem is that it's not possible locate the offset of this span
					 instead, we should be adding the marker to the img attributes
					 also, it would be better to gert the markerClass to be passed in in all circumstances
					 */
					var marker = '<span class="'+ (markerClass ? markerClass : 'bookmark') +'" data-cfi="' + cfi + '"></span>';
					cfi = r.CFI.addContext(cfi);
					var $node = $(EPUBcfi.Interpreter.getTargetElement(cfi, document, _classBlacklist));
					if ($node.length) {
						if ($node[0].nodeType === 1) { // append to element
							$node.before($(marker));
						}
						if ($node[0].nodeType === 3) { // inject into the text node
							r.CFI.addOneWordToCFI(cfi, $node, marker);
						}
					}
					return $node;
				}
				catch (err) {
					// cannot insert CFI
					r.Notify.error($.extend({}, r.Event.ERR_CFI_INSERTION, {details: err, call: 'setCFI'}));
				}
			}
		},
		// <a name="addOneNodeToCFI"></a> Helper function that moves the CFI to the next node. This is required to avoid a bug in some browsers that displays the current CFI on the previous page.
		addOneNodeToCFI : function (c, el, marker) {
			var $nextNode = getNextNode(el);
			var cfi = c;
			if ($nextNode) {
				if ($nextNode[0].nodeType === 3 && $nextNode[0].length > 1) {
					try {
						cfi = EPUBcfi.Generator.generateCharacterOffsetCFIComponent($nextNode[0], 2, _classBlacklist);
						cfi = EPUBcfi.Generator.generateCompleteCFI(r.CFI.opfCFI, cfi);
					}
					catch (err) { }
				} else if ($nextNode[0].nodeType === 1) {
					$nextNode.before($(marker));
					return;
				}
				try {
					// Ignore errors and jump to the next node if something wrong happens when we inject the element into the CFI address
					EPUBcfi.Interpreter.injectElement(cfi, document, marker, _classBlacklist);
				}
				catch (e) {
					r.CFI.addOneNodeToCFI(cfi, $nextNode, marker);
				}
				return true;
			}
			return false;
		},
		// <a name="addOneWordToCFI"></a> Add one position to the cfi if we are in a text node to avoid the CFI to be set in the previous page.
		addOneWordToCFI : function (cfi, el, marker) {
			var pos = parseInt(cfi.split(':')[1].split(')')[0], 10);
			var words = el.text().substring(pos).split(/\s+/);
			// find next word position
			if (el.text().length > 1 && words.length && pos + words[0].length < el.text().length) {
				pos = pos + words[0].length;
				cfi = cfi.split(':')[0] + ':' + pos + ')';
				EPUBcfi.Interpreter.injectElement(cfi, document, marker, _classBlacklist);
			} else {
				// We must check if there are more nodes in the chapter.
				// If not, we add the marker one character after the cfi position, if possible.
				if(!r.CFI.addOneNodeToCFI(cfi, el, marker)){
					pos = pos + 1 < el.text().length ? pos + 1 : pos;
					cfi = cfi.split(':')[0] + ':' + pos + ')';
					EPUBcfi.Interpreter.injectElement(cfi, document, marker, _classBlacklist);
				}
			}
		},
		findCFIElement : function (value) {
			var elem = $('*[data-cfi="' + value + '"]');
			if (elem.length) {
				var tagName = elem[0].parentElement.tagName;
				/* TODO: *** REFACTORING CANDIDATE ***
				 ideally, we should not end up with bookmark markers in a span element within an image element
				 the main problem is that it's not possible locate the offset of this span
				 instead, we should be adding the marker to the img element attributes
				 */
				return tagName === 'IMG' ? r.returnPageElement(elem[0].parentElement) : r.returnPageElement(elem[0]);
			}
			return -1;
		},
		// <a name="goToCFI"></a>Find and load the page that contains the CFI's marker. If the marker does not exist, it will be injected in the chapter. If the CFI points to another chapter it will load that chapter first.
		goToCFI : function (cfi, fixed) {
			var _fixed = !!fixed;

			var _go = function(){
				if (r.CFI.findCFIElement(cfi) !== -1) {
					r.Navigation.loadPage(r.CFI.findCFIElement(cfi));
				} else {
					r.CFI.setCFI(cfi, 'cpr-marker');
					var p = r.CFI.findCFIElement(cfi);
					if (p !== -1) {
						r.Navigation.loadPage(p);
					} else {
						r.Navigation.loadPage(0);
					}
				}
        // Update reader position
        if(!_fixed){
          r.Navigation.update();
        }
			};

			var chapter = r.CFI.getChapterFromCFI(cfi);
			if(chapter !== -1){
				if(r.Navigation.getChapter() === chapter){
					_go();
					var defer = $.Deferred();
					defer.resolve();
					return defer.promise();
				} else {
					return r.loadChapter(chapter).then(_go);
				}
			} else {
				r.Notify.error($.extend({}, r.Event.ERR_INVALID_ARGUMENT, {details: 'Invalid CFI', value: cfi, call: 'goToCFI'}));
			}
		},
		// <a name="getChapterFromCFI"></a> This function will calculate what chapter the CFI is pointing at and return the its index (or -1 on failure).
		getChapterFromCFI: function(cfi){
			if($.type(cfi) === 'string'){
				var chapter = cfi.split('/');
				if(chapter.length >= 3 && $.isNumeric(chapter[2].slice(0, -1))){
					return parseInt(parseInt(chapter[2].slice(0, -1), 10) / 2 - 1, 10);
				}
			}
			return -1;
		},
		reset : function(){
			r.CFI.opfCFI = null;
			r.CFI.context = null;
		}
	};

	// <a name="getFirstNode"></a> Helper function that returns the first node in the current page displayed by the reader.
	var getFirstNode = function () {

		var range;
		var textNode;
		var offset;
		var container = r.$reader[0];
		var rect = container.getBoundingClientRect();

		/* standard */
		if (document.caretPositionFromPoint) {
			range = document.caretPositionFromPoint(rect.left - parseInt(r.$reader.css('left'), 10), rect.top);
			textNode = range.offsetNode;
			offset = range.offset;
			/* WebKit */
		} else if (document.caretRangeFromPoint) {
			range = document.caretRangeFromPoint(rect.left - parseInt(r.$reader.css('left'), 10), rect.top);
			textNode = range.startContainer;
			offset = range.startOffset;
		}

		/* Make sure textNode is part of the reader... */
		if (!r.$reader.has(textNode).length) {
			/* Reset offset since textNode changed. */
			offset = 0;
			/* TextNode is the first node that contains text, otherwise get the first child node. */
			textNode = container.childNodes.length > 0 && $(container.childNodes[0]).text().trim().length ? container.childNodes[0] : r.$reader.children().first()[0];
		}

		var findLeafNode = function (el) {
			var $el = $(el);
			/* Return a non-empty textNode or null */
			if (el === null || !el.childNodes || el.childNodes.length === 0) {
				return el;
			}
			/* Return the element if it only has one child and it is in the blacklist */
			if (el.childNodes.length === 1 && _hasClass($el.contents(), _classBlacklist)) { // TODO: Explore more options
				return el;
			}
			for(var i = 0, l = $el.contents().length; i < l; i++){
				var $child = $($el.contents()[i]);
				if(!_hasClass($child, _classBlacklist)){
					/* reset offset since textNode changed */
					offset = 0;
					return findLeafNode($child[0]);
				}
			}
			return el;
		};

		/* generate a preview from the current position */
		var preview = '',
			words = 0;

		// Calculates the length of a string and returns true if the length has the minimum number of words.
		// Returns true if text is a string and its length is > than the desired number of words, false otherwise.
		var hasDesiredLength = function (text) {
			if ($.type(text) !== 'string') {
				return false;
			}

			// Check number of words so far.
			var whitespaces = text.match(/\S+/g);
			words = whitespaces ? text.match(/\S+/g).length : 0;
			return words > 100;
		};

		var _hasClass = function (el, classNames) {
			var classes = '.' + classNames.join(', .');
			return el.filter(classes).length > 0;
		};

		// Loops through all adjacent nodes to generate the preview, starting with the first text node.
		var generatePreview = function () {
			var $currentNode = $(textNode);
			var text = offset ? '&#8230;' + $currentNode.text().substr(offset) : $currentNode.text();  // prepend ellipses to previews which don't begin at the start of a sentence

			generatePreview :
			while (!hasDesiredLength(text)) {
				var $next = getNextNode($currentNode);

				if ($next && $next.length) {
					$currentNode = $next;
					text += $currentNode.text().length && $currentNode[0].tagName !== 'SCRIPT' ? $currentNode.text().trim() + ' ' : '';
				} else {
					// No more content go get text from, break operation.
					break generatePreview;
				}
			}

			// Trim preview to 100 words.
			var trimmed = text.trim().match(/((\S+\s+){100})/);
			return trimmed && trimmed.length ? trimmed[0] : text;
		};

		// Get the top element that is the child of the reader container.
		var $currentNode = $(textNode);
		while ($currentNode.parent().length && !$currentNode.parent().is(r.$reader)) {
			$currentNode = $currentNode.parent();
		}

		// Check that the first tag has text, if not, add any image/table we can find.
		if (!$currentNode.text().trim().length) {
			var $img = $currentNode.find('img');
			var $table = $currentNode.find('table');
			var $svg = $currentNode.find('svg');

			if ($img.length) {
				preview = 'Image: ' + ($img.attr('alt') ? $img.attr('alt') : 'No description');
			} else if ($table.length) {
				preview = 'Table';
			} else if ($svg.length) {
				preview = 'Image: No description';
			}
		} else {
			preview = generatePreview();
		}

		return {
			textNode: findLeafNode(textNode),
			offset: offset,
			preview: preview
		};
	};

	var getNextNode = function ($el) {
		if ($el.length) {
			$el = $el.last();
			var nodes = $el.parent().contents().filter(':not(.'+_classBlacklist.join(',.')+')');
			var index = $.inArray($el[0], nodes);
			if (nodes[index + 1]) {
				var $next = $(nodes[index + 1]);
				// ignore empty textnodes
				if($next[0].nodeType === 3 && !$next.text().trim().length){
					return getNextNode($next);
				}
				return $next;
			} else if (!$el.parent().is(r.$reader)) {
				return getNextNode($el.parent());
			}
		}
		return null;
	};

	return r;
}(Reader || {}));