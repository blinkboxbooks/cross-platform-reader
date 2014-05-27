'use strict';

var Reader = (function (r) {

	r.Layout = {
		Container: {
			width: 0,
			height: 0
		},
		Reader: {
			width: 0,
			height: 0,
			columns: 1,
			padding: 0
		},
		resizeContainer: function(dimensions){
			dimensions = $.extend({
				width: r.Layout.Container.width,
				height: r.Layout.Container.height,
				columns: r.Layout.Reader.columns,
				padding: r.Layout.Reader.padding
			}, dimensions);

			// Save new values.
			r.Layout.Container.width = Math.floor(dimensions.width);
			r.Layout.Container.height = Math.floor(dimensions.height);
			r.Layout.Reader.width = r.Layout.Container.width - Math.floor(r.preferences.margin.value[1]*r.Layout.Container.width/100) - Math.floor(r.preferences.margin.value[3]*r.Layout.Container.width/100);
			r.Layout.Reader.height = r.Layout.Container.height - Math.floor(r.preferences.margin.value[0]*r.Layout.Container.height/100) - Math.floor(r.preferences.margin.value[2]*r.Layout.Container.height/100);
			r.Layout.Reader.columns = dimensions.columns;
			r.Layout.Reader.padding = dimensions.padding;

			// avoid rounding errors, adjust the width of the reader to contain the columns + padding
			var columnWidth = Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2),
					// columnAdjust adjusts the Reader padding depending on the column number and gap:
					columnAdjust = dimensions.columns > 1 ? 0 : Math.floor(r.Layout.Reader.padding / 4);
			r.Layout.Reader.width = columnWidth * r.Layout.Reader.columns + (r.Layout.Reader.columns - 1) * r.Layout.Reader.padding;

			// Apply new size
			r.$iframe.css({
				width: r.Layout.Container.width + 'px',
				height: r.Layout.Container.height + 'px'
			});

			r.$reader.css({
				width: r.Layout.Reader.width + 'px',
				height: r.Layout.Reader.height + 'px',
				'column-width': columnWidth + 'px',
				'column-gap': r.Layout.Reader.padding + 'px',
				'column-fill': 'auto'
			});

			r.$container.css({
				width: r.Layout.Reader.width + 'px',
				height: r.Layout.Reader.height + 'px',
				'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
				'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px',
				// This centers the column on single column view:
				'padding-left': columnAdjust + 'px'
			});

			r.$header.css({
				width: r.Layout.Reader.width + 'px',
				'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
				'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px',
				'height': Math.floor(r.preferences.margin.value[0] * r.Layout.Container.height/100) + 'px',
				'line-height': Math.floor(r.preferences.margin.value[0] * r.Layout.Container.height/100) + 'px',
				'padding-left': columnAdjust + 'px'
			});

			r.$footer.css({
				width: r.Layout.Reader.width + 'px',
				'margin-left': Math.floor(r.preferences.margin.value[3] * r.Layout.Container.width/100) + 'px',
				'margin-right': Math.floor(r.preferences.margin.value[1] * r.Layout.Container.width/100) + 'px',
				'height': Math.floor(r.preferences.margin.value[2] * r.Layout.Container.height/100) + 'px',
				'line-height': Math.floor(r.preferences.margin.value[2] * r.Layout.Container.height/100) + 'px',
				'padding-left': columnAdjust + 'px'
			});

			_resizeImages();
			// Update navigation variables
			r.refreshLayout();
		}
	};

	// Modifies some parameter related to the dimensions of the images and svg elements.
	var _resizeImages = function(){
		// Get SVG elements
		$('svg', r.$reader).each(function(index,node){
			// Calculate 95% of the width and height of the container.
			var width = Math.floor(0.95 * (r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2));
			var height = Math.floor(0.95 * r.Layout.Reader.height);
			// Modify SVG params when the dimensions are higher than the view space or they are set in % as this unit is not working in IE.
			if ((node.getAttribute('width') && (node.getAttribute('width') > r.Layout.Reader.width || node.getAttribute('width').indexOf('%') !== -1)) || !node.getAttribute('width')) {
				node.setAttribute('width', width);
			}
			if ((node.getAttribute('height') && (node.getAttribute('height') > r.Layout.Reader.height || node.getAttribute('height').indexOf('%') !== -1)) || !node.getAttribute('height')) {
				node.setAttribute('height', height);
			}
			// Modify the viewBox attribute if their dimensions are higher than the container.
			node.viewBox.baseVal.width = (node.viewBox.baseVal.width > r.Layout.Reader.width) ? width : node.viewBox.baseVal.width;
			node.viewBox.baseVal.height = (node.viewBox.baseVal.height > r.Layout.Reader.height) ? height : node.viewBox.baseVal.height;
			node.setAttribute('transform', 'scale(1)');
			// Modify children elements (images, rectangles, circles..) dimensions if they are higher than the container.
			$(this).children().map(function(){
				if ($(this).attr('width') > r.Layout.Reader.width) {
					$(this).attr('width', width);
				}
				if ($(this).attr('height') > r.Layout.Reader.height) {
					$(this).attr('height', height);
				}
			});
			if ($(this).find('path')) {
				// Fix path elements dimensions.
				var pathMaxWidth = 0;
				var pathMaxHeight = 0;
				// Take the highest width and height.
				$(this).find('path').each(function(){
					var pathWidth = $(this)[0].getBoundingClientRect().width;
					var pathHeight = $(this)[0].getBoundingClientRect().height;
					pathMaxWidth = (pathWidth > pathMaxWidth) ? pathWidth : pathMaxWidth;
					pathMaxHeight = (pathHeight > pathMaxHeight) ? pathHeight : pathMaxHeight;
				});
				if (pathMaxWidth > width || pathMaxHeight > height) {
					// Scale the elements to the correct proportion.
					var scale = Math.min(Math.floor((width/pathMaxWidth)*10)/10,Math.floor((height/pathMaxHeight)*10)/10);
					$(this).find('path').each(function(){
						$(this)[0].setAttribute('transform', 'scale(' + scale + ')');
					});
				}
			}
			// Remove SVG empty elements in some Webkit browsers is showing the content outside the SVG (Chrome).
			if ($(this).children().length === 0) {
				$(this).remove();
			}
		});
	};

	return r;
}(Reader || {}));
