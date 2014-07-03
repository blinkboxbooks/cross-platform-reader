/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * touch.js: touch handling for the Reader
 *
 * Touch movement code based on
 * https://github.com/blueimp/Gallery
 */

/* exported Reader */

var Reader = (function (r) {
	'use strict';

	var touchStartData,
			touchDelta,
			isVerticalScroll,
			leftPosition;

	function resetPosition() {
		// Move back to the original position:
		r.setReaderLeftPosition(leftPosition, r.preferences.transitionDuration.value);
	}

	r.Touch = {
		reset: function () {
			touchStartData = undefined;
			touchDelta = undefined;
			isVerticalScroll = undefined;
		},
		start: function (e) {
			var touches = e.originalEvent.touches;
			touchStartData = {
				call: 'userClick',
				clientX: touches ? touches[0].clientX : null,
				clientY: touches ? touches[0].clientY : null,
				time: Date.now()
			};
			leftPosition = r.getReaderLeftPosition();
		},
		move: function (e) {
			var touches = e.originalEvent.touches[0],
					scale = e.originalEvent.scale;
			// Ensure this is a one touch swipe and not, e.g. a pinch:
			if (touches.length > 1 || scale && scale !== 1) {
				return;
			}
			touchDelta = {
				x: touches.clientX - touchStartData.clientX,
				y: touches.clientY - touchStartData.clientY
			};
			// Detect if this is a vertical scroll movement (run only once per touch):
			if (isVerticalScroll === undefined) {
				isVerticalScroll = Math.abs(touchDelta.x) < Math.abs(touchDelta.y);
			}
			if (isVerticalScroll) {
				return;
			}
			// Always prevent horizontal scroll:
			e.preventDefault();
			r.setReaderLeftPosition(leftPosition + touchDelta.x);
		},
		end: function (e) {
			var isShortDuration = Date.now() - touchStartData.time < 250,
					promise;
			// Check if the swipe is a short flick or a swipe across more than half of the Reader:
			if (touchDelta && (isShortDuration && Math.abs(touchDelta.x) > 20 ||
					Math.abs(touchDelta.x) > r.Layout.Reader.width / 2)) {
				// Move the Reader page in the swipe direction:
				if (touchDelta.x < 0) {
					promise = r.Navigation.next();
				} else {
					promise = r.Navigation.prev();
				}
				// If we are already at the start or end of the book, reset to the last position:
				promise.fail(resetPosition);
			} else {
				if (touchDelta && !isVerticalScroll) {
					resetPosition();
				}
				if (isShortDuration && !$(e.target).closest('a').length) {
					r.Notify.event($.extend({}, r.Event.UNHANDLED_TOUCH_EVENT, touchStartData));
				}
			}
			this.reset();
		},
		cancel: function (e) {
			this.end(e);
		},
		init: function (doc) {
			doc.on('touchstart touchmove touchend touchcancel', function (event) {
				r.Touch[event.type.slice(5)].call(r.Touch, event);
			});
		}
	};

	return r;
}(Reader || {}));
