'use strict';

describe('Epub', function() {

	var Epub = Reader.Epub;

	it('should initialise Epub manager API', function(){
		expect(Epub).toBeObject();
		expect(Epub.generateCFI).toBeFunction();
		expect(Epub.getElementAt).toBeFunction();
		expect(Epub.injectMarker).toBeFunction();
	});

});