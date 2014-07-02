/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * touch.js: touch handling for the Reader
 */

/* exported Reader */

var Reader = (function (r) {
	'use strict';

	var _touchTimer, _touchData = {
		call: 'userClick',
		clientX: null,
		clientY: null
	};

	r.Touch = {
		start: function (e) {
			if ($(e.target).is(':not(a)')) {
				var touches = e.originalEvent.touches;
				_touchTimer = (new Date()).getTime();
				_touchData.clientX = touches ? touches[0].clientX : null;
				_touchData.clientY = touches ? touches[0].clientY : null;
			}
		},
		end: function (e) {
			// if the difference between touchstart and touchend is smalller than 300ms, send the callback, otherwise it's a long touch event
			if((new Date()).getTime() - _touchTimer < 300 && $(e.target).is(':not(a)')){
				r.Notify.event($.extend({}, Reader.Event.UNHANDLED_TOUCH_EVENT, _touchData));
			}
		},
		init: function (doc) {
			doc.on('touchstart touchend', function (event) {
				r.Touch[event.type.slice(5)].call(r.Touch, event);
			});
		}
	};

	return r;
}(Reader || {}));
