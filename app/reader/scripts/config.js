/**
 * ReaderJS v1.0.0
 * (c) 2013 BlinkboxBooks
 * config.js: contains global variables
 */

/* jshint unused: true */
/* exported Reader */
/* globals $ */

var Reader = (function (r) {
	'use strict';

	// Constants
	r.DOCROOT = '';
	r.INF = 'META-INF/book-info.json';

	// Initial settings.
	r.$iframe = null;
	r.$wrap = null;
	r.$head = null;
	r.$container = null;
	r.$reader = null;
	r.$header = null;
	r.$footer = null;
	r.$stylesheet = null;

	// Indicates if the Reader has been called from a mobile app.
	r.mobile = false;
	// DOM object
	r.listener = null;
	// User-set preferences that are related to the display options.
	var i, rule;
	r.preferences = {
		// Preload range for lazy image loading (indicates the number of pages around the current page on which images are preloaded):
		preloadRange: {
			min: 1,
			max: 10,
			value: 2,
			clear: function (value) {
				value = Number(value) || 0;
				if (value > r.preferences.preloadRange.max) {
					return r.preferences.preloadRange.max;
				}
				if (value < r.preferences.preloadRange.min) {
					return r.preferences.preloadRange.min;
				}
				return value;
			}
		},
		lineHeight : {
			rules: [],
			min: 1.1,
			max: 20,
			unit: 0.1,
			value: 1.6,
			applyRules: function(){
				for(i = 0; i< r.preferences.lineHeight.rules.length; i++){
					rule = r.preferences.lineHeight.rules[i];
					rule.rule[rule.property] = r.preferences.lineHeight.value + 'em';
				}
			}
		},
		fontSize : {
			rules: [],
			min: 0.5,
			max: 15,
			unit: 0.1,
			value: 1.125,
			applyRules: function(){
				for(i = 0; i< r.preferences.fontSize.rules.length; i++){
					rule = r.preferences.fontSize.rules[i];
					rule.rule[rule.property] = (r.preferences.fontSize.value * 18) + 'px';
				}
			}
		},
		fontFamily : {
			rules: [],
			value: '',
			applyRules: function(){
				for(i = 0; i< r.preferences.fontFamily.rules.length; i++){
					rule = r.preferences.fontFamily.rules[i];
					rule.rule[rule.property] = r.preferences.fontFamily.value;
				}
			}
		},
		margin : { // top, right, bottom, left
			min : [9.8, 4, 6.5, 4],
			max: [9.8, 17.75, 6.5, 17.75],
			medium: [9.8, 11, 6.5, 11],
			value: [9.8, 11, 6.5, 11],
			// Helper function that sets a valid margin from an argument.
			clear: function(args){
				// Replace keywords with their respective values...
				if(args === 'min'){
					args = r.preferences.margin.min;
					return args;
				}
				else if(args === 'max'){
					args = r.preferences.margin.max;
					return args;
				}
				if(args === 'medium'){
					args = r.preferences.margin.medium;
					return args;
				}
				// Make sure the args are an array of length 4...
				if(!Array.isArray(args) || args.length !== 4){
					// Only send error notification if the client actually attemted to set the value
					if(args){
						r.Notify.error($.extend({}, r.Event.ERR_INVALID_ARGUMENT, {value: args, details: 'The reader margin has to be defined as either min, max or medium. Alternatively, you can define your own values by sending an array in the following format [top, right, bottom, left].', call: 'margin'}));
					}
					args = r.preferences.margin.value;
				}

				// Make sure bounds are respected...
				for(var  i = 0; i < args.length; i++){
					args[i] = args[i] < r.preferences.margin.min[i] ? r.preferences.margin.min[i] : args[i];
					args[i] = args[i] > r.preferences.margin.max[i] ? r.preferences.margin.max[i] : args[i];
				}
				return args;
			}
		},
		theme : {
			rules: {
				background: [],
				title: [],
				color: []
			},
			transparent : {
				background : 'transparent',
				title : '#666',
				color : '#000'
			},
			light : {
				background : '#f4f4f4',
				title : '#666',
				color : '#000'
			},
			dark : {
				background : '#000000',
				title : '#666',
				color : '#dddddd'
			},
			sepia : {
				background : '#ede7d5',
				title : '#666',
				color : '#181818'
			},
			value : {
				background : '#f4f4f4',
				title : '#666',
				color : '#000'
			},
			clear : function(args){
				if(args === 'light' || args === 'dark' || args === 'sepia' || args === 'transparent'){
					return r.preferences.theme[args];
				}
				if(typeof(args) === 'object' && args.hasOwnProperty('color') && args.hasOwnProperty('background') && args.hasOwnProperty('title')){
					return args;
				}
				if(args){
					r.Notify.error($.extend({}, r.Event.ERR_INVALID_ARGUMENT, {value: args, details: 'The reader theme has to be either transparent, light, dark or sepia. Alternatively you can set your own custom theme by sending an object with background and color properties defined.', call: 'theme'}));
				}
				return r.preferences.theme.value;
			},
			applyRules: function(){
				for(i = 0; i< r.preferences.theme.rules.background.length; i++){
					rule = r.preferences.theme.rules.background[i];
					rule.rule[rule.property] = r.preferences.theme.value.background;
				}
				for(i = 0; i< r.preferences.theme.rules.title.length; i++){
					rule = r.preferences.theme.rules.title[i];
					rule.rule[rule.property] = r.preferences.theme.value.title;
				}
				for(i = 0; i< r.preferences.theme.rules.color.length; i++){
					rule = r.preferences.theme.rules.color[i];
					rule.rule[rule.property] = r.preferences.theme.value.color;
				}
			}
		},
		textAlign:{
			rules: [],
			values: ['left', 'justify'],
			value: 'left',
			clear: function(args){
				if(args && (typeof(args) !== 'string' || $.inArray(args, r.preferences.textAlign.values) === -1)){
					r.Notify.error($.extend({}, r.Event.ERR_INVALID_ARGUMENT, {value: args, details: 'The text align has to be either left or justify.', call: 'textAlign'}));
					return r.preferences.textAlign.value;
				}
				return args;
			},
			applyRules: function(){
				for(i = 0; i< r.preferences.textAlign.rules.length; i++){
					rule = r.preferences.textAlign.rules[i];
					rule.rule[rule.property] = r.preferences.textAlign.value;
				}
			}
		},
		applyAll: function(){
			r.preferences.lineHeight.applyRules();
			r.preferences.fontSize.applyRules();
			r.preferences.fontFamily.applyRules();
			r.preferences.theme.applyRules();
			r.preferences.lineHeight.applyRules();
			r.preferences.textAlign.applyRules();
		}
	};
	return r;

}(Reader || {}));