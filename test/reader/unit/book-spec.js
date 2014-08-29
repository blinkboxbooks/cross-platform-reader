/* global fixtures */

'use strict';

describe('Book', function() {

	it('should provide the Book interface', function () {
		expect(Reader.Book).toBeObject();
	});

	it('should provide a Book.load method to load the book metadata', function () {
		Reader.Book.load(fixtures.BOOK.DATA);
		expect(Reader.Book.spine).toBe(fixtures.BOOK.DATA.spine);
		expect(Reader.Book.toc).toBe(fixtures.BOOK.DATA.toc);
		expect(Reader.Book.title).toBe(fixtures.BOOK.DATA.title);
		expect(Reader.Book.content_path_prefix).toBe(fixtures.BOOK.DATA.content_path_prefix);
		expect(Reader.Book.$opf.length).toBe($(fixtures.BOOK.DATA.opf).filter('package').length);
		Reader.Book.load({});
		expect(Reader.Book.spine).toEqual([]);
		expect(Reader.Book.toc).toEqual([]);
		expect(Reader.Book.title).toBe('');
		expect(Reader.Book.content_path_prefix).toBe('');
		expect(Reader.Book.$opf).toBeNull();
	});

	it('should provide a Book.reset method to reset the book metadata', function () {
		Reader.Book.load(fixtures.BOOK.DATA);
		Reader.Book.reset();
		expect(Reader.Book.spine).toEqual([]);
		expect(Reader.Book.toc).toEqual([]);
		expect(Reader.Book.title).toBe('');
		expect(Reader.Book.content_path_prefix).toBe('');
		expect(Reader.Book.$opf).toBeNull();
	});

	it('should provide a Book.getTOC method to retrieve the book TOC as an array', function () {
		Reader.Book.load(fixtures.BOOK.DATA);
		expect(Reader.Book.getTOC()).toEqual(fixtures.BOOK.DATA.toc);
	});

	it('should provide a Book.getSPINE method to retrieve the book spine as an array', function () {
		Reader.Book.load(fixtures.BOOK.DATA);
		expect(Reader.Book.getSPINE()).toEqual(fixtures.BOOK.DATA.spine);
	});

});
