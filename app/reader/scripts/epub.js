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
		prototype.DOT_REGEX = /\[([\w-_])*\.([\w-_])*\]/gi;
		prototype.BODY_CFI = '!/4';

		// Initialisation function, called when the reader is initialised.
		prototype.init = function(reader){
			this.document = reader.ownerDocument;

			var elCFI = EPUBcfi.Generator.generateElementCFIComponent(reader);
			this.context = elCFI.substring(2); // remove the body cfi step, i.e. /4
		};

		// <a name="_clean"></a> This function will sanitize a cfi (removed dots from ID assertion)
		prototype.cleanCFI = function(cfi){
			return cfi.replace(this.DOT_REGEX, '');
		};

		// <a name="addContext"></a> This function will add the context into a CFI to generate a complete and valid CFI to be used with the current chapter.
		prototype.addContext = function(cfi){
			cfi = this.cleanCFI(cfi);

			var contextSplit = cfi.split(this.BODY_CFI);

			return contextSplit[0] + this.BODY_CFI + this.context + contextSplit[1];
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