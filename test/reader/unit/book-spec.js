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
		expect(Reader.Book.contentPathPrefix).toBe(fixtures.BOOK.DATA.contentPathPrefix);
		expect(Reader.Book.opfDoc).toBeTruthy();
	});

	it('should provide a Book.reset method to reset the book metadata', function () {
		Reader.Book.load(fixtures.BOOK.DATA);
		Reader.Book.reset();
		expect(Reader.Book.spine).toEqual([]);
		expect(Reader.Book.toc).toEqual([]);
		expect(Reader.Book.title).toBe('');
		expect(Reader.Book.contentPathPrefix).toBe('');
		expect(Reader.Book.opfDoc).toBeNull();
	});

});
