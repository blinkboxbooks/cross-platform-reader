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
		var doc = r.document.implementation.createHTMLDocument(''),
				styleElement = doc.createElement('style');

		styleElement.textContent = style;

		// the style will only be parsed once it is added to a document
		doc.body.appendChild(styleElement);

		return styleElement.sheet;
	}

  var cssWhitelist = {
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
    borderLeftWidth: 'border-left-width',
    borderRightWidth: 'border-right-width',
    borderTopWidth: 'border-top-width',
    borderBottomWidth: 'border-bottom-width',
    borderLeftStyle: 'border-left-style',
    borderRightStyle: 'border-right-style',
    borderTopStyle: 'border-top-style',
    borderBottomStyle: 'border-bottom-style',
    borderLeftColor: 'border-left-color',
    borderRightColor: 'border-right-color',
    borderTopColor: 'border-top-color',
    borderBottomColor: 'border-bottom-color',
    float: 'float'
  };

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

  r.applyPublisherStylesheet = function applyPublisherStylesheet(styleSheet){
    var j,k;
    var rules = _parseCSS(styleSheet).cssRules;
    var sheet = r.$stylesheet[0].sheet;
    for (j = 0, k = rules.length; j < k; j++) {
      var rule = rules[j];
      if (rule.style) {
        var cssText = '';
        for (var key in cssWhitelist) {
          if (rule.style[key]) {
            // convert px font-size to rem, todo: convert other sizes?
            if (key === 'fontSize') {
              cssText += cssWhitelist[key] + ':' + _parseFontSize(rule.style[key]) + 'rem';
            } else if (key.indexOf('margin') !== -1 || key.indexOf('padding') !== -1 || key === 'textIndent') {
              cssText += cssWhitelist[key] + ':' + _parseSize(rule.style[key]) + 'px';
            } else {
              cssText += cssWhitelist[key] + ':' + rule.style[key];
            }
            cssText += ';';
          }
        }
        if (cssText && rule.selectorText && rule.selectorText.indexOf('html') === -1 && rule.selectorText.indexOf('body') === -1) {
          sheet.insertRule(rule.selectorText + '{' + cssText + '}', sheet.cssRules.length);
        }
      }
    }
  };

	r.addPublisherStyles = function () {
    var stylesDeferred = $.Deferred();
    var cssLinkPromiseArray = [];

    // clear prev. publisher styles
    r.resetPublisherStyles();

		r.Navigation.getChapterHead().filter('link[href$=".css"]').each(function (index, link) {
      var promise = $.ajax({
        url: link.href
      }).then(function(stylesheet){
        r.applyPublisherStylesheet(stylesheet);
      }, function(e){
        r.Notify.error($.extend({}, r.Event.ERR_CSS_FILE_LOAD_FAILED, {details: link.href + ': ' + e.status + ' - ' + e.responseText, call: 'addPublisherStyles'}));
      });
			cssLinkPromiseArray.push(promise);
		});

    // We return a resolved promise, EVEN IF some styles failed to load.
    // This will ensure the reader continues normally.
		$.when.apply($, cssLinkPromiseArray).always(stylesDeferred.resolve);

		return stylesDeferred;

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
