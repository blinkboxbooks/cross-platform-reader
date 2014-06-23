'use strict';

describe('Book', function() {

	it('should provide the Book interface', function () {
		expect(Reader.Book).toBeObject();
	});

	it('should provide a Book.load method to load the book metadata', function () {
		Reader.Book.load(fixtures.BOOK_DATA);
		expect(Reader.Book.spine).toBe(fixtures.BOOK_DATA.spine);
		expect(Reader.Book.toc).toBe(fixtures.BOOK_DATA.toc);
		expect(Reader.Book.title).toBe(fixtures.BOOK_DATA.title);
		expect(Reader.Book.content_path_prefix).toBe(fixtures.BOOK_DATA.content_path_prefix);
		expect(Reader.Book.$opf.length).toBe($(fixtures.BOOK_DATA.opf).filter('package').length);
		Reader.Book.load({});
		expect(Reader.Book.spine).toEqual([]);
		expect(Reader.Book.toc).toEqual([]);
		expect(Reader.Book.title).toBe('');
		expect(Reader.Book.content_path_prefix).toBe('');
		expect(Reader.Book.$opf.length).toBe(0);
	});

	it('should provide a Book.reset method to reset the book metadata', function () {
		Reader.Book.load(fixtures.BOOK_DATA);
		Reader.Book.reset();
		expect(Reader.Book.spine).toEqual([]);
		expect(Reader.Book.toc).toEqual([]);
		expect(Reader.Book.title).toBe('');
		expect(Reader.Book.content_path_prefix).toBe('');
		expect(Reader.Book.$opf).toBeNull();
	});

	it('should provide a Book.getTOC method to retrieve a JSON string representation of the book TOC', function () {
		Reader.Book.load(fixtures.BOOK_DATA);
		expect(Reader.Book.getTOC()).toEqual(JSON.stringify(fixtures.BOOK_DATA.toc));
	});

	it('should provide a Book.getSPINE method to retrieve a JSON string representation of the book spine', function () {
		Reader.Book.load(fixtures.BOOK_DATA);
		expect(Reader.Book.getSPINE()).toEqual(JSON.stringify(fixtures.BOOK_DATA.spine));
	});

});
