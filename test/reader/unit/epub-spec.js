'use strict';

describe('Epub', function() {

	var Epub, $dom;

	beforeEach(function(){
		// set up epub
		Epub = Reader.Epub;
		Epub.setUp(0, $(fixtures.BOOK.DATA.opf).filter('package'));

		// create a demo document for test
		$dom = $((new window.DOMParser()).parseFromString('<html>' +
			'<body>' +
				'<div id="textRange">Text node</div>' +
				'<div id="nodeRange">' +
					'<span></span><span></span>' +
				'</div>' +
			'</body></html>', 'text/xml'));

		// stub out these methods used by the epub module as they are out of scope of this test
		spyOn(Epub, 'normalizeChapterPartCFI').and.callFake(function(cfi){
			return cfi;
		});
		spyOn(Epub, 'removeContext').and.callFake(function(cfi){
			return cfi;
		});
		spyOn(Epub, 'addContext').and.callFake(function(cfi){
			return cfi;
		});
		Reader.$iframe = {
			contents: function(){
				return $dom;
			}
		};
		// workaround PhantomJS. manipulating dom nodes using a range from a different document throws a WRONG_DOCUMENT_ERR that does not exist in other browsers.
		spyOn(document, 'createRange').and.callFake(function(){
			return $dom[0].createRange();
		});
	});

	afterEach(function(){
		Reader.$iframe = null;
	});

	it('should initialise Epub manager API', function(){
		expect(Epub).toBeObject();
		expect(Epub.generateCFI).toBeFunction();
		expect(Epub.getElementAt).toBeFunction();
		expect(Epub.injectMarker).toBeFunction();
		expect(Epub.generateRangeCFI).toBeFunction();
		expect(Epub.injectRangeMarker).toBeFunction();
	});

	it('should generate range cfi for text nodes', function(){
		var range = $dom[0].createRange(),
			$node = $dom.find('#textRange'), startOffset = 0, endOffset = 1;

		range.setStart($node.contents()[0], startOffset);
		range.setEnd($node.contents()[0], endOffset);

		expect(Epub.generateRangeCFI(range)).toEqual('epubcfi(/6/2!/2/2[textRange],/1:'+startOffset+',/1:'+endOffset+')');
	});

	it('should generate range cfi for normal nodes', function(){
		var range = $dom[0].createRange(),
			$node = $dom.find('#nodeRange span');

		range.setStart($node[0], 0);
		range.setEnd($node[1], 0);

		expect(Epub.generateRangeCFI(range)).toEqual('epubcfi(/6/2!/2/4[nodeRange],/2,/4)');
	});

	xit('should generate range cfi for a text node and a normal node', function(){
		var range = $dom[0].createRange(),
			text = $dom.find('#textRange').contents()[0],
			node = $dom.find('#nodeRange span').first()[0];

		range.setStart(text, 0);
		range.setEnd(node, 0);

		expect(Epub.generateRangeCFI(range)).toEqual('epubcfi(/6/2!/2,/2[textRange]/1:0,/4[nodeRange]/2)');
	});

	it('should inject marker for a range CFI', function(){
		var range = $dom[0].createRange(),
			$node = $dom.find('#textRange'), startOffset = 0, endOffset = 1;

		range.setStart($node.contents()[0], startOffset);
		range.setEnd($node.contents()[0], endOffset);

		Epub.injectRangeMarker(Epub.generateRangeCFI(range), '<i></i>');
	});

});