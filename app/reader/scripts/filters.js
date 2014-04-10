'use strict';

var Reader = (function (r) {

	var filters = new FilterJS();

	filters.addFilter('beforeChapterDisplay', function(content){
		return content;
	});

	filters.addFilter('afterChapterDisplay', function(content){
		return content;
	});

	filters.addFilter('init', function(){

	});

	filters.addFilter('headerContent', function(content){
		return content;
	});

	filters.addFilter('footerContent', function(content){
		return content;
	});

	r.Filters = filters;

	return r;
}(Reader || {}));
