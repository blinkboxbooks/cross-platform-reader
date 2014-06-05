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

	r.setReaderOpacity = function (opacity, duration) {
		var defer = $.Deferred();
		if (duration) {
			r.$reader.one(r.support.transitionend, defer.resolve);
		} else {
			defer.resolve();
		}
		r.$reader.css({
			'transition-duration': (duration || 0) + 's',
			opacity: opacity
		});
		return defer.promise();
	};

	return r;
}(Reader || {}));
