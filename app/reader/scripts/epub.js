'use strict';

var Reader = (function (r, Epub) {
	r.Epub = new Epub();
	return r;
}(Reader || {}, (function(){

		var Epub = function(){
			this.context = null;
			this.opfCFI = null;
			this.document = null;
		}, prototype = Epub.prototype;

		// constants
		prototype.BLACKLIST = ['cpr-marker', 'cpr-subchapter-link'];

		// Initialisation function, called when the reader is initialised
		prototype.init = function(reader){
			// save a reference to the document
			this.document = reader.ownerDocument;

			// update the context
			var elCFI = EPUBcfi.Generator.generateElementCFIComponent(reader);
			elCFI = elCFI.substring(2); // remove the body cfi step, i.e. /4
			this.context = elCFI.split('[' + reader.id + ']')[0] + '[' + reader.id + ']';
		};

		// <a name="_clean"></a> This function will sanitize a cfi (removed dots from ID assertion)
		var _clean = function(cfi){
			return cfi.replace(/\[([\w-_])*\.([\w-_])*\]/gi, '');
		};

		// <a name="addContext"></a> This function will add the context into a CFI to generate a complete and valid CFI to be used with the current chapter.
		prototype.addContext = function(cfi){
			cfi = _clean(cfi);

			var contextSplit = cfi.split('!/4');

			return contextSplit[0] + '!/4' + this.context + contextSplit[1];
		};

		prototype.normalizeChapterPartCFI = function(cfi){
			return cfi;
		};

		// Adds the reader DOM context to a cfi
		prototype.getElementAt = function(cfi){

			cfi = this.addContext(cfi);
			cfi = this.normalizeChapterPartCFI(cfi, true);

			return $(EPUBcfi.Interpreter.getTargetElement(cfi, this.document, this.BLACKLIST));
		};

		return Epub;
	})()));