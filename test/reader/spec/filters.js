'use strict';

describe('Filters', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#filters_test', Filters = Reader.Filters,
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false,
		},
		currentStatus = null,
		defaultArgs = {
			url: testBookUrl,
			container: readerID,
			width: 400,
			height: 600,
			listener: function(ev){
				switch(ev.code){
					case 0: // reader reached last page of book
						flags.hasNext = false;
						break;
					case 4: // reader reached first page of book
						flags.hasPrev = false;
						break;
					case 5: // reader started loading
						break;
					case 6: // reader finished loading
						break;
					case 7: // reader returned status
						currentStatus = ev;
						break;
					case 9: // reader missing a file
					case 10: // parsing failed
					case 11: // cfi generation error
					case 12: // cfi insertion
					case 13: // invalid argument
					case 14: // cannot add bookmark
					case 15: // bookmark already exists
					case 16: // cannot remove bookmark
						console.log(ev);
						flags.hasErrors = true;
						break;
				}
			}
		};

	var chapters = [];

	function _saveChapter(chapter){
		chapters.push(chapter.href);
		if(chapter.children){
			for(var i = 0, l = chapter.children.length; i < l; i++){
				saveChapter(chapter.children[i]);
			}
		}
	}

	var _loopChapters = function(cb, done){
		var _testChapter = function(index){
			READER.loadChapter(chapters[index]).then(function(){
				cb(chapters[index]);

				if(index < chapters.length - 1){
					_testChapter(index+1);
				} else {
					done();
				}
			});
		};

		_testChapter(0);
	};

	beforeEach(function(done){
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));

		// reset flags and variables
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;

		currentStatus = null;

		READER.init($.extend({}, defaultArgs)).then(function(){

			// Save all the chapter href-s on load
			chapters = [];
			var spine = JSON.parse(READER.getSPINE());
			for(var i = 0, l = spine.length; i < l; i++){
				_saveChapter(spine[i]);
			}

			done();
		});
	});

	afterEach(function(){
		expect($(readerID)).toHaveReaderStructure();
		expect(flags.hasErrors).toBe(false);
	});

	it('should define filter manager', function(){
		expect(Filters).toBeObject();
		expect(Filters.hooks).toBeObject();
		expect(Filters.addFilter).toBeFunction();
		expect(Filters.removeFilter).toBeFunction();
		expect(Filters.removeAllFilters).toBeFunction();
		expect(Filters.applyFilters).toBeFunction();
	});

	it('should initialise all filters', function(){
		expect(Filters.hooks.beforeChapterDisplay).toBeArray();
		expect(Filters.hooks.beforeChapterParse).toBeArray();
	});

	it('should add anchor link types', function(done){
		_loopChapters(function(){
			$('a[href]').each(function(i, link){

				var $link = $(link);

				if(/^(ftp|http|https):\/\/[^ "]+$/.test($link.attr('href'))){
					expect($link).toHaveAttributes({'data-link-type': 'external'});
				} else {
					expect($link).toHaveAttributes({'data-link-type': 'internal'});
				}

			});
		}, done);
	});

	it('should transform relative links and resources', function(done){
		_loopChapters(function(){
			$('img, video').each(function(i, el){
				var $el = $(el);
				expect($el.attr('src')).not.toContain('..');
			});
			$('a').each(function(i, el){
				var href = $(el).attr('href');
				if(href){
					expect(href).not.toContain('..');
				}
			});
		}, done);
	});
});