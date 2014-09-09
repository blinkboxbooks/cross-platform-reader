'use strict';

describe('Epub', function() {

	var Epub, $dom;

	beforeEach(function(){
		// set up epub
		Epub = Reader.Epub;
		Epub.setUp(0, $(fixtures.BOOK.DATA.opf).filter('package'));

		// stub out these methods used by the epub module as they are out of scope of this test
		spyOn(Epub, 'normalizeChapterPartCFI').and.callFake(function(args){
			return args;
		});
		spyOn(Epub, 'removeContext').and.callFake(function(args){
			return args;
		});

		// create a demo document to test
		$dom = $((new window.DOMParser()).parseFromString('<html><body><div id="textRange">Text node</div><div id="nodeRange"><span></span><span></span></div></body></html>', 'text/xml'));

	});

	it('should initialise Epub manager API', function(){
		expect(Epub).toBeObject();
		expect(Epub.generateCFI).toBeFunction();
		expect(Epub.getElementAt).toBeFunction();
		expect(Epub.injectMarker).toBeFunction();
		expect(Epub.generateRangeCFI).toBeFunction();
	});

	it('should generate range cfi for text nodes', function(){
		var range = $dom[0].createRange(),
			$node = $dom.find('#textRange'), startOffset = 0, endOffset = 1;

		range.setStart($node.contents()[0], startOffset);
		range.setEnd($node.contents()[0], endOffset);

		expect(Epub.generateRangeCFI(range)).toEqual('epubcfi(/6/2!/2/2[textRange],/1:'+startOffset+',/1:'+endOffset+')');
	});

});