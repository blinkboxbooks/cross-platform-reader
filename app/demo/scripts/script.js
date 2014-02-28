'use strict';

/* jshint devel:true */
/* globals READER */

var app = angular.module('app', []);

// Controller for configure the Reader and init it.

app.controller('Reader_controller', function ($scope, $exceptionHandler, Book) {

      // Use '/books/' + isbn + '/' if you want to check the books in your localhost (you would need the books from the share drive  /Documents/ePubs/Test-Books-book-info-v1.2.zip
      var URL = '';
      var PRODUCTION_API = 'https://api.blinkboxbooks.com/service/catalogue/books/';

      // Reader event handler
      function eventHandler(e){
        console.log(e);
        $('#log div').prepend('<p>' + JSON.stringify(e) + '</p>');
      }

      // Validate ISBN
      function isValidISBN (a) {
        for (var b = /\d/g, c = 0, d, e = 25; d = b.exec(a); e -= 2)
          c += e % 4 * d;
        return !(~e | c % 10);
      }

      // ISBN
      $scope.$watch('isbn.value', function(val){
        if (val && isValidISBN(val)) {
          Book.get({}, PRODUCTION_API + val).then(function (response) {
            if (response.data.code === 200 || !response.data.code) {
              if (response.data.links && response.data.links.length > 0) {
                var linkIdx, l;
                for (linkIdx = 0, l = response.data.links.length; linkIdx !== l; linkIdx += 1) {
                  var link = response.data.links[linkIdx];
                  if (link.title === 'Sample' &&  link.href!=='') {
                    // this is a slightly obscure, but simple method of extracting a path from an href
                    // ref: http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
                    var a = document.createElement('a');
                    a.href = link.href;
                    var samplePath = a.pathname.indexOf('/') === 0 ? a.pathname : '/'+a.pathname; // add leading slash if not present in pathname (IE bug)
                    URL = '//'+ a.hostname+'/params;v=0'+ samplePath;     // prepend the mandatory matrix params
                    READER.init({container: '#reader_container', width: 400, height: 400, padding: 0, url: URL, bookmarks: [], listener: eventHandler, preferences: { margin: [9.800000,11.000000,6.500000,11.000000], lineHeight: 1.583000, fontSize: 1.497656, textAlign: 'left', fontFamily: 'Helvetica', theme: 'light'}});

                    $scope.$watch('lineHeight.value', READER.setLineHeight);
                    $scope.$watch('fontSize.value', READER.setFontSize);

                    // Width and height
                    $scope.$watch('width.value', function(val){
                      $scope.dimensions.width = val;
                      READER.resizeContainer($scope.dimensions);
                    });
                    $scope.$watch('height.value', function(val){
                      $scope.dimensions.height = val;
                      READER.resizeContainer($scope.dimensions);
                    });
                    break;
                  }
                }
              }
            } else {
              if (response.data.error) {
                $exceptionHandler({message: response.data.error, stack: ''}, response.data.error);
              }
            }
          },
          function (error) {
            $exceptionHandler({message: error.status, stack: error.config}, error);
          }
          );
        }
      });

      $scope.dimensions = angular.extend({
        width: '500',
        height: '600',
        columns: 1,
        padding: 0
      }, $scope.dimensions);



      // Line height increase/decrease
      $scope.lineHeight = {
        min: 1.1,
        max: 20,
        step: 0.01,
        value: 1.583000
      };

      // Font-size increase/decrease
      $scope.fontSize = {
        min: 0.5,
        max: 15,
        step: 0.1,
        value: 1.497656
      };


      // font family
      $scope.fonts = ['Serif font', 'Helvetica', 'Times new Roman', 'Courier New', 'Arial'];
      $scope.font = $scope.fonts[0];


      $scope.alignment = ['left', 'justify'];
      $scope.align = $scope.alignment[0];
      $scope.$watch('align', function(val){
        READER.setTextAlign(val);
      });

      $scope.setTheme = READER.setTheme;

      // Margins
      $scope.setMargin = READER.setMargin;

      // CFI
      $scope.getCFI = function(){
        console.log('Current CFI', decodeURIComponent(READER.getCFI()));
      };

      // Next/previous chapter navigation.
      $scope.next = function () {
        READER.next();
      };

      $scope.previous = function () {
        READER.prev();
      };
    });

// Service to access to the API of Catalogue
app.factory('Book', function($http, $q) {
      var _call = function(args, uri){
        var deferred = $q.defer();
          var _defaults = {
            url: uri,
            method: 'GET',
            params: args
          };
          $http(_defaults).then(deferred.resolve, deferred.reject);
        return deferred.promise;
      };

      return {
        get: function(args, uri){
          return _call(args, uri);
        }
      };
    }
);