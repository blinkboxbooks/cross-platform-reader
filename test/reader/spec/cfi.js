'use strict';

describe('CFI', function() {

	var testBookUrl = '/base/app/books/9780007441235', readerID = '#cfi_test', CFI = Reader.CFI,
		flags = {
			hasErrors: false,
			hasNext: true,
			hasPrev: false
		},
		currentStatus = null,
		cfi = {
			CFI: 'epubcfi(/6/2!/4/2[cover]/1:0)',
			preview: 'Image: No description',
			chapter: 'Cover'
		},
		cfis = [],
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

	beforeEach(function(){
		// making sure the reader has a valid container in the body
		$('<div id="'+readerID.slice(1)+'"></div>').appendTo($('body'));

		// reset flags and variables
		flags.hasErrors = false;
		flags.hasNext = true;
		flags.hasPrev = false;

		currentStatus = null;
	});

	afterEach(function(){
		expect(flags.hasErrors).toBe(false);
	});

	it('should initialise CFI manager', function(){
		// fields
		expect(CFI).toBeObject();
		expect(CFI.opfCFI).toBeDefined();
		expect(CFI.context).toBeDefined();

		// getters and setters
		expect(CFI.getCFIObject).toBeFunction();
		expect(CFI.setCFI).toBeFunction();

		// methods
		expect(CFI.goToCFI).toBeFunction();
		expect(CFI.getChapterFromCFI).toBeFunction();
		expect(CFI.reset).toBeFunction();
	});

	it('should get current CFI', function(done){
		var _nextLoop = function(){

			if(flags.hasErrors){
				// terminate test if we have errors
				done();
			}

			var cfi = CFI.getCFIObject();
			expect(cfi).toBeObject();
			expect(cfi).toEqual(currentStatus.cfi);

			// save cfi for next test
			cfis.push(currentStatus.cfi.CFI);

			if(flags.hasNext){
				READER.next().then(_nextLoop);
			} else {
				// we reached the end of the book
				done();
			}
		};

		READER.init($.extend({}, defaultArgs)).then(_nextLoop);
	});

	it('should inject marker in the specified CFI location', function(done){
		var _nextLoop = function(){

			if(flags.hasErrors){
				// terminate test if we have errors
				done();
			}

			var cfi = currentStatus.cfi;
			expect(cfi).toBeObject();

			cfi = cfi.CFI;
			CFI.setCFI(cfi);

			var marker = $('[data-cfi="'+cfi+'"]');

			expect(cfi).toEqual(currentStatus.cfi.CFI);
			expect(marker).toExist();
			expect(marker).toMatch('span.bookmark');
			expect(Reader.returnPageElement(marker)).toBe(currentStatus.page);

			if(flags.hasNext){
				READER.next().then(_nextLoop);
			} else {
				// we reached the end of the book
				done();
			}
		};

		READER.init($.extend({}, defaultArgs)).then(_nextLoop);

	});

	it('should go to the specified CFI', function(done){

		var _go = function(index){
			if(index < cfis.length){
				READER.goToCFI(cfis[index]).then(function(){

					var marker = $('[data-cfi="'+cfis[index]+'"]');

					expect(marker).toExist();
					expect(Reader.returnPageElement(marker)).toBe(currentStatus.page);
					expect(CFI.getChapterFromCFI(cfis[index])).toBe(currentStatus.chapter);

					_go(index + 1);
				});
			} else {
				done();
			}
		};

		READER.init($.extend({}, defaultArgs)).then(function(){
			_go(0);
		});

	});

});