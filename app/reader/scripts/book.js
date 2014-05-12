'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)

var Reader = (function (r) {

	r.Book = {
		spine: [],
		toc: [],
		title: '',
		load: function(args){
			r.Book.spine = args.spine || [];
			r.Book.toc = args.toc || [];
			r.Book.title = args.title || '';
		},
		reset: function(){
			r.Book.spine = [];
			r.Book.toc = [];
			r.Book.title = '';
		}
	};

	return r;
}(Reader || {}));
