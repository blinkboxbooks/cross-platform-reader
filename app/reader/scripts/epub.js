'use strict';

var Reader = (function (r, Epub) {
	r.Epub = new Epub();
	return r;
}(Reader || {}, (function(EPUBcfi){

		var Epub = function(){
			this.context = null;
			this.opfCFI = null;
			this.document = null;
		}, prototype = Epub.prototype;

		// constants
		prototype.BLACKLIST = ['cpr-marker', 'cpr-subchapter-link'];
		prototype.DOT_REGEX = /\[([\w-_])*\.([\w-_])*\]/gi;
		prototype.BODY_CFI = '!/4';

		// Initialisation function, called when the reader is initialised.
		prototype.init = function(reader){
			var elCFI = EPUBcfi.Generator.generateElementCFIComponent(reader);

			this.document = reader.ownerDocument;
			this.context = elCFI.substring(2); // remove the body cfi step, i.e. /4
		};

		// <a name="setUp"></a> Initialises the CFI variables, should be called whenever we load a new chapter
		// `chapter` the current chapter
		prototype.setUp = function(chapter, $opf){
			var chapterId = $opf.find('spine').children()[chapter].getAttribute('idref');
			this.opfCFI = EPUBcfi.Generator.generatePackageDocumentCFIComponent(chapterId, $opf[0]);
		};

		// <a name="_clean"></a> This function will sanitize a cfi (removed dots from ID assertion)
		prototype.cleanCFI = function(cfi){
			return cfi.replace(this.DOT_REGEX, '');
		};

		// <a name="addContext"></a> This function will add the context into a CFI to generate a complete and valid CFI to be used with the current chapter.
		prototype.addContext = function(cfi){
			var contextSplit = cfi.split(this.BODY_CFI);
			return contextSplit[0] + this.BODY_CFI + this.context + contextSplit[1];
		};

		// <a name="removeContext"></a> This function will remove the context from a CFI to generate a re-usable, generic, CFI.
		prototype.removeContext = function(cfi){
			return cfi.replace(this.context, '');
		};

		prototype.normalizeChapterPartCFI = function(cfi){
			return cfi;
		};

		// Gets the element targetted by a CFI
		prototype.getElementAt = function(cfi){

			cfi = this.cleanCFI(cfi);
			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);

			return $(EPUBcfi.Interpreter.getTargetElement(cfi, this.document, this.BLACKLIST));
		};

		// Generates the CFI that targets the given element
		prototype.generateCFI = function(el, offset){
			var cfi;

			if (el.nodeType === 3) {
				cfi = EPUBcfi.Generator.generateCharacterOffsetCFIComponent(el, offset || 0, this.BLACKLIST);
			} else {
				cfi = EPUBcfi.Generator.generateElementCFIComponent(el, this.BLACKLIST);
			}

			cfi = EPUBcfi.Generator.generateCompleteCFI(this.opfCFI, cfi);

			cfi = this.cleanCFI(cfi);
			cfi = this.normalizeChapterPartCFI(cfi);
			cfi = this.removeContext(cfi);

			return cfi;
		};

		return Epub;
	})(window.EPUBcfi)));