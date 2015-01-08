'use strict';
(function (useIframe) {

  var iframeTestSuffix = ' : ' + (useIframe ? 'with iframe' : 'without iframe');

  describe('Bookmarks' + iframeTestSuffix, function () {

    var page = require('../page.js');

    beforeEach(function () {
      page.useIframe = useIframe;
    });

    it('should reload demo app', function () {
      page.load(undefined, undefined, undefined, useIframe);
      expect(browser.getCurrentUrl()).toContain(page.path);
    });

    it('should bookmark every page', function () {

      page.loop(function (status) {
        expect(status.bookmarksInPage).toBeEmptyArray();

        return page.bookmark().then(function (status) {
          expect(status.bookmarksInPage).toBeArrayOfSize(1);

          return page.bookmark().then(function (status) {
            expect(status.bookmarksInPage).toBeEmptyArray();
          });
        });
      });
    });
  });
})(/*grunt:useiframe*/true);