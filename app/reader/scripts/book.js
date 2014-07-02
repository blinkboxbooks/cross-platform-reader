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

	r.Book = {
		spine: [],
		toc: [],
		title: '',
		content_path_prefix: '',
		$opf: null,
		// <a name="load"></a> Loads a book's information.
		load: function(args){
			r.Book.spine = args.spine || [];
			r.Book.toc = args.toc || [];
			r.Book.title = args.title || '';
			r.Book.content_path_prefix = args.content_path_prefix || '';
			r.Book.$opf = $(args.opf).filter('package');
		},
		// <a name="reset"></a> Resets the module to default values.
		reset: function(){
			r.Book.spine = [];
			r.Book.toc = [];
			r.Book.title = '';
			r.Book.content_path_prefix = '';
			r.Book.$opf = null;
		},

		// This function returns a stringified version of the table of contents. It is mainly used on mobile readers.
		// <a name="getTOC"></a> Returns the TOC as a JSON string.
		getTOC: function(){
			return JSON.stringify(r.Book.toc);
		},
		// <a name="getSPINE"></a> Returns the spine as a JSON string.
		getSPINE: function(){
			return JSON.stringify(r.Book.spine);
		}
	};

	return r;
}(Reader || {}));
