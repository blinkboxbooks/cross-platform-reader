'use strict';

/* jshint unused: true */
/* exported Reader */

var Reader = (function (r) {

	r.hideHeaderAndFooter = function(){
		r.$header.css({visibility: 'hidden'});
		r.$footer.css({visibility: 'hidden'});
	};

	r.showHeaderAndFooter = function(){
		r.$header.css({visibility: 'visible'});
		r.$footer.css({visibility: 'visible'});
	};

	return r;
}(Reader || {}));
