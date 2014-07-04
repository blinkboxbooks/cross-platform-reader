'use strict';

/* jshint unused: true */
/* exported Reader */

var Reader = (function (r) {

	// based on http://websemantics.co.uk/resources/font_size_conversion_chart/
	var _fontSizes = {
		'x-small': 0.555, // 10px
		'small': 0.7222, // 13px
		'medium': 0.89, // 16 px
		'large': 1, // 18 px
		'x-large': 1.333, // 24px
		'xx-large': 1.777, // 32px
		'smaller': 'smaller',
		'larger': 'larger'
	};

	/*
	 * Will convert a font size css declaration to rems
	 * */
	function _parseFontSize(size) {
		if(size.indexOf('px') !== -1){
			return parseFloat(size) / 18;
		} else if(size.indexOf('small') !== -1 || size.indexOf('large') !== -1){
			return _fontSizes[size] || '';
		} else if(size.indexOf('em') !== -1){
			return parseFloat(size);
		} else {
			// if font-size unit is not recognised, return default
			return 1;
		}
	}

	// Will set a maximum size of 0.5 of a column width for the given size
	// result is always in px
	function _parseSize(size) {
		var columnWidth = Math.floor(r.Layout.Reader.width / r.Layout.Reader.columns - r.Layout.Reader.padding / 2),
			value = 0;

		if(size.indexOf('px') !== -1){
			value = Math.min(parseFloat(size), columnWidth / 2);
		} else if(size.indexOf('em') !== -1){
			value = Math.min(parseFloat(size) * 18, columnWidth / 2);
		} else if(size.indexOf('%') !== -1){
			// do not allow relative margins higher than 100
			value = Math.min(parseFloat(size), 100) * columnWidth / 100;
		}

		// if size unit is not recognised, return 0
		// we cannot allow negative margins, paddings and text indents.
		// Some books rely on the body having a left margin to display property, but the body is used for layout and cannot have any margins on it http://jira.blinkbox.local/jira/browse/CR-331
		return Math.max(value, 0);
	}

	function _parseCSS(style) {
		var doc = document.implementation.createHTMLDocument(''),
			styleElement = document.createElement('style');

		styleElement.textContent = style;

		// the style will only be parsed once it is added to a document
		doc.body.appendChild(styleElement);

		return styleElement.sheet;
	}

	r.resetPublisherStyles = function () {
		if (r.$stylesheet) {
			// Reset the existing publisher styles:
			r.$stylesheet = $('<style></style>').replaceAll(r.$stylesheet);
		} else {
			// Append a placeholder for the publisher styles:
			r.$stylesheet = $('<style></style>').appendTo(r.$head);
		}
		return r.$stylesheet;
	};

	r.addPublisherStyles = function () {
		var links = [];
		r.Navigation.getChapterHead().filter('link[href$=".css"]').each(function (index, link) {
			links.push($.ajax({
				url: link.href
			}));
		});
		return $.when.apply($, links).then(function () {
			var i, l, j, k;

			// remove previous styles
			r.resetPublisherStyles();

			// append whitelisted properties
			var sheet = r.$stylesheet[0].sheet,
				whitelist = {
					textAlign: 'text-align',
					fontStyle: 'font-style',
					fontWeight: 'font-weight',
					fontSize: 'font-size',
					textDecoration: 'text-decoration',
					textIndent: 'text-indent',
					textTransform: 'text-transform',
					marginLeft: 'margin-left',
					marginTop: 'margin-top',
					marginRight: 'margin-right',
					marginBottom: 'margin-bottom',
					paddingLeft: 'padding-left',
					paddingTop: 'padding-top',
					paddingRight: 'padding-right',
					paddingBottom: 'padding-bottom',
					display: 'display',
					border: 'border',
					float: 'float'
				};
			for (i = 0, l = links.length; i < l; i++) {
				var rules = _parseCSS(arguments[i]).cssRules;
				for (j = 0, k = rules.length; j < k; j++) {
					var rule = rules[j];
					if (rule.style) {
						var cssText = '';
						for (var key in whitelist) {
							if (rule.style[key]) {
								// convert px font-size to rem, todo: convert other sizes?
								if (key === 'fontSize') {
									cssText += ';' + whitelist[key] + ':' + _parseFontSize(rule.style[key]) + 'rem';
								} else if (key.indexOf('margin') !== -1 || key.indexOf('padding') !== -1 || key.indexOf('text-indent')) {
									cssText += ';' + whitelist[key] + ':' + _parseSize(rule.style[key]) + 'px';
								} else {
									cssText += ';' + whitelist[key] + ':' + rule.style[key];
								}
							}
						}
						if (cssText && rule.selectorText && rule.selectorText.indexOf('html') === -1 && rule.selectorText.indexOf('body') === -1) {
							sheet.insertRule(rule.selectorText + '{' + cssText + '}', sheet.cssRules.length);
						}
					}
				}
			}
		});
	};

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
