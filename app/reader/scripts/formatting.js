'use strict';

/* jshint unused: true */
/* exported Reader */

// The **Formatting** options available to the user.
//
// * [`setMaxParallelRequests`](#setMaxParallelRequests)
// * [`setMaxChapterElements`](#setMaxChapterElements)
// * [`setPreloadRange`](#setPreloadRange)
// * [`setTransitionDuration`](#setTransitionDuration)
// * [`setTransitionTimingFunction`](#setTransitionTimingFunction)
// * [`setLineHeight`](#setLineHeight)
// * [`increaseLineHeight`](#increaseLineHeight)
// * [`decreaseLineHeight`](#decreaseLineHeight)
// * [`setFontSize`](#setFontSize)
// * [`setTextAlign`](#setTextAlign)
// * [`setFontFamily`](#setFontFamily)
// * [`increaseFontSize`](#increaseFontSize)
// * [`decreaseFontSize`](#decreaseFontSize)
// * [`setMargin`](#setMargin)
// * [`setTheme`](#setTheme)

var Reader = (function (r) {
	// <a name="enablePublisherStyles"></a>
	r.enablePublisherStyles = function(){
		return r.setPreferences({publisherStyles: true});
	};

	// <a name="disablePublisherStyles"></a>
	r.disablePublisherStyles = function(){
		return r.setPreferences({publisherStyles: false});
	};

	// <a name="setImageWordCount"></a> Set image word count.
	r.setImageWordCount = function(value){
		return r.setPreferences({imageWordCount: value});
	};

	// <a name="setMaxParallelRequests"></a> Set max parallel requests (within bounds).
	r.setMaxParallelRequests = function(value){
		return r.setPreferences({maxParallelRequests: value});
	};

	// <a name="setMaxChapterElements"></a> Set max chapter elements (within bounds).
	r.setMaxChapterElements = function(value){
		return r.setPreferences({maxChapterElements: value});
	};

	// <a name="setPreloadRange"></a> Set preload range (within bounds).
	r.setPreloadRange = function(value){
		return r.setPreferences({preloadRange: value});
	};

	// <a name="setTransitionDuration"></a> Set transition duration (within bounds).
	r.setTransitionDuration = function(value){
		return r.setPreferences({transitionDuration: value});
	};

	// <a name="setTransitionDuration"></a> Set transition duration (within bounds).
	r.setTransitionTimingFunction = function(value){
		return r.setPreferences({transitionTimingFunction: value});
	};

	// <a name="setLineHeight"></a>Set line size, if within bounds.
	// If current line height is larger than the minimum line height, decrease it by one unit.
	// Returns the current value of the line height
	r.setLineHeight = function(value){
		return r.setPreferences({lineHeight: value});
	};

	// <a name="increaseLineHeight"></a>Increase line size, if possible
	// If current line height is smaller than the maximum line height, increase it by one unit.
	// ReturnS the current value of the line height.
	r.increaseLineHeight = function(){
		return r.setPreferences({lineHeight: r.preferences.lineHeight.value + r.preferences.lineHeight.unit});
	};

	// <a name="decreaseLineHeight"></a>Decrease line size, if possible.
	// If current line height is larger than the minimum line height, decrease it by one unit.
	// Returns the current value of the line height.
	r.decreaseLineHeight = function(){
		return r.setPreferences({lineHeight: r.preferences.lineHeight.value - r.preferences.lineHeight.unit});
	};

	// <a name="setFontSize"></a>Set font size, if within bounds.
	// If current font size is larger than the minimum font, decrease it by one unit.
	// Returns the current value of the line height.
	r.setFontSize = function(value){
		return r.setPreferences({fontSize: value});
	};

	// <a name="setTextAlign"></a>Set the text alignment, acceptable values are only left or justified.
	// If the argument is different than the acceptable values, defaults to left.
	// Return the current value of the text align.
	r.setTextAlign = function(value){
		return r.setPreferences({textAlign: value});
	};

	// <a name="setFontFamily"></a>Set font family
	// Return the current font-family of the reader.
	r.setFontFamily = function(value){
		return r.setPreferences({fontFamily: value});
	};

	// <a name="increaseFontSize"></a>Increase font size, if possible.
	// If current font size is smaller than the maximum font size, increase it by one unit.
	// Returns the current value of the font size.
	r.increaseFontSize = function(){
		return r.setPreferences({fontSize: r.preferences.fontSize.value + r.preferences.fontSize.unit});
	};

	// <a name="decreaseFontSize"></a>Decrease font size, if possible
	// If current font size is larger than the minimum font size, decrease it by one unit
	// Returns the current value of the font size
	r.decreaseFontSize = function(){
		return r.setPreferences({fontSize: r.preferences.fontSize.value - r.preferences.fontSize.unit});
	};

	// <a name="setMargin"></a>Setter for the reader's margin property
	//
	// * `args` an array of 4 integers representing the top, right, bottom, left margins. Can also accept keyword params such as 'min', 'max' and 'medium'.
	// Returns the updated margins.
	r.setMargin = function(args){
		return r.setPreferences({margin:args});
	};

	// <a name="setTheme"></a>Setter for the reader's theme
	//
	// * `args` an object containing the color and background of the theme. Can also accept keyword params such as 'light', 'dark' and 'sepia'
	// Returns the current theme
	r.setTheme = function(args){
		return r.setPreferences({theme:args});
	};

	// <a name="setPreferences"></a>Set all style related user preferences
	//
	// * `args` an Object containing valid preference values.

	r.setPreferences = function (args) {
		if (typeof args !== 'object') {
			return r.preferences;
		}
		var updated = false,
				pref,
				value,
				prop;

		function refresh() {
			r.refreshLayout();
		}

		for (prop in args) {
			if (args.hasOwnProperty(prop)) {
				pref = r.preferences[prop];
				value = args[prop];
				switch (prop) {
					case 'lineHeight':
					case 'fontSize':
					case 'textAlign':
					case 'fontFamily':
					case 'theme':
						value = pref.clear(value);
						if (pref.value !== value) {
							pref.value = value;
							updated = true;
						}
						break;
					case 'transitionTimingFunction':
						pref.value = value;
						r.$reader.css('transition-timing-function', value);
						break;
					case 'publisherStyles':
						value = Boolean(value);
						if (value !== pref.value) {
							pref.value = value;
							if (value) {
								r.addPublisherStyles().then(refresh);
							} else {
								r.resetPublisherStyles();
								r.refreshLayout();
							}
						}
						break;
					case 'margin':
						value = pref.clear(value);
						if (value !== pref.value) {
							pref.value = value;
							r.Layout.resizeContainer();
							updated = true;
						}
						break;
					default:
						pref.value = pref.clear(value);
				}
			}
		}

		if (updated) {
			r.preferences.applyAll();
			// Update variables that are dependant on styles.
			r.refreshLayout();
		}
		return r.preferences;
	};

	return r;
}(Reader || {}));
