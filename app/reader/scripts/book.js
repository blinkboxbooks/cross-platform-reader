'use strict';

// Sub module for managing a book's meta-information (url, title, spine, isbn)

var Reader = (function (r) {

	r.Book = {
		spine: [],
		toc: [],
		load: function(args){
			r.Book.spine = args.spine || [];
			r.Book.toc = args.toc || [];
		}
	};

	return r;
}(Reader || {}));
