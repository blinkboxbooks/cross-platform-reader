'use strict';

var Reader = (function (r) {

	var filters = new FilterJS(), HOOKS = {
		BEFORE_CHAPTER_DISPLAY: 'beforeChapterDisplay',
		AFTER_CHAPTER_DISPLAY: 'afterChapterDisplay',
		INIT: 'init',
		HEADER_CONTENT: 'headerContent',
		FOOTER_CONTENT: 'footerContent'
	};

	// add data attributes to anchors
	filters.addFilter(HOOKS.BEFORE_CHAPTER_DISPLAY, function($content){

		$('a[href]', $content).each(function(i, link){
			var $link = $(link);
			var valid = /^(ftp|http|https):\/\/[^ "]+$/.test($link.attr('href'));
			if (!valid) {
				// ### Internal link.
				$link.attr('data-link-type', 'internal');
				/* elements[idx].attributes[0].nodeValue = 'http://localhost:8888/books/9780718159467/OPS/xhtml/' + elements[idx].attributes[0].nodeValue;*/
			} else {
				// ### External link.
				// External links attribute 'target' set to '_blank' for open the new link in another window / tab of the browser.
				$link.attr('data-link-type', 'external').attr('target', '_blank');
			}
		});

		return $content;
	});

	filters.addFilter(HOOKS.AFTER_CHAPTER_DISPLAY, function(content){
		return content;
	});

	filters.addFilter(HOOKS.INIT, function(){

	});

	filters.addFilter(HOOKS.HEADER_CONTENT, function(content){
		return content;
	});

	filters.addFilter(HOOKS.FOOTER_CONTENT, function(content){
		return content;
	});

	r.Filters = $.extend({HOOKS: HOOKS}, filters);

	return r;
}(Reader || {}));
