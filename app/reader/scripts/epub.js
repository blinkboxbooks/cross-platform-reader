'use strict';

// Helper methods:
//
// * [`updateContext`](#updateContext)
// * [`addContext`](#addContext)
// * [`removeContext`](#removeContext)
// * [`normalizeChapterPartCFI`](#normalizeChapterPartCFI)
// * [`addOneNodeToCFI`](#addOneNodeToCFI)

var Reader = (function (r, Epub) {
	r.Epub = new Epub();
	return r;
}(Reader || {}, (function(r, EPUBcfi){

		var Epub = function(){
			this.context = null;
			this.opfCFI = null;
			this.document = null;
		}, prototype = Epub.prototype;

		// Private array for blacklisted classes. The CFI library will ignore any DOM elements that have these classes.
		// [Read more](https://github.com/readium/EPUBCFI/blob/864527fbb2dd1aaafa034278393d44bba27230df/spec/javascripts/cfi_instruction_spec.js#L137)
		prototype.BLACKLIST = ['cpr-marker', 'cpr-highlight', 'cpr-subchapter-link'];
		prototype.BODY_CFI = '!/4';
		prototype.BODY_ID_RGX = /!\/4\[.*?\]/;

		// Initialisation function, called when the reader is initialised.
		prototype.init = function(reader){
			var elCFI = EPUBcfi.generateElementCFIComponent(reader);

			this.document = reader.ownerDocument;
			this.context = elCFI.substring(2); // remove the body cfi step, i.e. /4
		};

		// <a name="setUp"></a> Initialises the CFI variables, should be called whenever we load a new chapter
		// `chapter` the current chapter
		prototype.setUp = function(chapter, book){
			var chapterId = $(book.opfDoc.querySelector('spine')).children()[chapter].getAttribute('idref');

			// EPUBcfi library doesn't handle element namespaces, so we remove them:
			var opf = $(book.opf.replace(/<(\/)?\w+:(\w+)/g, '<$1$2')).filter('package')[0];

			this.opfCFI = EPUBcfi.generatePackageDocumentCFIComponent(chapterId, opf);
		};

		// <a name="addContext"></a> This function will add the context into a CFI to generate a complete and valid CFI to be used with the current chapter.
		prototype.addContext = function(cfi){
			// if the body has an id assertion, we need to strip it out CR-493
			cfi = cfi.replace(this.BODY_ID_RGX, this.BODY_CFI);
			var contextSplit = cfi.split(this.BODY_CFI);
			return contextSplit[0] + this.BODY_CFI + this.context + contextSplit[1];
		};

		// <a name="removeContext"></a> This function will remove the context from a CFI to generate a re-usable, generic, CFI.
		prototype.removeContext = function(cfi){
			return cfi.replace(this.context, '');
		};

		// <a name="normalizeChapterPartCFI"></a> This function normalizes CFI parts to account for chapters which have been split up into multiple parts.
		// todo this method is the only dependency on global Reader object, consider refactoring
		// move getPrevChapterPartMarker and stuff to Epub
		prototype.normalizeChapterPartCFI = function (cfi, remove) {
			// Check if the chapter has been split up into multiple parts:
			var prevChapterPartMarker = r.Navigation.getPrevChapterPartMarker();
			if (prevChapterPartMarker.length) {
				// Get the CFI path for the first non-removed element:
				var chapterMarkerCFI = EPUBcfi.generateElementCFIComponent(prevChapterPartMarker.next()[0], this.BLACKLIST),
					chapterMarkerCompleteCFI = EPUBcfi.generateCompleteCFI(this.opfCFI, chapterMarkerCFI),
					markerCFIParts = chapterMarkerCompleteCFI.split('/'),
					completeCFIParts = cfi.split('/');
				// Check if the elCFI path points to a location inside of the set of reduced chapter part elements:
				if (markerCFIParts.slice(0, -1).join('/') === completeCFIParts.slice(0, markerCFIParts.length - 1).join('/')) {
					var removedElements = r.Navigation.getCurrentChapterPart() * r.preferences.maxChapterElements.value,
					// The incorrect path value, as it doesn't account for the removed elements:
						elPathValue = parseInt(completeCFIParts[markerCFIParts.length - 1], 10),
					// Get the optional path suffix like any ids:
						pathSuffix = completeCFIParts[markerCFIParts.length - 1].slice(String(elPathValue).length);
					// Update the path value with the number of removed elements * 2 (CFI elements always have an even index):
					completeCFIParts[markerCFIParts.length - 1] = (elPathValue + (removedElements * 2 * (remove ? -1 : 1))) + pathSuffix;
					return completeCFIParts.join('/');
				}
			}
			return cfi;
		};

		// Gets the element targetted by a CFI
		prototype.getElementAt = function(cfi){

			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);

			return  $(EPUBcfi.getTargetElement(cfi, this.document, this.BLACKLIST));
		};

		prototype.getRangeTargetElements = function(cfi){
			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);

			var nodes = EPUBcfi.getRangeTargetElements(cfi, this.document, this.BLACKLIST);
			return $([nodes.startElement, nodes.endElement]);
		};

		// Generates the CFI that targets the given element
		prototype.generateCFI = function(el, offset){
			var cfi;

			if (el.nodeType === 3) {
				cfi = EPUBcfi.generateCharacterOffsetCFIComponent(el, offset || 0, this.BLACKLIST);
			} else {
				cfi = EPUBcfi.generateElementCFIComponent(el, this.BLACKLIST);
			}

			cfi = EPUBcfi.generateCompleteCFI(this.opfCFI, cfi);

			cfi = this.normalizeChapterPartCFI(cfi);
			cfi = this.removeContext(cfi);

			return cfi;
		};

		// Generate CFI range for a DOM range element
		prototype.generateRangeCFI = function(range){
			var cfi;

			cfi = EPUBcfi.generateRangeComponent(range.startContainer, range.startOffset, range.endContainer, range.endOffset, this.BLACKLIST);
			cfi = EPUBcfi.generateCompleteCFI(this.opfCFI, cfi);
			cfi = this.normalizeChapterPartCFI(cfi);
			cfi = this.removeContext(cfi);

			return cfi;
		};

		// Injects a marker in the specified position
		prototype.injectMarker = function(cfi, marker){
			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);
			EPUBcfi.injectElement(cfi, r.document, marker, this.BLACKLIST);
		};

		// Injects a marker in the specified range
		prototype.injectRangeMarker = function(cfi, marker){
			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);
			EPUBcfi.injectRangeElements(cfi, r.document, marker, marker, this.BLACKLIST);
		};

		prototype.reset = function(){
			this.opfCFI = null;
			this.context = null;
		};

		return Epub;
	})(Reader || {}, EPUBcfi)));
