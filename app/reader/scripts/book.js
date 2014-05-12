'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)

var Reader = (function (r) {

	r.Book = {
		spine: [],
		toc: [],
		title: '',
		content_path_prefix: '',
		$opf: null,
		load: function(args){
			r.Book.spine = args.spine || [];
			r.Book.toc = args.toc || [];
			r.Book.title = args.title || '';
			r.Book.content_path_prefix = args.content_path_prefix || '';
			r.Book.$opf = $(args.opf).filter('package');
		},
		reset: function(){
			r.Book.spine = [];
			r.Book.toc = [];
			r.Book.title = '';
			r.Book.content_path_prefix = '';
			r.Book.$opf = null;
		},

		// This function returns a stringified version of the table of contents. It is mainly used on mobile readers.
		getTOC: function(){
			return JSON.stringify(r.Book.toc);
		},
		getSPINE: function(){
			return JSON.stringify(r.Book.spine);
		}
	};

	return r;
}(Reader || {}));
